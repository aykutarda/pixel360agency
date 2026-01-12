import React from 'react';
import { ArrowRight, Phone, Play, Zap } from 'lucide-react';
import { heroData, siteData, statsData } from '../data/mock';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.querySelector('#services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6 md:px-12 pt-24 pb-12">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left - Text Content */}
          <div className="lg:w-3/5 text-center lg:text-left">
            {/* Badge with connector line */}
            <div className="relative inline-block mb-8">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 glitch-box">
                <Zap className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-accent text-sm font-mono tracking-wider">360° DİJİTAL ÇÖZÜMLER</span>
              </div>
              {/* Connector line */}
              <div className="hidden lg:block absolute left-full top-1/2 w-20 h-px bg-gradient-to-r from-accent to-transparent ml-2"></div>
              <div className="hidden lg:block absolute left-full top-1/2 w-2 h-2 bg-accent rounded-full ml-[88px] -translate-y-1/2 animate-pulse"></div>
            </div>
            
            <h1 className="font-pixel text-white text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-tight mb-6 pixel-text">
              <span className="text-accent glitch" data-text="P">P</span>İXEL360
              <br />
              <span className="text-gray-400">REKLAM AJANSI</span>
            </h1>
            
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-mono mb-8 max-w-xl mx-auto lg:mx-0">
              {heroData.description}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToContact}
                className="group relative flex items-center justify-center gap-3 bg-accent text-dark font-mono font-bold px-8 py-4 hover:bg-white transition-all text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  {heroData.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>
              <button 
                onClick={scrollToServices}
                className="flex items-center justify-center gap-3 border-2 border-accent/50 text-accent font-mono px-8 py-4 hover:bg-accent hover:text-dark transition-all relative overflow-hidden group"
              >
                <Play className="w-5 h-5" />
                {heroData.ctaSecondary}
                <div className="absolute inset-0 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left -z-10"></div>
              </button>
            </div>

            {/* Quick Contact */}
            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start">
              <a 
                href={`tel:${siteData.phone}`}
                className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors group"
              >
                <div className="w-8 h-8 bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span className="font-mono text-sm">{siteData.phone}</span>
              </a>
            </div>
          </div>

          {/* Right - Stats with glowing effect */}
          <div className="lg:w-2/5 w-full">
            <div className="grid grid-cols-2 gap-4">
              {statsData.map((stat, index) => (
                <div 
                  key={index}
                  className="relative group bg-dark-light/80 backdrop-blur-sm border border-dark-lighter p-6 text-center hover:border-accent/50 transition-all duration-300"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10">
                    <div className="font-pixel text-accent text-2xl md:text-3xl mb-2 glitch-text">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-xs font-mono tracking-wider uppercase">
                      {stat.label}
                    </div>
                  </div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/30"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/30"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center py-6 px-6 md:px-12 text-xs tracking-[0.15em] text-gray-500 font-mono border-t border-dark-lighter/50 bg-dark/50 backdrop-blur-sm">
        <span>{siteData.copyright}</span>
        <span className="text-accent">{siteData.slogan}</span>
        <span>{siteData.address}</span>
      </div>
    </section>
  );
};

export default Hero;
