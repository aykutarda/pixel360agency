import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { getHubs, deleteHub } from '../api';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const HubsListPage = () => {
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadHubs();
  }, []);

  const loadHubs = async () => {
    try {
      const data = await getHubs();
      setHubs(data);
    } catch (error) {
      console.error('Error loading hubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu hub\'ı silmek istediğinizden emin misiniz?')) return;
    
    try {
      await deleteHub(id);
      setHubs(hubs.filter(h => h.id !== id));
    } catch (error) {
      console.error('Error deleting hub:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const filteredHubs = hubs.filter(hub => {
    const matchesSearch = hub.title.toLowerCase().includes(search.toLowerCase()) ||
                         hub.seo_slug.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || hub.status === filter;
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
            <h1 className="text-2xl font-bold text-white">Konu Merkezleri</h1>
            <p className="text-gray-500 mt-1">{hubs.length} hub</p>
          </div>
          <Link
            to="/admin/hubs/new"
            className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 font-medium hover:bg-white transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Hub
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
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Hub</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Anahtar Kelime</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Durum</th>
                <th className="text-left text-gray-400 text-sm font-medium px-4 py-3">Slug</th>
                <th className="text-right text-gray-400 text-sm font-medium px-4 py-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredHubs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">Hub bulunamadı</p>
                  </td>
                </tr>
              ) : (
                filteredHubs.map((hub) => (
                  <tr key={hub.id} className="border-b border-[#222] hover:bg-[#1a1a1a]">
                    <td className="px-4 py-4">
                      <p className="text-white font-medium">{hub.title}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs px-2 py-1 bg-[#c8ff00]/10 text-[#c8ff00]">
                        {hub.primary_keyword || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`flex items-center gap-1 text-xs ${
                        hub.status === 'published' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {hub.status === 'published' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        {hub.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-gray-400 text-sm">/konular/{hub.seo_slug}</code>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/konular/${hub.seo_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/admin/hubs/${hub.id}`}
                          className="p-2 text-gray-400 hover:text-[#c8ff00] hover:bg-[#222] transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(hub.id)}
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

export default HubsListPage;
