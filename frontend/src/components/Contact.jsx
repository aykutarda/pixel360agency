import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contactData } from '../data/mock';

const Contact = () => {
  return (
    <section className="bg-dark py-32 px-8 md:px-16">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title */}
        <div className="mb-16">
          <h2 className="font-pixel text-white text-[48px] md:text-[72px] lg:text-[96px] leading-[0.9] tracking-tight">
            LET'S
          </h2>
          <h2 className="font-pixel text-white text-[48px] md:text-[72px] lg:text-[96px] leading-[0.9] tracking-tight">
            <span className="text-accent">C</span>ONNECT
          </h2>
        </div>
        
        {/* Email Link */}
        <a 
          href={`mailto:${contactData.email}`}
          className="group inline-flex items-center gap-4 text-white text-lg md:text-xl font-mono tracking-[0.15em] border-b border-white pb-2 hover:text-accent hover:border-accent transition-colors"
        >
          <span>{contactData.email}</span>
          <span className="w-6 h-6 bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4 text-dark" />
          </span>
        </a>
      </div>
    </section>
  );
};

export default Contact;
