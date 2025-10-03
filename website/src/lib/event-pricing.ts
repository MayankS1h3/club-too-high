import { supabase } from './supabase'

export interface CreateEventData {
  title: string
  event_date: string
  dj_name?: string
  woman_price: number
  couple_price: number
  stag_price: number
  poster_image_url?: string
  description?: string
}

export async function createEvent(eventData: CreateEventData) {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Failed to create event:', error)
    return { data: null, error }
  }
}

export async function updateEvent(eventId: string, eventData: Partial<CreateEventData>) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Failed to update event:', error)
    return { data: null, error }
  }
}