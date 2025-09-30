'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useState } from 'react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <div className="navbar bg-black/90 backdrop-blur-md border-b border-purple-500/20 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden text-white hover:bg-purple-500/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {isMenuOpen && (
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl bg-black/95 backdrop-blur-md border border-purple-500/30 rounded-box w-52"
            >
              <li><Link href="/" className="text-white hover:text-purple-400 hover:bg-purple-500/20" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link href="/events" className="text-white hover:text-purple-400 hover:bg-purple-500/20" onClick={() => setIsMenuOpen(false)}>Events</Link></li>
              <li><Link href="/gallery" className="text-white hover:text-purple-400 hover:bg-purple-500/20" onClick={() => setIsMenuOpen(false)}>Gallery</Link></li>
              <li><Link href="/about" className="text-white hover:text-purple-400 hover:bg-purple-500/20" onClick={() => setIsMenuOpen(false)}>About</Link></li>
              <li><Link href="/contact" className="text-white hover:text-purple-400 hover:bg-purple-500/20" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            </ul>
          )}
        </div>
        <Link href="/" className="btn btn-ghost text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all duration-300">
          CLUB TOO HIGH
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          <li><Link href="/" className="font-medium text-white hover:text-purple-400 hover:bg-purple-500/20 rounded-lg transition-all duration-300">Home</Link></li>
          <li><Link href="/events" className="font-medium text-white hover:text-purple-400 hover:bg-purple-500/20 rounded-lg transition-all duration-300">Events</Link></li>
          <li><Link href="/gallery" className="font-medium text-white hover:text-purple-400 hover:bg-purple-500/20 rounded-lg transition-all duration-300">Gallery</Link></li>
          <li><Link href="/about" className="font-medium text-white hover:text-purple-400 hover:bg-purple-500/20 rounded-lg transition-all duration-300">About</Link></li>
          <li><Link href="/contact" className="font-medium text-white hover:text-purple-400 hover:bg-purple-500/20 rounded-lg transition-all duration-300">Contact</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-purple-500/20">
              <div className="w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-black/95 backdrop-blur-md border border-purple-500/30 rounded-box w-52">
              <li><Link href="/profile" className="text-white hover:text-purple-400 hover:bg-purple-500/20">Profile</Link></li>
              <li><Link href="/my-bookings" className="text-white hover:text-purple-400 hover:bg-purple-500/20">My Bookings</Link></li>
              <li><button onClick={handleSignOut} className="text-white hover:text-purple-400 hover:bg-purple-500/20">Sign Out</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/auth/signin" className="btn btn-ghost text-white hover:text-purple-400 hover:bg-purple-500/20 border border-transparent hover:border-purple-500/30">Sign In</Link>
            <Link href="/auth/signup" className="btn bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white hover:from-purple-700 hover:to-pink-700 shadow-lg transform hover:scale-105 transition-all duration-300">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  )
}