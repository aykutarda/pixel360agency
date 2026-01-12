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
    <section id="services" className="bg-dark py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">H</span>İZMETLERİMİZ
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            {servicesData.subtitle}
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.services.map((service) => {
            const IconComponent = iconMap[service.id] || Megaphone;
            return (
              <div 
                key={service.id}
                className="group bg-dark-light border border-dark-lighter p-8 hover:border-accent/50 transition-all duration-300 cursor-pointer"
                onClick={scrollToContact}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-gray-600 text-sm font-mono">{service.id}</span>
                </div>
                
                <h3 className="font-pixel text-white text-lg md:text-xl mb-4 group-hover:text-accent transition-colors">
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
                      className="text-xs font-mono bg-dark-lighter text-gray-400 px-3 py-1"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-accent text-sm font-mono group-hover:gap-4 transition-all">
                  <span>Detaylı Bilgi Al</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button 
            onClick={scrollToContact}
            className="bg-accent text-dark font-mono font-bold px-10 py-4 hover:bg-white transition-colors text-lg"
          >
            TÜM HİZMETLER İÇİN TEKLİF AL
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
