import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHubBySlug, getBlogPosts, getServices } from '../api/cms';
import SEOHead, { generateFAQSchema, generateBreadcrumbSchema } from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronRight, ArrowRight, BookOpen, Zap, FileText } from 'lucide-react';

const HubPage = () => {
  const { slug } = useParams();
  const [hub, setHub] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const hubData = await getHubBySlug(slug);
      setHub(hubData);
      
      if (hubData) {
        // Fetch related posts
        const posts = await getBlogPosts({ hub_id: hubData.id });
        setRelatedPosts(posts);
        
        // Fetch related services
        const services = await getServices();
        const related = services.filter(s => hubData.featured_service_ids?.includes(s.id));
        setRelatedServices(related);
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
        <div className="text-center">
          <h1 className="font-pixel text-white text-2xl mb-4">Sayfa Bulunamadı</h1>
          <Link to="/" className="text-accent hover:underline">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": hub.title,
      "description": hub.seo_description,
      "url": `https://pixel360.com.tr/konular/${hub.seo_slug}`
    },
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: 'https://pixel360.com.tr' },
      { name: 'Konular', url: 'https://pixel360.com.tr/konular' },
      { name: hub.title, url: `https://pixel360.com.tr/konular/${hub.seo_slug}` }
    ])
  ];
  
  if (hub.seo_schema_faq_enabled && hub.seo_schema_faq_items?.length > 0) {
    schemas.push(generateFAQSchema(hub.seo_schema_faq_items));
  }

  return (
    <div className="min-h-screen bg-dark">
      <SEOHead
        title={hub.seo_title || hub.title}
        description={hub.seo_description || hub.intro?.replace(/<[^>]*>/g, '').slice(0, 160)}
        canonical={`https://pixel360.com.tr/konular/${hub.seo_slug}`}
        robots={hub.seo_robots}
        keywords={[hub.primary_keyword, ...hub.secondary_keywords]}
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
            <span className="text-accent">{hub.title}</span>
          </nav>
        </div>

        {/* Hero */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-2 mb-6">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-mono">KONU REHBERİ</span>
            </div>
            
            <h1 className="font-pixel text-white text-[32px] md:text-[48px] lg:text-[56px] leading-[1.1] mb-6">
              {hub.title}
            </h1>
            
            <div 
              className="text-gray-400 text-lg font-mono leading-relaxed max-w-3xl prose prose-invert"
              dangerouslySetInnerHTML={{ __html: hub.intro }}
            />

            {/* Keywords */}
            <div className="flex flex-wrap gap-2 mt-8">
              <span className="bg-accent text-dark font-mono text-sm px-4 py-2 font-bold">
                {hub.primary_keyword}
              </span>
              {hub.secondary_keywords?.map((kw, index) => (
                <span key={index} className="bg-dark-light text-gray-400 font-mono text-sm px-4 py-2 border border-dark-lighter">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Related Service */}
        {relatedServices.length > 0 && (
          <section className="px-6 md:px-12 py-12 bg-dark-light/30">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-pixel text-white text-2xl mb-8 flex items-center gap-3">
                <Zap className="w-6 h-6 text-accent" />
                İLGİLİ HİZMET
              </h2>
              {relatedServices.map((service) => (
                <div key={service.id} className="bg-dark-light/50 border border-accent/30 p-8">
                  <h3 className="font-pixel text-accent text-xl mb-4">{service.name}</h3>
                  <p className="text-gray-400 font-mono mb-6">{service.hero_summary}</p>
                  <Link 
                    to={`/hizmetler/${service.seo_slug}`}
                    className="inline-flex items-center gap-2 bg-accent text-dark font-mono font-bold px-6 py-3 hover:bg-white transition-all"
                  >
                    HİZMET DETAYLARI
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Blog Posts */}
        {relatedPosts.length > 0 && (
          <section className="px-6 md:px-12 py-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-pixel text-white text-2xl mb-8 flex items-center gap-3">
                <FileText className="w-6 h-6 text-accent" />
                {hub.title} HAKKINDA YAZILAR
                <span className="text-gray-500 font-mono text-sm">({relatedPosts.length})</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/blog/${post.seo_slug}`}
                    className="group bg-dark-light/50 border border-dark-lighter p-6 hover:border-accent/50 transition-all"
                  >
                    <span className="text-accent text-xs font-mono mb-2 block">
                      {post.intent_type?.toUpperCase()}
                    </span>
                    <h3 className="font-mono text-white font-bold text-lg mb-3 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="text-accent font-mono text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

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
            <h2 className="font-pixel text-white text-2xl mb-4">
              <span className="text-accent">U</span>ZMAN DESTEĞİ ALIN
            </h2>
            <p className="text-gray-400 font-mono mb-8">
              {hub.title} konusunda profesyonel destek almak için bizimle iletişime geçin.
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

export default HubPage;
