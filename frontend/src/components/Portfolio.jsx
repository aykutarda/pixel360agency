import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/mock';

const Portfolio = () => {
  return (
    <section id="portfolio" className="bg-dark-light py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">B</span>AŞARI HİKAYELERİ
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base">
            Müşterilerimizle birlikte elde ettiğimiz sonuçlar
          </p>
        </div>
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.projects.map((project) => (
            <div 
              key={project.id}
              className="group relative overflow-hidden bg-dark"
            >
              <div className="aspect-[3/2] overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent opacity-80"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-accent text-xs font-mono tracking-wider mb-2 block">
                  {project.category}
                </span>
                <h3 className="font-pixel text-white text-xl mb-2">
                  {project.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-white font-mono text-sm bg-accent/20 px-3 py-1">
                    {project.result}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
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
