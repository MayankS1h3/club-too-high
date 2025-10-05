'use client'

import { useState, useEffect } from 'react'
import { getUpcomingEvents } from '@/lib/database'
import type { DatabaseEvent } from '@/lib/database-types'
import Link from 'next/link'
import EventPosterPlaceholder from '@/components/EventPosterPlaceholder'

export default function EventsPage() {
  const [events, setEvents] = useState<DatabaseEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getUpcomingEvents()
        setEvents(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-thin text-white mb-6 tracking-tight">
            UPCOMING
            <br />
            <span className="font-black">EVENTS</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Experience the finest electronic music, world-class DJs, and unforgettable nights at Club Too High.
          </p>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">🎵</div>
            <h2 className="text-3xl font-light text-white mb-4">No Upcoming Events</h2>
            <p className="text-gray-400 text-lg">
              Stay tuned for our next epic night. Follow us on social media for announcements.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-gray-900 border border-gray-800 hover:border-gray-600 transition-all duration-300 overflow-hidden"
              >
                {/* Event Image */}
                <div className="relative h-64 overflow-hidden">
                  {event.poster_image_url ? (
                    <>
                      <img
                        src={event.poster_image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </>
                  ) : (
                    <EventPosterPlaceholder title={event.title} size="medium" />
                  )}
                </div>

                {/* Event Content */}
                <div className="p-6">
                  {/* Date & Time */}
                  <div className="text-gray-400 text-sm font-light mb-4 tracking-wide">
                    <div>{formatDate(event.event_date)}</div>
                    <div>{formatTime(event.event_date)}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-light text-white mb-3 group-hover:text-gray-300 transition-colors">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 font-light leading-relaxed mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Pricing Tiers */}
                  <div className="mb-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Women:</span>
                      <span className="text-white font-medium">₹{event.woman_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Couple:</span>
                      <span className="text-white font-medium">₹{event.couple_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Stag:</span>
                      <span className="text-white font-medium">₹{event.stag_price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div className="flex justify-center">
                    <Link href={`/events/${event.id}`} className="w-full">
                      <button className="w-full px-6 py-3 border border-gray-600 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium tracking-wide">
                        BOOK NOW
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-20 py-16 border-t border-gray-800">
          <h2 className="text-3xl font-light text-white mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-8 font-light">
            Don't miss out on our exclusive events and special announcements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors">
              FOLLOW US
            </button>
            <button className="px-8 py-3 border border-gray-600 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 font-medium">
              NEWSLETTER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}