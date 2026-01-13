import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, BarChart3, Globe, Video, Megaphone, Settings, Zap, Search } from 'lucide-react';
import { getServices } from '../api/cms';

const categoryIconMap = {
  'performance': TrendingUp,
  'social': Megaphone,
  'brand': Globe,
  'seo': Search,
  'video': Video,
  'automation': Settings
};

// Fallback data for initial load or errors
const fallbackServices = [
  {
    id: '01',
    name: 'Google Ads Yönetimi',
    category: 'performance',
    hero_summary: 'AI-destekli Google Ads yönetimi ile reklam harcamalarınızdan maksimum verim alın.',
    seo_slug: 'google-ads-yonetimi',
    kpi_outcomes: [{ metric_name: 'ROAS Artışı', value: '%200-400' }]
  },
  {
    id: '02',
    name: 'Meta Ads Yönetimi',
    category: 'performance',
    hero_summary: 'Facebook ve Instagram reklamlarıyla hedef kitlenize ulaşın.',
    seo_slug: 'meta-ads-yonetimi',
    kpi_outcomes: [{ metric_name: 'ROAS', value: '3x-5x' }]
  },
  {
    id: '03',
    name: 'SEO Hizmeti',
    category: 'seo',
    hero_summary: 'Google\'ın ilk sayfasında yer alın. Teknik SEO, içerik stratejisi ve link building.',
    seo_slug: 'seo-hizmeti',
    kpi_outcomes: [{ metric_name: 'Organik Trafik', value: '%100-300' }]
  }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices('published');
        setServices(data.length > 0 ? data : fallbackServices);
      } catch (error) {
        console.error('Error loading services:', error);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="relative py-24 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-light/30 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-accent text-sm font-mono tracking-wider">360° ÇÖZÜMLER</span>
          </div>
          <h2 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[64px] leading-[1] tracking-tight mb-4">
            <span className="text-accent glitch" data-text="H">H</span>İZMETLERİMİZ
          </h2>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            AI-Destekli Büyüme Çözümleri
          </p>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = categoryIconMap[service.category] || TrendingUp;
              const displayNumber = String(index + 1).padStart(2, '0');
              
              return (
                <Link 
                  key={service.id}
                  to={`/hizmetler/${service.seo_slug}`}
                  className="group relative bg-dark-light/50 backdrop-blur-sm border border-dark-lighter p-8 hover:border-accent/50 transition-all duration-500 cursor-pointer hover-glow"
                  data-testid={`service-card-${service.seo_slug}`}
                >
                  {/* Service Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-dark-lighter border border-dark-lighter flex items-center justify-center font-mono text-xs text-gray-500 group-hover:bg-accent group-hover:text-dark group-hover:border-accent transition-all">
                    {displayNumber}
                  </div>
                  
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/30 group-hover:border-accent transition-colors"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors"></div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-accent" />
                  </div>
                  
                  <h3 className="font-pixel text-white text-base mb-4 group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                  
                  {/* Summary */}
                  <p className="text-gray-400 text-sm font-mono mb-6 line-clamp-3">
                    {service.hero_summary}
                  </p>

                  {/* KPI Outcome */}
                  {service.kpi_outcomes?.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-start gap-2">
                        <span className="text-accent text-xs font-mono">SONUÇ:</span>
                        <span className="text-accent text-xs font-mono font-bold">
                          {service.kpi_outcomes[0].value} {service.kpi_outcomes[0].metric_name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Category Tag */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="text-xs font-mono bg-dark/50 text-gray-400 px-2 py-1 border border-dark-lighter group-hover:border-accent/30 transition-colors uppercase">
                      {service.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-accent text-sm font-mono group-hover:gap-4 transition-all">
                    <span>Hizmeti İncele</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <button 
            onClick={scrollToContact}
            className="relative group bg-accent text-dark font-mono font-bold px-10 py-4 hover:bg-white transition-all text-lg overflow-hidden"
            data-testid="services-cta-button"
          >
            <span className="relative z-10">360° BÜYÜME PAKETİ İÇİN GÖRÜŞELİM</span>
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
