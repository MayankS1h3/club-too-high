import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      bookingId
    } = await request.json()

    // Validate input
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Verify Razorpay signature
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValidSignature) {
      // Update booking status to failed
      await supabase
        .from('bookings')
        .update({
          status: 'failed',
          razorpay_payment_id,
          failure_reason: 'Invalid payment signature'
        })
        .eq('id', bookingId)

      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        events (
          id,
          title,
          event_date,
          dj_name
        )
      `)
      .eq('id', bookingId)
      .eq('razorpay_order_id', razorpay_order_id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Update booking status to confirmed
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        razorpay_payment_id,
        razorpay_signature,
        confirmed_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select(`
        *,
        events (
          id,
          title,
          event_date,
          dj_name,
          poster_image_url
        )
      `)
      .single()

    if (updateError) {
      console.error('Failed to update booking:', updateError)
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500 }
      )
    }

    // TODO: Send confirmation email to user
    // TODO: Generate and store digital ticket

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
      message: 'Payment verified and booking confirmed'
    })

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}