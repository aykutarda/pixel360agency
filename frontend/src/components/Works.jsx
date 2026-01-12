import React from 'react';
import { worksData } from '../data/mock';

const Works = () => {
  return (
    <section className="bg-dark py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left - Title */}
          <div className="md:w-1/3 md:sticky md:top-32 self-start">
            <h2 className="font-pixel text-white text-[48px] md:text-[64px] lg:text-[80px] leading-[0.9] tracking-tight">
              <span className="text-accent">S</span>ELECTED
            </h2>
            <h2 className="font-pixel text-white text-[48px] md:text-[64px] lg:text-[80px] leading-[0.9] tracking-tight flex items-end gap-4">
              WORK
              <span className="text-gray-500 text-lg font-mono">{worksData.count}</span>
            </h2>
          </div>
          
          {/* Right - Projects */}
          <div className="md:w-2/3 flex flex-col gap-6">
            {worksData.projects.map((project) => (
              <a 
                key={project.id}
                href={project.link}
                className="group relative bg-[#2a2a2a] overflow-hidden"
              >
                <div className="p-6">
                  <span className="text-white text-sm font-mono tracking-[0.15em]">
                    {project.name}
                  </span>
                </div>
                <div className="relative h-[350px] md:h-[450px] overflow-hidden">
                  <img 
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <button className="absolute bottom-6 right-6 bg-[#3a3a3a] text-white text-xs font-mono tracking-[0.15em] px-6 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#4a4a4a]">
                    SEE MORE
                  </button>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Works;
