import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import ServicePage from './pages/ServicePage';
import BlogPage from './pages/BlogPage';
import HubPage from './pages/HubPage';

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/hizmetler/:slug" element={<ServicePage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/konular/:slug" element={<HubPage />} />
            <Route path="/*" element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
