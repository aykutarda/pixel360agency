import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHubBySlug, getBlogPosts, getServices } from '../api/cms';
import SEOHead, { generateBreadcrumbSchema, generateFAQSchema } from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronRight, ArrowRight, BookOpen, Zap, Tag, Calendar } from 'lucide-react';

const HubPage = () => {
  const { slug } = useParams();
  const [hub, setHub] = useState(null);
  const [posts, setPosts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const hubData = await getHubBySlug(slug);
      setHub(hubData);
      
      if (hubData) {
        // Fetch posts belonging to this hub
        const hubPosts = await getBlogPosts({ hub_id: hubData.id });
        setPosts(hubPosts);
        
        // Fetch featured services
        if (hubData.featured_service_ids?.length > 0) {
          const allServices = await getServices();
          const featuredServices = allServices.filter(s => 
            hubData.featured_service_ids.includes(s.id)
          );
          setServices(featuredServices);
        }
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

  if (!hub) {
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
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: 'https://pixel360.com.tr' },
      { name: 'Konular', url: 'https://pixel360.com.tr/konular' },
      { name: hub.title, url: `https://pixel360.com.tr/konular/${hub.seo_slug}` }
    ])
  ];
  
  if (hub.seo_schema_faq_enabled && hub.seo_schema_faq_items?.length > 0) {
    schemas.push(generateFAQSchema(hub.seo_schema_faq_items));
  }

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Group posts by intent type
  const groupedPosts = posts.reduce((acc, post) => {
    const intent = post.intent_type || 'informational';
    if (!acc[intent]) acc[intent] = [];
    acc[intent].push(post);
    return acc;
  }, {});

  const intentLabels = {
    informational: 'Bilgi Yazıları',
    commercial: 'Karşılaştırma & Değerlendirme',
    transactional: 'Uygulama Rehberleri',
    navigational: 'Araç & Kaynak'
  };

  return (
    <div className="min-h-screen bg-dark">
      <SEOHead
        title={hub.seo_title || hub.title}
        description={hub.seo_description}
        canonical={`https://pixel360.com.tr/konular/${hub.seo_slug}`}
        robots={hub.seo_robots}
        keywords={hub.seo_secondary_keywords}
        ogTitle={hub.og_title}
        ogDescription={hub.og_description}
        ogImage={hub.og_image}
        schema={schemas}
      />
      
      <Header />
      
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm font-mono text-gray-400">
            <Link to="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-accent transition-colors">Konular</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent">{hub.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-mono">KONU MERKEZİ</span>
            </div>
            
            <h1 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] mb-6">
              {hub.title}
            </h1>
            
            <div 
              className="text-gray-400 text-lg md:text-xl font-mono mb-8 max-w-3xl prose prose-invert prose-p:text-gray-400"
              dangerouslySetInnerHTML={{ __html: hub.intro }}
            />
            
            {/* Keywords */}
            <div className="flex flex-wrap gap-2">
              {hub.primary_keyword && (
                <span className="text-xs font-mono bg-accent/20 text-accent px-3 py-1 border border-accent/30">
                  {hub.primary_keyword}
                </span>
              )}
              {hub.secondary_keywords?.map((keyword, idx) => (
                <span 
                  key={idx}
                  className="text-xs font-mono bg-dark-light text-gray-400 px-3 py-1 border border-dark-lighter"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        {services.length > 0 && (
          <section className="px-6 md:px-12 py-12 bg-dark-light/30">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-pixel text-white text-xl mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-accent" />
                İLGİLİ HİZMETLER
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Link 
                    key={service.id}
                    to={`/hizmetler/${service.seo_slug}`}
                    className="group bg-dark-light/50 border border-dark-lighter p-6 hover:border-accent/50 transition-all"
                  >
                    <span className="text-accent text-xs font-mono mb-2 block uppercase">
                      {service.category}
                    </span>
                    <h3 className="font-pixel text-white text-lg mb-2 group-hover:text-accent transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm line-clamp-2 mb-4">
                      {service.hero_summary}
                    </p>
                    <div className="flex items-center gap-2 text-accent text-sm font-mono">
                      <span>Hizmeti İncele</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Posts by Intent */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-pixel text-white text-2xl md:text-3xl mb-12">
              <span className="text-accent">İ</span>ÇERİKLER
            </h2>
            
            {Object.entries(groupedPosts).map(([intent, intentPosts]) => (
              <div key={intent} className="mb-12">
                <h3 className="font-mono text-accent text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {intentLabels[intent] || intent}
                  <span className="text-gray-500">({intentPosts.length})</span>
                </h3>
                
                <div className="grid gap-4">
                  {intentPosts.map((post) => (
                    <Link 
                      key={post.id}
                      to={`/blog/${post.seo_slug}`}
                      className="group bg-dark-light/30 border border-dark-lighter p-6 hover:border-accent/50 transition-all flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <div className="flex-grow">
                        <h4 className="font-mono text-white font-bold mb-2 group-hover:text-accent transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-gray-400 font-mono text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 text-xs font-mono shrink-0">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.created_at)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-mono">Bu konuda henüz içerik bulunmuyor.</p>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        {hub.seo_schema_faq_enabled && hub.seo_schema_faq_items?.length > 0 && (
          <section className="px-6 md:px-12 py-16 bg-dark-light/30">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-pixel text-white text-2xl mb-8 text-center">
                <span className="text-accent">S</span>IK SORULAN SORULAR
              </h2>
              <div className="space-y-4">
                {hub.seo_schema_faq_items.map((faq, index) => (
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

        {/* CTA */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-pixel text-white text-2xl md:text-3xl mb-6">
              <span className="text-accent">U</span>ZMAN DESTEĞİ ALIN
            </h2>
            <p className="text-gray-400 font-mono mb-8">
              {hub.title} hakkında detaylı bilgi ve profesyonel destek için uzman ekibimizle görüşün.
            </p>
            <Link 
              to="/#contact"
              className="inline-flex items-center gap-3 bg-accent text-dark font-mono font-bold px-10 py-4 hover:bg-white transition-all"
            >
              ÜCRETSİZ DANIŞMANLIK
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HubPage;
