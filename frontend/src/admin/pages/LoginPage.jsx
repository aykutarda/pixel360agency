import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { login as apiLogin } from '../api';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiLogin(email, password);
      login(data.access_token, data.must_change_password);
    } catch (err) {
      const message = err.response?.data?.detail || 'Giriş başarısız';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            <span className="text-[#c8ff00]">P</span>IXEL360
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#111] border border-[#222] p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Giriş Yap</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-2">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white pl-11 pr-4 py-3 focus:border-[#c8ff00] focus:outline-none transition-colors"
                  placeholder="admin@pixel360.com.tr"
                  required
                  data-testid="login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white pl-11 pr-12 py-3 focus:border-[#c8ff00] focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8ff00] text-black font-semibold py-3 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-submit"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2024 Pixel360. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
