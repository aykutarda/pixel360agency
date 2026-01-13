import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ============================================
// SERVICES
// ============================================

export const getServices = async (status = 'published') => {
  try {
    const response = await axios.get(`${API}/cms/services`, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const getServiceBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API}/cms/services/by-slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
};

// ============================================
// BLOG POSTS
// ============================================

export const getBlogPosts = async (params = {}) => {
  try {
    const response = await axios.get(`${API}/cms/blog`, {
      params: { status: 'published', ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const getBlogPostBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API}/cms/blog/by-slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
};

// ============================================
// HUB PAGES
// ============================================

export const getHubPages = async (status = 'published') => {
  try {
    const response = await axios.get(`${API}/cms/hubs`, {
      params: { status }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hubs:', error);
    return [];
  }
};

export const getHubBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API}/cms/hubs/by-slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hub:', error);
    return null;
  }
};

// ============================================
// REDIRECTS
// ============================================

export const checkRedirect = async (path) => {
  try {
    const response = await axios.get(`${API}/cms/redirects/check`, {
      params: { path }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking redirect:', error);
    return { has_redirect: false };
  }
};

// ============================================
// SETTINGS
// ============================================

export const getSettings = async () => {
  try {
    const response = await axios.get(`${API}/cms/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

// ============================================
// AUTHORS & CATEGORIES
// ============================================

export const getAuthors = async () => {
  try {
    const response = await axios.get(`${API}/cms/authors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API}/cms/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
