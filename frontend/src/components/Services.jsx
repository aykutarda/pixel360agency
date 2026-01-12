import React from 'react';
import { ArrowUpRight, Megaphone, PenTool, BarChart3, Globe, Video, FileText } from 'lucide-react';
import { servicesData } from '../data/mock';

const iconMap = {
  '01': Megaphone,
  '02': BarChart3,
  '03': PenTool,
  '04': Globe,
  '05': Video,
  '06': FileText
};

const Services = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="relative py-24 px-6 md:px-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4 pixel-text">
            <span className="text-accent glitch" data-text="H">H</span>İZMETLERİMİZ
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            {servicesData.subtitle}
          </p>
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-accent"></div>
            <div className="w-2 h-2 bg-accent rotate-45"></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-accent"></div>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.services.map((service) => {
            const IconComponent = iconMap[service.id] || Megaphone;
            return (
              <div 
                key={service.id}
                className="group relative bg-dark-light/50 backdrop-blur-sm border border-dark-lighter p-8 hover:border-accent/50 transition-all duration-500 cursor-pointer hover-glow"
                onClick={scrollToContact}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/30 group-hover:border-accent transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors"></div>
                
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-accent" />
                  </div>
                  <span className="text-gray-600 text-sm font-mono font-bold">{service.id}</span>
                </div>
                
                <h3 className="font-pixel text-white text-base md:text-lg mb-4 group-hover:text-accent transition-colors">
                  {service.shortName}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed font-mono mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-mono bg-dark/50 text-gray-400 px-3 py-1 border border-dark-lighter group-hover:border-accent/30 transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-accent text-sm font-mono group-hover:gap-4 transition-all">
                  <span>Detaylı Bilgi Al</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button 
            onClick={scrollToContact}
            className="relative group bg-accent text-dark font-mono font-bold px-10 py-4 hover:bg-white transition-all text-lg overflow-hidden"
          >
            <span className="relative z-10">TÜM HİZMETLER İÇİN TEKLİF AL</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
