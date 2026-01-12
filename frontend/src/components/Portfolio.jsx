import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/mock';

const Portfolio = () => {
  return (
    <section id="portfolio" className="relative py-24 px-6 md:px-12 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-light/20 via-transparent to-dark-light/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4 pixel-text">
            <span className="text-accent glitch" data-text="B">B</span>AŞARI HİKAYELERİ
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base">
            Müşterilerimizle birlikte elde ettiğimiz sonuçlar
          </p>
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-accent"></div>
            <div className="w-2 h-2 bg-accent rotate-45 animate-pulse"></div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-accent"></div>
          </div>
        </div>
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.projects.map((project, index) => (
            <div 
              key={project.id}
              className="group relative overflow-hidden bg-dark-light/50 backdrop-blur-sm border border-dark-lighter hover:border-accent/50 transition-all duration-500 hover-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/30 group-hover:border-accent group-hover:w-10 group-hover:h-10 transition-all duration-300 z-20"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/30 group-hover:border-accent group-hover:w-10 group-hover:h-10 transition-all duration-300 z-20"></div>
              
              <div className="aspect-[3/2] overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              {/* Scanlines effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
              }}></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-accent text-xs font-mono tracking-wider mb-2 block glitch-text">
                  {project.category}
                </span>
                <h3 className="font-pixel text-white text-lg md:text-xl mb-3 group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono text-sm bg-accent/20 px-4 py-2 border border-accent/30 glitch-box">
                    {project.result}
                  </span>
                  <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-accent/20">
                    <ArrowUpRight className="w-5 h-5 text-accent group-hover:rotate-45 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
