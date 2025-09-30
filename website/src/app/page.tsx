export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-gray-900 opacity-80"></div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="text-sm tracking-[0.3em] text-gray-400 font-light mb-4 uppercase">
              Jaipur's Premier Nightlife Destination
            </div>
            <h1 className="text-6xl md:text-9xl font-thin tracking-tighter mb-6 text-white leading-none">
              CLUB
              <br />
              <span className="font-black tracking-wider">TOO HIGH</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Where sophistication meets energy. An exclusive sanctuary for those who demand 
            the finest in music, cuisine, and atmosphere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative px-12 py-4 bg-white text-black font-medium tracking-wide hover:bg-gray-100 transition-all duration-300">
              <span className="relative z-10">RESERVE TABLE</span>
              <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button className="px-12 py-4 border border-gray-600 text-white hover:border-white hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-wide">
              VIEW EVENTS
            </button>
          </div>
        </div>
        
        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 animate-pulse">
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-gray-500"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-16">
            {/* Feature 1 */}
            <div className="group text-center">
              <div className="w-16 h-16 mx-auto mb-8 border border-gray-700 flex items-center justify-center group-hover:border-white transition-colors duration-500">
                <div className="text-2xl text-gray-400 group-hover:text-white transition-colors duration-500">♪</div>
              </div>
              <h3 className="text-xl font-light text-white mb-4 tracking-wide">AUDIO EXCELLENCE</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Precision-engineered sound systems delivering crystal-clear acoustics 
                that move both body and soul.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group text-center">
              <div className="w-16 h-16 mx-auto mb-8 border border-gray-700 flex items-center justify-center group-hover:border-white transition-colors duration-500">
                <div className="text-2xl text-gray-400 group-hover:text-white transition-colors duration-500">◊</div>
              </div>
              <h3 className="text-xl font-light text-white mb-4 tracking-wide">CURATED EXPERIENCE</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Meticulously crafted cocktails and premium spirits in an atmosphere 
                of understated luxury.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group text-center">
              <div className="w-16 h-16 mx-auto mb-8 border border-gray-700 flex items-center justify-center group-hover:border-white transition-colors duration-500">
                <div className="text-2xl text-gray-400 group-hover:text-white transition-colors duration-500">⋆</div>
              </div>
              <h3 className="text-xl font-light text-white mb-4 tracking-wide">EXCLUSIVE ACCESS</h3>
              <p className="text-gray-400 leading-relaxed font-light">
                Private tables, personalized service, and access to Jaipur's 
                most discerning nightlife community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-6xl font-thin text-white mb-8 tracking-tight">
            Experience
            <br />
            <span className="font-light text-gray-300">the extraordinary</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 font-light">
            Join Jaipur's most exclusive nightlife destination.
          </p>
          <div className="space-y-4">
            <button className="w-full sm:w-auto px-16 py-5 bg-white text-black font-medium tracking-widest hover:bg-gray-100 transition-all duration-300 text-sm">
              MAKE RESERVATION
            </button>
            <div className="text-sm text-gray-500 font-light">
              Call +91 XXXX XXXXXX or book online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}