'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console and error reporting service
    console.error('Global Error:', error)
    
    // In production, log to error monitoring service
    // logErrorToService(error)
  }, [error])

  return (
    <html>
      <body className="bg-black text-white">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center space-y-8">
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="text-6xl font-bold text-white">500</h1>
              <h2 className="text-2xl font-semibold text-gray-300">Server Error</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                We're experiencing technical difficulties. Our team has been notified and is working to fix the issue.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={reset}
                  className="py-3 px-6 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Try Again
                </button>
                
                <Link
                  href="/"
                  className="py-3 px-6 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-center"
                >
                  Go Home
                </Link>
              </div>
              
              <Link
                href="/contact"
                className="block py-3 px-6 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 text-center"
              >
                Report Issue
              </Link>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">What you can do:</h3>
              <ul className="space-y-2 text-gray-400 text-sm text-left">
                <li>• Refresh the page in a few minutes</li>
                <li>• Check your internet connection</li>
                <li>• Try accessing a different page</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-gray-900 p-4 rounded-lg border border-gray-700">
                <summary className="text-red-400 font-medium cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Message:</span>
                    <pre className="text-red-300 mt-1 overflow-auto text-xs">
                      {error.message}
                    </pre>
                  </div>
                  {error.digest && (
                    <div>
                      <span className="text-gray-400">Digest:</span>
                      <pre className="text-gray-300 mt-1 text-xs">
                        {error.digest}
                      </pre>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Stack:</span>
                    <pre className="text-gray-300 mt-1 text-xs overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}