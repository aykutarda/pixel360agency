import React from 'react';
import { servicesData } from '../data/mock';

const Services = () => {
  return (
    <section className="bg-dark py-32 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="mb-20">
          <h2 className="font-pixel text-white text-[48px] md:text-[72px] lg:text-[96px] leading-[0.9] tracking-tight">
            WHAT I <span className="text-accent">D</span>O
          </h2>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicesData.services.map((service) => (
            <div 
              key={service.id}
              className="bg-[#2a2a2a] p-8 hover:bg-[#333333] transition-colors duration-300 group"
            >
              <span className="text-gray-500 text-sm font-mono mb-4 block">
                {service.id}
              </span>
              <h3 className="font-pixel text-white text-2xl md:text-3xl mb-6 group-hover:text-accent transition-colors">
                {service.name}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed tracking-[0.1em] font-mono uppercase">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
