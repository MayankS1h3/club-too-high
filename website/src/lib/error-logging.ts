// Error logging and reporting utilities
// Provides centralized error handling and reporting capabilities

export interface ErrorContext {
  userId?: string
  userAgent?: string
  url?: string
  timestamp: string
  errorBoundary?: string
  additionalInfo?: Record<string, any>
}

export interface ErrorReport {
  error: Error
  context: ErrorContext
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'ui' | 'api' | 'payment' | 'auth' | 'database' | 'unknown'
}

// In-memory error storage (use external service in production)
const errorLogs: ErrorReport[] = []

// Create error context
export function createErrorContext(additionalInfo?: Record<string, any>): ErrorContext {
  return {
    userId: getUserId(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server',
    timestamp: new Date().toISOString(),
    additionalInfo
  }
}

// Get current user ID (implement based on your auth system)
function getUserId(): string | undefined {
  try {
    // Get from local storage, session, or auth context
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        return user.id
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return undefined
}

// Categorize error based on error message and stack
export function categorizeError(error: Error): ErrorReport['category'] {
  const message = error.message.toLowerCase()
  const stack = error.stack?.toLowerCase() || ''

  if (message.includes('payment') || message.includes('razorpay') || stack.includes('payment')) {
    return 'payment'
  }
  
  if (message.includes('auth') || message.includes('login') || message.includes('unauthorized')) {
    return 'auth'
  }
  
  if (message.includes('fetch') || message.includes('api') || message.includes('network')) {
    return 'api'
  }
  
  if (message.includes('database') || message.includes('supabase') || message.includes('sql')) {
    return 'database'
  }
  
  if (stack.includes('react') || stack.includes('component')) {
    return 'ui'
  }
  
  return 'unknown'
}

// Determine error severity
export function determineErrorSeverity(error: Error, category: ErrorReport['category']): ErrorReport['severity'] {
  // Critical errors
  if (category === 'payment' || category === 'auth') {
    return 'critical'
  }
  
  // High severity errors
  if (category === 'database' || error.message.includes('500')) {
    return 'high'
  }
  
  // Medium severity errors
  if (category === 'api' || error.message.includes('400') || error.message.includes('404')) {
    return 'medium'
  }
  
  // Low severity errors (UI issues, non-critical)
  return 'low'
}

// Log error to console and storage
export function logError(error: Error, context?: Partial<ErrorContext>, errorBoundary?: string): ErrorReport {
  const fullContext: ErrorContext = {
    ...createErrorContext(),
    ...context,
    errorBoundary
  }
  
  const category = categorizeError(error)
  const severity = determineErrorSeverity(error, category)
  
  const errorReport: ErrorReport = {
    error,
    context: fullContext,
    severity,
    category
  }
  
  // Log to console with appropriate level
  const logLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn'
  console[logLevel]('Error Report:', {
    message: error.message,
    category,
    severity,
    context: fullContext,
    stack: error.stack
  })
  
  // Store in memory (replace with external service in production)
  errorLogs.push(errorReport)
  
  // In production, send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    sendToErrorService(errorReport)
  }
  
  return errorReport
}

// Send error to external monitoring service (placeholder)
async function sendToErrorService(errorReport: ErrorReport) {
  try {
    // Example: Send to Sentry, LogRocket, or custom error service
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport)
    // })
    
    console.log('Would send to error service:', errorReport)
  } catch (err) {
    console.error('Failed to send error to monitoring service:', err)
  }
}

// Log payment-specific errors
export function logPaymentError(error: Error, paymentData?: any) {
  return logError(error, {
    additionalInfo: {
      type: 'payment',
      paymentData: paymentData ? {
        amount: paymentData.amount,
        eventId: paymentData.eventId,
        orderId: paymentData.orderId
      } : undefined
    }
  }, 'PaymentErrorBoundary')
}

// Log authentication errors
export function logAuthError(error: Error, authAction?: string) {
  return logError(error, {
    additionalInfo: {
      type: 'authentication',
      action: authAction
    }
  }, 'AuthErrorBoundary')
}

// Get error statistics (for debugging)
export function getErrorStats() {
  const stats = {
    total: errorLogs.length,
    byCategory: {} as Record<string, number>,
    bySeverity: {} as Record<string, number>,
    recent: errorLogs.slice(-10) // Last 10 errors
  }
  
  errorLogs.forEach(report => {
    stats.byCategory[report.category] = (stats.byCategory[report.category] || 0) + 1
    stats.bySeverity[report.severity] = (stats.bySeverity[report.severity] || 0) + 1
  })
  
  return stats
}

// Clear error logs (for debugging)
export function clearErrorLogs() {
  errorLogs.length = 0
}

export default {
  logError,
  logPaymentError,
  logAuthError,
  getErrorStats,
  clearErrorLogs,
  createErrorContext,
  categorizeError,
  determineErrorSeverity
}