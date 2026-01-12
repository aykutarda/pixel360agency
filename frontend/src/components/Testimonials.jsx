import React from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonialsData } from '../data/mock';

const Testimonials = () => {
  return (
    <section className="relative py-24 px-6 md:px-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4 pixel-text">
            <span className="text-accent glitch" data-text="M">M</span>ÜŞTERİ YORUMLARI
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base">
            Müşterilerimizin bizim hakkımızda söyledikleri
          </p>
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-accent"></div>
            <div className="w-2 h-2 bg-accent rotate-45 animate-pulse"></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-accent"></div>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="group relative bg-dark-light/50 backdrop-blur-sm p-8 border border-dark-lighter hover:border-accent/50 transition-all duration-500 hover-glow"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/30 group-hover:border-accent transition-colors"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/30 group-hover:border-accent transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors"></div>
              
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-accent flex items-center justify-center">
                <Quote className="w-4 h-4 text-dark" />
              </div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 fill-accent text-accent" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              
              <p className="text-gray-300 font-mono text-sm leading-relaxed mb-6 group-hover:text-white transition-colors">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 object-cover border-2 border-dark-lighter group-hover:border-accent transition-colors"
                  />
                  {/* Glow effect on avatar */}
                  <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div>
                  <h4 className="text-white font-mono text-sm font-bold group-hover:text-accent transition-colors">
                    {testimonial.name}
                  </h4>
                  <span className="text-gray-500 font-mono text-xs">
                    {testimonial.company}
                  </span>
                </div>
              </div>
              
              {/* Scanlines effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(230,255,0,0.1) 2px, rgba(230,255,0,0.1) 4px)'
              }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
