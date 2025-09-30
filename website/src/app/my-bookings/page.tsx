'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getUserBookings } from '@/lib/database'
import type { Booking, Event } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface BookingWithEvent extends Booking {
  events: Event
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingWithEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    async function loadBookings() {
      if (!user) return
      
      try {
        const data = await getUserBookings(user.id)
        setBookings(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [user, authLoading, router])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'cancelled':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your bookings...</div>
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-thin text-white mb-6 tracking-tight">
            MY
            <br />
            <span className="font-black">BOOKINGS</span>
          </h1>
          <p className="text-xl text-gray-400 font-light">
            Your upcoming events and booking history
          </p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">🎫</div>
            <h2 className="text-3xl font-light text-white mb-4">No Bookings Yet</h2>
            <p className="text-gray-400 text-lg mb-8">
              Book your first event and create unforgettable memories!
            </p>
            <button 
              onClick={() => router.push('/events')}
              className="px-8 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors"
            >
              BROWSE EVENTS
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-900 border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-light text-white mb-2">
                            {booking.events.title}
                          </h3>
                          {booking.events.dj_name && (
                            <div className="text-gray-400 mb-2">
                              Featuring {booking.events.dj_name}
                            </div>
                          )}
                        </div>
                        <div className={`text-sm font-medium uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </div>
                      </div>
                      
                      <div className="text-gray-400 space-y-1">
                        <div>{formatDate(booking.events.event_date)}</div>
                        <div>{formatTime(booking.events.event_date)}</div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="lg:text-right">
                      <div className="text-white text-lg font-medium mb-2">
                        {booking.num_of_tickets} ticket{booking.num_of_tickets > 1 ? 's' : ''}
                      </div>
                      <div className="text-white text-xl font-medium mb-2">
                        ₹{booking.total_amount.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm">
                        Booked {new Date(booking.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Event Poster */}
                  {booking.events.poster_image_url && (
                    <div className="mt-6 lg:hidden">
                      <img
                        src={booking.events.poster_image_url}
                        alt={booking.events.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-800 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => router.push(`/events/${booking.events.id}`)}
                      className="px-6 py-2 border border-gray-600 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
                    >
                      VIEW EVENT
                    </button>
                    {booking.status === 'confirmed' && (
                      <button className="px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm font-medium">
                        DOWNLOAD TICKET
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}