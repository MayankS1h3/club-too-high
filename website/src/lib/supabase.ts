import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Profile = {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
}

export type Event = {
  id: string
  title: string
  event_date: string
  dj_name: string | null
  woman_price: number
  couple_price: number
  stag_price: number
  poster_image_url: string | null
  description: string | null
  created_at: string
}

export type Booking = {
  id: string
  user_id: string
  event_id: string
  num_of_tickets: number
  total_amount: number
  payment_id: string
  status: string
  created_at: string
  // Razorpay specific fields
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  receipt_id?: string
  confirmed_at?: string
  failure_reason?: string
  amount_paid?: number
  webhook_confirmed?: boolean
}

export type GalleryImage = {
  id: string
  image_url: string
  caption: string | null
  created_at: string
}