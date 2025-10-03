'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

interface PaymentErrorBoundaryProps {
  children: ReactNode
  onPaymentError?: (error: Error) => void
}

export class PaymentErrorBoundary extends Component<PaymentErrorBoundaryProps> {
  handlePaymentError = (error: Error, errorInfo: ErrorInfo) => {
    // Log payment-specific error
    console.error('Payment Error Boundary:', error, errorInfo)
    
    // Call custom payment error handler
    if (this.props.onPaymentError) {
      this.props.onPaymentError(error)
    }

    // In production, log to payment monitoring service
    // logPaymentError(error, errorInfo)
  }

  render() {
    return (
      <ErrorBoundary
        onError={this.handlePaymentError}
        fallback={
          <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                
                <h1 className="text-2xl font-bold text-white">Payment Error</h1>
                <p className="text-gray-400">
                  We encountered an issue processing your payment. Your card has not been charged.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  If you were in the middle of a payment, please check your payment method and try again. 
                  No charges have been made to your account.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Try Payment Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/events'}
                  className="w-full py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  Browse Events
                </button>
                
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        }
      >
        {this.props.children}
      </ErrorBoundary>
    )
  }
}

export default PaymentErrorBoundary