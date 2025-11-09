'use client';

export default function WorldMap() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <svg
        viewBox="0 0 1200 600"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Animated dots representing cities */}
        <defs>
          <radialGradient id="cityGlow">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Major cities as glowing dots */}
        <circle cx="200" cy="150" r="4" fill="url(#cityGlow)" className="animate-pulse" />
        <circle cx="350" cy="180" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '0.5s'}} />
        <circle cx="500" cy="200" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '1s'}} />
        <circle cx="650" cy="220" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '1.5s'}} />
        <circle cx="800" cy="180" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '2s'}} />
        <circle cx="950" cy="250" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '2.5s'}} />
        
        {/* Connection lines */}
        <line x1="200" y1="150" x2="350" y2="180" stroke="#60a5fa" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" className="animate-pulse" />
        <line x1="350" y1="180" x2="500" y2="200" stroke="#60a5fa" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" className="animate-pulse" />
        <line x1="500" y1="200" x2="650" y2="220" stroke="#60a5fa" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" className="animate-pulse" />
        <line x1="650" y1="220" x2="800" y2="180" stroke="#60a5fa" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" className="animate-pulse" />
        <line x1="800" y1="180" x2="950" y2="250" stroke="#60a5fa" strokeWidth="1" opacity="0.3" strokeDasharray="5,5" className="animate-pulse" />
        
        {/* More cities in different regions */}
        <circle cx="300" cy="350" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '0.3s'}} />
        <circle cx="550" cy="380" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '0.8s'}} />
        <circle cx="750" cy="320" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '1.3s'}} />
        <circle cx="900" cy="400" r="4" fill="url(#cityGlow)" className="animate-pulse" style={{animationDelay: '1.8s'}} />
        
        {/* Grid pattern for world map feel */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.5" opacity="0.1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

