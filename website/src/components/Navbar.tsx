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
    <div className="navbar backdrop-blur-md shadow-lg sticky top-0 z-50 h-20 px-8" style={{background: 'rgba(10, 10, 10, 0.9)', borderBottom: '1px solid rgba(0, 255, 255, 0.2)'}}>
      <div className="navbar-start">
        <div className="dropdown">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden text-primary hover:bg-accent/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {isMenuOpen && (
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-2xl backdrop-blur-md border border-accent/20 rounded-box w-52"
              style={{background: 'rgba(10, 10, 10, 0.95)'}}
            >
              <li><Link href="/" className="text-primary hover:text-accent hover:bg-accent/10 font-body font-medium" onClick={() => setIsMenuOpen(false)}>HOME</Link></li>
              <li><Link href="/events" className="text-primary hover:text-accent hover:bg-accent/10 font-body font-medium" onClick={() => setIsMenuOpen(false)}>EVENTS</Link></li>
              <li><Link href="/gallery" className="text-primary hover:text-accent hover:bg-accent/10 font-body font-medium" onClick={() => setIsMenuOpen(false)}>GALLERY</Link></li>
              <li><Link href="/about" className="text-primary hover:text-accent hover:bg-accent/10 font-body font-medium" onClick={() => setIsMenuOpen(false)}>ABOUT US</Link></li>
              <li><Link href="/contact" className="text-primary hover:text-accent hover:bg-accent/10 font-body font-medium" onClick={() => setIsMenuOpen(false)}>CONTACT</Link></li>
            </ul>
          )}
        </div>
        <Link href="/" className="btn btn-ghost text-2xl font-display text-primary hover:text-accent transition-all duration-300">
          CLUB TOO HIGH
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          <li><Link href="/" className="font-body font-medium text-primary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300 px-4 py-2">HOME</Link></li>
          <li><Link href="/events" className="font-body font-medium text-primary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300 px-4 py-2">EVENTS</Link></li>
          <li><Link href="/gallery" className="font-body font-medium text-primary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300 px-4 py-2">GALLERY</Link></li>
          <li><Link href="/about" className="font-body font-medium text-primary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300 px-4 py-2">ABOUT US</Link></li>
          <li><Link href="/contact" className="font-body font-medium text-primary hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300 px-4 py-2">CONTACT</Link></li>
        </ul>
      </div>
      
            <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-accent/10">
              <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-5 h-5 text-base-content"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
                  />
                </svg>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content backdrop-blur-md border border-accent/20 rounded-box w-52" style={{background: 'rgba(10, 10, 10, 0.95)'}}>
              <li><Link href="/profile" className="text-primary hover:text-accent hover:bg-accent/10 font-body">Profile</Link></li>
              <li><Link href="/my-bookings" className="text-primary hover:text-accent hover:bg-accent/10 font-body">My Bookings</Link></li>
              <li><button onClick={handleSignOut} className="text-primary hover:text-accent hover:bg-accent/10 font-body">Logout</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/auth/signin" className="btn-secondary text-sm px-6 py-2">Login</Link>
            <Link href="/auth/signup" className="btn-primary text-sm px-6 py-2">Signup</Link>
          </div>
        )}
      </div>
    </div>
  )
}