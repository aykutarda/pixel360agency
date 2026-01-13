import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, Brain, Zap } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load header and footer data for WhatsApp
    loadSiteData();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadSiteData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/site/sections`);
      const data = await res.json();
      setHeaderData(data.header);
      setFooterData(data.footer);
    } catch (error) {
      console.error('Error loading site data:', error);
    }
  };

  const scrollToSection = (path) => {
    setIsMenuOpen(false);
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Fallback data
  const navLinks = headerData?.nav_links || [
    { name: 'ANA SAYFA', path: '/' },
    { name: 'HİZMETLER', path: '#services' },
    { name: 'İLETİŞİM', path: '#contact' }
  ];
  
  const phone = headerData?.phone || footerData?.contact?.phone || '+90 532 123 45 67';
  const whatsapp = footerData?.contact?.whatsapp || '905321234567';
  const ctaText = headerData?.cta_button?.text || 'STRATEJİ GÖRÜŞMESİ';
  const ctaUrl = headerData?.cta_button?.url || '#contact';
  const logo = headerData?.logo || 'PIXEL360.';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'bg-dark/95 backdrop-blur-md shadow-lg border-b border-dark-lighter/50' : ''}`}>
        <a href="/" className="font-pixel text-white text-base md:text-lg tracking-wider hover:text-accent transition-colors flex items-center gap-2">
          <span className="text-accent">{logo.charAt(0)}</span>{logo.slice(1)}
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(link.path)}
              className="text-gray-400 font-mono text-sm hover:text-accent transition-colors"
            >
              {link.name}
            </button>
          ))}
        </nav>
        
        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a 
            href={`tel:${phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 text-gray-400 text-sm font-mono hover:text-accent transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden xl:inline">{phone}</span>
          </a>
          <a 
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500/20 text-green-500 text-sm font-mono px-3 py-2 border border-green-500/30 hover:bg-green-500 hover:text-white transition-all"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button 
            onClick={() => scrollToSection(ctaUrl)}
            className="flex items-center gap-2 bg-accent text-dark text-sm font-mono font-bold px-5 py-2 hover:bg-white transition-colors"
          >
            <Brain className="w-4 h-4" />
            <span>{ctaText}</span>
          </button>
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
        <div className="px-6 py-4 flex justify-between items-center border-b border-dark-lighter">
          <span className="font-pixel text-white text-lg tracking-wider">
            <span className="text-accent">{logo.charAt(0)}</span>{logo.slice(1)}
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
              className="text-white font-pixel text-xl tracking-wider hover:text-accent transition-colors"
            >
              {link.name}
            </button>
          ))}
          
          {/* Mobile CTAs */}
          <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
            <a 
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white font-mono px-8 py-4"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <button 
              onClick={() => scrollToSection(ctaUrl)}
              className="flex items-center justify-center gap-2 bg-accent text-dark font-mono font-bold px-8 py-4"
            >
              <Brain className="w-5 h-5" />
              {ctaText}
            </button>
          </div>
        </nav>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href={`https://wa.me/${whatsapp}?text=Merhaba, büyüme stratejisi hakkında görüşmek istiyorum.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all group"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute right-full mr-3 bg-dark text-white text-xs font-mono px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Hemen Yazın
        </span>
      </a>
    </>
  );
};

export default Header;
