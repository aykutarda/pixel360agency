import React from 'react';
import { siteData, navLinks, servicesData, trustBadges } from '../data/mock';
import { Phone, Mail, MapPin, MessageCircle, Brain, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative py-16 px-6 md:px-12 border-t border-dark-lighter/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-dark-light/50 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <a href="/" className="font-pixel text-white text-xl tracking-wider block mb-4 group">
              <span className="text-accent">P</span>IXEL360<span className="text-accent">.</span>
            </a>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-4">
              AI-Powered Growth Agency. Yapay zeka destekli stratejilerle markaları ölçeklenebilir büyümeye taşıyoruz.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {trustBadges.slice(0, 2).map((badge, index) => (
                <div key={index} className="text-xs font-mono text-gray-500 bg-dark-light/50 px-2 py-1 border border-dark-lighter">
                  {badge.name}
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent"></div>
              HIZLI LİNKLER
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path}
                    className="group text-gray-400 font-mono text-sm hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent"></div>
              HİZMETLER
            </h4>
            <ul className="space-y-3">
              {servicesData.services.map((service) => (
                <li key={service.id}>
                  <a 
                    href="#services"
                    className="group text-gray-400 font-mono text-sm hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.shortName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent"></div>
              İLETİŞİM
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`tel:${siteData.phone}`}
                  className="group flex items-center gap-3 text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {siteData.phone}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${siteData.email}`}
                  className="group flex items-center gap-3 text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {siteData.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 font-mono text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {siteData.address}
              </li>
            </ul>
            
            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${siteData.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-green-500/20 text-green-500 font-mono text-sm px-4 py-2 border border-green-500/30 hover:bg-green-500 hover:text-white transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-dark-lighter/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-gray-500 font-mono text-xs">
            {siteData.copyright} - Tüm Hakları Saklıdır.
          </span>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-accent font-mono text-xs font-bold">
              {siteData.slogan}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
