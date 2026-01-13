import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { getServices, deleteService } from '../api';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Palette,
  Target,
  Search as SearchIcon,
  Users,
  Video
} from 'lucide-react';

// Category Badge Component
const CategoryBadge = ({ category }) => {
  const config = {
    performance: { 
      label: 'Performance', 
      color: 'bg-red-500/20 text-red-400 border-red-500/30',
      icon: TrendingUp
    },
    creative: { 
      label: 'Creative', 
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: Palette
    },
    strategy: { 
      label: 'Strategy', 
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      icon: Target
    },
    seo: { 
      label: 'SEO', 
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
      icon: SearchIcon
    },
    social: { 
      label: 'Social', 
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      icon: Users
    },
    production: { 
      label: 'Production', 
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      icon: Video
    }
  };
  
  const { label, color, icon: Icon } = config[category] || { 
    label: category || 'Other', 
    color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: AlertCircle
  };
  
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 border ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const ServicesListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    
    try {
      await deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
                         service.seo_slug.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || service.status === filter;
    return matchesSearch && matchesFilter;
  });

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Hizmetler</h1>
            <p className="text-gray-500 mt-1">{services.length} hizmet</p>
          </div>
          <Link
            to="/admin/services/new"
            className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 font-medium hover:bg-white transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Hizmet
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ara..."
              className="w-full bg-[#111] border border-[#222] text-white pl-10 pr-4 py-2 focus:border-[#c8ff00] focus:outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#111] border border-[#222] text-white px-4 py-2 focus:border-[#c8ff00] focus:outline-none"
          >
            <option value="all">Tümü</option>
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#111] border border-[#222] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#222]">
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Hizmet</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Kategori</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Durum</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Slug</th>
                <th className="text-right text-gray-400 text-sm font-medium px-4 py-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">Hizmet bulunamadı</p>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                    <td className="px-4 py-4">
                      <p className="text-white font-medium">{service.name}</p>
                      <p className="text-gray-500 text-sm truncate max-w-xs">{service.hero_summary?.slice(0, 60)}...</p>
                    </td>
                    <td className="px-4 py-4">
                      <CategoryBadge category={service.category} />
                    </td>
                    <td className="px-4 py-4">
                      <span className={`flex items-center gap-1 text-xs ${
                        service.status === 'published' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {service.status === 'published' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {service.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-gray-400 text-sm">/hizmetler/{service.seo_slug}</code>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/hizmetler/${service.seo_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/admin/services/${service.id}`}
                          className="p-2 text-gray-400 hover:text-[#c8ff00] hover:bg-[#222] transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#222] transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ServicesListPage;
