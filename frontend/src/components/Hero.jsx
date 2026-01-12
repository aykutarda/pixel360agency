import React from 'react';
import { heroData, siteData } from '../data/mock';

const Hero = () => {
  return (
    <section className="min-h-screen bg-dark flex flex-col justify-between relative overflow-hidden px-8 md:px-16">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-24">
        {/* Hero Image */}
        <div className="relative mb-[-60px] z-10">
          <div className="w-[280px] h-[340px] md:w-[320px] md:h-[400px] relative">
            <div className="absolute inset-0 bg-[#2a2a2a] transform translate-x-4 translate-y-4"></div>
            <img 
              src={heroData.image}
              alt="Mark Davis"
              className="w-full h-full object-cover relative z-10"
            />
          </div>
        </div>
        
        {/* Hero Text */}
        <div className="text-center z-0">
          <h1 className="font-pixel text-white text-[60px] md:text-[120px] lg:text-[160px] leading-[0.85] tracking-tight">
            {heroData.title[0]}
          </h1>
          <h1 className="font-pixel text-white text-[60px] md:text-[120px] lg:text-[160px] leading-[0.85] tracking-tight">
            <span className="text-accent">D</span>{heroData.title[1].slice(1)}
          </h1>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="flex justify-between items-center py-6 text-xs tracking-[0.2em] text-gray-400 font-mono">
        <span>{siteData.copyright}</span>
        <span>{siteData.status}</span>
        <span>{siteData.portfolio}</span>
      </div>
    </section>
  );
};

export default Hero;
