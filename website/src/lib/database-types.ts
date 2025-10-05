// Database type definitions and interfaces
// This file provides strong typing for all database operations

export interface DatabaseEvent {
  id: string
  title: string
  description: string | null
  event_date: string
  dj_name: string | null
  woman_price: number
  couple_price: number
  stag_price: number
  poster_image_url: string | null
  created_at: string
  updated_at?: string // Make this optional since it might not exist
}

export interface DatabaseProfile {
  id: string
  email: string
  full_name: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseBooking {
  id: string
  event_id: string
  user_id: string
  num_of_tickets: number
  total_amount: number
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  payment_id: string | null
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  receipt_id: string | null
  failure_reason: string | null
  payment_status: 'pending' | 'paid' | 'failed' | null
  womens_tickets?: number
  couple_tickets?: number
  stag_tickets?: number
  created_at: string
  updated_at: string
}

export interface DatabaseGalleryImage {
  id: string
  title: string
  image_url: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

// Joined types for complex queries
export interface BookingWithEvent extends DatabaseBooking {
  events: {
    id: string
    title: string
    event_date: string
    dj_name: string | null
    poster_image_url: string | null
  } | null
}

// Input types for database operations
export interface CreateBookingInput {
  event_id: string
  user_id: string
  num_of_tickets: number
  total_amount: number
  payment_id: string
  status: 'pending' | 'paid' | 'failed'
  razorpay_order_id: string
  receipt_id: string
  womens_tickets?: number
  couple_tickets?: number
  stag_tickets?: number
}

export interface UpdateBookingPaymentInput {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
  payment_status: 'paid' | 'failed'
}

export interface UpdateProfileInput {
  full_name?: string
}

// Validation helpers for database inputs
export function validateCreateBookingInput(input: any): input is CreateBookingInput {
  return (
    typeof input === 'object' &&
    typeof input.event_id === 'string' &&
    typeof input.user_id === 'string' &&
    typeof input.num_of_tickets === 'number' &&
    typeof input.total_amount === 'number' &&
    typeof input.payment_id === 'string' &&
    ['pending', 'paid', 'failed'].includes(input.status) &&
    typeof input.razorpay_order_id === 'string' &&
    typeof input.receipt_id === 'string'
  )
}

export function validateUpdateBookingPaymentInput(input: any): input is UpdateBookingPaymentInput {
  return (
    typeof input === 'object' &&
    typeof input.razorpay_payment_id === 'string' &&
    typeof input.razorpay_order_id === 'string' &&
    typeof input.razorpay_signature === 'string' &&
    ['paid', 'failed'].includes(input.payment_status)
  )
}

export function validateUpdateProfileInput(input: any): input is UpdateProfileInput {
  return (
    typeof input === 'object' &&
    (input.full_name === undefined || typeof input.full_name === 'string')
  )
}

// Database error types
export class DatabaseError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Helper function to handle database errors consistently
export function handleDatabaseError(error: any): never {
  if (error?.code) {
    throw new DatabaseError(
      error.message || 'Database operation failed',
      error.code,
      error
    )
  }
  throw new DatabaseError(error?.message || 'Unknown database error')
}

// Helper function to validate required fields
export function validateRequiredFields(
  data: Record<string, any>, 
  requiredFields: string[]
): void {
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw new ValidationError(`${field} is required`, field)
    }
  }
}

// Type guards for database responses
export function isDatabaseEvent(data: any): data is DatabaseEvent {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    typeof data.event_date === 'string' &&
    typeof data.woman_price === 'number' &&
    typeof data.couple_price === 'number' &&
    typeof data.stag_price === 'number'
  )
}

export function isDatabaseProfile(data: any): data is DatabaseProfile {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.email === 'string'
  )
}

export function isDatabaseBooking(data: any): data is DatabaseBooking {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.event_id === 'string' &&
    typeof data.user_id === 'string' &&
    typeof data.num_of_tickets === 'number' &&
    typeof data.total_amount === 'number'
  )
}