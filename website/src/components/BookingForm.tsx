'use client'

import { useState, useEffect } from 'react'
import { razorpayConfig, handleRazorpayError } from '@/lib/razorpay'
import type { DatabaseEvent } from '@/lib/database-types'
import type { RazorpayOptions, RazorpayResponse } from '@/lib/razorpay'
import { ErrorBoundary } from './ErrorBoundary'
import { CONFIG } from '@/lib/config'
import { 
  PaymentCreateOrderRequest, 
  PaymentCreateOrderResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
  TicketType
} from '@/lib/api-types'

interface BookingFormProps {
  event: DatabaseEvent
  user: {
    id: string
    email: string
  }
  onClose: () => void
  onSuccess: () => void
}

export default function BookingForm({ event, user, onClose, onSuccess }: BookingFormProps) {
  // Cart-style state for multiple ticket types
  const [cart, setCart] = useState({
    women: 0,
    couple: 0,
    stag: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Update cart quantity for a specific ticket type
  const updateCartQuantity = (ticketType: TicketType, quantity: number) => {
    const maxTickets = 10
    const newQuantity = Math.max(0, Math.min(quantity, maxTickets))
    setCart(prev => ({
      ...prev,
      [ticketType]: newQuantity
    }))
  }

  // Calculate total tickets in cart
  const getTotalTickets = () => cart.women + cart.couple + cart.stag

  // Calculate total amount
  const getTotalAmount = () => {
    return (cart.women * event.woman_price) + 
           (cart.couple * event.couple_price) + 
           (cart.stag * event.stag_price)
  }

  const totalAmount = getTotalAmount()
  const totalTickets = getTotalTickets()

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          setRazorpayLoaded(true)
          resolve(true)
        }
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })
    }

    if (!window.Razorpay) {
      loadRazorpay()
    } else {
      setRazorpayLoaded(true)
    }
  }, [])

  const createOrder = async (): Promise<PaymentCreateOrderResponse> => {
    try {
      const requestBody: PaymentCreateOrderRequest = {
        eventId: event.id,
        userId: user.id,
        cart: cart,
        totalAmount,
      }

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      return data as PaymentCreateOrderResponse
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment order'
      throw new Error(errorMessage)
    }
  }

  const verifyPayment = async (paymentData: RazorpayResponse, bookingId: string): Promise<PaymentVerifyResponse> => {
    try {
      const requestBody: PaymentVerifyRequest = {
        ...paymentData,
        bookingId,
      }

      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed')
      }

      return data as PaymentVerifyResponse
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment'
      throw new Error(errorMessage)
    }
  }

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      setError('Payment system is loading. Please try again.')
      return
    }

    setLoading(true)
    setError('')
    setStep('payment')

    try {
      // Create order on backend
      const orderData = await createOrder()

      const options: RazorpayOptions = {
        key: razorpayConfig.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: razorpayConfig.company_name,
        description: `${event.title} - ${totalTickets} ticket(s)`,
        image: razorpayConfig.image,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          setStep('processing')
          try {
            // Verify payment on backend
            await verifyPayment(response, orderData.bookingId)
            setStep('success')
            setTimeout(() => {
              onSuccess()
            }, CONFIG.UI.SUCCESS_REDIRECT_DELAY_MS)
          } catch (verifyError: unknown) {
            const errorMessage = verifyError instanceof Error ? verifyError.message : 'Payment verification failed'
            setError(errorMessage)
            setStep('details')
          }
        },
        prefill: {
          name: orderData.userName || user.email,
          email: user.email,
        },
        notes: {
          event_id: event.id,
          user_id: user.id,
          num_tickets: totalTickets,
        },
        theme: razorpayConfig.theme,
        modal: {
          ondismiss: () => {
            setStep('details')
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', (response: { error: unknown }) => {
        setError(handleRazorpayError(response.error))
        setStep('details')
        setLoading(false)
      })

      rzp.open()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed'
      setError(errorMessage)
      setStep('details')
    } finally {
      setLoading(false)
    }
  }

  const renderDetails = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-light text-white mb-2">{event.title}</h3>
        <div className="text-gray-400">
          {new Date(event.event_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Select Tickets
        </label>
        
        {/* Women Tickets */}
        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-white">Women</div>
              <div className="text-sm text-gray-400">₹{event.woman_price.toLocaleString()} per ticket</div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => updateCartQuantity('women', cart.women - 1)}
                disabled={cart.women === 0}
                className="w-8 h-8 border border-gray-600 rounded text-white hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="w-8 text-center text-white">{cart.women}</span>
              <button
                type="button"
                onClick={() => updateCartQuantity('women', cart.women + 1)}
                className="w-8 h-8 border border-gray-600 rounded text-white hover:border-white"
              >
                +
              </button>
            </div>
          </div>
          {cart.women > 0 && (
            <div className="text-right text-sm text-cyan-400">
              Subtotal: ₹{(cart.women * event.woman_price).toLocaleString()}
            </div>
          )}
        </div>

        {/* Couple Tickets */}
        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-white">Couple</div>
              <div className="text-sm text-gray-400">₹{event.couple_price.toLocaleString()} per ticket</div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => updateCartQuantity('couple', cart.couple - 1)}
                disabled={cart.couple === 0}
                className="w-8 h-8 border border-gray-600 rounded text-white hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="w-8 text-center text-white">{cart.couple}</span>
              <button
                type="button"
                onClick={() => updateCartQuantity('couple', cart.couple + 1)}
                className="w-8 h-8 border border-gray-600 rounded text-white hover:border-white"
              >
                +
              </button>
            </div>
          </div>
          {cart.couple > 0 && (
            <div className="text-right text-sm text-cyan-400">
              Subtotal: ₹{(cart.couple * event.couple_price).toLocaleString()}
            </div>
          )}
        </div>

        {/* Stag Tickets */}
        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium text-white">Stag</div>
              <div className="text-sm text-gray-400">₹{event.stag_price.toLocaleString()} per ticket</div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => updateCartQuantity('stag', cart.stag - 1)}
                disabled={cart.stag === 0}
                className="w-8 h-8 border border-gray-600 rounded text-white hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="w-8 text-center text-white">{cart.stag}</span>
              <button
                type="button"
                onClick={() => updateCartQuantity('stag', cart.stag + 1)}
                className="w-8 h-8 border border-gray-600 rounded text-white hover:border-white"
              >
                +
              </button>
            </div>
          </div>
          {cart.stag > 0 && (
            <div className="text-right text-sm text-cyan-400">
              Subtotal: ₹{(cart.stag * event.stag_price).toLocaleString()}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {totalTickets > 0 && (
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center text-white">
              <span className="font-medium">Total ({totalTickets} tickets)</span>
              <span className="text-xl font-bold text-cyan-400">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">💳</div>
        <h3 className="text-2xl font-light text-white mb-2">Razorpay Payment</h3>
        <div className="text-gray-400">
          Complete your payment of ₹{totalAmount.toLocaleString()} through Razorpay
        </div>
      </div>

      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>

      <div className="text-center text-sm text-gray-400">
        Please complete the payment in the Razorpay popup window.
      </div>
    </div>
  )

  const renderProcessing = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <h3 className="text-2xl font-light text-white mb-2">Verifying Payment</h3>
        <div className="text-gray-400">
          Please wait while we verify your payment and confirm your booking.
        </div>
      </div>

      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-3xl font-light text-white mb-4">Booking Confirmed!</h3>
      <div className="text-gray-300 space-y-2">
        <div>Your tickets for {event.title} have been booked successfully.</div>
        <div className="text-white font-medium">
          {totalTickets} ticket{totalTickets > 1 ? 's' : ''} • ₹{totalAmount.toLocaleString()}
        </div>
      </div>
      <div className="text-sm text-gray-400">
        Confirmation details will be sent to your email.
      </div>
    </div>
  )

  return (
    <ErrorBoundary
      fallback={
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 max-w-md w-full rounded-lg p-6 text-center">
            <div className="text-red-400 mb-4">Something went wrong with the payment form</div>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Close and Try Again
            </button>
          </div>
        </div>
      }
      onError={(error: Error, errorInfo: React.ErrorInfo) => {
        console.error('BookingForm Error:', error, errorInfo)
        // You can add error reporting service here later
      }}
    >
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-gray-900 max-w-md w-full rounded-lg my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-light text-white">
            {step === 'details' && 'Book Tickets'}
            {step === 'payment' && 'Complete Payment'}
            {step === 'processing' && 'Verifying Payment'}
            {step === 'success' && 'Booking Confirmed'}
          </h2>
          {(step !== 'payment' && step !== 'processing') && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {step === 'details' && renderDetails()}
          {step === 'payment' && renderPayment()}
          {step === 'processing' && renderProcessing()}
          {step === 'success' && renderSuccess()}
        </div>

        {/* Footer */}
        {step === 'details' && (
          <div className="p-6 border-t border-gray-800">
            <button
              onClick={handlePayment}
              disabled={loading || !razorpayLoaded || totalTickets === 0}
              className="w-full py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              {loading ? 'Processing...' : !razorpayLoaded ? 'Loading Payment...' : totalTickets === 0 ? 'Select Tickets' : `Pay ₹${totalAmount.toLocaleString()}`}
            </button>
          </div>
        )}
        </div>
      </div>
    </ErrorBoundary>
  )
}