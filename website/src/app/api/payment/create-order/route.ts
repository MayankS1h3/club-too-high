import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay-server'
import { createBooking } from '@/lib/database'
import { supabase } from '@/lib/supabase'
import { 
  validateUUID, 
  validatePaymentAmount, 
  validateTicketQuantity,
  combineValidationResults
} from '@/lib/validation'
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
    const rateLimit = checkRateLimit(`payment-create-${clientIP}`, 5, 60000) // 5 requests per minute
    
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

    const { eventId, userId, numTickets, totalAmount } = bodyResult.data

    // Comprehensive input validation
    const validationResults = [
      validateUUID(eventId),
      validateUUID(userId),
      validateTicketQuantity(numTickets),
      validatePaymentAmount(totalAmount)
    ]

    const validationResult = combineValidationResults(validationResults)
    if (!validationResult.isValid) {
      return createErrorResponse(
        'Validation failed',
        400,
        validationResult.errors
      )
    }

    // Verify event exists and get details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return createErrorResponse('Event not found', 404)
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return createErrorResponse('User not found', 404)
    }

    // Calculate total amount (server-side validation)
    const calculatedAmount = event.ticket_price * numTickets
    if (Math.abs(calculatedAmount - totalAmount) > 0.01) {
      return createErrorResponse(
        'Amount mismatch. Expected: ₹' + calculatedAmount + ', Received: ₹' + totalAmount,
        400
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
      return createErrorResponse('Failed to create booking', 500)
    }

    return createSuccessResponse({
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
    return createErrorResponse('Internal server error', 500)
  }
}