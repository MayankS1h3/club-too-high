import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

// Initialize Supabase client with service role key to bypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addSampleGalleryImages() {
  const sampleImages = [
    {
      image_url: 'https://images.unsplash.com/photo-1571266028243-d220c9d3b104?w=800',
      caption: 'Electric night with DJ Shadow - crowd going wild!'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800', 
      caption: 'VIP section vibes during Royal Beats event'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      caption: 'Weekend madness - the dance floor is on fire!'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      caption: 'Bollywood fusion night - best of both worlds'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1545224144-b38cd309ef69?w=800',
      caption: 'The crowd enjoying premium cocktails'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=800',
      caption: 'DJ booth action - mixing the perfect beats'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1571266028243-d220c9d3b104?w=800',
      caption: 'Laser show lighting up the night'
    },
    {
      image_url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800',
      caption: 'Friends celebrating at Club Too High'
    }
  ]

  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert(sampleImages)
      .select()

    if (error) {
      console.error('Error inserting gallery images:', error)
      return
    }

    console.log('Successfully added sample gallery images:', data)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run the function
addSampleGalleryImages()