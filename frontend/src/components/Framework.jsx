import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { frameworkData } from '../data/mock';

const Framework = () => {
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="framework" className="relative py-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-light/30 via-transparent to-dark-light/30 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-mono tracking-wider">METODOLOJİ</span>
          </div>
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">G</span>ROWTH FRAMEWORK
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            {frameworkData.subtitle}
          </p>
        </div>

        {/* Framework Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {frameworkData.steps.map((step, index) => (
              <div 
                key={step.phase}
                className="group relative"
              >
                {/* Step Card */}
                <div className="relative bg-dark-light/50 backdrop-blur-sm border border-dark-lighter p-6 hover:border-accent transition-all duration-500 h-full">
                  
                  {/* Phase Number */}
                  <div className="absolute -top-5 left-6 flex items-center gap-2">
                    <div className="w-10 h-10 bg-accent flex items-center justify-center font-pixel text-dark text-sm">
                      {step.phase}
                    </div>
                    <span className="text-accent font-mono text-xs tracking-wider">{step.name}</span>
                  </div>

                  <div className="pt-6">
                    <h3 className="font-pixel text-white text-base md:text-lg mb-3 group-hover:text-accent transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <div className="w-2 h-2 bg-accent/50 rounded-full"></div>
                      <span className="text-gray-500">{step.duration}</span>
                    </div>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/20 group-hover:border-accent transition-colors"></div>
                </div>

                {/* Arrow to next */}
                {index < frameworkData.steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-accent/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 font-mono text-sm mb-6">
            Her adım veri ve AI tarafından desteklenir
          </p>
          <button 
            onClick={scrollToContact}
            className="group relative bg-accent text-dark font-mono font-bold px-10 py-4 hover:bg-white transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              BÜYÜME YOLCULUĞUNA BAŞLA
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Framework;
