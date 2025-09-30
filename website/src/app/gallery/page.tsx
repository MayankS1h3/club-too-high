'use client'

import { useState, useEffect } from 'react'
import { getGalleryImagesFromStorage } from '@/lib/gallery-storage'

interface GalleryImageFromStorage {
  id: string
  image_url: string
  caption: string
  created_at: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImageFromStorage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState<GalleryImageFromStorage | null>(null)

  useEffect(() => {
    async function loadImages() {
      try {
        const data = await getGalleryImagesFromStorage()
        setImages(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery images')
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading gallery...</div>
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
            PHOTO
            <br />
            <span className="font-black">GALLERY</span>
          </h1>
          <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
            Relive the energy, the moments, and the unforgettable nights at Club Too High.
          </p>
        </div>

        {/* Gallery Grid */}
        {images.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-8">📸</div>
            <h2 className="text-3xl font-light text-white mb-4">Gallery Coming Soon</h2>
            <p className="text-gray-400 text-lg">
              We're preparing an amazing collection of photos from our events.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden bg-gray-900 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 text-white">
                    {image.caption && (
                      <p className="text-sm font-light mb-1">{image.caption}</p>
                    )}
                    <p className="text-xs text-gray-300">{formatDate(image.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
              
              <img
                src={selectedImage.image_url}
                alt={selectedImage.caption || 'Gallery image'}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {selectedImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-4">
                  <p className="text-lg font-light">{selectedImage.caption}</p>
                  <p className="text-sm text-gray-300">{formatDate(selectedImage.created_at)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-20 py-16 border-t border-gray-800">
          <h2 className="text-3xl font-light text-white mb-4">Join the Experience</h2>
          <p className="text-gray-400 mb-8 font-light">
            Be part of our next unforgettable night and create memories that last forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-black font-medium hover:bg-gray-100 transition-colors">
              VIEW EVENTS
            </button>
            <button className="px-8 py-3 border border-gray-600 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 font-medium">
              BOOK TABLE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}