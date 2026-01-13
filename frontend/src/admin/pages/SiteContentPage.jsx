import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getSiteSections, updateSiteSection, seedSiteSections } from '../api';
import { 
  Save, 
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

const SiteContentPage = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [expandedSection, setExpandedSection] = useState('header');
  const [hasChanges, setHasChanges] = useState({});

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await getSiteSections();
      setSections(data);
    } catch (error) {
      console.error('Error loading sections:', error);
      toast.error('Bölümler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key) => {
    setSaving(key);
    try {
      await updateSiteSection(key, sections[key]);
      toast.success(`${sectionLabels[key]} kaydedildi`);
      setHasChanges(prev => ({ ...prev, [key]: false }));
    } catch (error) {
      toast.error('Kaydetme başarısız');
    } finally {
      setSaving(null);
    }
  };

  const updateSection = (key, newData) => {
    setSections(prev => ({ ...prev, [key]: newData }));
    setHasChanges(prev => ({ ...prev, [key]: true }));
  };

  const sectionLabels = {
    header: 'Header',
    hero: 'Hero Bölümü',
    stats: 'İstatistikler',
    trust_badges: 'Partner & Müşteri Logoları',
    footer: 'Footer'
  };

  const sectionDescriptions = {
    header: 'Logo, navigasyon ve CTA butonu',
    hero: 'Ana sayfa hero alanı - başlık, açıklama ve CTA\'lar',
    stats: 'Sayısal metrikler (4 adet)',
    trust_badges: 'Partner rozetleri ve müşteri logoları',
    footer: 'İletişim bilgileri, sosyal medya ve copyright'
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

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Site İçeriği</h1>
            <p className="text-gray-500 mt-1">Ana sayfa bölümlerini düzenleyin</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[#333] text-gray-400 hover:text-white hover:border-[#c8ff00] transition-colors"
          >
            <Eye className="w-4 h-4" />
            Siteyi Görüntüle
          </a>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {Object.keys(sectionLabels).map((key) => (
            <div key={key} className="bg-[#111] border border-[#222]">
              {/* Section Header */}
              <button
                onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white text-left">{sectionLabels[key]}</h3>
                    <p className="text-gray-500 text-sm text-left">{sectionDescriptions[key]}</p>
                  </div>
                  {hasChanges[key] && (
                    <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500">Kaydedilmedi</span>
                  )}
                </div>
                {expandedSection === key ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Section Content */}
              {expandedSection === key && (
                <div className="border-t border-[#222] p-6">
                  {key === 'header' && (
                    <HeaderEditor 
                      data={sections.header} 
                      onChange={(data) => updateSection('header', data)} 
                    />
                  )}
                  {key === 'hero' && (
                    <HeroEditor 
                      data={sections.hero} 
                      onChange={(data) => updateSection('hero', data)} 
                    />
                  )}
                  {key === 'stats' && (
                    <StatsEditor 
                      data={sections.stats} 
                      onChange={(data) => updateSection('stats', data)} 
                    />
                  )}
                  {key === 'trust_badges' && (
                    <TrustBadgesEditor 
                      data={sections.trust_badges} 
                      onChange={(data) => updateSection('trust_badges', data)} 
                    />
                  )}
                  {key === 'footer' && (
                    <FooterEditor 
                      data={sections.footer} 
                      onChange={(data) => updateSection('footer', data)} 
                    />
                  )}

                  {/* Save Button */}
                  <div className="mt-6 pt-4 border-t border-[#222] flex justify-end">
                    <button
                      onClick={() => handleSave(key)}
                      disabled={saving === key || !hasChanges[key]}
                      className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {saving === key ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

// ============================================
// SECTION EDITORS
// ============================================

const HeaderEditor = ({ data, onChange }) => {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const updateNavLink = (index, field, value) => {
    const newLinks = [...data.nav_links];
    newLinks[index][field] = value;
    onChange({ ...data, nav_links: newLinks });
  };

  const addNavLink = () => {
    onChange({ 
      ...data, 
      nav_links: [...data.nav_links, { name: '', path: '' }] 
    });
  };

  const removeNavLink = (index) => {
    onChange({ 
      ...data, 
      nav_links: data.nav_links.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Logo Metni</label>
          <input
            type="text"
            value={data.logo || ''}
            onChange={(e) => update('logo', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Telefon</label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-gray-400 text-sm">Navigasyon Linkleri</label>
          <button
            type="button"
            onClick={addNavLink}
            className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Link Ekle
          </button>
        </div>
        <div className="space-y-2">
          {data.nav_links?.map((link, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={link.name}
                onChange={(e) => updateNavLink(index, 'name', e.target.value)}
                placeholder="Link adı"
                className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2"
              />
              <input
                type="text"
                value={link.path}
                onChange={(e) => updateNavLink(index, 'path', e.target.value)}
                placeholder="URL (ör: #services)"
                className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeNavLink(index)}
                className="p-2 text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">CTA Butonu</label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={data.cta_button?.text || ''}
            onChange={(e) => update('cta_button', { ...data.cta_button, text: e.target.value })}
            placeholder="Buton metni"
            className="bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
          />
          <input
            type="text"
            value={data.cta_button?.url || ''}
            onChange={(e) => update('cta_button', { ...data.cta_button, url: e.target.value })}
            placeholder="URL"
            className="bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
          />
        </div>
      </div>
    </div>
  );
};

const HeroEditor = ({ data, onChange }) => {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-400 text-sm mb-2">Badge</label>
        <input
          type="text"
          value={data.badge || ''}
          onChange={(e) => update('badge', e.target.value)}
          className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Başlık (her satır ayrı)</label>
        <div className="space-y-2">
          {data.title?.map((line, index) => (
            <input
              key={index}
              type="text"
              value={line}
              onChange={(e) => {
                const newTitle = [...data.title];
                newTitle[index] = e.target.value;
                update('title', newTitle);
              }}
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 font-bold"
              placeholder={`Satır ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Alt Başlık</label>
        <input
          type="text"
          value={data.subtitle || ''}
          onChange={(e) => update('subtitle', e.target.value)}
          className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Açıklama</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Birincil CTA</label>
          <input
            type="text"
            value={data.primary_cta?.text || ''}
            onChange={(e) => update('primary_cta', { ...data.primary_cta, text: e.target.value })}
            placeholder="Buton metni"
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 mb-2"
          />
          <input
            type="text"
            value={data.primary_cta?.url || ''}
            onChange={(e) => update('primary_cta', { ...data.primary_cta, url: e.target.value })}
            placeholder="URL"
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">İkincil CTA</label>
          <input
            type="text"
            value={data.secondary_cta?.text || ''}
            onChange={(e) => update('secondary_cta', { ...data.secondary_cta, text: e.target.value })}
            placeholder="Buton metni"
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 mb-2"
          />
          <input
            type="text"
            value={data.secondary_cta?.url || ''}
            onChange={(e) => update('secondary_cta', { ...data.secondary_cta, url: e.target.value })}
            placeholder="URL"
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
          />
        </div>
      </div>
    </div>
  );
};

const StatsEditor = ({ data, onChange }) => {
  const updateStat = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm flex items-center gap-2">
        <Info className="w-4 h-4" />
        4 adet istatistik gösterilir
      </p>
      <div className="grid grid-cols-2 gap-4">
        {data.items?.map((stat, index) => (
          <div key={index} className="bg-[#0a0a0a] border border-[#222] p-4">
            <input
              type="text"
              value={stat.number}
              onChange={(e) => updateStat(index, 'number', e.target.value)}
              placeholder="Değer (ör: ₺500M+)"
              className="w-full bg-transparent border border-[#333] text-[#c8ff00] text-2xl font-bold px-3 py-2 mb-2"
            />
            <input
              type="text"
              value={stat.label}
              onChange={(e) => updateStat(index, 'label', e.target.value)}
              placeholder="Etiket"
              className="w-full bg-transparent border border-[#333] text-white px-3 py-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const TrustBadgesEditor = ({ data, onChange }) => {
  const updatePartner = (index, field, value) => {
    const newPartners = [...data.partners];
    newPartners[index][field] = value;
    onChange({ ...data, partners: newPartners });
  };

  const addPartner = () => {
    onChange({ 
      ...data, 
      partners: [...data.partners, { name: '', type: 'partner' }] 
    });
  };

  const removePartner = (index) => {
    onChange({ 
      ...data, 
      partners: data.partners.filter((_, i) => i !== index) 
    });
  };

  const updateClientLogo = (index, field, value) => {
    const newLogos = [...data.client_logos];
    newLogos[index][field] = value;
    onChange({ ...data, client_logos: newLogos });
  };

  const addClientLogo = () => {
    onChange({ 
      ...data, 
      client_logos: [...data.client_logos, { name: '', logo: '' }] 
    });
  };

  const removeClientLogo = (index) => {
    onChange({ 
      ...data, 
      client_logos: data.client_logos.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="space-y-8">
      {/* Partners */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-white font-medium">Partner Rozetleri</label>
          <button
            type="button"
            onClick={addPartner}
            className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Ekle
          </button>
        </div>
        <div className="space-y-2">
          {data.partners?.map((partner, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={partner.name}
                onChange={(e) => updatePartner(index, 'name', e.target.value)}
                placeholder="Partner adı"
                className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2"
              />
              <select
                value={partner.type}
                onChange={(e) => updatePartner(index, 'type', e.target.value)}
                className="bg-[#0a0a0a] border border-[#333] text-white px-3 py-2"
              >
                <option value="premier">Premier</option>
                <option value="partner">Partner</option>
                <option value="certified">Certified</option>
              </select>
              <button
                type="button"
                onClick={() => removePartner(index)}
                className="p-2 text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Client Logos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-white font-medium">Müşteri Logoları</label>
          <button
            type="button"
            onClick={addClientLogo}
            className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Ekle
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {data.client_logos?.map((client, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={client.name}
                onChange={(e) => updateClientLogo(index, 'name', e.target.value)}
                placeholder="Şirket adı"
                className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={client.logo}
                onChange={(e) => updateClientLogo(index, 'logo', e.target.value)}
                placeholder="Kısaltma"
                className="w-16 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 text-sm text-center"
              />
              <button
                type="button"
                onClick={() => removeClientLogo(index)}
                className="p-1 text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FooterEditor = ({ data, onChange }) => {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const updateContact = (field, value) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...data.social_links];
    newLinks[index][field] = value;
    onChange({ ...data, social_links: newLinks });
  };

  const addSocialLink = () => {
    onChange({ 
      ...data, 
      social_links: [...data.social_links, { platform: '', url: '' }] 
    });
  };

  const removeSocialLink = (index) => {
    onChange({ 
      ...data, 
      social_links: data.social_links.filter((_, i) => i !== index) 
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Logo</label>
          <input
            type="text"
            value={data.logo || ''}
            onChange={(e) => update('logo', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Slogan</label>
          <input
            type="text"
            value={data.slogan || ''}
            onChange={(e) => update('slogan', e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-3">İletişim Bilgileri</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Telefon</label>
            <input
              type="text"
              value={data.contact?.phone || ''}
              onChange={(e) => updateContact('phone', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">E-posta</label>
            <input
              type="email"
              value={data.contact?.email || ''}
              onChange={(e) => updateContact('email', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">WhatsApp</label>
            <input
              type="text"
              value={data.contact?.whatsapp || ''}
              onChange={(e) => updateContact('whatsapp', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Adres</label>
            <input
              type="text"
              value={data.contact?.address || ''}
              onChange={(e) => updateContact('address', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-white font-medium">Sosyal Medya</label>
          <button
            type="button"
            onClick={addSocialLink}
            className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Ekle
          </button>
        </div>
        <div className="space-y-2">
          {data.social_links?.map((link, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={link.platform}
                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                className="w-32 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2"
              >
                <option value="">Seçin</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter/X</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
              </select>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                placeholder="URL"
                className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="p-2 text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Copyright</label>
        <input
          type="text"
          value={data.copyright || ''}
          onChange={(e) => update('copyright', e.target.value)}
          className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2"
        />
      </div>
    </div>
  );
};

export default SiteContentPage;
