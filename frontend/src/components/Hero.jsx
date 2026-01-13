import React, { useEffect, useState } from 'react';
import { ArrowRight, Play, Sparkles, Brain, TrendingUp, Zap } from 'lucide-react';

const Hero = () => {
  const [currentStat, setCurrentStat] = useState(0);
  const [heroData, setHeroData] = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [trustBadges, setTrustBadges] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [logoSettings, setLogoSettings] = useState({
    section_title: 'Büyüme Ortaklarımız',
    animation_speed: 'slow',
    logo_size: 'large'
  });

  useEffect(() => {
    loadSiteData();
  }, []);

  useEffect(() => {
    if (statsData.length > 0) {
      const interval = setInterval(() => {
        setCurrentStat((prev) => (prev + 1) % statsData.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [statsData]);

  const loadSiteData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/site/sections`);
      const data = await res.json();
      setHeroData(data.hero);
      setStatsData(data.stats?.items || []);
      setTrustBadges(data.trust_badges?.partners || []);
      setClientLogos(data.trust_badges?.client_logos || []);
      // Load logo section settings
      setLogoSettings({
        section_title: data.trust_badges?.section_title || 'Büyüme Ortaklarımız',
        animation_speed: data.trust_badges?.animation_speed || 'slow',
        logo_size: data.trust_badges?.logo_size || 'large'
      });
    } catch (error) {
      console.error('Error loading site data:', error);
      // Fallback data
      setHeroData({
        badge: 'AI-POWERED GROWTH AGENCY',
        title: ['BÜYÜME', 'MÜHENDİSLERİ'],
        subtitle: 'Sadece reklam yapmıyoruz. Büyüme üretiyoruz.',
        description: 'Yapay zeka destekli stratejiler, veri odaklı kararlar ve yaratıcı mükemmellikle markaları ölçeklenebilir başarıya taşıyoruz.',
        primary_cta: { text: 'BÜYÜME STRATEJİNİZİ KONUŞALIM', url: '#contact' },
        secondary_cta: { text: 'BAŞARI HİKAYELERİ', url: '#portfolio' },
        tertiary_cta: { text: 'ÜCRETSİZ AI ANALİZ', url: '#contact' }
      });
      setStatsData([
        { number: '₺500M+', label: 'Yönetilen Bütçe' },
        { number: '340%', label: 'Ortalama ROAS' },
        { number: '150+', label: 'Büyüyen Marka' },
        { number: '2.5x', label: 'Ort. Büyüme Oranı' }
      ]);
    }
  };

  // Get animation class based on speed setting
  const getAnimationClass = () => {
    switch(logoSettings.animation_speed) {
      case 'fast': return 'animate-marquee-fast';
      case 'slow': return 'animate-marquee-slow';
      default: return 'animate-marquee';
    }
  };

  // Get logo size classes based on size setting
  const getLogoSizeClasses = () => {
    switch(logoSettings.logo_size) {
      case 'small': return 'w-36 md:w-44 lg:w-48 h-16 md:h-20 lg:h-24';
      case 'large': return 'w-48 md:w-56 lg:w-64 h-20 md:h-26 lg:h-32';
      default: return 'w-44 md:w-52 lg:w-56 h-18 md:h-24 lg:h-28'; // medium
    }
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPortfolio = () => {
    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!heroData) {
    return <section className="min-h-screen flex items-center justify-center bg-dark"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></section>;
  }

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6 md:px-12 pt-24 pb-20">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Trust Badges - Top */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
          {trustBadges.map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-dark-light/50 backdrop-blur-sm border border-dark-lighter px-3 py-1.5 text-xs font-mono text-gray-400"
            >
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              {badge.name}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left - Text Content */}
          <div className="lg:w-3/5 text-center lg:text-left">
            
            {/* AI Badge */}
            <div className="relative inline-block mb-6">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/40 px-5 py-2.5 glitch-box">
                <Brain className="w-5 h-5 text-accent animate-pulse" />
                <span className="text-accent text-sm font-mono tracking-wider font-bold">{heroData.badge}</span>
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>
              <div className="hidden lg:block absolute left-full top-1/2 w-24 h-px bg-gradient-to-r from-accent to-transparent ml-3"></div>
            </div>
            
            {/* Main Title */}
            <h1 className="font-pixel text-white text-[32px] sm:text-[42px] md:text-[56px] lg:text-[72px] leading-[1.05] tracking-tight mb-4">
              {heroData.title?.map((line, idx) => (
                <span key={idx} className="block">
                  {idx === 0 ? (
                    <><span className="text-accent glitch" data-text={line.charAt(0)}>{line.charAt(0)}</span>{line.slice(1)}</>
                  ) : (
                    <span className="text-gray-200">{line}</span>
                  )}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white font-mono mb-4">
              {heroData.subtitle}
            </p>
            
            {/* Description */}
            <p className="text-gray-400 text-base md:text-lg leading-relaxed font-mono mb-8 max-w-xl mx-auto lg:mx-0">
              {heroData.description}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button 
                onClick={scrollToContact}
                className="group relative flex items-center justify-center gap-3 bg-accent text-dark font-mono font-bold px-8 py-4 hover:bg-white transition-all text-base overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  {heroData.primary_cta?.text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </button>
              <button 
                onClick={scrollToPortfolio}
                className="group flex items-center justify-center gap-3 border-2 border-white/30 text-white font-mono px-8 py-4 hover:bg-white hover:text-dark transition-all relative overflow-hidden"
              >
                <Play className="w-5 h-5" />
                {heroData.secondary_cta?.text}
              </button>
            </div>

            {/* AI Analysis CTA */}
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToContact}
                className="group flex items-center gap-3 text-accent hover:text-white transition-colors"
              >
                <div className="w-10 h-10 border border-accent/50 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
                  <Brain className="w-5 h-5 group-hover:text-dark transition-colors" />
                </div>
                <div className="text-left">
                  <span className="font-mono text-sm block">{heroData.tertiary_cta?.text}</span>
                  <span className="text-xs text-gray-500">{heroData.tertiary_cta?.description || 'Markanız için özel rapor'}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right - Stats Dashboard */}
          <div className="lg:w-2/5 w-full">
            <div className="relative">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {statsData.map((stat, index) => (
                  <div 
                    key={index}
                    className={`relative group bg-dark-light/60 backdrop-blur-sm border p-6 text-center transition-all duration-500 ${
                      currentStat === index 
                        ? 'border-accent shadow-[0_0_30px_rgba(230,255,0,0.2)]' 
                        : 'border-dark-lighter hover:border-accent/50'
                    }`}
                  >
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="relative z-10">
                      <div className={`font-pixel text-2xl md:text-3xl mb-2 transition-colors ${
                        currentStat === index ? 'text-accent' : 'text-white'
                      }`}>
                        {stat.number}
                      </div>
                      <div className="text-gray-400 text-xs font-mono tracking-wider uppercase">
                        {stat.label}
                      </div>
                    </div>
                    
                    {currentStat === index && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent animate-pulse"></div>
                    )}
                    
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/30"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/30"></div>
                  </div>
                ))}
              </div>

              {/* Live Indicator */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Gerçek zamanlı performans verileri</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Logos Section - Premium Design */}
        <div className="mt-16 pt-12 border-t border-dark-lighter/50">
          <p className="text-center text-gray-400 text-sm font-mono tracking-[0.3em] mb-10 uppercase">
            {logoSettings.section_title}
          </p>
          
          {/* Draggable Logo Carousel Container */}
          <div className="relative">
            {/* Gradient Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrollable Track - Drag to scroll */}
            <div 
              className="flex gap-5 md:gap-6 overflow-x-auto pb-12 pt-2 px-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
              onMouseDown={(e) => {
                const slider = e.currentTarget;
                slider.dataset.isDown = 'true';
                slider.dataset.startX = e.pageX - slider.offsetLeft;
                slider.dataset.scrollLeft = slider.scrollLeft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.dataset.isDown = 'false';
              }}
              onMouseUp={(e) => {
                e.currentTarget.dataset.isDown = 'false';
              }}
              onMouseMove={(e) => {
                const slider = e.currentTarget;
                if (slider.dataset.isDown !== 'true') return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - parseInt(slider.dataset.startX || '0')) * 2;
                slider.scrollLeft = parseInt(slider.dataset.scrollLeft || '0') - walk;
              }}
            >
              {clientLogos.map((client, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 group"
                >
                  {/* Premium Logo Card */}
                  <div className="relative">
                    {/* Glitch Effect Layers */}
                    <div className="absolute inset-0 rounded-xl bg-purple-500/30 translate-x-[3px] translate-y-[-3px] opacity-0 group-hover:opacity-100 transition-all duration-300 blur-[1px]"></div>
                    <div className="absolute inset-0 rounded-xl bg-cyan-400/30 translate-x-[-3px] translate-y-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 blur-[1px]"></div>
                    
                    {/* Main Logo Container */}
                    <div className={`relative ${getLogoSizeClasses()}
                                    bg-[#111]/80 backdrop-blur-md 
                                    border border-gray-700/50 rounded-xl
                                    flex items-center justify-center 
                                    overflow-hidden 
                                    group-hover:border-accent/60 
                                    group-hover:bg-[#151515]
                                    group-hover:shadow-[0_0_30px_rgba(200,255,0,0.15)]
                                    transition-all duration-500`}>
                      
                      {/* Corner Accent Lines */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/20 rounded-tl group-hover:border-accent/60 transition-colors duration-300"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent/20 rounded-tr group-hover:border-accent/60 transition-colors duration-300"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent/20 rounded-bl group-hover:border-accent/60 transition-colors duration-300"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent/20 rounded-br group-hover:border-accent/60 transition-colors duration-300"></div>
                      
                      {/* Logo Content - Full Size */}
                      {client.logo_url ? (
                        <img 
                          src={client.logo_url} 
                          alt={client.name} 
                          className="w-full h-full object-contain p-3 md:p-4
                                     filter grayscale brightness-90 
                                     group-hover:grayscale-0 group-hover:brightness-100 
                                     transition-all duration-500
                                     pointer-events-none"
                          draggable="false"
                        />
                      ) : (
                        <span className="text-gray-300 font-mono text-2xl md:text-3xl font-bold tracking-wider
                                         group-hover:text-white transition-colors duration-300
                                         pointer-events-none select-none">
                          {client.logo || client.name?.substring(0, 4).toUpperCase()}
                        </span>
                      )}
                      
                      {/* Scanline Overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.03)_50%)] bg-[length:100%_3px] pointer-events-none opacity-50"></div>
                      
                      {/* Hover Glow Ring */}
                      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-accent/20 transition-all duration-300"></div>
                    </div>
                    
                    {/* Brand Name Label - Fixed Position */}
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <span className="text-xs font-mono text-accent whitespace-nowrap bg-[#0a0a0a]/90 px-3 py-1 rounded border border-accent/30">
                        {client.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scroll Hint */}
            <p className="text-center text-gray-600 text-xs font-mono mt-2">
              ← Sürükleyerek gezin →
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
