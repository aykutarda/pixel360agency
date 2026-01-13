import React from 'react';
import { Star, Quote, TrendingUp } from 'lucide-react';
import { testimonialsData } from '../data/mock';

const Testimonials = () => {
  return (
    <section className="relative py-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-accent text-sm font-mono tracking-wider">SOSYAL KANIT</span>
          </div>
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">M</span>ARKALARIN GÖRÜŞÜ
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base">
            {testimonialsData.subtitle}
          </p>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="group relative bg-dark-light/50 backdrop-blur-sm border border-dark-lighter p-8 hover:border-accent/50 transition-all duration-500"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/30 group-hover:border-accent transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors"></div>
              
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6 w-8 h-8 bg-accent flex items-center justify-center">
                <Quote className="w-4 h-4 text-dark" />
              </div>
              
              {/* Metric Badge */}
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-accent font-mono text-sm font-bold">
                  {testimonial.metric}
                </span>
              </div>
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
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
                </div>
                <div>
                  <h4 className="text-white font-mono text-sm font-bold group-hover:text-accent transition-colors">
                    {testimonial.name}
                  </h4>
                  <span className="text-gray-500 font-mono text-xs">
                    {testimonial.role}, {testimonial.company}
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
