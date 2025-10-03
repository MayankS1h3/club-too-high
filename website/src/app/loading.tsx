export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto">
          <div className="w-full h-full border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Loading...</h2>
          <p className="text-gray-400">Please wait while we prepare your experience</p>
        </div>
      </div>
    </div>
  )
}