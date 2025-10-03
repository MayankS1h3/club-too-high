'use client'

import { useState } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import PaymentErrorBoundary from '@/components/PaymentErrorBoundary'
import { useErrorRecovery } from '@/lib/error-recovery'

// Component that throws an error for testing
function ErrorTrigger({ errorType }: { errorType: string }) {
  if (errorType === 'render') {
    throw new Error('Test render error from ErrorTrigger component')
  }
  
  if (errorType === 'payment') {
    throw new Error('Test payment processing error')
  }
  
  return <div className="text-green-400">No error - component rendered successfully</div>
}

export default function ErrorTestPage() {
  const [errorType, setErrorType] = useState<string>('')
  const { handleError, retry, error, isRetrying, retryCount, canRetry } = useErrorRecovery({
    maxRetries: 3,
    retryDelay: 1000
  })

  const triggerAsyncError = async () => {
    try {
      // Simulate an async operation that fails
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Async operation failed')), 1000)
      })
    } catch (err) {
      await handleError(err as Error, { context: 'async-test' })
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Testing</h1>
          <p className="text-gray-400">This page is only available in development mode.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Error Boundary Testing</h1>
          <p className="text-gray-400">Test different error scenarios and recovery mechanisms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Error Trigger Controls */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Trigger Errors</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setErrorType('render')}
                className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Trigger Render Error
              </button>
              
              <button
                onClick={() => setErrorType('payment')}
                className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Trigger Payment Error
              </button>
              
              <button
                onClick={triggerAsyncError}
                className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Trigger Async Error
              </button>
              
              <button
                onClick={() => setErrorType('')}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear Errors
              </button>
            </div>

            {/* Async Error Recovery Status */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="text-red-400 font-medium mb-2">Async Error Detected</h3>
                <p className="text-red-300 text-sm mb-3">{error.message}</p>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>Retry Count: {retryCount}</span>
                  <span>{isRetrying ? 'Retrying...' : 'Ready'}</span>
                </div>
                {canRetry && (
                  <button
                    onClick={retry}
                    disabled={isRetrying}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isRetrying ? 'Retrying...' : 'Manual Retry'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error Boundary Test Areas */}
          <div className="space-y-6">
            {/* General Error Boundary */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">General Error Boundary</h3>
              <ErrorBoundary>
                <ErrorTrigger errorType={errorType === 'render' ? 'render' : ''} />
              </ErrorBoundary>
            </div>

            {/* Payment Error Boundary */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Error Boundary</h3>
              <PaymentErrorBoundary>
                <ErrorTrigger errorType={errorType === 'payment' ? 'payment' : ''} />
              </PaymentErrorBoundary>
            </div>
          </div>
        </div>

        {/* Error Testing Instructions */}
        <div className="mt-12 bg-blue-900/20 border border-blue-500/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Testing Instructions</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• <strong>Render Error:</strong> Tests the general ErrorBoundary component with fallback UI</li>
            <li>• <strong>Payment Error:</strong> Tests the PaymentErrorBoundary with payment-specific error handling</li>
            <li>• <strong>Async Error:</strong> Tests the useErrorRecovery hook for async operations</li>
            <li>• All errors are logged to console and error monitoring system</li>
            <li>• Check browser console for detailed error logs and reports</li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}