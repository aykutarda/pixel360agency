import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { getService, createService, updateService } from '../api';
import { 
  Save, 
  ArrowLeft, 
  Eye,
  AlertCircle,
  ChevronDown,
  Plus,
  Trash2,
  Info,
  Send
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import PublishGuardModal, { validatePublish } from '../components/PublishGuard';
import ChangeLog from '../components/ChangeLog';

const ServiceEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPublishGuard, setShowPublishGuard] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'performance',
    hero_h1: '',
    hero_summary: '',
    primary_cta_label: 'Teklif Al',
    primary_cta_url: '#contact',
    secondary_cta_label: '',
    secondary_cta_url: '',
    problem_block: '',
    solution_block: '',
    process_steps: [],
    deliverables: [],
    kpi_outcomes: [],
    // SEO
    seo_title: '',
    seo_description: '',
    seo_slug: '',
    seo_focus_keyword: '',
    seo_secondary_keywords: [],
    seo_robots: 'index,follow',
    seo_schema_faq_enabled: false,
    seo_schema_faq_items: [],
    // Social
    og_title: '',
    og_description: '',
    og_image: '',
    // Status
    status: 'draft'
  });

  useEffect(() => {
    if (!isNew) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      const data = await getService(id);
      setFormData(data);
    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Hizmet yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (value) => {
    handleChange('name', value);
    if (isNew || !formData.seo_slug) {
      handleChange('seo_slug', generateSlug(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isNew) {
        const result = await createService(formData);
        toast.success('Hizmet oluşturuldu');
        navigate(`/admin/services/${result.id}`);
      } else {
        await updateService(id, formData);
        toast.success('Hizmet güncellendi');
        setHasChanges(false);
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Kaydetme başarısız';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Process steps management
  const addProcessStep = () => {
    handleChange('process_steps', [
      ...formData.process_steps,
      { title: '', description: '', icon: null }
    ]);
  };

  const updateProcessStep = (index, field, value) => {
    const updated = [...formData.process_steps];
    updated[index][field] = value;
    handleChange('process_steps', updated);
  };

  const removeProcessStep = (index) => {
    handleChange('process_steps', formData.process_steps.filter((_, i) => i !== index));
  };

  // KPI outcomes management
  const addKPI = () => {
    handleChange('kpi_outcomes', [
      ...formData.kpi_outcomes,
      { metric_name: '', value: '', note: '' }
    ]);
  };

  const updateKPI = (index, field, value) => {
    const updated = [...formData.kpi_outcomes];
    updated[index][field] = value;
    handleChange('kpi_outcomes', updated);
  };

  const removeKPI = (index) => {
    handleChange('kpi_outcomes', formData.kpi_outcomes.filter((_, i) => i !== index));
  };

  // FAQ management
  const addFAQ = () => {
    handleChange('seo_schema_faq_items', [
      ...formData.seo_schema_faq_items,
      { question: '', answer: '' }
    ]);
  };

  const updateFAQ = (index, field, value) => {
    const updated = [...formData.seo_schema_faq_items];
    updated[index][field] = value;
    handleChange('seo_schema_faq_items', updated);
  };

  const removeFAQ = (index) => {
    handleChange('seo_schema_faq_items', formData.seo_schema_faq_items.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#c8ff00] border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const tabs = [
    { id: 'content', name: 'İçerik' },
    { id: 'seo', name: 'SEO' },
    { id: 'social', name: 'Sosyal Medya' },
  ];

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/services"
              className="p-2 text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isNew ? 'Yeni Hizmet' : formData.name}
              </h1>
              {!isNew && (
                <p className="text-gray-500 text-sm">/hizmetler/{formData.seo_slug}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isNew && (
              <a
                href={`/hizmetler/${formData.seo_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-[#333] text-gray-400 hover:text-white hover:border-[#c8ff00] transition-colors"
              >
                <Eye className="w-4 h-4" />
                Önizle
              </a>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 font-medium hover:bg-white transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* Status & Category Row */}
        <div className="flex gap-4">
          <div className="flex-1 bg-[#111] border border-[#222] p-4">
            <label className="block text-gray-400 text-sm mb-2">Durum</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
            </select>
          </div>
          <div className="flex-1 bg-[#111] border border-[#222] p-4">
            <label className="block text-gray-400 text-sm mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
            >
              <option value="performance">Performance</option>
              <option value="social">Social</option>
              <option value="seo">SEO</option>
              <option value="creative">Creative</option>
              <option value="strategy">Strategy</option>
              <option value="production">Production</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#222]">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#c8ff00] border-b-2 border-[#c8ff00]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-[#111] border border-[#222] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Temel Bilgiler</h3>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Hizmet Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Hero H1 *</label>
                <input
                  type="text"
                  value={formData.hero_h1}
                  onChange={(e) => handleChange('hero_h1', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none"
                  placeholder="Google Ads Yönetimi | Dönüşüm Odaklı Kampanya Yönetimi"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Hero Özet *</label>
                <textarea
                  value={formData.hero_summary}
                  onChange={(e) => handleChange('hero_summary', e.target.value)}
                  rows={3}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none resize-none"
                  required
                />
              </div>
            </div>

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#111] border border-[#222] p-6">
                <label className="block text-gray-400 text-sm mb-2">Problem Blok (HTML)</label>
                <textarea
                  value={formData.problem_block}
                  onChange={(e) => handleChange('problem_block', e.target.value)}
                  rows={6}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none resize-none font-mono text-sm"
                  placeholder="<p>Problem açıklaması...</p>"
                />
              </div>

              <div className="bg-[#111] border border-[#222] p-6">
                <label className="block text-gray-400 text-sm mb-2">Çözüm Blok (HTML)</label>
                <textarea
                  value={formData.solution_block}
                  onChange={(e) => handleChange('solution_block', e.target.value)}
                  rows={6}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none resize-none font-mono text-sm"
                  placeholder="<p>Çözüm açıklaması...</p>"
                />
              </div>
            </div>

            {/* Process Steps */}
            <div className="bg-[#111] border border-[#222] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Süreç Adımları</h3>
                <button
                  type="button"
                  onClick={addProcessStep}
                  className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  Adım Ekle
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.process_steps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start bg-[#0a0a0a] p-4 border border-[#222]">
                    <span className="w-8 h-8 bg-[#c8ff00] text-black flex items-center justify-center font-bold text-sm shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateProcessStep(index, 'title', e.target.value)}
                        placeholder="Adım başlığı"
                        className="w-full bg-transparent border border-[#333] text-white px-3 py-2 focus:border-[#c8ff00] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) => updateProcessStep(index, 'description', e.target.value)}
                        placeholder="Adım açıklaması"
                        className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2 focus:border-[#c8ff00] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProcessStep(index)}
                      className="p-2 text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Outcomes */}
            <div className="bg-[#111] border border-[#222] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Beklenen Sonuçlar (KPI)</h3>
                <button
                  type="button"
                  onClick={addKPI}
                  className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline"
                >
                  <Plus className="w-4 h-4" />
                  KPI Ekle
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.kpi_outcomes.map((kpi, index) => (
                  <div key={index} className="flex gap-4 items-start bg-[#0a0a0a] p-4 border border-[#222]">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={kpi.metric_name}
                        onChange={(e) => updateKPI(index, 'metric_name', e.target.value)}
                        placeholder="Metrik adı"
                        className="bg-transparent border border-[#333] text-white px-3 py-2 focus:border-[#c8ff00] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={kpi.value}
                        onChange={(e) => updateKPI(index, 'value', e.target.value)}
                        placeholder="Değer (ör: %200)"
                        className="bg-transparent border border-[#333] text-[#c8ff00] px-3 py-2 focus:border-[#c8ff00] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={kpi.note}
                        onChange={(e) => updateKPI(index, 'note', e.target.value)}
                        placeholder="Not (opsiyonel)"
                        className="bg-transparent border border-[#333] text-gray-400 px-3 py-2 focus:border-[#c8ff00] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeKPI(index)}
                      className="p-2 text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="bg-[#111] border border-[#222] p-6">
              <h3 className="text-lg font-semibold text-white mb-4">CTA Butonları</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Birincil CTA Metni</label>
                  <input
                    type="text"
                    value={formData.primary_cta_label}
                    onChange={(e) => handleChange('primary_cta_label', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Birincil CTA URL</label>
                  <input
                    type="text"
                    value={formData.primary_cta_url}
                    onChange={(e) => handleChange('primary_cta_url', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">İkincil CTA Metni</label>
                  <input
                    type="text"
                    value={formData.secondary_cta_label || ''}
                    onChange={(e) => handleChange('secondary_cta_label', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">İkincil CTA URL</label>
                  <input
                    type="text"
                    value={formData.secondary_cta_url || ''}
                    onChange={(e) => handleChange('secondary_cta_url', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-[#111] border border-[#222] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">SEO Ayarları</h3>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">URL Slug *</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">/hizmetler/</span>
                  <input
                    type="text"
                    value={formData.seo_slug}
                    onChange={(e) => handleChange('seo_slug', e.target.value)}
                    className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 focus:border-[#c8ff00] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">SEO Başlık</label>
                <input
                  type="text"
                  value={formData.seo_title || ''}
                  onChange={(e) => handleChange('seo_title', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 focus:border-[#c8ff00] focus:outline-none"
                  placeholder="Boş bırakılırsa hizmet adı kullanılır"
                />
                <p className="text-gray-600 text-xs mt-1">{(formData.seo_title || formData.name).length}/60 karakter</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Meta Açıklama</label>
                <textarea
                  value={formData.seo_description || ''}
                  onChange={(e) => handleChange('seo_description', e.target.value)}
                  rows={3}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 focus:border-[#c8ff00] focus:outline-none resize-none"
                  placeholder="155-160 karakter önerilir"
                />
                <p className="text-gray-600 text-xs mt-1">{(formData.seo_description || '').length}/160 karakter</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Odak Anahtar Kelime</label>
                  <input
                    type="text"
                    value={formData.seo_focus_keyword || ''}
                    onChange={(e) => handleChange('seo_focus_keyword', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Robots</label>
                  <select
                    value={formData.seo_robots}
                    onChange={(e) => handleChange('seo_robots', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                  >
                    <option value="index,follow">index, follow</option>
                    <option value="noindex,follow">noindex, follow</option>
                    <option value="index,nofollow">index, nofollow</option>
                    <option value="noindex,nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>
            </div>

            {/* FAQ Schema */}
            <div className="bg-[#111] border border-[#222] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">FAQ Schema</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.seo_schema_faq_enabled}
                      onChange={(e) => handleChange('seo_schema_faq_enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c8ff00]"></div>
                  </label>
                </div>
                {formData.seo_schema_faq_enabled && (
                  <button
                    type="button"
                    onClick={addFAQ}
                    className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Soru Ekle
                  </button>
                )}
              </div>
              
              {formData.seo_schema_faq_enabled && (
                <div className="space-y-4">
                  {formData.seo_schema_faq_items.map((faq, index) => (
                    <div key={index} className="bg-[#0a0a0a] p-4 border border-[#222] space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                            placeholder="Soru"
                            className="w-full bg-transparent border border-[#333] text-white px-3 py-2 focus:border-[#c8ff00] focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFAQ(index)}
                          className="p-2 text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        placeholder="Cevap"
                        rows={2}
                        className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2 focus:border-[#c8ff00] focus:outline-none resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="bg-[#111] border border-[#222] p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Open Graph (Sosyal Medya Paylaşımı)</h3>
              <p className="text-gray-500 text-sm">Bu alanlar boş bırakılırsa SEO başlık ve açıklaması kullanılır.</p>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">OG Başlık</label>
                <input
                  type="text"
                  value={formData.og_title || ''}
                  onChange={(e) => handleChange('og_title', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                  placeholder="Sosyal medyada görünecek başlık"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">OG Açıklama</label>
                <textarea
                  value={formData.og_description || ''}
                  onChange={(e) => handleChange('og_description', e.target.value)}
                  rows={3}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 resize-none"
                  placeholder="Sosyal medyada görünecek açıklama"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">OG Görsel URL</label>
                <input
                  type="url"
                  value={formData.og_image || ''}
                  onChange={(e) => handleChange('og_image', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                  placeholder="https://..."
                />
                <p className="text-gray-600 text-xs mt-1">Önerilen boyut: 1200x630 piksel</p>
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
};

export default ServiceEditPage;
