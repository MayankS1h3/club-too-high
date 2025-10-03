import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300">Page Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a different location.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/"
              className="py-3 px-6 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors text-center"
            >
              Go Home
            </Link>
            
            <Link
              href="/events"
              className="py-3 px-6 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Browse Events
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/gallery"
              className="py-3 px-6 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 text-center"
            >
              View Gallery
            </Link>
            
            <Link
              href="/contact"
              className="py-3 px-6 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Looking for something specific?</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>• Check if the URL is spelled correctly</li>
            <li>• Try using the navigation menu above</li>
            <li>• Search for events or content you're interested in</li>
            <li>• Contact us if you think this is an error</li>
          </ul>
        </div>
      </div>
    </div>
  )
}