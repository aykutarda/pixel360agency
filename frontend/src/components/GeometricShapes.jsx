import React from 'react';

const WireframeCube = ({ className = '' }) => {
  return (
    <div className={`wireframe-cube ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Back face */}
        <polygon 
          points="60,60 140,60 140,140 60,140" 
          fill="none" 
          stroke="rgba(230, 255, 0, 0.3)" 
          strokeWidth="1"
          className="animate-pulse"
        />
        {/* Front face */}
        <polygon 
          points="40,80 120,80 120,160 40,160" 
          fill="none" 
          stroke="rgba(230, 255, 0, 0.6)" 
          strokeWidth="1.5"
        />
        {/* Connecting lines */}
        <line x1="40" y1="80" x2="60" y2="60" stroke="rgba(230, 255, 0, 0.4)" strokeWidth="1" />
        <line x1="120" y1="80" x2="140" y2="60" stroke="rgba(230, 255, 0, 0.4)" strokeWidth="1" />
        <line x1="120" y1="160" x2="140" y2="140" stroke="rgba(230, 255, 0, 0.4)" strokeWidth="1" />
        <line x1="40" y1="160" x2="60" y2="140" stroke="rgba(230, 255, 0, 0.4)" strokeWidth="1" />
      </svg>
    </div>
  );
};

const ImpossibleTriangle = ({ className = '' }) => {
  return (
    <div className={`impossible-triangle ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {/* Outer triangle */}
        <polygon 
          points="100,20 180,160 20,160" 
          fill="none" 
          stroke="url(#purpleGradient)" 
          strokeWidth="3"
        />
        {/* Inner elements for impossible effect */}
        <polygon 
          points="100,50 150,140 50,140" 
          fill="none" 
          stroke="url(#purpleGradient)" 
          strokeWidth="2"
          opacity="0.7"
        />
        {/* Connector lines for 3D effect */}
        <line x1="100" y1="20" x2="100" y2="50" stroke="#9333ea" strokeWidth="2" />
        <line x1="180" y1="160" x2="150" y2="140" stroke="#7c3aed" strokeWidth="2" />
        <line x1="20" y1="160" x2="50" y2="140" stroke="#6366f1" strokeWidth="2" />
      </svg>
    </div>
  );
};

const DiamondShape = ({ className = '' }) => {
  return (
    <div className={`diamond-shape ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon 
          points="50,10 90,50 50,90 10,50" 
          fill="none" 
          stroke="rgba(230, 255, 0, 0.5)" 
          strokeWidth="1.5"
        />
        <polygon 
          points="50,25 75,50 50,75 25,50" 
          fill="none" 
          stroke="rgba(230, 255, 0, 0.3)" 
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

const GeometricShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large wireframe cube - top right */}
      <div className="absolute top-20 right-10 w-32 h-32 md:w-48 md:h-48 animate-float opacity-60">
        <WireframeCube />
      </div>
      
      {/* Impossible triangle - center right */}
      <div className="absolute top-1/3 right-20 w-40 h-40 md:w-56 md:h-56 animate-float-slow opacity-70">
        <ImpossibleTriangle />
      </div>
      
      {/* Small diamonds scattered */}
      <div className="absolute top-40 left-20 w-12 h-12 animate-spin-slow opacity-50">
        <DiamondShape />
      </div>
      <div className="absolute bottom-40 right-40 w-16 h-16 animate-float opacity-40">
        <DiamondShape />
      </div>
      <div className="absolute top-2/3 left-10 w-10 h-10 animate-pulse opacity-30">
        <DiamondShape />
      </div>
      
      {/* Small cubes */}
      <div className="absolute bottom-20 left-1/4 w-20 h-20 animate-float-slow opacity-40">
        <WireframeCube />
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(230, 255, 0, 0)" />
            <stop offset="50%" stopColor="rgba(230, 255, 0, 0.5)" />
            <stop offset="100%" stopColor="rgba(230, 255, 0, 0)" />
          </linearGradient>
        </defs>
        {/* Animated connection line */}
        <line 
          x1="10%" y1="30%" x2="40%" y2="50%" 
          stroke="url(#lineGradient)" 
          strokeWidth="1" 
          strokeDasharray="5,5"
          className="animate-dash"
        />
        <line 
          x1="60%" y1="20%" x2="90%" y2="40%" 
          stroke="url(#lineGradient)" 
          strokeWidth="1" 
          strokeDasharray="5,5"
          className="animate-dash-reverse"
        />
      </svg>
    </div>
  );
};

export default GeometricShapes;
