import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { packagesData } from '../data/mock';

const Packages = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="packages" className="bg-dark py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">P</span>AKETLERİMİZ
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            İhtiyacınıza uygun paketi seçin, hemen başlayalım
          </p>
        </div>
        
        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packagesData.packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative p-8 transition-all duration-300 ${
                pkg.popular 
                  ? 'bg-accent text-dark border-2 border-accent transform md:-translate-y-4' 
                  : 'bg-dark-light border border-dark-lighter hover:border-accent/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-dark text-accent text-xs font-mono px-4 py-1 border border-accent">
                  EN POPÜLER
                </div>
              )}
              
              <h3 className={`font-pixel text-xl mb-2 ${pkg.popular ? 'text-dark' : 'text-white'}`}>
                {pkg.name}
              </h3>
              <p className={`text-sm font-mono mb-6 ${pkg.popular ? 'text-dark/70' : 'text-gray-400'}`}>
                {pkg.description}
              </p>
              
              <div className="mb-6">
                <span className={`font-pixel text-4xl ${pkg.popular ? 'text-dark' : 'text-accent'}`}>
                  {pkg.price === 'Özel' ? '' : '₺'}{pkg.price}
                </span>
                <span className={`font-mono text-sm ${pkg.popular ? 'text-dark/70' : 'text-gray-400'}`}>
                  {pkg.period}
                </span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${pkg.popular ? 'text-dark' : 'text-accent'}`} />
                    <span className={`font-mono text-sm ${pkg.popular ? 'text-dark/80' : 'text-gray-400'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={scrollToContact}
                className={`w-full flex items-center justify-center gap-2 font-mono font-bold py-4 transition-colors ${
                  pkg.popular 
                    ? 'bg-dark text-accent hover:bg-dark-light' 
                    : 'bg-accent text-dark hover:bg-white'
                }`}
              >
                HEMEN BAŞLA
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
