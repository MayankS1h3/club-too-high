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
  getClientIP,
  validateMethod
} from '@/lib/api-helpers'
import { 
  checkAdvancedRateLimit, 
  detectSuspiciousActivity,
  checkPaymentSecurity
} from '@/lib/rate-limiting'
import {
  checkDuplicatePayment,
  registerPaymentAttempt,
  updatePaymentAttemptStatus,
  detectSuspiciousPaymentPattern,
  checkDuplicateRazorpayOrder,
  registerRazorpayOrder
} from '@/lib/payment-protection'

export async function POST(request: NextRequest) {
  try {
    // Validate HTTP method
    if (!validateMethod(request, ['POST'])) {
      return createErrorResponse('Method not allowed', 405)
    }

    // Advanced rate limiting
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || undefined
    
    // Check for suspicious activity
    const suspiciousActivity = detectSuspiciousActivity(clientIP, userAgent, request.url)
    if (suspiciousActivity.isSuspicious && suspiciousActivity.riskLevel === 'high') {
      return createErrorResponse(
        'Suspicious activity detected. Please try again later.',
        429,
        { reason: suspiciousActivity.reason }
      )
    }
    
    // Advanced rate limiting for payment creation
    const rateLimit = checkAdvancedRateLimit(clientIP, 'payment-create')
    
    if (!rateLimit.allowed) {
      return createErrorResponse(
        'Too many payment requests. Please try again later.',
        429,
        { 
          retryAfter: rateLimit.retryAfter,
          resetTime: rateLimit.resetTime 
        }
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

    // Payment security checks
    const paymentSecurity = checkPaymentSecurity(totalAmount, userId, eventId)
    if (!paymentSecurity.isSecure) {
      return createErrorResponse(
        'Payment security check failed',
        400,
        { violations: paymentSecurity.violations }
      )
    }

    // Check for duplicate payment attempts
    const duplicateCheck = checkDuplicatePayment(userId, eventId, totalAmount)
    if (duplicateCheck.isDuplicate) {
      return createErrorResponse(
        'Duplicate payment attempt detected',
        409,
        { reason: duplicateCheck.reason }
      )
    }

    // Check for suspicious payment patterns
    const suspiciousPattern = detectSuspiciousPaymentPattern(userId, eventId, totalAmount)
    if (suspiciousPattern.isSuspicious && suspiciousPattern.riskLevel === 'high') {
      return createErrorResponse(
        'Suspicious payment pattern detected',
        400,
        { reasons: suspiciousPattern.reasons }
      )
    }

    // Check for duplicate Razorpay order
    const duplicateOrder = checkDuplicateRazorpayOrder(userId, eventId, totalAmount)
    if (duplicateOrder.isDuplicate) {
      return createErrorResponse(
        'Payment order already exists',
        409,
        { existingOrderId: duplicateOrder.existingOrderId }
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

    // Register payment attempt
    const paymentAttemptKey = registerPaymentAttempt(userId, eventId, totalAmount)

    try {
      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(totalAmount, receipt)

      // Register Razorpay order for deduplication
      registerRazorpayOrder(razorpayOrder.id, userId, eventId, totalAmount)

      // Update payment attempt status
      updatePaymentAttemptStatus(userId, eventId, totalAmount, 'processing', razorpayOrder.id)

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
        // Mark payment attempt as failed
        updatePaymentAttemptStatus(userId, eventId, totalAmount, 'failed')
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
      
    } catch (razorpayError) {
      console.error('Failed to create Razorpay order:', razorpayError)
      // Mark payment attempt as failed
      updatePaymentAttemptStatus(userId, eventId, totalAmount, 'failed')
      return createErrorResponse('Failed to create payment order', 500)
    }

  } catch (error) {
    console.error('Create order error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}