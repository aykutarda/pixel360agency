import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { getServices, getBlogPosts, getHubs, getRedirects } from '../api';
import { 
  FileText, 
  BookOpen, 
  Layers, 
  ArrowUpRight,
  Plus,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    services: { total: 0, published: 0 },
    blog: { total: 0, published: 0 },
    hubs: { total: 0, published: 0 },
    redirects: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [services, blogPosts, hubs, redirects] = await Promise.all([
        getServices(),
        getBlogPosts(),
        getHubs(),
        getRedirects()
      ]);

      setStats({
        services: {
          total: services.length,
          published: services.filter(s => s.status === 'published').length
        },
        blog: {
          total: blogPosts.length,
          published: blogPosts.filter(p => p.status === 'published').length
        },
        hubs: {
          total: hubs.length,
          published: hubs.filter(h => h.status === 'published').length
        },
        redirects: redirects.length
      });

      // Combine and sort by updated_at
      const allItems = [
        ...services.map(s => ({ ...s, type: 'service', url: `/admin/services/${s.id}` })),
        ...blogPosts.map(p => ({ ...p, type: 'blog', url: `/admin/blog/${p.id}` })),
        ...hubs.map(h => ({ ...h, type: 'hub', url: `/admin/hubs/${h.id}` }))
      ].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      setRecentItems(allItems.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    const labels = { service: 'Hizmet', blog: 'Blog', hub: 'Hub' };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = { 
      service: 'text-blue-400 bg-blue-400/10',
      blog: 'text-green-400 bg-green-400/10',
      hub: 'text-purple-400 bg-purple-400/10'
    };
    return colors[type] || 'text-gray-400 bg-gray-400/10';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#c8ff00] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 mt-1">İçerik yönetimi özeti</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/admin/services"
            className="bg-[#111] border border-[#222] p-6 hover:border-[#c8ff00]/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-blue-400" />
              <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-[#c8ff00] transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.services.total}</p>
            <p className="text-gray-500 text-sm mt-1">Hizmetler</p>
            <p className="text-xs text-gray-600 mt-2">{stats.services.published} yayında</p>
          </Link>

          <Link 
            to="/admin/blog"
            className="bg-[#111] border border-[#222] p-6 hover:border-[#c8ff00]/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="w-8 h-8 text-green-400" />
              <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-[#c8ff00] transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.blog.total}</p>
            <p className="text-gray-500 text-sm mt-1">Blog Yazıları</p>
            <p className="text-xs text-gray-600 mt-2">{stats.blog.published} yayında</p>
          </Link>

          <Link 
            to="/admin/hubs"
            className="bg-[#111] border border-[#222] p-6 hover:border-[#c8ff00]/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <Layers className="w-8 h-8 text-purple-400" />
              <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-[#c8ff00] transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.hubs.total}</p>
            <p className="text-gray-500 text-sm mt-1">Konu Merkezleri</p>
            <p className="text-xs text-gray-600 mt-2">{stats.hubs.published} yayında</p>
          </Link>

          <Link 
            to="/admin/settings"
            className="bg-[#111] border border-[#222] p-6 hover:border-[#c8ff00]/50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-[#c8ff00]" />
              <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-[#c8ff00] transition-colors" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.redirects}</p>
            <p className="text-gray-500 text-sm mt-1">301 Yönlendirmeler</p>
            <p className="text-xs text-gray-600 mt-2">SEO koruması</p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/services/new"
            className="flex items-center gap-4 bg-[#111] border border-[#222] p-4 hover:border-[#c8ff00]/50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-400/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Yeni Hizmet</p>
              <p className="text-gray-500 text-sm">Hizmet sayfası oluştur</p>
            </div>
          </Link>

          <Link
            to="/admin/blog/new"
            className="flex items-center gap-4 bg-[#111] border border-[#222] p-4 hover:border-[#c8ff00]/50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-400/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">Yeni Blog Yazısı</p>
              <p className="text-gray-500 text-sm">İçerik oluştur</p>
            </div>
          </Link>

          <Link
            to="/admin/site-content"
            className="flex items-center gap-4 bg-[#111] border border-[#222] p-4 hover:border-[#c8ff00]/50 transition-colors"
          >
            <div className="w-10 h-10 bg-[#c8ff00]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#c8ff00]" />
            </div>
            <div>
              <p className="text-white font-medium">Site İçeriği</p>
              <p className="text-gray-500 text-sm">Hero, footer düzenle</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111] border border-[#222]">
          <div className="p-4 border-b border-[#222]">
            <h2 className="text-lg font-semibold text-white">Son Güncellenen</h2>
          </div>
          <div className="divide-y divide-[#222]">
            {recentItems.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">Henüz içerik yok</p>
              </div>
            ) : (
              recentItems.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={item.url}
                  className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                    <div>
                      <p className="text-white">{item.name || item.title}</p>
                      <p className="text-gray-500 text-sm">/{item.seo_slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 ${item.status === 'published' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                      {item.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {formatDate(item.updated_at)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
