// Enhanced authentication security utilities
// Provides secure authentication with validation, rate limiting, and security features

import { validateEmail, validatePassword, validateFullName } from './validation'
import { checkAdvancedRateLimit } from './rate-limiting'

// Authentication error types
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  ACCOUNT_LOCKED = 'account_locked',
  RATE_LIMITED = 'rate_limited',
  WEAK_PASSWORD = 'weak_password',
  INVALID_EMAIL = 'invalid_email',
  ACCOUNT_NOT_CONFIRMED = 'account_not_confirmed',
  TOO_MANY_ATTEMPTS = 'too_many_attempts',
  SESSION_EXPIRED = 'session_expired',
  UNAUTHORIZED = 'unauthorized'
}

export interface AuthError {
  type: AuthErrorType
  message: string
  details?: any
  retryAfter?: number
}

export interface AuthValidationResult {
  isValid: boolean
  errors: AuthError[]
}

// Validate authentication input
export function validateAuthInput(email: string, password: string, fullName?: string): AuthValidationResult {
  const errors: AuthError[] = []

  // Email validation
  const emailValidation = validateEmail(email)
  if (!emailValidation.isValid) {
    errors.push({
      type: AuthErrorType.INVALID_EMAIL,
      message: emailValidation.errors[0]?.message || 'Invalid email format'
    })
  }

  // Password validation
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.isValid) {
    errors.push({
      type: AuthErrorType.WEAK_PASSWORD,
      message: passwordValidation.errors[0]?.message || 'Password does not meet security requirements'
    })
  }

  // Full name validation (for sign up)
  if (fullName !== undefined) {
    const nameValidation = validateFullName(fullName)
    if (!nameValidation.isValid) {
      errors.push({
        type: AuthErrorType.INVALID_EMAIL, // Reusing for simplicity
        message: nameValidation.errors[0]?.message || 'Invalid full name'
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Enhanced rate limiting for authentication
export function checkAuthRateLimit(identifier: string, action: 'signin' | 'signup'): {
  allowed: boolean
  error?: AuthError
} {
  const rateLimit = checkAdvancedRateLimit(identifier, `auth-${action}`)
  
  if (!rateLimit.allowed) {
    return {
      allowed: false,
      error: {
        type: AuthErrorType.RATE_LIMITED,
        message: `Too many ${action} attempts. Please try again later.`,
        retryAfter: rateLimit.retryAfter
      }
    }
  }
  
  return { allowed: true }
}

// Parse Supabase auth errors to our custom format
export function parseSupabaseAuthError(error: any): AuthError {
  if (!error) {
    return {
      type: AuthErrorType.UNAUTHORIZED,
      message: 'An unknown error occurred'
    }
  }

  const errorMessage = error.message?.toLowerCase() || ''

  // Map common Supabase errors to our types
  if (errorMessage.includes('invalid login credentials') || 
      errorMessage.includes('email not confirmed')) {
    return {
      type: AuthErrorType.INVALID_CREDENTIALS,
      message: 'Invalid email or password'
    }
  }

  if (errorMessage.includes('email not confirmed')) {
    return {
      type: AuthErrorType.ACCOUNT_NOT_CONFIRMED,
      message: 'Please check your email and confirm your account'
    }
  }

  if (errorMessage.includes('too many requests')) {
    return {
      type: AuthErrorType.TOO_MANY_ATTEMPTS,
      message: 'Too many attempts. Please try again later.'
    }
  }

  if (errorMessage.includes('session') && errorMessage.includes('expired')) {
    return {
      type: AuthErrorType.SESSION_EXPIRED,
      message: 'Your session has expired. Please sign in again.'
    }
  }

  if (errorMessage.includes('password') && 
      (errorMessage.includes('weak') || errorMessage.includes('short'))) {
    return {
      type: AuthErrorType.WEAK_PASSWORD,
      message: 'Password is too weak. Please choose a stronger password.'
    }
  }

  // Default error
  return {
    type: AuthErrorType.UNAUTHORIZED,
    message: error.message || 'Authentication failed'
  }
}

// Security headers for authentication requests
export function getSecurityHeaders(userAgent?: string): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  }
}

// Session security utilities
export interface SessionInfo {
  isValid: boolean
  user: any
  expiresAt?: Date
  lastActivity?: Date
  isExpiringSoon: boolean
  requiresRefresh: boolean
}

export function validateSession(session: any): SessionInfo {
  if (!session || !session.user) {
    return {
      isValid: false,
      user: null,
      isExpiringSoon: false,
      requiresRefresh: false
    }
  }

  const now = new Date()
  const expiresAt = session.expires_at ? new Date(session.expires_at * 1000) : null
  const lastActivity = session.last_sign_in_at ? new Date(session.last_sign_in_at) : null

  // Check if session is expired
  if (expiresAt && now > expiresAt) {
    return {
      isValid: false,
      user: session.user,
      expiresAt: expiresAt || undefined,
      lastActivity: lastActivity || undefined,
      isExpiringSoon: false,
      requiresRefresh: true
    }
  }

  // Check if session is expiring soon (within 5 minutes)
  const fiveMinutes = 5 * 60 * 1000
  const isExpiringSoon = expiresAt ? (expiresAt.getTime() - now.getTime()) < fiveMinutes : false

  // Check if session needs refresh (older than 1 hour of activity)
  const oneHour = 60 * 60 * 1000
  const requiresRefresh = lastActivity ? (now.getTime() - lastActivity.getTime()) > oneHour : false

  return {
    isValid: true,
    user: session.user,
    expiresAt: expiresAt || undefined,
    lastActivity: lastActivity || undefined,
    isExpiringSoon,
    requiresRefresh
  }
}

// Password strength meter
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4 // 0 = very weak, 4 = very strong
  feedback: string[]
  isAcceptable: boolean
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('Use at least 8 characters')

  if (/[a-z]/.test(password)) score++
  else feedback.push('Include lowercase letters')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Include uppercase letters')

  if (/\d/.test(password)) score++
  else feedback.push('Include numbers')

  if (/[^a-zA-Z0-9]/.test(password)) score++
  else feedback.push('Include special characters (!@#$%^&*)')

  // Additional checks
  if (password.length >= 12) score = Math.min(score + 1, 4)
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeated characters')
    score = Math.max(score - 1, 0)
  }

  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123']
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    feedback.push('Avoid common passwords')
    score = Math.max(score - 2, 0)
  }

  return {
    score: score as 0 | 1 | 2 | 3 | 4,
    feedback,
    isAcceptable: score >= 3
  }
}

// Email format security validation
export function validateEmailSecurity(email: string): {
  isSecure: boolean
  warnings: string[]
} {
  const warnings: string[] = []

  // Check for suspicious patterns
  if (email.includes('..')) {
    warnings.push('Email contains consecutive dots')
  }

  if (email.includes('+') && email.split('+').length > 2) {
    warnings.push('Email contains multiple plus signs')
  }

  if (email.length > 254) {
    warnings.push('Email is unusually long')
  }

  // Check for disposable email domains (basic list)
  const disposableDomains = [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
    'mailinator.com'
  ]

  const domain = email.split('@')[1]?.toLowerCase()
  if (domain && disposableDomains.includes(domain)) {
    warnings.push('Disposable email addresses are not allowed')
  }

  return {
    isSecure: warnings.length === 0,
    warnings
  }
}