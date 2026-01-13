import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { portfolioData } from '../data/mock';

const Portfolio = () => {
  return (
    <section id="portfolio" className="relative py-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-light/20 via-transparent to-dark-light/20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-mono tracking-wider">KANITLANMIŞ SONUÇLAR</span>
          </div>
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">B</span>AŞARI HİKAYELERİ
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base">
            {portfolioData.subtitle}
          </p>
        </div>
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.projects.map((project, index) => (
            <div 
              key={project.id}
              className="group relative overflow-hidden bg-dark-light/50 backdrop-blur-sm border border-dark-lighter hover:border-accent/50 transition-all duration-500"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/30 group-hover:border-accent group-hover:w-12 group-hover:h-12 transition-all duration-300 z-20"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/30 group-hover:border-accent group-hover:w-12 group-hover:h-12 transition-all duration-300 z-20"></div>
              
              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${project.color} via-dark/80 to-dark/40 opacity-90`}></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-accent text-xs font-mono tracking-wider mb-2">
                  {project.category}
                </span>
                <h3 className="font-pixel text-white text-xl md:text-2xl mb-4 group-hover:text-accent transition-colors">
                  {project.name}
                </h3>
                
                {/* Result Highlight */}
                <div className="flex items-center justify-between">
                  <div className="bg-dark/80 backdrop-blur-sm border border-accent/30 px-4 py-3">
                    <div className="font-pixel text-accent text-2xl md:text-3xl">
                      {project.result}
                    </div>
                    <div className="text-gray-400 text-xs font-mono">
                      {project.subResult}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 border border-accent/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-accent">
                    <ArrowUpRight className="w-6 h-6 text-accent group-hover:text-dark transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Results Teaser */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 font-mono text-sm mb-4">
            150+ marka ile çalıştık. Her biri için ölçülebilir sonuçlar ürettik.
          </p>
          <button 
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-accent font-mono hover:gap-4 transition-all"
          >
            <span>Tüm başarı hikayelerini gör</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
