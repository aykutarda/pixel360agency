import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getServiceBySlug, getBlogPosts } from '../api/cms';
import SEOHead, { generateServiceSchema, generateFAQSchema, generateBreadcrumbSchema } from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight, CheckCircle, ChevronRight, Brain, Zap, TrendingUp, FileText } from 'lucide-react';

const ServicePage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const serviceData = await getServiceBySlug(slug);
      setService(serviceData);
      
      if (serviceData) {
        // Fetch related blog posts
        const posts = await getBlogPosts({ service_id: serviceData.id });
        setRelatedPosts(posts.slice(0, 3));
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <SEOHead title="Sayfa Bulunamadı" robots="noindex,nofollow" />
        <div className="text-center">
          <h1 className="font-pixel text-white text-2xl mb-4">Sayfa Bulunamadı</h1>
          <Link to="/" className="text-accent hover:underline">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  // Generate schemas
  const schemas = [
    generateServiceSchema(service),
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: 'https://pixel360.com.tr' },
      { name: 'Hizmetler', url: 'https://pixel360.com.tr/#services' },
      { name: service.name, url: `https://pixel360.com.tr/hizmetler/${service.seo_slug}` }
    ])
  ];
  
  if (service.seo_schema_faq_enabled && service.seo_schema_faq_items?.length > 0) {
    schemas.push(generateFAQSchema(service.seo_schema_faq_items));
  }

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark">
      <SEOHead
        title={service.seo_title || service.name}
        description={service.seo_description || service.hero_summary}
        canonical={`https://pixel360.com.tr/hizmetler/${service.seo_slug}`}
        robots={service.seo_robots}
        keywords={service.seo_secondary_keywords}
        ogTitle={service.og_title}
        ogDescription={service.og_description}
        ogImage={service.og_image}
        ogType="website"
        schema={schemas}
      />
      
      <Header />
      
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm font-mono text-gray-400">
            <Link to="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/#services" className="hover:text-accent transition-colors">Hizmetler</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">{service.name}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
              <Brain className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-mono">{service.category.toUpperCase()}</span>
            </div>
            
            <h1 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] mb-6">
              {service.hero_h1 || service.name}
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl font-mono mb-8 max-w-3xl">
              {service.hero_summary}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={scrollToContact}
                className="group flex items-center gap-3 bg-accent text-dark font-mono font-bold px-8 py-4 hover:bg-white transition-all"
              >
                {service.primary_cta_label || 'Teklif Al'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              {service.secondary_cta_label && (
                <a 
                  href={service.secondary_cta_url || '#'}
                  className="flex items-center gap-3 border border-white/30 text-white font-mono px-8 py-4 hover:bg-white hover:text-dark transition-all"
                >
                  {service.secondary_cta_label}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="px-6 md:px-12 py-16 bg-dark-light/30">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="bg-dark-light/50 border border-dark-lighter p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-pixel text-sm">!</span>
                </div>
                <h2 className="font-pixel text-white text-lg">PROBLEM</h2>
              </div>
              <div 
                className="text-gray-400 font-mono text-sm leading-relaxed prose prose-invert"
                dangerouslySetInnerHTML={{ __html: service.problem_block }}
              />
            </div>
            
            {/* Solution */}
            <div className="bg-dark-light/50 border border-accent/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <h2 className="font-pixel text-accent text-lg">ÇÖZÜM</h2>
              </div>
              <div 
                className="text-gray-300 font-mono text-sm leading-relaxed prose prose-invert"
                dangerouslySetInnerHTML={{ __html: service.solution_block }}
              />
            </div>
          </div>
        </section>

        {/* Process Steps */}
        {service.process_steps?.length > 0 && (
          <section className="px-6 md:px-12 py-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-pixel text-white text-2xl md:text-3xl mb-12 text-center">
                <span className="text-accent">S</span>ÜREÇ
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {service.process_steps.map((step, index) => (
                  <div key={index} className="relative bg-dark-light/50 border border-dark-lighter p-6">
                    <div className="absolute -top-4 left-6 w-8 h-8 bg-accent flex items-center justify-center font-pixel text-dark text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="font-mono text-white font-bold mt-4 mb-2">{step.title}</h3>
                    <p className="text-gray-400 font-mono text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Deliverables & KPIs */}
        <section className="px-6 md:px-12 py-16 bg-dark-light/30">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Deliverables */}
            {service.deliverables?.length > 0 && (
              <div>
                <h2 className="font-pixel text-white text-xl mb-6 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-accent" />
                  TESLİMATLAR
                </h2>
                <ul className="space-y-3">
                  {service.deliverables.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300 font-mono text-sm">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* KPIs */}
            {service.kpi_outcomes?.length > 0 && (
              <div>
                <h2 className="font-pixel text-white text-xl mb-6 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  BEKLENEN SONUÇLAR
                </h2>
                <div className="space-y-4">
                  {service.kpi_outcomes.map((kpi, index) => (
                    <div key={index} className="bg-dark-light/50 border border-dark-lighter p-4">
                      <div className="font-pixel text-accent text-xl mb-1">{kpi.value}</div>
                      <div className="text-gray-400 font-mono text-sm">{kpi.metric_name}</div>
                      {kpi.note && <div className="text-gray-500 font-mono text-xs mt-1">{kpi.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        {service.seo_schema_faq_enabled && service.seo_schema_faq_items?.length > 0 && (
          <section className="px-6 md:px-12 py-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-pixel text-white text-2xl mb-8 text-center">
                <span className="text-accent">S</span>IK SORULAN SORULAR
              </h2>
              <div className="space-y-4">
                {service.seo_schema_faq_items.map((faq, index) => (
                  <details key={index} className="group bg-dark-light/50 border border-dark-lighter">
                    <summary className="p-6 cursor-pointer font-mono text-white hover:text-accent transition-colors">
                      {faq.question}
                    </summary>
                    <div className="px-6 pb-6 text-gray-400 font-mono text-sm">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Blog Posts */}
        {relatedPosts.length > 0 && (
          <section className="px-6 md:px-12 py-16 bg-dark-light/30">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-pixel text-white text-2xl mb-8">
                <span className="text-accent">İ</span>LGİLİ İÇERİKLER
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/blog/${post.seo_slug}`}
                    className="group bg-dark-light/50 border border-dark-lighter p-6 hover:border-accent/50 transition-all"
                  >
                    <span className="text-accent text-xs font-mono mb-2 block">
                      {post.intent_type?.toUpperCase()}
                    </span>
                    <h3 className="font-mono text-white font-bold mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section id="contact" className="px-6 md:px-12 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-pixel text-white text-2xl md:text-3xl mb-6">
              <span className="text-accent">B</span>AŞLAYALIM MI?
            </h2>
            <p className="text-gray-400 font-mono mb-8">
              {service.name} hizmeti hakkında detaylı bilgi ve özel teklif için bizimle iletişime geçin.
            </p>
            <Link 
              to="/#contact"
              className="inline-flex items-center gap-3 bg-accent text-dark font-mono font-bold px-10 py-4 hover:bg-white transition-all"
            >
              ÜCRETSİZ STRATEJİ GÖRÜŞMESİ
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServicePage;
