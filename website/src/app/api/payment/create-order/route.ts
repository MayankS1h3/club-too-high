import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { eventId, userId, numTickets, totalAmount } = await request.json()

    // Validate input
    if (!eventId || !userId || !numTickets || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Verify event exists and get details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate total amount (server-side validation)
    const calculatedAmount = event.ticket_price * numTickets
    if (Math.abs(calculatedAmount - totalAmount) > 0.01) {
      return NextResponse.json(
        { error: 'Amount mismatch' },
        { status: 400 }
      )
    }

    // Generate unique receipt ID
    const receipt = `CTH_${eventId}_${userId}_${Date.now()}`

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(totalAmount, receipt)

    // Store pending booking in database
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        event_id: eventId,
        user_id: userId,
        num_of_tickets: numTickets,
        total_amount: totalAmount,
        payment_id: razorpayOrder.id,
        status: 'pending',
        razorpay_order_id: razorpayOrder.id,
        receipt_id: receipt
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Failed to create booking:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      bookingId: booking.id,
      eventTitle: event.title,
      userName: user.full_name || user.email
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}