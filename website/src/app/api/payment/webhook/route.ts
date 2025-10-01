import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay-server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const payload = JSON.parse(body)
    const { event: webhookEvent, payload: webhookPayload } = payload

    console.log('Razorpay Webhook Event:', webhookEvent)

    switch (webhookEvent) {
      case 'payment.authorized':
      case 'payment.captured':
        await handlePaymentSuccess(webhookPayload.payment.entity)
        break

      case 'payment.failed':
        await handlePaymentFailure(webhookPayload.payment.entity)
        break

      case 'order.paid':
        await handleOrderPaid(webhookPayload.order.entity)
        break

      default:
        console.log('Unhandled webhook event:', webhookEvent)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(payment: any) {
  try {
    const { id: paymentId, order_id: orderId, amount, status } = payment

    // Find booking by Razorpay order ID
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single()

    if (error || !booking) {
      console.error('Booking not found for order:', orderId)
      return
    }

    // Update booking status if not already confirmed
    if (booking.status !== 'confirmed') {
      await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          razorpay_payment_id: paymentId,
          confirmed_at: new Date().toISOString(),
          webhook_confirmed: true
        })
        .eq('id', booking.id)

      console.log('Booking confirmed via webhook:', booking.id)
    }
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailure(payment: any) {
  try {
    const { order_id: orderId, error_code, error_description } = payment

    // Find booking by Razorpay order ID
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single()

    if (error || !booking) {
      console.error('Booking not found for order:', orderId)
      return
    }

    // Update booking status to failed
    await supabase
      .from('bookings')
      .update({
        status: 'failed',
        failure_reason: `${error_code}: ${error_description}`,
        webhook_confirmed: true
      })
      .eq('id', booking.id)

    console.log('Booking marked as failed via webhook:', booking.id)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handleOrderPaid(order: any) {
  try {
    const { id: orderId, amount_paid } = order

    // Find booking by Razorpay order ID
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single()

    if (error || !booking) {
      console.error('Booking not found for order:', orderId)
      return
    }

    // Update booking with paid amount
    await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        amount_paid: amount_paid / 100, // Convert from paise to rupees
        confirmed_at: new Date().toISOString(),
        webhook_confirmed: true
      })
      .eq('id', booking.id)

    console.log('Order payment confirmed via webhook:', booking.id)
  } catch (error) {
    console.error('Error handling order paid:', error)
  }
}