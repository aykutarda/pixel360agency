import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { changePassword } from '../api';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

const ChangePasswordPage = () => {
  const { passwordChanged, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor');
      return;
    }

    if (newPassword.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır');
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      passwordChanged();
    } catch (err) {
      const message = err.response?.data?.detail || 'Şifre değiştirme başarısız';
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

        {/* Change Password Form */}
        <div className="bg-[#111] border border-[#222] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#c8ff00]/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#c8ff00]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Şifre Değiştir</h2>
              <p className="text-gray-500 text-sm">İlk girişte şifre değişikliği zorunludur</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Mevcut Şifre</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Yeni Şifre</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none transition-colors"
                placeholder="En az 8 karakter"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={logout}
                className="flex-1 border border-[#333] text-gray-400 font-semibold py-3 hover:bg-[#222] transition-colors"
              >
                Çıkış Yap
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#c8ff00] text-black font-semibold py-3 hover:bg-white transition-colors disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
