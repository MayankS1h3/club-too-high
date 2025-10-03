'use client'

import { useState, useEffect } from 'react'
import { getUpcomingEvents } from '@/lib/database'
import type { Event } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState('')

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

    loadUpcomingEvents()
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
    <div className="min-h-screen" style={{background: '#0a0a0a'}}>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background: '#0a0a0a'}}>
        {/* Background with dark overlay for video placeholder */}
        <div className="absolute inset-0" style={{background: '#0a0a0a'}}>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Subtle grid pattern for visual interest */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #00FFFF 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
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
          
          <p className="text-lg md:text-xl text-primary mb-12 max-w-3xl mx-auto leading-relaxed font-body">
            Where sophistication meets energy. An exclusive sanctuary for those who demand 
            the finest in music, cuisine, and atmosphere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="btn-primary">
              VIEW UPCOMING EVENTS
            </button>
            <button className="btn-secondary">
              BOOK A TABLE
            </button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-secondary animate-bounce">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-accent"></div>
        </div>
      </div>

      {/* Events Preview Section */}
      <div className="py-24" style={{background: '#0a0a0a'}}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display text-center text-primary mb-16">
            This Week's Lineup
          </h2>
          
          {eventsLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-primary font-body text-lg">Loading upcoming events...</div>
            </div>
          ) : eventsError ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-secondary font-body text-lg">{eventsError}</div>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-primary font-body text-lg mb-4">No upcoming events scheduled</div>
              <div className="text-secondary font-body">Stay tuned for exciting announcements!</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-12">
              {upcomingEvents.map((event, index) => (
                <div key={event.id} className="group border border-secondary rounded-lg overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:-translate-y-2" style={{background: '#0a0a0a'}}>
                  <div className="aspect-[4/3] bg-secondary relative overflow-hidden">
                    {event.poster_image_url ? (
                      <img 
                        src={event.poster_image_url} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-secondary font-display text-lg">
                          {event.title.toUpperCase()}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-display text-primary mb-2">{event.title}</h3>
                    <p className="text-primary font-body mb-1">
                      {formatDate(event.event_date)} • {formatTime(event.event_date)}
                    </p>
                    {event.dj_name && (
                      <p className="text-secondary font-body italic mb-4">{event.dj_name}</p>
                    )}
                    <div className="flex justify-end">
                      <Link href={`/events/${event.id}`}>
                        <button className="btn-primary text-sm px-6 py-2">
                          BOOK NOW
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {upcomingEvents.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/events">
                <button className="btn-secondary">
                  VIEW ALL EVENTS
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Preview Section */}
      <div className="py-24 border-t border-secondary" style={{background: '#0a0a0a'}}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-display text-center text-primary mb-16">
            Glimpses From The Floor
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {/* Gallery Image 1 */}
            <div className="group relative aspect-square bg-secondary rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-secondary font-body text-sm">
                GALLERY IMAGE
              </div>
            </div>
            
            {/* Gallery Image 2 */}
            <div className="group relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-secondary font-body text-sm">
                GALLERY IMAGE
              </div>
            </div>
            
            {/* Gallery Image 3 */}
            <div className="group relative aspect-[4/3] bg-secondary rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-secondary font-body text-sm">
                GALLERY IMAGE
              </div>
            </div>
            
            {/* Gallery Image 4 */}
            <div className="group relative aspect-square bg-secondary rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-secondary font-body text-sm">
                GALLERY IMAGE
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button className="btn-secondary">
              VIEW FULL GALLERY
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 border-t border-secondary" style={{background: '#0a0a0a'}}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-6xl font-display text-primary mb-8 tracking-tight">
            Experience
            <br />
            <span className="text-accent">the extraordinary</span>
          </h2>
          <p className="text-xl text-primary mb-12 font-body">
            Join Jaipur's most exclusive nightlife destination.
          </p>
          <div className="space-y-4">
            <button className="btn-primary">
              MAKE RESERVATION
            </button>
            <div className="text-sm text-secondary font-body">
              Call +91 XXXX XXXXXX or book online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}