import React from 'react';
import { siteData, navLinks, servicesData } from '../data/mock';
import { Phone, Mail, MapPin, MessageCircle, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative py-16 px-6 md:px-12 border-t border-dark-lighter/50 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-light/50 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <a href="/" className="font-pixel text-white text-xl tracking-wider block mb-4 group">
              <span className="text-accent glitch" data-text="P">P</span>IXEL360<span className="text-accent">.</span>
            </a>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
              360° dijital çözümlerle markanızı zirveye taşıyoruz.
            </p>
            <div className="flex gap-4">
              <a 
                href={`https://wa.me/${siteData.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-10 h-10 bg-green-500/20 border border-green-500/30 flex items-center justify-center hover:bg-green-500 hover:border-green-500 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 text-green-500 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              HIZLI LİNKLER
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path}
                    className="group text-gray-400 font-mono text-sm hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-accent/50 group-hover:bg-accent transition-colors"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              HİZMETLER
            </h4>
            <ul className="space-y-3">
              {servicesData.services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a 
                    href="#services"
                    className="group text-gray-400 font-mono text-sm hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-accent/50 group-hover:bg-accent transition-colors"></span>
                    {service.shortName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              İLETİŞİM
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`tel:${siteData.phone}`}
                  className="group flex items-center gap-3 text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:border-accent transition-colors">
                    <Phone className="w-4 h-4 text-accent" />
                  </div>
                  {siteData.phone}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${siteData.email}`}
                  className="group flex items-center gap-3 text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:border-accent transition-colors">
                    <Mail className="w-4 h-4 text-accent" />
                  </div>
                  {siteData.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 font-mono text-sm">
                <div className="w-8 h-8 bg-accent/10 flex items-center justify-center border border-accent/20 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                {siteData.address}
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-dark-lighter/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-gray-500 font-mono text-xs">
            {siteData.copyright} - Tüm Hakları Saklıdır.
          </span>
          <span className="text-accent font-mono text-xs glitch-text">
            {siteData.slogan}
          </span>
        </div>
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-accent/10"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-accent/10"></div>
    </footer>
  );
};

export default Footer;
