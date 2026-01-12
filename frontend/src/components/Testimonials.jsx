import React from 'react';
import { Star } from 'lucide-react';
import { testimonialsData } from '../data/mock';

const Testimonials = () => {
  return (
    <section className="bg-dark-light py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">M</span>ÜŞTERİ YORUMLARI
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base">
            Müşterilerimizin bizim hakkımızda söyledikleri
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-dark p-8 border border-dark-lighter hover:border-accent/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-gray-300 font-mono text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 object-cover"
                />
                <div>
                  <h4 className="text-white font-mono text-sm font-bold">
                    {testimonial.name}
                  </h4>
                  <span className="text-gray-500 font-mono text-xs">
                    {testimonial.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
