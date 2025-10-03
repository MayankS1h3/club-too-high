'use client'

import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { 
  validateAuthInput, 
  checkAuthRateLimit, 
  parseSupabaseAuthError, 
  validateSession,
  validateEmailSecurity,
  AuthError,
  SessionInfo
} from './auth-security'

interface AuthState {
  user: User | null
  session: Session | null
  sessionInfo: SessionInfo
  loading: boolean
  error: AuthError | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    sessionInfo: { isValid: false, user: null, isExpiringSoon: false, requiresRefresh: false },
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        const authError = parseSupabaseAuthError(error)
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: authError
        }))
        return
      }

      const sessionInfo = validateSession(session)
      setAuthState({
        session,
        user: session?.user ?? null,
        sessionInfo,
        loading: false,
        error: null
      })
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionInfo = validateSession(session)
      setAuthState({
        session,
        user: session?.user ?? null,
        sessionInfo,
        loading: false,
        error: null
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  // Enhanced sign up with validation and security checks
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Input validation
      const validation = validateAuthInput(email, password, fullName)
      if (!validation.isValid) {
        return { data: null, error: validation.errors[0] }
      }

      // Email security check
      const emailSecurity = validateEmailSecurity(email)
      if (!emailSecurity.isSecure) {
        return { 
          data: null, 
          error: {
            type: 'invalid_email' as any,
            message: emailSecurity.warnings[0] || 'Email security check failed'
          }
        }
      }

      // Rate limiting check
      const rateLimit = checkAuthRateLimit(email, 'signup')
      if (!rateLimit.allowed) {
        return { data: null, error: rateLimit.error! }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      })

      if (error) {
        const authError = parseSupabaseAuthError(error)
        return { data, error: authError }
      }

      return { data, error: null }
    } catch (err) {
      const authError = parseSupabaseAuthError(err)
      return { data: null, error: authError }
    }
  }

  // Enhanced sign in with validation and security checks
  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
      const validation = validateAuthInput(email, password)
      if (!validation.isValid) {
        return { data: null, error: validation.errors[0] }
      }

      // Rate limiting check
      const rateLimit = checkAuthRateLimit(email, 'signin')
      if (!rateLimit.allowed) {
        return { data: null, error: rateLimit.error! }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        const authError = parseSupabaseAuthError(error)
        return { data, error: authError }
      }

      return { data, error: null }
    } catch (err) {
      const authError = parseSupabaseAuthError(err)
      return { data: null, error: authError }
    }
  }

  // Enhanced sign out with cleanup
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        const authError = parseSupabaseAuthError(error)
        return { error: authError }
      }

      // Clear auth state
      setAuthState({
        user: null,
        session: null,
        sessionInfo: { isValid: false, user: null, isExpiringSoon: false, requiresRefresh: false },
        loading: false,
        error: null
      })

      return { error: null }
    } catch (err) {
      const authError = parseSupabaseAuthError(err)
      return { error: authError }
    }
  }

  // Refresh session if needed
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        const authError = parseSupabaseAuthError(error)
        setAuthState(prev => ({ ...prev, error: authError }))
        return { error: authError }
      }

      const sessionInfo = validateSession(data.session)
      setAuthState({
        session: data.session,
        user: data.session?.user ?? null,
        sessionInfo,
        loading: false,
        error: null
      })

      return { error: null }
    } catch (err) {
      const authError = parseSupabaseAuthError(err)
      return { error: authError }
    }
  }

  return {
    user: authState.user,
    session: authState.session,
    sessionInfo: authState.sessionInfo,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signOut,
    refreshSession,
  }
}