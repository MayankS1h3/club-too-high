interface EventPosterPlaceholderProps {
  title?: string
  className?: string
  size?: 'small' | 'medium' | 'large'
}

export default function EventPosterPlaceholder({ 
  title = 'Event Poster', 
  className = '',
  size = 'medium' 
}: EventPosterPlaceholderProps) {
  
  const sizeClasses = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-96 lg:h-full'
  }

  return (
    <div 
      className={`${sizeClasses[size]} w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center border border-gray-700 ${className}`}
    >
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.05) 10px,
            rgba(255,255,255,0.05) 20px
          )`
        }} />
      </div>

      {/* Icon and Text */}
      <div className="relative z-10 text-center px-6">
        <div className="mb-4">
          {/* Music Icon */}
          <svg 
            className="w-20 h-20 mx-auto text-gray-600" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div className="text-gray-500 text-sm font-light tracking-wider">
          NO POSTER AVAILABLE
        </div>
        {title && (
          <div className="text-gray-400 text-xs mt-2 font-light">
            {title}
          </div>
        )}
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute top-0 right-0 border-t-2 border-r-2 border-cyan-400 w-full h-full"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-10">
        <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-cyan-400 w-full h-full"></div>
      </div>
    </div>
  )
}
