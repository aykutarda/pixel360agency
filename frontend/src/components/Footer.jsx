import React from 'react';
import { siteData } from '../data/mock';

const Footer = () => {
  return (
    <footer className="bg-dark py-8 px-8 md:px-16 border-t border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-[0.2em] text-gray-400 font-mono">
        <span>{siteData.copyright}</span>
        <span>{siteData.status}</span>
        <span>{siteData.portfolio}</span>
      </div>
    </footer>
  );
};

export default Footer;
