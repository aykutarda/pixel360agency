import React from 'react';
import { ArrowUpRight, TrendingUp, BarChart3, Globe, Video, Megaphone, Settings, Zap } from 'lucide-react';
import { servicesData } from '../data/mock';

const iconMap = {
  '01': TrendingUp,
  '02': Megaphone,
  '03': Globe,
  '04': BarChart3,
  '05': Video,
  '06': Settings
};

const Services = () => {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="relative py-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-mono tracking-wider">360° ÇÖZÜMLER</span>
          </div>
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
            const IconComponent = iconMap[service.id] || TrendingUp;
            return (
              <div 
                key={service.id}
                className="group relative bg-dark-light/50 backdrop-blur-sm border border-dark-lighter p-8 hover:border-accent/50 transition-all duration-500 cursor-pointer hover-glow"
                onClick={scrollToContact}
              >
                {/* Service Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-dark-lighter border border-dark-lighter flex items-center justify-center font-mono text-xs text-gray-500 group-hover:bg-accent group-hover:text-dark group-hover:border-accent transition-all">
                  {service.id}
                </div>
                
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/30 group-hover:border-accent transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors"></div>
                
                {/* Icon */}
                <div className="w-14 h-14 bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <IconComponent className="w-7 h-7 text-accent" />
                </div>
                
                <h3 className="font-pixel text-white text-base mb-4 group-hover:text-accent transition-colors">
                  {service.shortName}
                </h3>
                
                {/* Problem → Solution → Result */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 text-xs font-mono">PROBLEM:</span>
                    <span className="text-gray-500 text-xs font-mono">{service.problem}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 text-xs font-mono">ÇÖZÜM:</span>
                    <span className="text-gray-400 text-xs font-mono">{service.solution}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-accent text-xs font-mono">SONUÇ:</span>
                    <span className="text-accent text-xs font-mono font-bold">{service.result}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-mono bg-dark/50 text-gray-400 px-2 py-1 border border-dark-lighter group-hover:border-accent/30 transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-accent text-sm font-mono group-hover:gap-4 transition-all">
                  <span>Bu Hizmeti İncele</span>
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
            <span className="relative z-10">360° BÜYÜME PAKETİ İÇİN GÖRÜŞELİM</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
