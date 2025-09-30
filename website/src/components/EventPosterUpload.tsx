'use client'

import { useState } from 'react'
import { uploadEventPoster } from '@/lib/storage'

interface EventPosterUploadProps {
  onUploadComplete: (url: string) => void
  currentUrl?: string
}

export default function EventPosterUpload({ onUploadComplete, currentUrl }: EventPosterUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const url = await uploadEventPoster(file)
      onUploadComplete(url)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Event Poster
        </label>
        
        {/* Current Image Preview */}
        {currentUrl && (
          <div className="mb-4">
            <img 
              src={currentUrl} 
              alt="Current poster" 
              className="w-32 h-48 object-cover rounded-lg border border-gray-600"
            />
            <p className="text-xs text-gray-400 mt-1">Current poster</p>
          </div>
        )}

        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50"
        />
        
        {/* Upload Status */}
        {uploading && (
          <div className="mt-2 text-sm text-blue-400">
            Uploading image...
          </div>
        )}
        
        {error && (
          <div className="mt-2 text-sm text-red-400">
            {error}
          </div>
        )}

        <p className="mt-2 text-xs text-gray-400">
          Upload a high-quality poster image (JPEG, PNG, WebP). Max size: 5MB.
        </p>
      </div>
    </div>
  )
}