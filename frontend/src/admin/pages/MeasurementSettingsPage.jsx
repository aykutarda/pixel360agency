import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  Save, 
  RefreshCw,
  Check,
  X,
  ExternalLink,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  TestTube
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

const API = process.env.REACT_APP_BACKEND_URL;

const MeasurementSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['gtm', 'ga4']);

  useEffect(() => {
    loadSettings();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API}/api/measurement/settings`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Ayarlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API}/api/measurement/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Kaydetme başarısız');
      }
      
      const data = await response.json();
      setSettings(data);
      setHasChanges(false);
      toast.success('Ayarlar kaydedildi');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const response = await fetch(`${API}/api/measurement/test-config`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setTestResults(data);
      
      if (data.overall?.ready) {
        toast.success('Tüm zorunlu servisler yapılandırıldı!');
      } else {
        toast.warning('Bazı servisler henüz yapılandırılmadı');
      }
    } catch (error) {
      toast.error('Test başarısız');
    } finally {
      setTesting(false);
    }
  };

  const updateSettings = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const updateConversion = (index, field, value) => {
    const newConversions = [...settings.google_ads_conversions];
    newConversions[index] = { ...newConversions[index], [field]: value };
    updateSettings('google_ads_conversions', newConversions);
  };

  const addConversion = () => {
    const newConversions = [
      ...settings.google_ads_conversions,
      { name: '', conversion_id: '', conversion_label: '', is_primary: false }
    ];
    updateSettings('google_ads_conversions', newConversions);
  };

  const removeConversion = (index) => {
    const newConversions = settings.google_ads_conversions.filter((_, i) => i !== index);
    updateSettings('google_ads_conversions', newConversions);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
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

  const sections = [
    {
      key: 'gtm',
      title: 'Google Tag Manager',
      subtitle: 'Zorunlu - Tüm tracking bu container üzerinden yapılır',
      required: true,
      fields: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.gtm_enabled}
                onChange={(e) => updateSettings('gtm_enabled', e.target.checked)}
                className="w-4 h-4 accent-[#c8ff00]"
              />
              <span className="text-white">GTM Aktif</span>
            </label>
          </div>
          <InputField
            label="GTM Container ID"
            value={settings?.gtm_container_id || ''}
            onChange={(v) => updateSettings('gtm_container_id', v)}
            placeholder="GTM-XXXXXXX"
            hint="Google Tag Manager > Admin > Container ID"
          />
        </div>
      )
    },
    {
      key: 'ga4',
      title: 'Google Analytics 4',
      subtitle: 'Zorunlu - Event tracking ve analitik',
      required: true,
      fields: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.ga4_enabled}
                onChange={(e) => updateSettings('ga4_enabled', e.target.checked)}
                className="w-4 h-4 accent-[#c8ff00]"
              />
              <span className="text-white">GA4 Aktif</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.ga4_debug_mode}
                onChange={(e) => updateSettings('ga4_debug_mode', e.target.checked)}
                className="w-4 h-4 accent-[#c8ff00]"
              />
              <span className="text-gray-400">Debug Mode</span>
            </label>
          </div>
          <InputField
            label="GA4 Measurement ID"
            value={settings?.ga4_measurement_id || ''}
            onChange={(v) => updateSettings('ga4_measurement_id', v)}
            placeholder="G-XXXXXXXXXX"
            hint="GA4 > Admin > Data Streams > Measurement ID"
          />
        </div>
      )
    },
    {
      key: 'googleAds',
      title: 'Google Ads',
      subtitle: 'Conversion tracking için',
      required: false,
      fields: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.google_ads_enabled}
                onChange={(e) => updateSettings('google_ads_enabled', e.target.checked)}
                className="w-4 h-4 accent-[#c8ff00]"
              />
              <span className="text-white">Google Ads Aktif</span>
            </label>
          </div>
          <InputField
            label="Google Ads Account ID"
            value={settings?.google_ads_id || ''}
            onChange={(v) => updateSettings('google_ads_id', v)}
            placeholder="AW-XXXXXXXXX"
            hint="Google Ads > Tools > Conversions > Account ID"
          />
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Conversion Events</span>
              <button
                onClick={addConversion}
                className="flex items-center gap-1 text-[#c8ff00] text-sm hover:underline"
              >
                <Plus className="w-4 h-4" /> Ekle
              </button>
            </div>
            
            {settings?.google_ads_conversions?.map((conv, idx) => (
              <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">
                    {conv.is_primary && <span className="text-[#c8ff00] mr-2">★ Primary</span>}
                    {conv.name || `Conversion #${idx + 1}`}
                  </span>
                  <button
                    onClick={() => removeConversion(idx)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={conv.name}
                    onChange={(e) => updateConversion(idx, 'name', e.target.value)}
                    placeholder="Event name"
                    className="bg-transparent border border-[#333] text-white px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={conv.conversion_label || ''}
                    onChange={(e) => updateConversion(idx, 'conversion_label', e.target.value)}
                    placeholder="Conversion Label"
                    className="bg-transparent border border-[#333] text-white px-3 py-2 text-sm"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={conv.is_primary}
                      onChange={(e) => updateConversion(idx, 'is_primary', e.target.checked)}
                      className="w-4 h-4 accent-[#c8ff00]"
                    />
                    <span className="text-gray-400 text-sm">Primary</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      key: 'metaPixel',
      title: 'Meta (Facebook) Pixel',
      subtitle: 'Meta Ads tracking için',
      required: false,
      fields: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.meta_pixel_enabled}
                onChange={(e) => updateSettings('meta_pixel_enabled', e.target.checked)}
                className="w-4 h-4 accent-[#c8ff00]"
              />
              <span className="text-white">Meta Pixel Aktif</span>
            </label>
          </div>
          <InputField
            label="Meta Pixel ID"
            value={settings?.meta_pixel_id || ''}
            onChange={(v) => updateSettings('meta_pixel_id', v)}
            placeholder="15-16 haneli sayı"
            hint="Meta Events Manager > Data Sources > Pixel ID"
          />
        </div>
      )
    },
    {
      key: 'clarity',
      title: 'Microsoft Clarity',
      subtitle: 'Opsiyonel - Kullanıcı davranış analizi (heatmap, session recording)',
      required: false,
      fields: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.clarity_enabled}
                onChange={(e) => updateSettings('clarity_enabled', e.target.checked)}
                className="w-4 h-4 accent-[#c8ff00]"
              />
              <span className="text-white">Clarity Aktif</span>
            </label>
          </div>
          <InputField
            label="Clarity Project ID"
            value={settings?.clarity_project_id || ''}
            onChange={(v) => updateSettings('clarity_project_id', v)}
            placeholder="Project ID"
            hint="clarity.microsoft.com > Settings > Project ID"
          />
        </div>
      )
    },
    {
      key: 'hotjar',
      title: 'Hotjar',
      subtitle: 'Opsiyonel - Kullanıcı davranış analizi',
      required: false,
      fields: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.hotjar_enabled}
                onChange={(e) => updateSettings('hotjar_enabled', e.target.checked)}
                className="w-4 h-4 accent-[#c8ff00]"
              />
              <span className="text-white">Hotjar Aktif</span>
            </label>
          </div>
          <InputField
            label="Hotjar Site ID"
            value={settings?.hotjar_site_id || ''}
            onChange={(v) => updateSettings('hotjar_site_id', v)}
            placeholder="Site ID"
            hint="insights.hotjar.com > Settings > Site ID"
          />
        </div>
      )
    },
    {
      key: 'events',
      title: 'Event Konfigürasyonu',
      subtitle: 'Scroll depth ve time on page eşikleri',
      required: false,
      fields: (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Scroll Depth Eşikleri (%)</label>
            <div className="flex gap-2">
              {settings?.scroll_depth_thresholds?.map((threshold, idx) => (
                <input
                  key={idx}
                  type="number"
                  value={threshold}
                  onChange={(e) => {
                    const newThresholds = [...settings.scroll_depth_thresholds];
                    newThresholds[idx] = parseInt(e.target.value) || 0;
                    updateSettings('scroll_depth_thresholds', newThresholds);
                  }}
                  className="w-20 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 text-center"
                />
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-1">Kullanıcı bu yüzdelere ulaştığında event tetiklenir</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Time on Page Eşikleri (saniye)</label>
            <div className="flex gap-2">
              {settings?.time_on_page_thresholds?.map((threshold, idx) => (
                <input
                  key={idx}
                  type="number"
                  value={threshold}
                  onChange={(e) => {
                    const newThresholds = [...settings.time_on_page_thresholds];
                    newThresholds[idx] = parseInt(e.target.value) || 0;
                    updateSettings('time_on_page_thresholds', newThresholds);
                  }}
                  className="w-20 bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 text-center"
                />
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-1">Kullanıcı bu süre sayfada kaldığında event tetiklenir</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <Toaster position="top-right" richColors />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Measurement & Tracking</h1>
            <p className="text-gray-500 mt-1">Google Tag Manager, GA4, Ads ve diğer tracking servisleri</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleTest}
              disabled={testing}
              className="flex items-center gap-2 px-4 py-2 border border-[#333] text-gray-400 hover:text-white hover:border-[#c8ff00] transition-colors"
            >
              <TestTube className="w-4 h-4" />
              {testing ? 'Test ediliyor...' : 'Konfigürasyonu Test Et'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-2 bg-[#c8ff00] text-black px-4 py-2 font-medium hover:bg-white transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className={`p-4 border ${testResults.overall?.ready ? 'border-green-500/50 bg-green-500/10' : 'border-yellow-500/50 bg-yellow-500/10'}`}>
            <div className="flex items-center gap-2 mb-3">
              {testResults.overall?.ready ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <span className={testResults.overall?.ready ? 'text-green-500' : 'text-yellow-500'}>
                {testResults.overall?.message}
              </span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {Object.entries(testResults).filter(([k]) => k !== 'overall').map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center ${value.configured ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                    {value.configured ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  </div>
                  <span className="text-xs text-gray-400 capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-gray-300 text-sm">
              <p className="mb-2"><strong>GTM ve GA4 zorunludur.</strong> Tüm event tracking GTM üzerinden yapılır.</p>
              <p>ID'leri girdikten sonra GTM container'ınızda ilgili tag'leri oluşturmanız gerekir:</p>
              <ul className="list-disc list-inside mt-2 text-gray-400">
                <li>GA4 Configuration Tag</li>
                <li>GA4 Event Tags (lead_form_submit, contact_click, vs.)</li>
                <li>Google Ads Conversion Tags (opsiyonel)</li>
                <li>Meta Pixel Base Tag (opsiyonel)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.key} className="bg-[#111] border border-[#222]">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white text-left">{section.title}</h3>
                      {section.required && (
                        <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400">Zorunlu</span>
                      )}
                      {testResults?.[section.key]?.configured && (
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400">Yapılandırıldı</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm text-left">{section.subtitle}</p>
                  </div>
                </div>
                {expandedSections.includes(section.key) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections.includes(section.key) && (
                <div className="border-t border-[#222] p-6">
                  {section.fields}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Event Reference */}
        <div className="bg-[#111] border border-[#222] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📋 Event Referansı</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left text-gray-400 py-2">Event</th>
                  <th className="text-left text-gray-400 py-2">Tip</th>
                  <th className="text-left text-gray-400 py-2">Açıklama</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-[#222]">
                  <td className="py-2 font-mono text-[#c8ff00]">lead_form_submit</td>
                  <td className="py-2"><span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5">Primary</span></td>
                  <td className="py-2">Form başarıyla gönderildiğinde</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="py-2 font-mono text-white">contact_click</td>
                  <td className="py-2"><span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5">Secondary</span></td>
                  <td className="py-2">Telefon, WhatsApp veya email tıklaması</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="py-2 font-mono text-white">service_cta_click</td>
                  <td className="py-2"><span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5">Secondary</span></td>
                  <td className="py-2">Hizmet sayfasındaki CTA tıklaması</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="py-2 font-mono text-white">blog_to_service_click</td>
                  <td className="py-2"><span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5">Secondary</span></td>
                  <td className="py-2">Blog'dan hizmete geçiş</td>
                </tr>
                <tr className="border-b border-[#222]">
                  <td className="py-2 font-mono text-white">scroll_depth</td>
                  <td className="py-2"><span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5">Engagement</span></td>
                  <td className="py-2">Sayfa scroll yüzdesi (25%, 50%, 75%)</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-white">time_on_page</td>
                  <td className="py-2"><span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5">Engagement</span></td>
                  <td className="py-2">Sayfada geçirilen süre (30s, 60s)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Helper Components
const InputField = ({ label, value, onChange, placeholder, hint }) => (
  <div>
    <label className="block text-gray-400 text-sm mb-2">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0a0a0a] border border-[#333] text-white px-4 py-2 font-mono"
    />
    {hint && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
  </div>
);

export default MeasurementSettingsPage;
