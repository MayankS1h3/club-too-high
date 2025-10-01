// Client-side Razorpay configuration
// This file is safe to be imported in client components

// Validate that required environment variables are present
if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
  throw new Error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not defined')
}

// Razorpay configuration for client-side (public information only)
export const razorpayConfig = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  currency: 'INR',
  company_name: 'Club Too High',
  description: 'Event Ticket Booking',
  image: '/favicon.ico', // Your logo URL
  theme: {
    color: '#8B5CF6' // Purple theme to match your brand
  }
}

// Razorpay payment options type
export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact?: string
  }
  notes: {
    event_id: string
    user_id: string
    num_tickets: number
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

// Razorpay response type
export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// Error handling for Razorpay
export function handleRazorpayError(error: any): string {
  if (error.code === 'BAD_REQUEST_ERROR') {
    return 'Invalid payment request. Please try again.'
  } else if (error.code === 'GATEWAY_ERROR') {
    return 'Payment gateway error. Please try again later.'
  } else if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection.'
  } else if (error.code === 'SERVER_ERROR') {
    return 'Server error. Please try again later.'
  } else {
    return 'Payment failed. Please try again.'
  }
}

// Declare Razorpay global for TypeScript
declare global {
  interface Window {
    Razorpay: any
  }
}