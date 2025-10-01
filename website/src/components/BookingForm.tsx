'use client'

import { useState, useEffect } from 'react'
import { createBooking } from '@/lib/database'
import { razorpayConfig, handleRazorpayError } from '@/lib/razorpay'
import type { Event } from '@/lib/supabase'
import type { RazorpayOptions, RazorpayResponse } from '@/lib/razorpay'

interface BookingFormProps {
  event: Event
  user: any
  onClose: () => void
  onSuccess: () => void
}

export default function BookingForm({ event, user, onClose, onSuccess }: BookingFormProps) {
  const [numTickets, setNumTickets] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  const totalAmount = event.ticket_price * numTickets

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

  const createOrder = async () => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          userId: user.id,
          numTickets,
          totalAmount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create payment order')
    }
  }

  const verifyPayment = async (paymentData: RazorpayResponse, bookingId: string) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          bookingId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed')
      }

      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify payment')
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
        description: `${event.title} - ${numTickets} ticket(s)`,
        image: razorpayConfig.image,
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          setStep('processing')
          try {
            // Verify payment on backend
            const verificationResult = await verifyPayment(response, orderData.bookingId)
            setStep('success')
            setTimeout(() => {
              onSuccess()
            }, 3000)
          } catch (verifyError: any) {
            setError(verifyError.message)
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
          num_tickets: numTickets,
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
      
      rzp.on('payment.failed', (response: any) => {
        setError(handleRazorpayError(response.error))
        setStep('details')
        setLoading(false)
      })

      rzp.open()
    } catch (error: any) {
      setError(error.message)
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
          Number of Tickets
        </label>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setNumTickets(Math.max(1, numTickets - 1))}
            className="w-10 h-10 border border-gray-600 text-white hover:border-white transition-colors flex items-center justify-center"
          >
            -
          </button>
          <span className="text-xl text-white w-12 text-center">{numTickets}</span>
          <button
            type="button"
            onClick={() => setNumTickets(Math.min(10, numTickets + 1))}
            className="w-10 h-10 border border-gray-600 text-white hover:border-white transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
        <div className="text-sm text-gray-400 mt-2">Maximum 10 tickets per booking</div>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Ticket Price</span>
          <span className="text-white">₹{event.ticket_price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300">Quantity</span>
          <span className="text-white">{numTickets}</span>
        </div>
        <div className="flex justify-between items-center text-xl font-medium pt-2 border-t border-gray-700">
          <span className="text-white">Total</span>
          <span className="text-white">₹{totalAmount.toLocaleString()}</span>
        </div>
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
          {numTickets} ticket{numTickets > 1 ? 's' : ''} • ₹{totalAmount.toLocaleString()}
        </div>
      </div>
      <div className="text-sm text-gray-400">
        Confirmation details will be sent to your email.
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 max-w-md w-full rounded-lg">
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
              disabled={loading || !razorpayLoaded}
              className="w-full py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : !razorpayLoaded ? 'Loading Payment...' : `Pay ₹${totalAmount.toLocaleString()}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}