import React from 'react';
import { ArrowRight, Phone, Play } from 'lucide-react';
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
    <section className="min-h-screen bg-dark flex flex-col justify-center relative overflow-hidden px-6 md:px-12 pt-24 pb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left - Text Content */}
          <div className="lg:w-3/5 text-center lg:text-left">
            <div className="inline-block bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
              <span className="text-accent text-sm font-mono tracking-wider">🚀 360° DİJİTAL ÇÖZÜMLER</span>
            </div>
            
            <h1 className="font-pixel text-white text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px] leading-[1.1] tracking-tight mb-6">
              <span className="text-accent">P</span>İXEL360
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
                className="group flex items-center justify-center gap-3 bg-accent text-dark font-mono font-bold px-8 py-4 hover:bg-white transition-colors text-lg"
              >
                {heroData.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={scrollToServices}
                className="flex items-center justify-center gap-3 border-2 border-white text-white font-mono px-8 py-4 hover:bg-white hover:text-dark transition-colors"
              >
                <Play className="w-5 h-5" />
                {heroData.ctaSecondary}
              </button>
            </div>

            {/* Quick Contact */}
            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start">
              <a 
                href={`tel:${siteData.phone}`}
                className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="font-mono text-sm">{siteData.phone}</span>
              </a>
            </div>
          </div>

          {/* Right - Stats */}
          <div className="lg:w-2/5 w-full">
            <div className="grid grid-cols-2 gap-4">
              {statsData.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-dark-light border border-dark-lighter p-6 text-center hover:border-accent/50 transition-colors"
                >
                  <div className="font-pixel text-accent text-2xl md:text-3xl mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-xs font-mono tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center py-6 px-6 md:px-12 text-xs tracking-[0.15em] text-gray-500 font-mono border-t border-dark-lighter">
        <span>{siteData.copyright}</span>
        <span>{siteData.slogan}</span>
        <span>{siteData.address}</span>
      </div>
    </section>
  );
};

export default Hero;
