export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="hero min-h-screen bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="hero-content text-center text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Club Too High</h1>
            <p className="py-6">
              Experience the ultimate nightlife destination in Jaipur. 
              Book your tickets now for upcoming events!
            </p>
            <button className="btn btn-primary btn-lg">
              View Events
            </button>
          </div>
        </div>
      </div>
      
      {/* Test DaisyUI Components */}
      <div className="p-8 space-y-4">
        <h2 className="text-2xl font-bold">DaisyUI Test Components</h2>
        
        <div className="flex gap-4">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
        </div>
        
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Sample Event</h2>
            <p>This is a test event card using DaisyUI components.</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
