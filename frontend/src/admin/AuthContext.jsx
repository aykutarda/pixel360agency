import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from './api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setMustChangePassword(userData.must_change_password);
    } catch (error) {
      localStorage.removeItem('admin_token');
    } finally {
      setLoading(false);
    }
  };

  const login = (token, mustChange = false) => {
    localStorage.setItem('admin_token', token);
    setMustChangePassword(mustChange);
    checkAuth();
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setMustChangePassword(false);
  };

  const passwordChanged = () => {
    setMustChangePassword(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      mustChangePassword, 
      passwordChanged,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
