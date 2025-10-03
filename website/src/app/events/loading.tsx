export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="h-12 bg-gray-800 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-800 rounded-lg max-w-md mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-800"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                <div className="h-10 bg-gray-800 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}