// Enhanced TypeScript types for better type safety

export interface PaymentCreateOrderRequest {
  eventId: string
  userId: string
  cart: {
    women: number
    couple: number
    stag: number
  }
  totalAmount: number
}

export interface PaymentCreateOrderResponse {
  orderId: string
  amount: number
  currency: string
  bookingId: string
  userName?: string
}

export interface PaymentVerifyRequest {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
  bookingId: string
}

export interface PaymentVerifyResponse {
  success: boolean
  bookingId: string
  message?: string
}

export interface ApiErrorResponse {
  error: string
  details?: any
  timestamp?: string
  requestId?: string
}

export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
  timestamp?: string
  requestId?: string
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// Razorpay error types
export interface RazorpayError {
  code: string
  description: string
  source: string
  step: string
  reason: string
  metadata: {
    order_id?: string
    payment_id?: string
  }
}

// Ticket type validation
export type TicketType = 'women' | 'couple' | 'stag'

export function isValidTicketType(type: string): type is TicketType {
  return ['women', 'couple', 'stag'].includes(type)
}

// Payment status validation
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled'

export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return ['pending', 'paid', 'failed', 'cancelled'].includes(status)
}

// Booking status validation
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded'

export function isValidBookingStatus(status: string): status is BookingStatus {
  return ['pending', 'confirmed', 'cancelled', 'refunded'].includes(status)
}

// Enhanced validation for API request bodies
export interface ValidatedRequest<T> {
  data: T
  isValid: boolean
  errors: string[]
}

export function validateApiRequest<T>(
  data: any,
  validator: (data: any) => data is T
): ValidatedRequest<T> {
  if (validator(data)) {
    return {
      data,
      isValid: true,
      errors: []
    }
  }
  
  return {
    data: data as T, // Fallback, but marked as invalid
    isValid: false,
    errors: ['Invalid request format']
  }
}

// Type guards for request validation
export function isPaymentCreateOrderRequest(data: any): data is PaymentCreateOrderRequest {
  return (
    typeof data === 'object' &&
    typeof data.eventId === 'string' &&
    typeof data.userId === 'string' &&
    typeof data.cart === 'object' &&
    typeof data.cart.women === 'number' &&
    typeof data.cart.couple === 'number' &&
    typeof data.cart.stag === 'number' &&
    typeof data.totalAmount === 'number' &&
    data.cart.women >= 0 &&
    data.cart.couple >= 0 &&
    data.cart.stag >= 0 &&
    (data.cart.women + data.cart.couple + data.cart.stag) > 0 &&
    data.totalAmount > 0
  )
}

export function isPaymentVerifyRequest(data: any): data is PaymentVerifyRequest {
  return (
    typeof data === 'object' &&
    typeof data.razorpay_payment_id === 'string' &&
    typeof data.razorpay_order_id === 'string' &&
    typeof data.razorpay_signature === 'string' &&
    typeof data.bookingId === 'string' &&
    data.razorpay_payment_id.length > 0 &&
    data.razorpay_order_id.length > 0 &&
    data.razorpay_signature.length > 0 &&
    data.bookingId.length > 0
  )
}