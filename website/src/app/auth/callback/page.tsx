'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'signup' && accessToken && refreshToken) {
          // Set the session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('Error setting session:', error)
            router.push('/auth/signin?error=Email confirmation failed')
            return
          }

          // Redirect to dashboard or welcome page
          router.push('/dashboard?welcome=true')
        } else if (type === 'recovery') {
          // Handle password recovery
          router.push('/auth/reset-password')
        } else {
          // Invalid or missing parameters
          router.push('/auth/signin?error=Invalid confirmation link')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/auth/signin?error=Email confirmation failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Confirming your email...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-400 mt-4">Please wait while we confirm your account.</p>
        </div>
      </div>
    </div>
  )
}