import React from 'react';
import { siteData, navLinks, servicesData } from '../data/mock';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-light py-16 px-6 md:px-12 border-t border-dark-lighter">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <a href="/" className="font-pixel text-white text-xl tracking-wider block mb-4">
              PIXEL360<span className="text-accent">.</span>
            </a>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
              360° dijital çözümlerle markanızı zirveye taşıyoruz.
            </p>
            <div className="flex gap-4">
              <a 
                href={`https://wa.me/${siteData.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6">HİZLİ LİNKLER</h4>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.path}
                    className="text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6">HİZMETLER</h4>
            <ul className="space-y-3">
              {servicesData.services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <a 
                    href="#services"
                    className="text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                  >
                    {service.shortName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6">İLETİŞİM</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`tel:${siteData.phone}`}
                  className="flex items-center gap-3 text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {siteData.phone}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${siteData.email}`}
                  className="flex items-center gap-3 text-gray-400 font-mono text-sm hover:text-accent transition-colors"
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
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-dark-lighter pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-gray-500 font-mono text-xs">
            {siteData.copyright} - Tüm Hakları Saklıdır.
          </span>
          <span className="text-gray-500 font-mono text-xs">
            {siteData.slogan}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
