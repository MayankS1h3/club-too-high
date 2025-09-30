export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Get In Touch</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📍</div>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p>Club Too High, Jaipur, Rajasthan</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📞</div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p>+91 XXXXX XXXXX</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✉️</div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>info@clubtoohigh.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🕒</div>
                  <div>
                    <p className="font-semibold">Hours</p>
                    <p>Wed - Sun: 9:00 PM - 3:00 AM</p>
                    <p>Mon - Tue: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Send Message</h2>
              
              <form className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input type="text" className="input input-bordered" required />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input type="email" className="input input-bordered" required />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Message</span>
                  </label>
                  <textarea className="textarea textarea-bordered h-24" required></textarea>
                </div>
                
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}