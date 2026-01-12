import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { navLinks, siteData } from '../data/mock';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (path) => {
    setIsMenuOpen(false);
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg' : ''}`}>
        <a href="/" className="font-pixel text-white text-base md:text-lg tracking-wider hover:text-accent transition-colors">
          PIXEL360<span className="text-accent">.</span>
        </a>
        
        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <a 
            href={`tel:${siteData.phone}`}
            className="flex items-center gap-2 text-white text-sm font-mono hover:text-accent transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden xl:inline">{siteData.phone}</span>
          </a>
          <a 
            href={`https://wa.me/${siteData.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white text-sm font-mono px-4 py-2 hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
          <a 
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }}
            className="bg-accent text-dark text-sm font-mono font-bold px-6 py-2 hover:bg-white transition-colors"
          >
            TEKLİF AL
          </a>
        </div>

        <button 
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden w-12 h-12 bg-dark-lighter flex items-center justify-center hover:bg-accent hover:text-dark transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-dark z-[100] transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-6 py-4 flex justify-between items-center">
          <span className="font-pixel text-white text-lg tracking-wider">
            PIXEL360<span className="text-accent">.</span>
          </span>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-12 h-12 bg-dark-lighter flex items-center justify-center hover:bg-accent hover:text-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex flex-col items-center justify-center h-[calc(100vh-200px)] gap-6">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(link.path)}
              className="text-white font-pixel text-2xl md:text-3xl tracking-wider hover:text-accent transition-colors"
            >
              {link.name}
            </button>
          ))}
          
          {/* Mobile CTA */}
          <div className="flex flex-col gap-4 mt-8">
            <a 
              href={`https://wa.me/${siteData.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white font-mono px-8 py-3"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile Ulaşın
            </a>
            <a 
              href={`tel:${siteData.phone}`}
              className="flex items-center justify-center gap-2 bg-accent text-dark font-mono font-bold px-8 py-3"
            >
              <Phone className="w-5 h-5" />
              Hemen Ara
            </a>
          </div>
        </nav>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${siteData.whatsapp}?text=Merhaba, hizmetleriniz hakkında bilgi almak istiyorum.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </>
  );
};

export default Header;
