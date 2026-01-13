import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts, getHubPages, getCategories } from '../api/cms';
import SEOHead, { generateBreadcrumbSchema } from '../components/SEOHead';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, ArrowRight, Filter, Tag } from 'lucide-react';

const BlogListPage = () => {
  const [posts, setPosts] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHub, setActiveHub] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [postsData, hubsData, catsData] = await Promise.all([
        getBlogPosts(),
        getHubPages(),
        getCategories()
      ]);
      setPosts(postsData);
      setHubs(hubsData);
      setCategories(catsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredPosts = activeHub 
    ? posts.filter(p => p.belongs_to_hub_id === activeHub)
    : posts;

  const schema = generateBreadcrumbSchema([
    { name: 'Ana Sayfa', url: 'https://pixel360.com.tr' },
    { name: 'Blog', url: 'https://pixel360.com.tr/blog' }
  ]);

  return (
    <div className="min-h-screen bg-dark">
      <SEOHead
        title="Blog | Dijital Pazarlama Rehberleri"
        description="Google Ads, Meta Ads, SEO ve dijital pazarlama hakkında uzman içerikler. Pixel360 ekibinden stratejik bilgiler ve pratik ipucları."
        canonical="https://pixel360.com.tr/blog"
        schema={schema}
      />
      
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-2 mb-6">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-mono">BLOG</span>
            </div>
            
            <h1 className="font-pixel text-white text-[32px] md:text-[48px] leading-[1.1] mb-6">
              <span className="text-accent">D</span>İJİTAL PAZARLAMA REHBERLERİ
            </h1>
            
            <p className="text-gray-400 text-lg font-mono max-w-2xl">
              Uzman ekibimizden stratejik bilgiler, pratik ipucları ve sektörel analizler.
            </p>
          </div>
        </section>

        {/* Hub Filters */}
        {hubs.length > 0 && (
          <section className="px-6 md:px-12 py-6 border-y border-dark-lighter">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 font-mono text-sm">KONUYA GÖRE FİLTRELE:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveHub(null)}
                  className={`font-mono text-sm px-4 py-2 border transition-all ${
                    !activeHub 
                      ? 'bg-accent text-dark border-accent' 
                      : 'text-gray-400 border-dark-lighter hover:border-accent/50'
                  }`}
                >
                  Tümü ({posts.length})
                </button>
                {hubs.map((hub) => {
                  const count = posts.filter(p => p.belongs_to_hub_id === hub.id).length;
                  return (
                    <button
                      key={hub.id}
                      onClick={() => setActiveHub(hub.id)}
                      className={`font-mono text-sm px-4 py-2 border transition-all ${
                        activeHub === hub.id 
                          ? 'bg-accent text-dark border-accent' 
                          : 'text-gray-400 border-dark-lighter hover:border-accent/50'
                      }`}
                    >
                      {hub.title} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="px-6 md:px-12 py-16">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 font-mono">Henüz içerik bulunmuyor.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/blog/${post.seo_slug}`}
                    className="group bg-dark-light/50 border border-dark-lighter hover:border-accent/50 transition-all duration-300"
                  >
                    {post.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.cover_image} 
                          alt={post.cover_image_alt || post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-accent text-xs font-mono">
                          {post.intent_type?.toUpperCase()}
                        </span>
                        {post.tags?.[0] && (
                          <span className="flex items-center gap-1 text-gray-500 text-xs font-mono">
                            <Tag className="w-3 h-3" />
                            {post.tags[0]}
                          </span>
                        )}
                      </div>
                      <h2 className="font-mono text-white font-bold text-lg mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 font-mono text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <span className="text-accent font-mono text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                        Devamını Oku
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Hub Links */}
        {hubs.length > 0 && (
          <section className="px-6 md:px-12 py-16 bg-dark-light/30">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-pixel text-white text-2xl mb-8">
                <span className="text-accent">K</span>ONU REHBERLERİ
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {hubs.map((hub) => (
                  <Link 
                    key={hub.id}
                    to={`/konular/${hub.seo_slug}`}
                    className="group bg-dark-light/50 border border-dark-lighter p-6 hover:border-purple-500/50 transition-all"
                  >
                    <h3 className="font-pixel text-white text-lg mb-3 group-hover:text-purple-400 transition-colors">
                      {hub.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm mb-4 line-clamp-2">
                      {hub.intro?.replace(/<[^>]*>/g, '').slice(0, 100)}...
                    </p>
                    <span className="text-purple-400 font-mono text-sm flex items-center gap-2">
                      Rehbere Git
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogListPage;
