import React from 'react';
import { Brain, Target, Zap, Layers, ArrowRight, CheckCircle } from 'lucide-react';
import { whyUsData } from '../data/mock';

const iconMap = {
  'brain': Brain,
  'target': Target,
  'zap': Zap,
  'layers': Layers
};

const WhyUs = () => {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="why-us" className="relative py-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
            <Target className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-mono tracking-wider">FARKIMIZ</span>
          </div>
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">N</span>EDEN PIXEL360?
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            {whyUsData.subtitle}
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {whyUsData.reasons.map((reason, index) => {
            const IconComponent = iconMap[reason.icon] || Brain;
            return (
              <div 
                key={reason.id}
                className="group relative bg-dark-light/50 backdrop-blur-sm border border-dark-lighter p-8 hover:border-accent transition-all duration-500"
              >
                {/* Number Badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-accent flex items-center justify-center font-pixel text-dark text-sm">
                  {reason.id}
                </div>
                
                {/* Corner decorations */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/20 group-hover:border-accent transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/20 group-hover:border-accent transition-colors"></div>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-white text-lg md:text-xl mb-3 group-hover:text-accent transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <button 
            onClick={scrollToContact}
            className="group inline-flex items-center gap-3 text-accent hover:text-white font-mono transition-colors"
          >
            <span>Farkı deneyimleyin</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
