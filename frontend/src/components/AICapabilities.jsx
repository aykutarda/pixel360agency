import React, { useEffect, useState } from 'react';
import { Brain, Cpu, TrendingUp, Users, Wand2, BarChart3, ArrowRight, Sparkles, Target, Zap } from 'lucide-react';

const iconMap = {
  0: Brain,
  1: Wand2,
  2: Users,
  3: TrendingUp,
  4: Cpu,
  5: BarChart3
};

const AICapabilities = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/site/sections/ai_capabilities`);
      const sectionData = await res.json();
      setData(sectionData);
    } catch (error) {
      console.error('Error loading ai_capabilities data:', error);
    }
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!data) return null;

  return (
    <section id="ai" className="relative py-24 px-6 md:px-12 overflow-hidden">
      {/* AI Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-accent/20 border border-purple-500/30 px-4 py-2 mb-6">
            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-accent text-sm font-mono tracking-wider font-bold">
              {data.badge}
            </span>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </div>
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent">{data.title?.charAt(0)}</span>{data.title?.slice(1)}
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* AI Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data.items?.map((capability, index) => {
            const IconComponent = iconMap[index] || Brain;
            return (
              <div 
                key={index}
                className="group relative bg-dark-light/30 backdrop-blur-sm border border-dark-lighter p-6 hover:border-purple-500/50 transition-all duration-500"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Icon */}
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-accent/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7 text-purple-400" />
                  </div>
                  
                  <h3 className="font-mono text-white text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                    {capability.name}
                  </h3>
                  <p className="text-gray-400 font-mono text-sm mb-4">
                    {capability.description}
                  </p>
                  
                  {/* Metric */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-accent font-mono text-sm font-bold">
                      {capability.metric}
                    </span>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-purple-500/30 group-hover:border-purple-500 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent/30 group-hover:border-accent transition-colors"></div>
              </div>
            );
          })}
        </div>

        {/* AI Statement */}
        <div className="relative bg-gradient-to-r from-purple-500/10 via-dark-light/50 to-accent/10 border border-purple-500/30 p-8 md:p-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-accent to-purple-500"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/30 to-accent/30 border border-purple-500/50 flex items-center justify-center">
                <Brain className="w-10 h-10 text-accent" />
              </div>
              <div>
                <h3 className="font-pixel text-white text-xl md:text-2xl mb-2">
                  <span className="text-accent">AI</span> AVANTAJINIZI ALIN
                </h3>
                <p className="text-gray-400 font-mono text-sm max-w-lg">
                  Rakipleriniz hala manuel çalışırken, siz yapay zekanın gücüyle öne geçin.
                </p>
              </div>
            </div>
            <button 
              onClick={scrollToContact}
              className="group flex items-center gap-3 bg-accent text-dark font-mono font-bold px-8 py-4 hover:bg-white transition-all"
            >
              AI DEMO TALEP ET
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AICapabilities;
