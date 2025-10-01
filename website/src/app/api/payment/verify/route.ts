import { NextRequest, NextResponse } from 'next/server'
import { verifyRazorpaySignature } from '@/lib/razorpay-server'
import { updateBookingPaymentStatus } from '@/lib/database'
import { supabase } from '@/lib/supabase'
import { validateUUID, validateString, combineValidationResults } from '@/lib/validation'
import { 
  parseJsonBody, 
  createErrorResponse, 
  createSuccessResponse,
  checkRateLimit,
  getClientIP,
  validateMethod
} from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    // Validate HTTP method
    if (!validateMethod(request, ['POST'])) {
      return createErrorResponse('Method not allowed', 405)
    }

    // Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(`payment-verify-${clientIP}`, 10, 60000) // 10 requests per minute
    
    if (!rateLimit.allowed) {
      return createErrorResponse(
        'Too many requests. Please try again later.',
        429,
        { resetTime: rateLimit.resetTime }
      )
    }

    // Parse and validate JSON body
    const bodyResult = await parseJsonBody(request)
    if (!bodyResult.success) {
      return createErrorResponse(bodyResult.error!, 400)
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      bookingId
    } = bodyResult.data

    // Comprehensive input validation
    const validationResults = [
      validateString(razorpay_payment_id, 1, 100),
      validateString(razorpay_order_id, 1, 100),
      validateString(razorpay_signature, 1, 256),
      validateUUID(bookingId)
    ]

    const validationResult = combineValidationResults(validationResults)
    if (!validationResult.isValid) {
      return createErrorResponse(
        'Validation failed',
        400,
        validationResult.errors
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

      return createErrorResponse('Invalid payment signature', 400)
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