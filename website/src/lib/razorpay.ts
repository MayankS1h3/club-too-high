import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay instance (server-side only)
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Razorpay configuration for client-side
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

// Verify Razorpay payment signature
export function verifyRazorpaySignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): boolean {
  try {
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')
    
    return expectedSignature === razorpay_signature
  } catch (error) {
    console.error('Razorpay signature verification failed:', error)
    return false
  }
}

// Create Razorpay order
export async function createRazorpayOrder(amount: number, receipt: string) {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        company: 'Club Too High',
        purpose: 'Event Ticket Booking'
      }
    })
    
    return order
  } catch (error) {
    console.error('Failed to create Razorpay order:', error)
    throw new Error('Unable to create payment order')
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