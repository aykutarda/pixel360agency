import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { getBlogPost, createBlogPost, updateBlogPost } from '../api';
import { 
  Save, 
  ArrowLeft, 
  Eye,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import PublishGuardModal, { validatePublish } from '../components/PublishGuard';
import ChangeLog from '../components/ChangeLog';
import InternalLinkHealth from '../components/InternalLinkHealth';

const BlogEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [hasChanges, setHasChanges] = useState(false);
  const [showPublishGuard, setShowPublishGuard] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    cover_image: '',
    cover_image_alt: '',
    content: '',
    tags: [],
    intent_type: 'informational',
    supports_service_id: null,
    belongs_to_hub_id: null,
    // SEO
    seo_title: '',
    seo_description: '',
    seo_slug: '',
    focus_keyword: '',
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
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const data = await getBlogPost(id);
      setFormData(data);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Yazı yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const generateSlug = (title) => {
    return title
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

  const handleTitleChange = (value) => {
    handleChange('title', value);
    if (isNew || !formData.seo_slug) {
      handleChange('seo_slug', generateSlug(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If trying to publish, show PublishGuard first
    if (formData.status === 'published') {
      const validation = validatePublish(formData, 'blog');
      if (!validation.isValid || validation.hasWarnings) {
        setShowPublishGuard(true);
        return;
      }
    }
    
    await savePost();
  };

  const savePost = async () => {
    setSaving(true);

    try {
      if (isNew) {
        const result = await createBlogPost(formData);
        toast.success('Yazı oluşturuldu');
        navigate(`/admin/blog/${result.id}`);
      } else {
        await updateBlogPost(id, formData);
        toast.success('Yazı güncellendi');
        setHasChanges(false);
        await loadPost();
      }
    } catch (error) {
      const message = error.response?.data?.detail || 'Kaydetme başarısız';
      toast.error(message);
    } finally {
      setSaving(false);
      setShowPublishGuard(false);
    }
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

  // Tags management
  const [tagInput, setTagInput] = useState('');
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (tag) => {
    handleChange('tags', formData.tags.filter(t => t !== tag));
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

  const seoValidation = validatePublish(formData, 'blog');

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      {/* Publish Guard Modal */}
      <PublishGuardModal
        isOpen={showPublishGuard}
        onClose={() => setShowPublishGuard(false)}
        onConfirm={savePost}
        data={formData}
        contentType="blog"
        isLoading={saving}
      />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/blog"
              className="p-2 text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isNew ? 'Yeni Blog Yazısı' : formData.title}
              </h1>
              {!isNew && (
                <p className="text-gray-500 text-sm">/blog/{formData.seo_slug}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isNew && (
              <a
                href={`/blog/${formData.seo_slug}`}
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

        {/* Main Layout with Sidebar */}
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Status & Intent */}
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
                <label className="block text-gray-400 text-sm mb-2">Intent Type</label>
                <select
                  value={formData.intent_type}
                  onChange={(e) => handleChange('intent_type', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                >
                  <option value="informational">🟢 Informational</option>
                  <option value="commercial">🟡 Commercial</option>
                  <option value="transactional">🔴 Transactional</option>
                  <option value="navigational">🔵 Navigational</option>
                </select>
              </div>
            </div>

            {/* SEO Status Preview */}
            {formData.status === 'published' && !seoValidation.isValid && (
              <div className="bg-red-500/10 border border-red-500/30 p-4">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-2">
                  <AlertCircle className="w-4 h-4" />
                  SEO Sorunları ({seoValidation.errors.length})
                </div>
                <ul className="text-red-400 text-xs space-y-1">
                  {seoValidation.errors.slice(0, 3).map((err, i) => (
                    <li key={i}>• {err.message}</li>
                  ))}
                </ul>
              </div>
            )}

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
                <div className="bg-[#111] border border-[#222] p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Temel Bilgiler</h3>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Başlık *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 focus:border-[#c8ff00] focus:outline-none"
                      placeholder="Blog yazısı başlığı"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Özet *</label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => handleChange('excerpt', e.target.value)}
                      rows={3}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 resize-none focus:border-[#c8ff00] focus:outline-none"
                      placeholder="Kısa açıklama (listelerde görünür)"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">İçerik *</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleChange('content', e.target.value)}
                      rows={15}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 resize-none focus:border-[#c8ff00] focus:outline-none font-mono text-sm"
                      placeholder="HTML veya Markdown içerik..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Etiketler</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 focus:border-[#c8ff00] focus:outline-none"
                        placeholder="Etiket ekle..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-[#222] text-gray-400 hover:text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 px-3 py-1 bg-[#222] text-gray-300 text-sm"
                        >
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)}>
                            <Trash2 className="w-3 h-3 text-gray-500 hover:text-red-400" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-[#111] border border-[#222] p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Kapak Görseli</h3>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Görsel URL</label>
                    <input
                      type="url"
                      value={formData.cover_image || ''}
                      onChange={(e) => handleChange('cover_image', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Alt Text</label>
                    <input
                      type="text"
                      value={formData.cover_image_alt || ''}
                      onChange={(e) => handleChange('cover_image_alt', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                      placeholder="Görsel açıklaması (SEO için önemli)"
                    />
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
                    <label className="block text-gray-400 text-sm mb-2">
                      SEO Başlık * <span className="text-gray-600">({formData.seo_title?.length || 0}/60)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.seo_title || ''}
                      onChange={(e) => handleChange('seo_title', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                      placeholder="Arama sonuçlarında görünecek başlık"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      SEO Açıklama * <span className="text-gray-600">({formData.seo_description?.length || 0}/160)</span>
                    </label>
                    <textarea
                      value={formData.seo_description || ''}
                      onChange={(e) => handleChange('seo_description', e.target.value)}
                      rows={3}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 resize-none"
                      placeholder="Arama sonuçlarında görünecek açıklama (120-160 karakter)"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">URL Slug *</label>
                    <div className="flex items-center">
                      <span className="text-gray-500 px-3 py-2 bg-[#0a0a0a] border border-r-0 border-[#333]">/blog/</span>
                      <input
                        type="text"
                        value={formData.seo_slug || ''}
                        onChange={(e) => handleChange('seo_slug', e.target.value)}
                        className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Focus Keyword *</label>
                    <input
                      type="text"
                      value={formData.focus_keyword || ''}
                      onChange={(e) => handleChange('focus_keyword', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                      placeholder="Ana anahtar kelime"
                    />
                  </div>
                </div>

                {/* FAQ Schema */}
                <div className="bg-[#111] border border-[#222] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">FAQ Schema</h3>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.seo_schema_faq_enabled}
                        onChange={(e) => handleChange('seo_schema_faq_enabled', e.target.checked)}
                        className="w-4 h-4 accent-[#c8ff00]"
                      />
                      <span className="text-gray-400 text-sm">Aktif</span>
                    </label>
                  </div>

                  {formData.seo_schema_faq_enabled && (
                    <>
                      <button
                        type="button"
                        onClick={addFAQ}
                        className="flex items-center gap-2 text-[#c8ff00] text-sm hover:underline"
                      >
                        <Plus className="w-4 h-4" /> Soru Ekle
                      </button>

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
                                  className="w-full bg-transparent border border-[#333] text-white px-3 py-2"
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
                              className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2 resize-none"
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="bg-[#111] border border-[#222] p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Open Graph</h3>
                  <p className="text-gray-500 text-sm">Boş bırakılırsa SEO değerleri kullanılır.</p>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">OG Başlık</label>
                    <input
                      type="text"
                      value={formData.og_title || ''}
                      onChange={(e) => handleChange('og_title', e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">OG Açıklama</label>
                    <textarea
                      value={formData.og_description || ''}
                      onChange={(e) => handleChange('og_description', e.target.value)}
                      rows={3}
                      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 resize-none"
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
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Internal Link Health */}
            <InternalLinkHealth
              postId={id}
              supportsServiceId={formData.supports_service_id}
              belongsToHubId={formData.belongs_to_hub_id}
              onServiceChange={(val) => handleChange('supports_service_id', val)}
              onHubChange={(val) => handleChange('belongs_to_hub_id', val)}
            />

            {/* Change Log */}
            {!isNew && (
              <ChangeLog
                createdAt={formData.created_at}
                createdBy={formData.created_by}
                updatedAt={formData.updated_at}
                updatedBy={formData.updated_by}
                lastChangeSummary={formData.last_change_summary}
              />
            )}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default BlogEditPage;
