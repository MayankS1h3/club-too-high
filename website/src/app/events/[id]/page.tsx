'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getEventById } from '@/lib/database'
import { useAuth } from '@/lib/auth'
import type { DatabaseEvent } from '@/lib/database-types'
import BookingForm from '@/components/BookingForm'
import PaymentErrorBoundary from '@/components/PaymentErrorBoundary'
import { logPaymentError } from '@/lib/error-logging'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<DatabaseEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)

  useEffect(() => {
    async function loadEvent() {
      try {
        const eventId = params.id as string
        const data = await getEventById(eventId)
        setEvent(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadEvent()
    }
  }, [params.id])

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

  const handleBookNow = () => {
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setShowBookingForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading event...</div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">
            {error || 'Event not found'}
          </div>
          <button 
            onClick={() => router.push('/events')}
            className="px-6 py-2 border border-gray-600 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/events')}
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center"
        >
          ← Back to Events
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Event Image */}
          <div className="relative">
            {event.poster_image_url ? (
              <img
                src={event.poster_image_url}
                alt={event.title}
                className="w-full h-96 lg:h-full object-cover"
              />
            ) : (
              <div className="w-full h-96 lg:h-full bg-gray-800 flex items-center justify-center">
                <div className="text-6xl">🎵</div>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-8">
            {/* Date & Time */}
            <div className="text-gray-400">
              <div className="text-sm font-light tracking-wide mb-2">EVENT DATE</div>
              <div className="text-xl text-white">{formatDate(event.event_date)}</div>
              <div className="text-lg text-gray-300">{formatTime(event.event_date)}</div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-thin text-white mb-4 tracking-tight">
                {event.title}
              </h1>
              {event.dj_name && (
                <div className="text-xl text-gray-300 font-light">
                  Featuring <span className="text-white">{event.dj_name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <div className="text-sm font-light tracking-wide mb-4 text-gray-400">ABOUT THIS EVENT</div>
                <p className="text-gray-300 leading-relaxed font-light text-lg">
                  {event.description}
                </p>
              </div>
            )}

            {/* Pricing */}
            <div className="border-t border-gray-800 pt-8">
              <div className="text-sm font-light tracking-wide mb-4 text-gray-400">TICKET PRICING</div>
              
              {/* Pricing Tiers */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300 font-light">Women Entry</span>
                  <span className="text-xl font-light text-white">₹{event.woman_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                  <span className="text-gray-300 font-light">Couple Entry</span>
                  <span className="text-xl font-light text-white">₹{event.couple_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300 font-light">Stag Entry</span>
                  <span className="text-xl font-light text-white">₹{event.stag_price.toLocaleString()}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                className="w-full py-4 bg-white text-black font-medium tracking-wide hover:bg-gray-100 transition-colors text-lg"
              >
                {user ? 'BOOK NOW' : 'SIGN IN TO BOOK'}
              </button>

              <div className="text-sm text-gray-400 mt-4 text-center font-light">
                Secure booking • Instant confirmation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && event && user && user.email && (
        <PaymentErrorBoundary onPaymentError={(error) => logPaymentError(error, { eventId: event.id, userId: user.id })}>
          <BookingForm
            event={event}
            user={user as { id: string; email: string }}
            onClose={() => setShowBookingForm(false)}
            onSuccess={() => {
              setShowBookingForm(false)
              // Could redirect to booking confirmation or show success message
            }}
          />
        </PaymentErrorBoundary>
      )}
    </div>
  )
}