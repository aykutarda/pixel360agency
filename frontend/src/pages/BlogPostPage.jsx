import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, getServiceBySlug, getHubBySlug } from '../api/cms';
import SEOHead, { generateArticleSchema, generateFAQSchema, generateBreadcrumbSchema } from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronRight, Calendar, Clock, Tag, ArrowRight, User } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedService, setRelatedService] = useState(null);
  const [relatedHub, setRelatedHub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const postData = await getBlogPostBySlug(slug);
      setPost(postData);
      
      if (postData?.supports_service_id) {
        // Fetch all services and find by ID
        const services = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cms/services`).then(r => r.json());
        const svc = services.find(s => s.id === postData.supports_service_id);
        setRelatedService(svc);
      }
      
      if (postData?.belongs_to_hub_id) {
        const hubs = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cms/hubs`).then(r => r.json());
        const hub = hubs.find(h => h.id === postData.belongs_to_hub_id);
        setRelatedHub(hub);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-pixel text-white text-2xl mb-4">Yazı Bulunamadı</h1>
          <Link to="/blog" className="text-accent hover:underline">Blog'a Dön</Link>
        </div>
      </div>
    );
  }

  const schemas = [
    generateArticleSchema(post),
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: 'https://pixel360.com.tr' },
      { name: 'Blog', url: 'https://pixel360.com.tr/blog' },
      { name: post.title, url: `https://pixel360.com.tr/blog/${post.seo_slug}` }
    ])
  ];
  
  if (post.seo_schema_faq_enabled && post.seo_schema_faq_items?.length > 0) {
    schemas.push(generateFAQSchema(post.seo_schema_faq_items));
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-dark">
      <SEOHead
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        canonical={`https://pixel360.com.tr/blog/${post.seo_slug}`}
        robots={post.seo_robots}
        keywords={post.seo_secondary_keywords}
        ogTitle={post.og_title}
        ogDescription={post.og_description}
        ogImage={post.og_image || post.cover_image}
        ogType="article"
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        schema={schemas}
      />
      
      <Header />
      
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm font-mono text-gray-400 flex-wrap">
            <Link to="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-accent transition-colors">Blog</Link>
            {relatedHub && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link to={`/konular/${relatedHub.seo_slug}`} className="hover:text-accent transition-colors">
                  {relatedHub.title}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>

        {/* Article Header */}
        <article className="px-6 md:px-12 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-gray-400 mb-6">
              <span className="bg-accent/10 text-accent px-3 py-1 border border-accent/30">
                {post.intent_type?.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Pixel360 Ekibi
              </span>
            </div>

            {/* Title */}
            <h1 className="font-pixel text-white text-[28px] md:text-[36px] lg:text-[42px] leading-[1.2] mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-gray-400 text-lg font-mono mb-8 border-l-4 border-accent pl-4">
              {post.excerpt}
            </p>

            {/* Cover Image */}
            {post.cover_image && (
              <div className="mb-8">
                <img 
                  src={post.cover_image} 
                  alt={post.cover_image_alt || post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="flex items-center gap-1 text-xs font-mono text-gray-400 bg-dark-light px-3 py-1 border border-dark-lighter"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-pixel prose-headings:text-white
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-300 prose-p:font-mono prose-p:leading-relaxed
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:font-mono"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* FAQ */}
            {post.seo_schema_faq_enabled && post.seo_schema_faq_items?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-dark-lighter">
                <h2 className="font-pixel text-white text-xl mb-6">
                  <span className="text-accent">S</span>IK SORULAN SORULAR
                </h2>
                <div className="space-y-4">
                  {post.seo_schema_faq_items.map((faq, index) => (
                    <details key={index} className="group bg-dark-light/50 border border-dark-lighter">
                      <summary className="p-4 cursor-pointer font-mono text-white hover:text-accent transition-colors">
                        {faq.question}
                      </summary>
                      <div className="px-4 pb-4 text-gray-400 font-mono text-sm">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Service CTA */}
        {relatedService && (
          <section className="px-6 md:px-12 py-12 bg-dark-light/30">
            <div className="max-w-3xl mx-auto">
              <div className="bg-accent/5 border border-accent/30 p-8">
                <span className="text-accent text-xs font-mono mb-2 block">İLGİLİ HİZMET</span>
                <h3 className="font-pixel text-white text-xl mb-4">{relatedService.name}</h3>
                <p className="text-gray-400 font-mono text-sm mb-6">{relatedService.hero_summary}</p>
                <Link 
                  to={`/hizmetler/${relatedService.seo_slug}`}
                  className="inline-flex items-center gap-2 bg-accent text-dark font-mono font-bold px-6 py-3 hover:bg-white transition-all"
                >
                  HİZMET DETAYLARI
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-pixel text-white text-2xl mb-4">
              <span className="text-accent">D</span>AHA FAZLA BİLGİ ALIN
            </h2>
            <p className="text-gray-400 font-mono mb-6">
              Dijital pazarlama stratejinizi güçlendirmek için uzman ekibimizle görüşün.
            </p>
            <Link 
              to="/#contact"
              className="inline-flex items-center gap-3 bg-accent text-dark font-mono font-bold px-8 py-4 hover:bg-white transition-all"
            >
              ÜCRETSİZ DANİŞMANLIK
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostPage;
