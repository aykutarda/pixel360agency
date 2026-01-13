import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Layers,
  Settings,
  Globe,
  ArrowUpRight,
  LogOut,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Hizmetler', href: '/admin/services', icon: FileText },
    { name: 'Blog Yazıları', href: '/admin/blog', icon: BookOpen },
    { name: 'Konu Merkezleri', href: '/admin/hubs', icon: Layers },
    { name: 'Site İçeriği', href: '/admin/site-content', icon: Globe },
    { name: 'Measurement', href: '/admin/measurement', icon: BarChart3 },
    { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href) => {
    if (href === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-[#222] transform transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#222]">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">
                <span className="text-[#c8ff00]">P</span>IXEL360
              </span>
              <span className="text-xs text-gray-500 bg-[#222] px-2 py-0.5">ADMIN</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    active
                      ? 'bg-[#c8ff00]/10 text-[#c8ff00] border-l-2 border-[#c8ff00]'
                      : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Preview Link */}
          <div className="p-4 border-t border-[#222]">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-colors"
            >
              <ArrowUpRight className="w-5 h-5" />
              Siteyi Görüntüle
            </a>
          </div>

          {/* User */}
          <div className="p-4 border-t border-[#222]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c8ff00]/20 flex items-center justify-center text-[#c8ff00] text-sm font-semibold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-sm text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#111] border border-[#222] lg:hidden"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Unsaved changes warning */}
        {hasUnsavedChanges && (
          <div className="sticky top-0 z-40 bg-yellow-500/10 border-b border-yellow-500/30 px-6 py-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 text-sm">Kaydedilmemiş değişiklikler var</span>
          </div>
        )}

        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
