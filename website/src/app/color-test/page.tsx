export default function ColorTest() {
  return (
    <div className="min-h-screen bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display text-primary mb-8">Color Palette Test</h1>
        
        {/* Color Swatches */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-primary border border-secondary rounded-lg mb-2 mx-auto"></div>
            <p className="font-body text-primary">Primary BG</p>
            <p className="font-body text-secondary text-sm">#111111</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-accent rounded-lg mb-2 mx-auto"></div>
            <p className="font-body text-primary">Accent</p>
            <p className="font-body text-secondary text-sm">#00FFFF</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-primary border border-secondary rounded-lg mb-2 mx-auto flex items-center justify-center">
              <span className="text-primary font-body">Text</span>
            </div>
            <p className="font-body text-primary">Primary Text</p>
            <p className="font-body text-secondary text-sm">#E0E0E0</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-primary border border-secondary rounded-lg mb-2 mx-auto flex items-center justify-center">
              <span className="text-secondary font-body">Text</span>
            </div>
            <p className="font-body text-primary">Secondary Text</p>
            <p className="font-body text-secondary text-sm">#444444</p>
          </div>
        </div>
        
        {/* Button Examples */}
        <div className="space-y-4 mb-8">
          <button className="btn-primary">PRIMARY BUTTON</button>
          <button className="btn-secondary">SECONDARY BUTTON</button>
        </div>
        
        {/* Text Examples */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display text-primary">This is a Montserrat heading</h2>
          <h3 className="text-xl font-display text-accent">This is an accent heading</h3>
          <p className="font-body text-primary">This is primary body text using Inter font.</p>
          <p className="font-body text-secondary">This is secondary body text using Inter font.</p>
        </div>
      </div>
    </div>
  )
}