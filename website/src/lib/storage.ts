import { supabase } from './supabase'

// Upload file to Supabase Storage
export async function uploadEventPoster(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `posters/${fileName}`

  const { data, error } = await supabase.storage
    .from('event-posters')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('event-posters')
    .getPublicUrl(filePath)

  return publicUrl
}

// Delete file from Supabase Storage
export async function deleteEventPoster(url: string): Promise<void> {
  // Extract file path from URL
  const urlParts = url.split('/storage/v1/object/public/event-posters/')
  if (urlParts.length < 2) return

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('event-posters')
    .remove([filePath])

  if (error) {
    throw error
  }
}

// Get all files in the event-posters bucket
export async function listEventPosters() {
  const { data, error } = await supabase.storage
    .from('event-posters')
    .list('posters', {
      limit: 100,
      offset: 0
    })

  if (error) {
    throw error
  }

  return data
}