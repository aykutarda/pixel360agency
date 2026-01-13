import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostBySlug, getBlogPosts, getServiceBySlug } from '../api/cms';
import SEOHead, { generateArticleSchema, generateBreadcrumbSchema } from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronRight, Calendar, Clock, Tag, ArrowRight, User } from 'lucide-react';

const BlogPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [relatedService, setRelatedService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const postData = await getBlogPostBySlug(slug);
      setPost(postData);
      
      if (postData) {
        // Fetch related posts from same hub or category
        const posts = await getBlogPosts({ 
          hub_id: postData.belongs_to_hub_id,
          limit: 4 
        });
        setRelatedPosts(posts.filter(p => p.id !== postData.id).slice(0, 3));
        
        // Fetch related service if exists
        if (postData.supports_service_id) {
          const allServices = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cms/services`).then(r => r.json());
          const service = allServices.find(s => s.id === postData.supports_service_id);
          setRelatedService(service);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-pixel text-white text-2xl mb-4">Sayfa Bulunamadı</h1>
          <Link to="/" className="text-accent hover:underline">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  // Generate schemas
  const schemas = [
    generateArticleSchema(post),
    generateBreadcrumbSchema([
      { name: 'Ana Sayfa', url: 'https://pixel360.com.tr' },
      { name: 'Blog', url: 'https://pixel360.com.tr/blog' },
      { name: post.title, url: `https://pixel360.com.tr/blog/${post.seo_slug}` }
    ])
  ];

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Estimate reading time (rough estimate: 200 words per minute)
  const estimateReadingTime = (content) => {
    const text = content?.replace(/<[^>]*>/g, '') || '';
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
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
          <nav className="flex items-center gap-2 text-sm font-mono text-gray-400 max-w-4xl mx-auto">
            <Link to="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-accent transition-colors">Blog</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-accent truncate max-w-[200px]">{post.title}</span>
          </nav>
        </div>

        {/* Article Header */}
        <article className="px-6 md:px-12 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Category/Intent Badge */}
            <div className="flex items-center gap-3 mb-6">
              {post.intent_type && (
                <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-3 py-1 text-accent text-xs font-mono uppercase">
                  {post.intent_type}
                </span>
              )}
              {post.tags?.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-gray-500 text-xs font-mono">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="font-pixel text-white text-[28px] md:text-[40px] lg:text-[48px] leading-[1.1] mb-6">
              {post.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-gray-400 text-lg md:text-xl font-mono mb-8 border-l-4 border-accent pl-4">
              {post.excerpt}
            </p>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm font-mono mb-8 pb-8 border-b border-dark-lighter">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{estimateReadingTime(post.content)} dk okuma</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Pixel360 Ekibi</span>
              </div>
            </div>

            {/* Cover Image */}
            {post.cover_image && (
              <div className="mb-12">
                <img 
                  src={post.cover_image} 
                  alt={post.cover_image_alt || post.title}
                  className="w-full h-auto rounded-none border border-dark-lighter"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-pixel prose-headings:text-white
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-300 prose-p:font-mono prose-p:text-base prose-p:leading-relaxed
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-gray-300 prose-ul:font-mono
                prose-ol:text-gray-300 prose-ol:font-mono
                prose-li:marker:text-accent
                prose-blockquote:border-accent prose-blockquote:text-gray-400 prose-blockquote:italic
                prose-code:text-accent prose-code:bg-dark-light prose-code:px-2 prose-code:py-1
                prose-pre:bg-dark-light prose-pre:border prose-pre:border-dark-lighter"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-dark-lighter">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-500 text-sm font-mono">Etiketler:</span>
                  {post.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="text-xs font-mono bg-dark-light text-gray-400 px-3 py-1 border border-dark-lighter hover:border-accent/30 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Service CTA */}
        {relatedService && (
          <section className="px-6 md:px-12 py-12 bg-dark-light/30">
            <div className="max-w-4xl mx-auto">
              <div className="bg-dark-light/50 border border-accent/30 p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <span className="text-accent text-xs font-mono mb-2 block">İLGİLİ HİZMET</span>
                    <h3 className="font-pixel text-white text-xl mb-2">{relatedService.name}</h3>
                    <p className="text-gray-400 font-mono text-sm">{relatedService.hero_summary?.slice(0, 120)}...</p>
                  </div>
                  <Link 
                    to={`/hizmetler/${relatedService.seo_slug}`}
                    className="inline-flex items-center gap-3 bg-accent text-dark font-mono font-bold px-6 py-3 hover:bg-white transition-all whitespace-nowrap"
                  >
                    Hizmeti İncele
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="px-6 md:px-12 py-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-pixel text-white text-2xl mb-8">
                <span className="text-accent">İ</span>LGİLİ YAZILAR
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relPost) => (
                  <Link 
                    key={relPost.id}
                    to={`/blog/${relPost.seo_slug}`}
                    className="group bg-dark-light/50 border border-dark-lighter p-6 hover:border-accent/50 transition-all"
                  >
                    <span className="text-accent text-xs font-mono mb-2 block uppercase">
                      {relPost.intent_type}
                    </span>
                    <h3 className="font-mono text-white font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {relPost.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm line-clamp-2">
                      {relPost.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs font-mono">
                      <Calendar className="w-3 h-3" />
                      {formatDate(relPost.created_at)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-6 md:px-12 py-16 bg-dark-light/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-pixel text-white text-2xl md:text-3xl mb-6">
              <span className="text-accent">D</span>AHA FAZLASI İÇİN
            </h2>
            <p className="text-gray-400 font-mono mb-8">
              Dijital pazarlama hakkında daha fazla bilgi almak ve markanızı büyütmek için bizimle iletişime geçin.
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

export default BlogPage;
