import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================
// AUTH
// ============================================

export const login = async (email, password) => {
  const response = await axios.post(`${API}/auth/login`, { email, password });
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await axios.post(
    `${API}/auth/change-password`,
    { current_password: currentPassword, new_password: newPassword },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API}/auth/me`, { headers: getAuthHeaders() });
  return response.data;
};

// ============================================
// SERVICES
// ============================================

export const getServices = async (status = null) => {
  const params = status ? { status } : {};
  const response = await axios.get(`${API}/cms/services`, { 
    params,
    headers: getAuthHeaders() 
  });
  return response.data;
};

export const getService = async (id) => {
  const response = await axios.get(`${API}/cms/services/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const createService = async (data) => {
  const response = await axios.post(`${API}/cms/services`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateService = async (id, data) => {
  const response = await axios.put(`${API}/cms/services/${id}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteService = async (id) => {
  const response = await axios.delete(`${API}/cms/services/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

// ============================================
// BLOG POSTS
// ============================================

export const getBlogPosts = async (status = null) => {
  const params = status ? { status } : {};
  const response = await axios.get(`${API}/cms/blog`, { 
    params,
    headers: getAuthHeaders() 
  });
  return response.data;
};

export const getBlogPost = async (id) => {
  const response = await axios.get(`${API}/cms/blog/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const createBlogPost = async (data) => {
  const response = await axios.post(`${API}/cms/blog`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateBlogPost = async (id, data) => {
  const response = await axios.put(`${API}/cms/blog/${id}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteBlogPost = async (id) => {
  const response = await axios.delete(`${API}/cms/blog/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

// ============================================
// HUB PAGES
// ============================================

export const getHubs = async (status = null) => {
  const params = status ? { status } : {};
  const response = await axios.get(`${API}/cms/hubs`, { 
    params,
    headers: getAuthHeaders() 
  });
  return response.data;
};

export const getHub = async (id) => {
  const response = await axios.get(`${API}/cms/hubs/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

export const createHub = async (data) => {
  const response = await axios.post(`${API}/cms/hubs`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const updateHub = async (id, data) => {
  const response = await axios.put(`${API}/cms/hubs/${id}`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteHub = async (id) => {
  const response = await axios.delete(`${API}/cms/hubs/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

// ============================================
// SITE SECTIONS
// ============================================

export const getSiteSections = async () => {
  const response = await axios.get(`${API}/site/sections`);
  return response.data;
};

export const getSiteSection = async (key) => {
  const response = await axios.get(`${API}/site/sections/${key}`);
  return response.data;
};

export const updateSiteSection = async (key, payload) => {
  const response = await axios.put(
    `${API}/site/sections/${key}`,
    payload,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const seedSiteSections = async () => {
  const response = await axios.post(
    `${API}/site/sections/seed`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// ============================================
// REDIRECTS
// ============================================

export const getRedirects = async () => {
  const response = await axios.get(`${API}/cms/redirects`, { headers: getAuthHeaders() });
  return response.data;
};

export const createRedirect = async (data) => {
  const response = await axios.post(`${API}/cms/redirects`, data, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteRedirect = async (id) => {
  const response = await axios.delete(`${API}/cms/redirects/${id}`, { headers: getAuthHeaders() });
  return response.data;
};

// ============================================
// SETTINGS
// ============================================

export const getSettings = async () => {
  const response = await axios.get(`${API}/cms/settings`, { headers: getAuthHeaders() });
  return response.data;
};

export const updateSettings = async (data) => {
  const response = await axios.put(`${API}/cms/settings`, data, { headers: getAuthHeaders() });
  return response.data;
};
