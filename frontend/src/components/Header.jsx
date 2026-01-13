import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, Brain, ChevronRight } from 'lucide-react';

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

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
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
        {/* Logo */}
        <a href="/" className="font-pixel text-white text-base md:text-lg tracking-wider hover:text-accent transition-colors">
          <span className="text-accent">{logo.charAt(0)}</span>{logo.slice(1)}
        </a>
        
        {/* Hamburger Menu Button - Always Visible */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="w-12 h-12 bg-dark-lighter/80 backdrop-blur-sm flex items-center justify-center hover:bg-accent hover:text-dark transition-colors border border-dark-lighter"
          aria-label="Menüyü Aç"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Fullscreen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-dark/95 backdrop-blur-md z-[100] transition-all duration-500 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Menu Header */}
        <div className="px-6 md:px-12 py-4 flex justify-between items-center border-b border-dark-lighter/50">
          <span className="font-pixel text-white text-base md:text-lg tracking-wider">
            <span className="text-accent">{logo.charAt(0)}</span>{logo.slice(1)}
          </span>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="w-12 h-12 bg-dark-lighter flex items-center justify-center hover:bg-accent hover:text-dark transition-colors border border-dark-lighter"
            aria-label="Menüyü Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Menu Content */}
        <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row">
          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(link.path)}
                className="group flex items-center justify-between py-4 md:py-6 border-b border-dark-lighter/30 hover:border-accent/50 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-pixel text-white text-lg md:text-2xl lg:text-3xl tracking-wider group-hover:text-accent transition-colors">
                  {link.name}
                </span>
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-accent group-hover:translate-x-2 transition-all" />
              </button>
            ))}
          </nav>

          {/* Contact Info & CTAs */}
          <div className="md:w-80 lg:w-96 bg-dark-light/30 p-6 md:p-8 flex flex-col justify-center gap-6">
            {/* Phone */}
            <a 
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="flex items-center gap-4 text-gray-400 hover:text-accent transition-colors group"
            >
              <div className="w-12 h-12 bg-dark-lighter flex items-center justify-center group-hover:bg-accent group-hover:text-dark transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-500 block">TELEFON</span>
                <span className="font-mono text-sm">{phone}</span>
              </div>
            </a>

            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-gray-400 hover:text-green-500 transition-colors group"
            >
              <div className="w-12 h-12 bg-green-500/20 border border-green-500/30 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5 text-green-500 group-hover:text-white" />
              </div>
              <div>
                <span className="text-xs font-mono text-gray-500 block">WHATSAPP</span>
                <span className="font-mono text-sm">Hemen Yazın</span>
              </div>
            </a>

            {/* Primary CTA */}
            <button 
              onClick={() => scrollToSection(ctaUrl)}
              className="flex items-center justify-center gap-3 bg-accent text-dark font-mono font-bold px-6 py-4 hover:bg-white transition-colors mt-4"
            >
              <Brain className="w-5 h-5" />
              {ctaText}
            </button>
          </div>
        </div>
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
