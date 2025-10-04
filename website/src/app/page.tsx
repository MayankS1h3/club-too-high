'use client'

import { useState, useEffect } from 'react'
import { getUpcomingEvents } from '@/lib/database'
import { getGalleryImagesFromStorage } from '@/lib/gallery-storage'
import type { DatabaseEvent } from '@/lib/database-types'
import Link from 'next/link'

interface GalleryImageFromStorage {
  id: string
  image_url: string
  caption: string
  created_at: string
}

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<DatabaseEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState('')
  
  const [galleryImages, setGalleryImages] = useState<GalleryImageFromStorage[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState('')

  useEffect(() => {
    async function loadUpcomingEvents() {
      try {
        const events = await getUpcomingEvents()
        // Limit to max 3 events for homepage
        setUpcomingEvents(events.slice(0, 3))
      } catch (err: any) {
        console.error('Failed to load upcoming events:', err)
        setEventsError('Failed to load events')
      } finally {
        setEventsLoading(false)
      }
    }

    async function loadGalleryImages() {
      try {
        const images = await getGalleryImagesFromStorage()
        // Limit to 4 images for homepage preview
        setGalleryImages(images.slice(0, 4))
      } catch (err: any) {
        console.error('Failed to load gallery images:', err)
        setGalleryError('Failed to load gallery')
      } finally {
        setGalleryLoading(false)
      }
    }

    loadUpcomingEvents()
    loadGalleryImages()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0a0a0a'}}>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{backgroundColor: '#0a0a0a'}}>
        {/* Background Video from Cloudinary */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 hero-video"
          onError={(e) => {
            console.error('Video failed to load from Cloudinary:', e);
            e.currentTarget.style.display = 'none';
            // Show fallback background
            const fallback = document.getElementById('video-fallback');
            if (fallback) fallback.classList.remove('hidden');
          }}
          onLoadStart={() => console.log('Video started loading')}
          onCanPlay={() => console.log('Video can play')}
          onLoadedData={() => console.log('Video loaded')}
          onPlay={() => console.log('Video started playing')}
          onPause={() => console.log('Video paused')}
        >
          <source src="https://res.cloudinary.com/dojbcrpp0/video/upload/v1759562630/2022395-hd_1920_1080_30fps_ipdste.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        
        {/* Fallback gradient background when video fails */}
        <div 
          id="video-fallback" 
          className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 hidden"
        ></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Subtle grid pattern for extra visual interest */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #00FFFF 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-primary px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="text-sm tracking-[0.3em] text-secondary font-body mb-4 uppercase">
              The peak of nightlife entertainment
            </div>
            <h1 className="text-6xl md:text-8xl font-display tracking-tight mb-6 text-primary leading-none">
              Redefine
              <br />
              <span className="text-accent">Your Night</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-primary mb-16 max-w-3xl mx-auto leading-relaxed font-body">
            Where sophistication meets energy. An exclusive sanctuary for those who demand 
            the finest in music, cuisine, and atmosphere.
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-secondary animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-accent"></div>
        </div>
      </div>

      {/* Events Preview Section - Light Theme */}
      {/* Events Section */}
      <section className="py-20" style={{backgroundColor: '#0a0a0a'}}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-display text-primary mb-6">Upcoming Events</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Immerse yourself in extraordinary nights featuring world-class DJs, 
              exclusive performances, and unforgettable experiences.
            </p>
          </div>
          
          {eventsLoading ? (
            <div className="text-center text-secondary text-lg">Loading events...</div>
          ) : eventsError ? (
            <div className="text-center text-red-400 text-lg">Error loading events: {eventsError}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="group cursor-pointer">
                  <div className="rounded-lg overflow-hidden transition-all duration-500 hover:scale-105" 
                       style={{
                         backgroundColor: '#111111',
                         border: '1px solid rgba(0, 255, 255, 0.2)'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.6)'
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.borderColor = 'rgba(0, 255, 255, 0.2)'
                       }}>
                    <div className="flex items-center justify-center h-48" style={{backgroundColor: 'rgba(0, 255, 255, 0.1)'}}>
                      <div className="text-6xl" style={{color: '#00FFFF'}}>♪</div>
                    </div>
                    <div className="p-6">
                      <div className="text-sm font-semibold mb-2" style={{color: '#00FFFF'}}>
                        {new Date(event.event_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <h3 className="text-xl font-bold mb-3 transition-colors" style={{color: '#E0E0E0'}}>
                        {event.title}
                      </h3>
                      <p className="mb-4 line-clamp-3" style={{color: '#666666'}}>
                        {event.description}
                      </p>
                      
                      {/* Pricing Tiers */}
                      <div className="mb-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span style={{color: '#E0E0E0'}}>Women:</span>
                          <span style={{color: '#00FFFF'}} className="font-semibold">₹{event.woman_price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span style={{color: '#E0E0E0'}}>Couple:</span>
                          <span style={{color: '#00FFFF'}} className="font-semibold">₹{event.couple_price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span style={{color: '#E0E0E0'}}>Stag:</span>
                          <span style={{color: '#00FFFF'}} className="font-semibold">₹{event.stag_price}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <button className="btn-primary text-sm w-full">
                          GET TICKETS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <button className="btn-secondary">
              VIEW ALL EVENTS
            </button>
          </div>
        </div>
      </section>      {/* Gallery Preview Section */}
      <div className="py-24 border-t" style={{backgroundColor: '#111111', borderColor: 'rgba(0, 255, 255, 0.2)'}}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display text-center text-primary mb-16">
            Glimpses From The Floor
          </h2>
          
          {galleryLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-primary font-body text-lg">Loading gallery...</div>
            </div>
          ) : galleryError ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-secondary font-body text-lg">{galleryError}</div>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-primary font-body text-lg mb-4">Gallery coming soon</div>
              <div className="text-secondary font-body">Stay tuned for amazing photos!</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {galleryImages.map((image, index) => (
                  <Link href="/gallery" key={image.id}>
                    <div className="group relative overflow-hidden rounded-lg cursor-pointer hover:scale-105 transition-all duration-300"
                         style={{
                           aspectRatio: index % 4 === 1 ? '3/4' : index % 4 === 2 ? '4/3' : '1/1'
                         }}>
                      <img 
                        src={image.image_url} 
                        alt={image.caption || 'Gallery image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-accent rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center">
                <Link href="/gallery">
                  <button className="btn-secondary">
                    VIEW FULL GALLERY
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}