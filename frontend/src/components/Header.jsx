import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navLinks } from '../data/mock';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-8 md:px-16 py-6 flex justify-between items-center">
        <a href="/" className="font-pixel text-white text-lg tracking-wider hover:text-accent transition-colors">
          PIXEFOLIO.
        </a>
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="w-12 h-12 bg-[#3a3a3a] flex items-center justify-center hover:bg-[#4a4a4a] transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      </header>

      {/* Full Screen Menu */}
      <div className={`fixed inset-0 bg-[#1a1a1a] z-[100] transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-8 md:px-16 py-6 flex justify-between items-center">
          <a href="/" className="font-pixel text-white text-lg tracking-wider">
            PIXEFOLIO.
          </a>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-12 h-12 bg-[#3a3a3a] flex items-center justify-center hover:bg-[#4a4a4a] transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <nav className="flex flex-col items-center justify-center h-[calc(100vh-100px)] gap-8">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-center gap-4 text-white font-pixel text-4xl md:text-6xl tracking-wider hover:text-accent transition-colors"
            >
              <span>{link.name}</span>
              <ArrowUpRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;
