'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'

export default function Dashboard() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
      return
    }

    // Show welcome message if user just signed up
    if (searchParams.get('welcome') === 'true') {
      setShowWelcome(true)
      // Remove the welcome parameter from URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [user, loading, router, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Welcome Message */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span>🎉</span>
            <span>Welcome to Club Too High! Your account has been confirmed.</span>
            <button 
              onClick={() => setShowWelcome(false)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-white text-xl font-bold">
                Club Too High
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Welcome, {user.user_metadata?.full_name || user.email}
              </span>
              <button
                onClick={() => {
                  // You can implement logout here
                  router.push('/auth/signin')
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-400 mb-8">
              Your Club Too High account is active and ready to go!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Dashboard Cards */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">Upcoming Events</h3>
                <p className="text-gray-400">Browse and book tickets for upcoming club events</p>
                <Link 
                  href="/"
                  className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  View Events
                </Link>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">My Bookings</h3>
                <p className="text-gray-400">View your ticket purchases and booking history</p>
                <button className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  View Bookings
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">Profile Settings</h3>
                <p className="text-gray-400">Update your account information and preferences</p>
                <button className="inline-block mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}