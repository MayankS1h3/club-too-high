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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addSampleEvents() {
  const sampleEvents = [
    {
      title: 'NEON NIGHTS',
      event_date: '2025-10-15T22:00:00Z',
      dj_name: 'DJ SHADOW',
      ticket_price: 2500,
      poster_image_url: 'https://images.unsplash.com/photo-1571266028243-d220c9d3b104?w=800',
      description: 'Experience the ultimate electronic music journey with internationally acclaimed DJ Shadow. State-of-the-art sound system, stunning visuals, and non-stop dancing till dawn.'
    },
    {
      title: 'ROYAL BEATS',
      event_date: '2025-10-22T21:30:00Z',
      dj_name: 'MC VIPER',
      ticket_price: 3000,
      poster_image_url: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800',
      description: 'A night of royal treatment with premium cocktails, VIP service, and electrifying beats by MC Viper. Dress code: Smart casual.'
    },
    {
      title: 'WEEKEND MADNESS',
      event_date: '2025-10-29T23:00:00Z',
      dj_name: 'DJ STORM',
      ticket_price: 2000,
      poster_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      description: 'End your week with a bang! High-energy music, amazing crowd, and the best nightlife experience in Jaipur.'
    },
    {
      title: 'BOLLYWOOD FUSION',
      event_date: '2025-11-05T21:00:00Z',
      dj_name: 'DJ REMIX',
      ticket_price: 1800,
      poster_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      description: 'A unique fusion of Bollywood hits and electronic beats. Perfect for those who love to dance to familiar tunes with a modern twist.'
    }
  ]

  try {
    const { data, error } = await supabase
      .from('events')
      .insert(sampleEvents)
      .select()

    if (error) {
      console.error('Error inserting events:', error)
      return
    }

    console.log('Successfully added sample events:', data)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run the function
addSampleEvents()