import Razorpay from 'razorpay'
import { createHmac } from 'crypto'

// Server-side only Razorpay configuration
// This file should only be imported in API routes and server components

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
  throw new Error('NEXT_PUBLIC_RAZORPAY_KEY_ID is not defined')
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('RAZORPAY_KEY_SECRET is not defined')
}

// Initialize Razorpay instance (server-side only)
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Verify Razorpay payment signature
export function verifyRazorpaySignature(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): boolean {
  try {
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
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

// Verify webhook signature
export function verifyWebhookSignature(body: string, signature: string): boolean {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Webhook secret not configured')
      return false
    }

    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')
    
    return expectedSignature === signature
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return false
  }
}