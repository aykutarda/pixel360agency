import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import BlogPage from './pages/BlogPage';
import HubPage from './pages/HubPage';

// Admin imports
import { AuthProvider, useAuth } from './admin/AuthContext';
import LoginPage from './admin/pages/LoginPage';
import ChangePasswordPage from './admin/pages/ChangePasswordPage';
import DashboardPage from './admin/pages/DashboardPage';
import ServicesListPage from './admin/pages/ServicesListPage';
import ServiceEditPage from './admin/pages/ServiceEditPage';
import BlogListPage from './admin/pages/BlogListPage';
import HubsListPage from './admin/pages/HubsListPage';
import SiteContentPage from './admin/pages/SiteContentPage';

// Admin route wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, mustChangePassword } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c8ff00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  if (mustChangePassword) {
    return <ChangePasswordPage />;
  }
  
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/hizmetler/:slug" element={<ServicePage />} />
              <Route path="/blog/:slug" element={<BlogPage />} />
              <Route path="/konular/:slug" element={<HubPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><DashboardPage /></AdminRoute>} />
              <Route path="/admin/services" element={<AdminRoute><ServicesListPage /></AdminRoute>} />
              <Route path="/admin/services/:id" element={<AdminRoute><ServiceEditPage /></AdminRoute>} />
              <Route path="/admin/blog" element={<AdminRoute><BlogListPage /></AdminRoute>} />
              <Route path="/admin/hubs" element={<AdminRoute><HubsListPage /></AdminRoute>} />
              <Route path="/admin/site-content" element={<AdminRoute><SiteContentPage /></AdminRoute>} />
              
              {/* Fallback */}
              <Route path="/*" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
