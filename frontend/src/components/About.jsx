import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { aboutData } from '../data/mock';

const About = () => {
  return (
    <section className="bg-dark py-32 px-8 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        {/* Left - Title */}
        <div className="md:w-1/2">
          <h2 className="font-pixel text-white text-[36px] md:text-[56px] lg:text-[72px] leading-[1.1] tracking-tight whitespace-nowrap">
            HI, I'M <span className="text-accent">M</span>ARK
          </h2>
        </div>
        
        {/* Right - Description */}
        <div className="md:w-1/2 flex flex-col gap-8">
          <p className="text-gray-400 text-sm leading-relaxed tracking-[0.1em] font-mono uppercase">
            {aboutData.description}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed tracking-[0.1em] font-mono uppercase">
            {aboutData.specialty}
          </p>
          <a 
            href="/about" 
            className="inline-flex items-center gap-2 text-white text-sm tracking-[0.15em] font-mono border-b border-white pb-1 hover:text-accent hover:border-accent transition-colors w-fit group"
          >
            {aboutData.cta}
            <span className="w-5 h-5 bg-accent flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3 text-dark" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
