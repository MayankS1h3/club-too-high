import { supabase } from './supabase'
import type { Event, GalleryImage, Booking } from './supabase'

// Events
export async function getUpcomingEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
  
  if (error) throw error
  return data as Event[]
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data as Event
}

// Gallery
export async function getGalleryImages() {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as GalleryImage[]
}

// Bookings
export async function createBooking(
  eventId: string, 
  userId: string, 
  numTickets: number, 
  totalAmount: number, 
  paymentId: string
) {
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
  
  if (error) throw error
  return data as Booking
}

export async function getUserBookings(userId: string) {
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
  
  if (error) throw error
  return data
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

export async function updateProfile(userId: string, updates: { full_name?: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateBookingPaymentStatus(
  bookingId: string,
  paymentData: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
    payment_status: 'paid' | 'failed'
  }
) {
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
  
  if (error) throw error
  return data
}