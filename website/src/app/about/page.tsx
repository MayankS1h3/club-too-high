export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">About Club Too High</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg mx-auto">
          <p className="text-xl text-center mb-8">
            Club Too High is Jaipur&apos;s premier nightlife destination, where music, energy, and unforgettable experiences collide.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Our Story</h2>
                <p>
                  Located in the heart of Jaipur, Club Too High has been setting the standard for nightlife entertainment. 
                  We bring together the best DJs, premium drinks, and an atmosphere that keeps the energy high all night long.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Our Mission</h2>
                <p>
                  To create unforgettable experiences through cutting-edge music, exceptional service, and a vibrant 
                  atmosphere that brings people together to celebrate life.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Visit Us</h3>
            <p className="text-lg">
              Experience the ultimate nightlife at Club Too High - where every night is a celebration!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}