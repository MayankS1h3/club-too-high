import { supabase } from './supabase'
import type { Event, Booking } from './supabase'
import {
  DatabaseEvent,
  DatabaseProfile,
  DatabaseBooking,
  BookingWithEvent,
  CreateBookingInput,
  UpdateBookingPaymentInput,
  UpdateProfileInput,
  handleDatabaseError,
  validateRequiredFields,
  validateCreateBookingInput,
  validateUpdateBookingPaymentInput,
  validateUpdateProfileInput,
  isDatabaseEvent,
  isDatabaseProfile,
  isDatabaseBooking
} from './database-types'

// Events
export async function getUpcomingEvents(): Promise<DatabaseEvent[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
    
    if (error) handleDatabaseError(error)
    
    // Validate response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format')
    }
    
    // Type validation for each event
    const validatedData = data.filter(isDatabaseEvent)
    if (validatedData.length !== data.length) {
      console.warn('Some events had invalid data structure')
    }
    
    return validatedData
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getEventById(id: string): Promise<DatabaseEvent> {
  try {
    // Validate input
    validateRequiredFields({ id }, ['id'])
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) handleDatabaseError(error)
    
    // Validate response data
    if (!isDatabaseEvent(data)) {
      throw new Error('Invalid event data structure')
    }
    
    return data
  } catch (error) {
    handleDatabaseError(error)
  }
}

// Bookings
export async function createBooking(
  eventId: string, 
  userId: string, 
  numTickets: number, 
  totalAmount: number, 
  paymentId: string
): Promise<DatabaseBooking> {
  try {
    // Validate inputs
    validateRequiredFields(
      { eventId, userId, numTickets, totalAmount, paymentId },
      ['eventId', 'userId', 'numTickets', 'totalAmount', 'paymentId']
    )
    
    // Additional validation
    if (numTickets <= 0 || numTickets > 10) {
      throw new Error('Number of tickets must be between 1 and 10')
    }
    
    if (totalAmount <= 0) {
      throw new Error('Total amount must be positive')
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        event_id: eventId,
        user_id: userId,
        num_of_tickets: numTickets,
        total_amount: totalAmount,
        payment_id: paymentId,
        status: 'confirmed'
      })
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    
    // Validate response data
    if (!isDatabaseBooking(data)) {
      throw new Error('Invalid booking data structure')
    }
    
    return data
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function getUserBookings(userId: string): Promise<BookingWithEvent[]> {
  try {
    // Validate input
    validateRequiredFields({ userId }, ['userId'])
    
    const { data, error } = await supabase
      .from('bookings')
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) handleDatabaseError(error)
    
    // Validate response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format')
    }
    
    // Type validation and transformation
    const validatedData: BookingWithEvent[] = data
      .filter(booking => isDatabaseBooking(booking))
      .map(booking => ({
        ...booking,
        events: (booking as any).events || null
      }))
    
    if (validatedData.length !== data.length) {
      console.warn('Some bookings had invalid data structure')
    }
    
    return validatedData
  } catch (error) {
    handleDatabaseError(error)
  }
}

// Profile
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: UpdateProfileInput): Promise<DatabaseProfile> {
  try {
    // Validate inputs
    validateRequiredFields({ userId }, ['userId'])
    
    if (!validateUpdateProfileInput(updates)) {
      throw new Error('Invalid profile update data')
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    
    // Validate response data
    if (!isDatabaseProfile(data)) {
      throw new Error('Invalid profile data structure')
    }
    
    return data
  } catch (error) {
    handleDatabaseError(error)
  }
}

export async function updateBookingPaymentStatus(
  bookingId: string,
  paymentData: UpdateBookingPaymentInput
): Promise<DatabaseBooking> {
  try {
    // Validate inputs
    validateRequiredFields({ bookingId }, ['bookingId'])
    
    if (!validateUpdateBookingPaymentInput(paymentData)) {
      throw new Error('Invalid payment update data')
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .update({
        payment_status: paymentData.payment_status,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single()
    
    if (error) handleDatabaseError(error)
    
    // Validate response data
    if (!isDatabaseBooking(data)) {
      throw new Error('Invalid booking data structure')
    }
    
    return data
  } catch (error) {
    handleDatabaseError(error)
  }
}