import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getSiteSections, updateSiteSection } from '../api';
import { 
  Save, 
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
    why_us: 'Neden Biz?',
    ai_capabilities: 'AI Yetenekleri',
    framework: 'Framework',
    portfolio: 'Başarı Hikayeleri',
    testimonials: 'Müşteri Yorumları',
    contact: 'İletişim',
    footer: 'Footer'
  };

  const sectionDescriptions = {
    header: 'Logo, navigasyon ve CTA butonu',
    hero: 'Ana sayfa hero alanı',
    stats: 'Sayısal metrikler',
    trust_badges: 'Partner rozetleri ve müşteri logoları',
    why_us: '4 adet fark yaratan özellik',
    ai_capabilities: '6 adet AI yeteneği',
    framework: '4 adımlı metodoloji',
    portfolio: 'Başarı hikayeleri / projeler',
    testimonials: 'Müşteri referansları',
    contact: 'İletişim formu ayarları',
    footer: 'İletişim bilgileri, sosyal medya'
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
            <p className="text-gray-500 mt-1">Tüm site bölümlerini düzenleyin</p>
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
              {expandedSection === key && sections[key] && (
                <div className="border-t border-[#222] p-6">
                  {key === 'header' && <HeaderEditor data={sections.header} onChange={(data) => updateSection('header', data)} />}
                  {key === 'hero' && <HeroEditor data={sections.hero} onChange={(data) => updateSection('hero', data)} />}
                  {key === 'stats' && <StatsEditor data={sections.stats} onChange={(data) => updateSection('stats', data)} />}
                  {key === 'trust_badges' && <TrustBadgesEditor data={sections.trust_badges} onChange={(data) => updateSection('trust_badges', data)} />}
                  {key === 'why_us' && <WhyUsEditor data={sections.why_us} onChange={(data) => updateSection('why_us', data)} />}
                  {key === 'ai_capabilities' && <AICapabilitiesEditor data={sections.ai_capabilities} onChange={(data) => updateSection('ai_capabilities', data)} />}
                  {key === 'framework' && <FrameworkEditor data={sections.framework} onChange={(data) => updateSection('framework', data)} />}
                  {key === 'portfolio' && <PortfolioEditor data={sections.portfolio} onChange={(data) => updateSection('portfolio', data)} />}
                  {key === 'testimonials' && <TestimonialsEditor data={sections.testimonials} onChange={(data) => updateSection('testimonials', data)} />}
                  {key === 'contact' && <ContactEditor data={sections.contact} onChange={(data) => updateSection('contact', data)} />}
                  {key === 'footer' && <FooterEditor data={sections.footer} onChange={(data) => updateSection('footer', data)} />}

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
  const update = (field, value) => onChange({ ...data, [field]: value });

  const updateNavLink = (index, field, value) => {
    const newLinks = [...data.nav_links];
    newLinks[index][field] = value;
    onChange({ ...data, nav_links: newLinks });
  };

  const addNavLink = () => onChange({ ...data, nav_links: [...data.nav_links, { name: '', path: '' }] });
  const removeNavLink = (index) => onChange({ ...data, nav_links: data.nav_links.filter((_, i) => i !== index) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Logo Metni" value={data.logo} onChange={(v) => update('logo', v)} />
        <InputField label="Telefon" value={data.phone} onChange={(v) => update('phone', v)} />
      </div>
      <ArrayField label="Navigasyon Linkleri" items={data.nav_links} fields={['name', 'path']} placeholders={['Link adı', 'URL']} onUpdate={updateNavLink} onAdd={addNavLink} onRemove={removeNavLink} />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="CTA Buton Metni" value={data.cta_button?.text} onChange={(v) => update('cta_button', { ...data.cta_button, text: v })} />
        <InputField label="CTA URL" value={data.cta_button?.url} onChange={(v) => update('cta_button', { ...data.cta_button, url: v })} />
      </div>
    </div>
  );
};

const HeroEditor = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      <InputField label="Badge" value={data.badge} onChange={(v) => update('badge', v)} />
      <div>
        <label className="block text-gray-400 text-sm mb-2">Başlık (her satır ayrı)</label>
        {data.title?.map((line, idx) => (
          <input key={idx} type="text" value={line} onChange={(e) => { const t = [...data.title]; t[idx] = e.target.value; update('title', t); }}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 mb-2 font-bold" placeholder={`Satır ${idx + 1}`} />
        ))}
      </div>
      <InputField label="Alt Başlık" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      <TextareaField label="Açıklama" value={data.description} onChange={(v) => update('description', v)} />
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Birincil CTA Metni" value={data.primary_cta?.text} onChange={(v) => update('primary_cta', { ...data.primary_cta, text: v })} />
        <InputField label="Birincil CTA URL" value={data.primary_cta?.url} onChange={(v) => update('primary_cta', { ...data.primary_cta, url: v })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="İkincil CTA Metni" value={data.secondary_cta?.text} onChange={(v) => update('secondary_cta', { ...data.secondary_cta, text: v })} />
        <InputField label="İkincil CTA URL" value={data.secondary_cta?.url} onChange={(v) => update('secondary_cta', { ...data.secondary_cta, url: v })} />
      </div>
    </div>
  );
};

const StatsEditor = ({ data, onChange }) => {
  const updateStat = (index, field, value) => {
    const items = [...data.items];
    items[index][field] = value;
    onChange({ ...data, items });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {data.items?.map((stat, idx) => (
        <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-4">
          <input type="text" value={stat.number} onChange={(e) => updateStat(idx, 'number', e.target.value)} placeholder="Değer" className="w-full bg-transparent border border-[#333] text-[#c8ff00] text-2xl font-bold px-3 py-2 mb-2" />
          <input type="text" value={stat.label} onChange={(e) => updateStat(idx, 'label', e.target.value)} placeholder="Etiket" className="w-full bg-transparent border border-[#333] text-white px-3 py-2" />
        </div>
      ))}
    </div>
  );
};

const TrustBadgesEditor = ({ data, onChange }) => {
  const updatePartner = (idx, field, value) => { const p = [...data.partners]; p[idx][field] = value; onChange({ ...data, partners: p }); };
  const addPartner = () => onChange({ ...data, partners: [...data.partners, { name: '', type: 'partner' }] });
  const removePartner = (idx) => onChange({ ...data, partners: data.partners.filter((_, i) => i !== idx) });

  const updateLogo = (idx, field, value) => { const l = [...data.client_logos]; l[idx][field] = value; onChange({ ...data, client_logos: l }); };
  const addLogo = () => onChange({ ...data, client_logos: [...data.client_logos, { name: '', logo: '' }] });
  const removeLogo = (idx) => onChange({ ...data, client_logos: data.client_logos.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between mb-3"><span className="text-white font-medium">Partner Rozetleri</span><AddButton onClick={addPartner} /></div>
        {data.partners?.map((p, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input type="text" value={p.name} onChange={(e) => updatePartner(idx, 'name', e.target.value)} placeholder="Partner adı" className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2" />
            <select value={p.type} onChange={(e) => updatePartner(idx, 'type', e.target.value)} className="bg-[#0a0a0a] border border-[#333] text-white px-3 py-2">
              <option value="premier">Premier</option><option value="partner">Partner</option><option value="certified">Certified</option>
            </select>
            <RemoveButton onClick={() => removePartner(idx)} />
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between mb-3"><span className="text-white font-medium">Müşteri Logoları</span><AddButton onClick={addLogo} /></div>
        <div className="grid grid-cols-3 gap-2">
          {data.client_logos?.map((c, idx) => (
            <div key={idx} className="flex gap-2">
              <input type="text" value={c.name} onChange={(e) => updateLogo(idx, 'name', e.target.value)} placeholder="Şirket" className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 text-sm" />
              <input type="text" value={c.logo} onChange={(e) => updateLogo(idx, 'logo', e.target.value)} placeholder="Kısa" className="w-16 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 text-sm text-center" />
              <RemoveButton onClick={() => removeLogo(idx)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WhyUsEditor = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const updateItem = (idx, field, value) => { const items = [...data.items]; items[idx][field] = value; onChange({ ...data, items }); };
  const addItem = () => onChange({ ...data, items: [...data.items, { title: '', description: '', icon: 'brain' }] });
  const removeItem = (idx) => onChange({ ...data, items: data.items.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <InputField label="Badge" value={data.badge} onChange={(v) => update('badge', v)} />
        <InputField label="Başlık" value={data.title} onChange={(v) => update('title', v)} />
        <InputField label="Alt Başlık" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      </div>
      <div className="flex justify-between mb-3"><span className="text-white font-medium">Özellikler (4 adet)</span><AddButton onClick={addItem} /></div>
      {data.items?.map((item, idx) => (
        <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-4 flex gap-4">
          <span className="w-8 h-8 bg-[#c8ff00] text-black flex items-center justify-center font-bold text-sm shrink-0">{String(idx + 1).padStart(2, '0')}</span>
          <div className="flex-1 space-y-2">
            <input type="text" value={item.title} onChange={(e) => updateItem(idx, 'title', e.target.value)} placeholder="Başlık" className="w-full bg-transparent border border-[#333] text-white px-3 py-2" />
            <input type="text" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} placeholder="Açıklama" className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2" />
            <select value={item.icon} onChange={(e) => updateItem(idx, 'icon', e.target.value)} className="bg-[#0a0a0a] border border-[#333] text-white px-3 py-2">
              <option value="brain">Brain</option><option value="chart">Chart</option><option value="users">Users</option><option value="target">Target</option><option value="zap">Zap</option>
            </select>
          </div>
          <RemoveButton onClick={() => removeItem(idx)} />
        </div>
      ))}
    </div>
  );
};

const AICapabilitiesEditor = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const updateItem = (idx, field, value) => { const items = [...data.items]; items[idx][field] = value; onChange({ ...data, items }); };
  const addItem = () => onChange({ ...data, items: [...data.items, { name: '', description: '', metric: '' }] });
  const removeItem = (idx) => onChange({ ...data, items: data.items.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <InputField label="Badge" value={data.badge} onChange={(v) => update('badge', v)} />
        <InputField label="Başlık" value={data.title} onChange={(v) => update('title', v)} />
        <InputField label="Alt Başlık" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      </div>
      <div className="flex justify-between mb-3"><span className="text-white font-medium">AI Yetenekleri</span><AddButton onClick={addItem} /></div>
      <div className="grid grid-cols-2 gap-4">
        {data.items?.map((item, idx) => (
          <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-4 space-y-2">
            <div className="flex justify-between"><span className="text-gray-500 text-sm">#{idx + 1}</span><RemoveButton onClick={() => removeItem(idx)} /></div>
            <input type="text" value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} placeholder="Yetenek adı" className="w-full bg-transparent border border-[#333] text-white px-3 py-2" />
            <input type="text" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} placeholder="Açıklama" className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2" />
            <input type="text" value={item.metric} onChange={(e) => updateItem(idx, 'metric', e.target.value)} placeholder="Metrik (ör: ROI +180%)" className="w-full bg-transparent border border-[#333] text-[#c8ff00] px-3 py-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

const FrameworkEditor = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const updateStep = (idx, field, value) => { const steps = [...data.steps]; steps[idx][field] = value; onChange({ ...data, steps }); };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <InputField label="Badge" value={data.badge} onChange={(v) => update('badge', v)} />
        <InputField label="Başlık" value={data.title} onChange={(v) => update('title', v)} />
        <InputField label="Alt Başlık" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      </div>
      <div><span className="text-white font-medium">Adımlar (4 adet)</span></div>
      {data.steps?.map((step, idx) => (
        <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-4 flex gap-4">
          <span className="w-10 h-10 bg-[#c8ff00] text-black flex items-center justify-center font-bold shrink-0">{step.phase}</span>
          <div className="flex-1 space-y-2">
            <input type="text" value={step.name} onChange={(e) => updateStep(idx, 'name', e.target.value)} placeholder="Adım adı" className="w-full bg-transparent border border-[#333] text-white px-3 py-2" />
            <input type="text" value={step.description} onChange={(e) => updateStep(idx, 'description', e.target.value)} placeholder="Açıklama" className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

const PortfolioEditor = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const updateProject = (idx, field, value) => { const projects = [...data.projects]; projects[idx][field] = value; onChange({ ...data, projects }); };
  const addProject = () => onChange({ ...data, projects: [...data.projects, { name: '', category: '', result: '', description: '' }] });
  const removeProject = (idx) => onChange({ ...data, projects: data.projects.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <InputField label="Badge" value={data.badge} onChange={(v) => update('badge', v)} />
        <InputField label="Başlık" value={data.title} onChange={(v) => update('title', v)} />
        <InputField label="Alt Başlık" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      </div>
      <div className="flex justify-between mb-3"><span className="text-white font-medium">Projeler</span><AddButton onClick={addProject} /></div>
      <div className="grid grid-cols-2 gap-4">
        {data.projects?.map((p, idx) => (
          <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-4 space-y-2">
            <div className="flex justify-between"><span className="text-gray-500 text-sm">Proje #{idx + 1}</span><RemoveButton onClick={() => removeProject(idx)} /></div>
            <input type="text" value={p.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} placeholder="Proje adı" className="w-full bg-transparent border border-[#333] text-white px-3 py-2" />
            <input type="text" value={p.category} onChange={(e) => updateProject(idx, 'category', e.target.value)} placeholder="Kategori" className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2" />
            <input type="text" value={p.result} onChange={(e) => updateProject(idx, 'result', e.target.value)} placeholder="Sonuç (ör: +340% ROAS)" className="w-full bg-transparent border border-[#333] text-[#c8ff00] px-3 py-2" />
            <input type="text" value={p.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} placeholder="Kısa açıklama" className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

const TestimonialsEditor = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const updateItem = (idx, field, value) => { const items = [...data.items]; items[idx][field] = value; onChange({ ...data, items }); };
  const addItem = () => onChange({ ...data, items: [...data.items, { name: '', title: '', company: '', quote: '', avatar: '' }] });
  const removeItem = (idx) => onChange({ ...data, items: data.items.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Badge" value={data.badge} onChange={(v) => update('badge', v)} />
        <InputField label="Başlık" value={data.title} onChange={(v) => update('title', v)} />
      </div>
      <div className="flex justify-between mb-3"><span className="text-white font-medium">Yorumlar</span><AddButton onClick={addItem} /></div>
      {data.items?.map((item, idx) => (
        <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-4 space-y-2">
          <div className="flex justify-between"><span className="text-gray-500 text-sm">Yorum #{idx + 1}</span><RemoveButton onClick={() => removeItem(idx)} /></div>
          <div className="grid grid-cols-3 gap-2">
            <input type="text" value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} placeholder="İsim" className="bg-transparent border border-[#333] text-white px-3 py-2" />
            <input type="text" value={item.title} onChange={(e) => updateItem(idx, 'title', e.target.value)} placeholder="Ünvan" className="bg-transparent border border-[#333] text-white px-3 py-2" />
            <input type="text" value={item.company} onChange={(e) => updateItem(idx, 'company', e.target.value)} placeholder="Şirket" className="bg-transparent border border-[#333] text-white px-3 py-2" />
          </div>
          <textarea value={item.quote} onChange={(e) => updateItem(idx, 'quote', e.target.value)} placeholder="Yorum metni" rows={2} className="w-full bg-transparent border border-[#333] text-gray-400 px-3 py-2 resize-none" />
          <input type="text" value={item.avatar} onChange={(e) => updateItem(idx, 'avatar', e.target.value)} placeholder="Avatar (2 harf, ör: AY)" className="w-24 bg-transparent border border-[#333] text-white px-3 py-2" />
        </div>
      ))}
    </div>
  );
};

const ContactEditor = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const updateFeature = (idx, value) => { const f = [...data.features]; f[idx] = value; onChange({ ...data, features: f }); };
  const addFeature = () => onChange({ ...data, features: [...data.features, ''] });
  const removeFeature = (idx) => onChange({ ...data, features: data.features.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <InputField label="Badge" value={data.badge} onChange={(v) => update('badge', v)} />
        <InputField label="Başlık" value={data.title} onChange={(v) => update('title', v)} />
        <InputField label="Alt Başlık" value={data.subtitle} onChange={(v) => update('subtitle', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Form Başlığı" value={data.form_title} onChange={(v) => update('form_title', v)} />
        <InputField label="Form CTA" value={data.form_cta} onChange={(v) => update('form_cta', v)} />
      </div>
      <TextareaField label="Form Açıklaması" value={data.form_description} onChange={(v) => update('form_description', v)} />
      <div className="flex justify-between mb-3"><span className="text-white font-medium">Özellikler</span><AddButton onClick={addFeature} /></div>
      {data.features?.map((f, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input type="text" value={f} onChange={(e) => updateFeature(idx, e.target.value)} className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2" />
          <RemoveButton onClick={() => removeFeature(idx)} />
        </div>
      ))}
    </div>
  );
};

const FooterEditor = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  const updateContact = (field, value) => onChange({ ...data, contact: { ...data.contact, [field]: value } });
  const updateSocial = (idx, field, value) => { const s = [...data.social_links]; s[idx][field] = value; onChange({ ...data, social_links: s }); };
  const addSocial = () => onChange({ ...data, social_links: [...data.social_links, { platform: '', url: '' }] });
  const removeSocial = (idx) => onChange({ ...data, social_links: data.social_links.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Logo" value={data.logo} onChange={(v) => update('logo', v)} />
        <InputField label="Slogan" value={data.slogan} onChange={(v) => update('slogan', v)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Telefon" value={data.contact?.phone} onChange={(v) => updateContact('phone', v)} />
        <InputField label="E-posta" value={data.contact?.email} onChange={(v) => updateContact('email', v)} />
        <InputField label="WhatsApp" value={data.contact?.whatsapp} onChange={(v) => updateContact('whatsapp', v)} />
        <InputField label="Adres" value={data.contact?.address} onChange={(v) => updateContact('address', v)} />
      </div>
      <div className="flex justify-between mb-3"><span className="text-white font-medium">Sosyal Medya</span><AddButton onClick={addSocial} /></div>
      {data.social_links?.map((s, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <select value={s.platform} onChange={(e) => updateSocial(idx, 'platform', e.target.value)} className="w-32 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2">
            <option value="">Seçin</option><option value="linkedin">LinkedIn</option><option value="instagram">Instagram</option><option value="twitter">Twitter</option><option value="facebook">Facebook</option><option value="youtube">YouTube</option>
          </select>
          <input type="url" value={s.url} onChange={(e) => updateSocial(idx, 'url', e.target.value)} placeholder="URL" className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2" />
          <RemoveButton onClick={() => removeSocial(idx)} />
        </div>
      ))}
      <InputField label="Copyright" value={data.copyright} onChange={(v) => update('copyright', v)} />
    </div>
  );
};

// Helper Components
const InputField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-gray-400 text-sm mb-2">{label}</label>
    <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2" />
  </div>
);

const TextareaField = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label className="block text-gray-400 text-sm mb-2">{label}</label>
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-3 resize-none" />
  </div>
);

const AddButton = ({ onClick }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline">
    <Plus className="w-4 h-4" />Ekle
  </button>
);

const RemoveButton = ({ onClick }) => (
  <button type="button" onClick={onClick} className="p-2 text-gray-500 hover:text-red-400">
    <Trash2 className="w-4 h-4" />
  </button>
);

const ArrayField = ({ label, items, fields, placeholders, onUpdate, onAdd, onRemove }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <label className="text-gray-400 text-sm">{label}</label>
      <AddButton onClick={onAdd} />
    </div>
    <div className="space-y-2">
      {items?.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          {fields.map((field, fidx) => (
            <input key={field} type="text" value={item[field]} onChange={(e) => onUpdate(idx, field, e.target.value)} placeholder={placeholders[fidx]} className="flex-1 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2" />
          ))}
          <RemoveButton onClick={() => onRemove(idx)} />
        </div>
      ))}
    </div>
  </div>
);

export default SiteContentPage;
