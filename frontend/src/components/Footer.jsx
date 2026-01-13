import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Brain, ArrowUpRight, Linkedin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const socialIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube
};

const Footer = () => {
  const [data, setData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [trustBadges, setTrustBadges] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/site/sections`);
      const sections = await res.json();
      setData(sections.footer);
      setHeaderData(sections.header);
      setTrustBadges(sections.trust_badges?.partners || []);
    } catch (error) {
      console.error('Error loading footer data:', error);
    }
  };

  if (!data) return null;

  const contact = data.contact || {};
  const navLinks = headerData?.nav_links || [];

  return (
    <footer className="relative py-16 px-6 md:px-12 border-t border-dark-lighter/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-dark-light/50 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <a href="/" className="font-pixel text-white text-xl tracking-wider block mb-4 group">
              <span className="text-accent glitch" data-text={data.logo?.charAt(0)}>{data.logo?.charAt(0)}</span>{data.logo?.slice(1)}
            </a>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-4">
              {data.slogan}. Yapay zeka destekli stratejilerle markaları ölçeklenebilir büyümeye taşıyoruz.
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
          
          {/* Legal Links */}
          <div>
            <h4 className="font-pixel text-white text-sm mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-accent"></div>
              YASAL
            </h4>
            <ul className="space-y-3">
              {data.legal_links?.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url}
                    className="group text-gray-400 font-mono text-sm hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
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
                  href={`tel:${contact.phone?.replace(/\s/g, '')}`}
                  className="group flex items-center gap-3 text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${contact.email}`}
                  className="group flex items-center gap-3 text-gray-400 font-mono text-sm hover:text-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 font-mono text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {contact.address}
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="mt-4 flex gap-2">
              {data.social_links?.map((social, index) => {
                const IconComponent = socialIcons[social.platform] || ArrowUpRight;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-dark-light border border-dark-lighter flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent transition-colors"
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
            
            {/* WhatsApp */}
            <a 
              href={`https://wa.me/${contact.whatsapp}`}
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
            {data.copyright}
          </span>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-accent font-mono text-xs font-bold">
              {data.slogan}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
