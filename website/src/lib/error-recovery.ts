'use client'

import { useState, useCallback, useEffect } from 'react'
import { logError, ErrorReport } from './error-logging'

interface UseErrorRecoveryOptions {
  maxRetries?: number
  retryDelay?: number
  onError?: (error: Error, errorReport: ErrorReport) => void
  onRetry?: (attempt: number) => void
  onMaxRetriesReached?: () => void
}

interface ErrorRecoveryState {
  error: Error | null
  isRetrying: boolean
  retryCount: number
  hasReachedMaxRetries: boolean
}

export function useErrorRecovery(options: UseErrorRecoveryOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onRetry,
    onMaxRetriesReached
  } = options

  const [state, setState] = useState<ErrorRecoveryState>({
    error: null,
    isRetrying: false,
    retryCount: 0,
    hasReachedMaxRetries: false
  })

  // Handle error with automatic recovery
  const handleError = useCallback(async (error: Error, context?: any) => {
    const errorReport = logError(error, context)
    
    setState(prev => ({
      ...prev,
      error,
      retryCount: prev.retryCount + 1
    }))

    // Call error callback
    if (onError) {
      onError(error, errorReport)
    }

    // Check if we should retry
    if (state.retryCount < maxRetries) {
      setState(prev => ({ ...prev, isRetrying: true }))
      
      // Call retry callback
      if (onRetry) {
        onRetry(state.retryCount + 1)
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      
      setState(prev => ({ ...prev, isRetrying: false }))
    } else {
      setState(prev => ({ ...prev, hasReachedMaxRetries: true }))
      
      if (onMaxRetriesReached) {
        onMaxRetriesReached()
      }
    }
  }, [state.retryCount, maxRetries, retryDelay, onError, onRetry, onMaxRetriesReached])

  // Manual retry function
  const retry = useCallback(() => {
    setState({
      error: null,
      isRetrying: false,
      retryCount: 0,
      hasReachedMaxRetries: false
    })
  }, [])

  // Reset error state
  const reset = useCallback(() => {
    setState({
      error: null,
      isRetrying: false,
      retryCount: 0,
      hasReachedMaxRetries: false
    })
  }, [])

  // Async wrapper for operations that might fail
  const withErrorRecovery = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: any
  ): Promise<T | null> => {
    try {
      return await operation()
    } catch (error) {
      await handleError(error as Error, context)
      return null
    }
  }, [handleError])

  return {
    ...state,
    handleError,
    retry,
    reset,
    withErrorRecovery,
    canRetry: state.retryCount < maxRetries && !state.hasReachedMaxRetries
  }
}

// Hook for API call error recovery
export function useApiErrorRecovery() {
  return useErrorRecovery({
    maxRetries: 3,
    retryDelay: 2000,
    onRetry: (attempt) => {
      console.log(`API retry attempt ${attempt}`)
    }
  })
}

// Hook for payment error recovery
export function usePaymentErrorRecovery() {
  return useErrorRecovery({
    maxRetries: 2,
    retryDelay: 3000,
    onError: (error) => {
      console.error('Payment error occurred:', error.message)
    },
    onMaxRetriesReached: () => {
      console.error('Payment failed after maximum retries')
    }
  })
}

export default useErrorRecovery