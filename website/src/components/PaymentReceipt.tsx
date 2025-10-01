'use client'

import { useState } from 'react'
import type { BookingWithEvent } from '@/lib/database-types'

interface PaymentReceiptProps {
  booking: BookingWithEvent
  onClose: () => void
}

export default function PaymentReceipt({ booking, onClose }: PaymentReceiptProps) {
  const [printing, setPrinting] = useState(false)

  // Guard clause for missing event data
  if (!booking.events) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-sm w-full rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium mb-4">Receipt Unavailable</h3>
          <p className="text-gray-600 mb-4">Event details are not available for this booking.</p>
          <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white rounded">
            Close
          </button>
        </div>
      </div>
    )
  }

  const handlePrint = () => {
    setPrinting(true)
    window.print()
    setTimeout(() => setPrinting(false), 1000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Confirmed</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">Pending</span>
      case 'failed':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">Failed</span>
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-sm">Cancelled</span>
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-sm">{status}</span>
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-lg text-black">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Payment Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4" id="receipt-content">
          {/* Club Logo/Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              CLUB TOO HIGH
            </h1>
            <p className="text-sm text-gray-600">Jaipur's Premier Nightlife Destination</p>
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Receipt ID:</span>
              <span className="font-mono text-sm">{booking.receipt_id || booking.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Event:</span>
              <span className="font-medium">{booking.events.title}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Event Date:</span>
              <span>{formatDate(booking.events.event_date)}</span>
            </div>
            
            {booking.events.dj_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">DJ:</span>
                <span>{booking.events.dj_name}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tickets:</span>
              <span>{booking.num_of_tickets}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Price per ticket:</span>
              <span>₹{(booking.total_amount / booking.num_of_tickets).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between border-t pt-3 font-bold">
              <span>Total Amount:</span>
              <span>₹{booking.total_amount.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              {getStatusBadge(booking.status)}
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Date:</span>
              <span>{formatDate(booking.created_at)}</span>
            </div>
            
            {booking.payment_status === 'paid' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Confirmed:</span>
                <span>{formatDate(booking.updated_at)}</span>
              </div>
            )}
            
            {booking.razorpay_payment_id && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono text-xs">{booking.razorpay_payment_id}</span>
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
            <p>• Tickets are non-transferable and non-refundable</p>
            <p>• Valid government ID required for entry</p>
            <p>• Age restriction: 21+ only</p>
            <p>• Management reserves the right to admission</p>
          </div>

          {/* QR Code Placeholder */}
          {booking.status === 'paid' && (
            <div className="text-center border-t pt-4">
              <div className="w-20 h-20 bg-gray-200 mx-auto mb-2 flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
              <p className="text-xs text-gray-500">Show this at the venue</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t flex gap-3">
          <button
            onClick={handlePrint}
            disabled={printing}
            className="flex-1 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {printing ? 'Printing...' : 'Print Receipt'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}