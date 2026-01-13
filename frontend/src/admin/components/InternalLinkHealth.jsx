import React, { useState, useEffect } from 'react';
import { Link2, AlertTriangle, CheckCircle, ArrowRight, FileText, Layers, ExternalLink } from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

/**
 * Internal Link Health Panel
 * Shows the linking status of a blog post to services and hubs
 */
const InternalLinkHealth = ({ 
  postId,
  supportsServiceId, 
  belongsToHubId,
  onServiceChange,
  onHubChange
}) => {
  const [services, setServices] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [linkedService, setLinkedService] = useState(null);
  const [linkedHub, setLinkedHub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [supportsServiceId, belongsToHubId]);

  const loadData = async () => {
    try {
      // Load all services and hubs
      const [servicesRes, hubsRes] = await Promise.all([
        fetch(`${API}/api/cms/services`),
        fetch(`${API}/api/cms/hubs`)
      ]);
      
      const servicesData = await servicesRes.json();
      const hubsData = await hubsRes.json();
      
      setServices(servicesData);
      setHubs(hubsData);
      
      // Find linked items
      if (supportsServiceId) {
        setLinkedService(servicesData.find(s => s.id === supportsServiceId));
      } else {
        setLinkedService(null);
      }
      
      if (belongsToHubId) {
        setLinkedHub(hubsData.find(h => h.id === belongsToHubId));
      } else {
        setLinkedHub(null);
      }
    } catch (error) {
      console.error('Error loading link health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const issues = [];
  const warnings = [];
  const successes = [];

  // Check service linking
  if (!supportsServiceId) {
    warnings.push({
      type: 'warning',
      message: 'Bu yazı hiçbir hizmeti desteklemiyor',
      suggestion: 'Bir hizmet seçerek dönüşüm potansiyelini artırın'
    });
  } else {
    successes.push({
      type: 'success',
      message: `"${linkedService?.name || 'Hizmet'}" hizmetini destekliyor`
    });
  }

  // Check hub linking
  if (!belongsToHubId) {
    warnings.push({
      type: 'warning',
      message: 'Bu yazı hiçbir hub\'a bağlı değil',
      suggestion: 'Bir hub seçerek SEO otoritesini güçlendirin'
    });
  } else {
    successes.push({
      type: 'success',
      message: `"${linkedHub?.title || 'Hub'}" hub\'ına bağlı`
    });
  }

  const healthScore = successes.length / (successes.length + warnings.length + issues.length) * 100;
  const healthColor = healthScore >= 100 ? 'text-green-500' : healthScore >= 50 ? 'text-yellow-500' : 'text-red-500';

  if (loading) {
    return (
      <div className="bg-[#111] border border-[#222] p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
          <span>Link durumu yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#222]">
      {/* Header */}
      <div className="p-4 border-b border-[#222] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[#c8ff00]" />
          <span className="text-white font-medium">Internal Link Health</span>
        </div>
        <span className={`text-sm font-mono ${healthColor}`}>
          {Math.round(healthScore)}%
        </span>
      </div>

      {/* Status Items */}
      <div className="p-4 space-y-3">
        {/* Successes */}
        {successes.map((item, idx) => (
          <div key={`success-${idx}`} className="flex items-start gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-green-400">{item.message}</span>
          </div>
        ))}

        {/* Warnings */}
        {warnings.map((item, idx) => (
          <div key={`warning-${idx}`} className="flex items-start gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-yellow-400">{item.message}</span>
              {item.suggestion && (
                <p className="text-gray-500 text-xs mt-1">{item.suggestion}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="p-4 border-t border-[#222] space-y-3">
        {/* Service Selector */}
        <div>
          <label className="block text-gray-400 text-xs mb-1">Desteklenen Hizmet</label>
          <select
            value={supportsServiceId || ''}
            onChange={(e) => onServiceChange(e.target.value || null)}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 text-sm"
          >
            <option value="">Seçiniz...</option>
            {services.filter(s => s.status === 'published').map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hub Selector */}
        <div>
          <label className="block text-gray-400 text-xs mb-1">Bağlı Hub</label>
          <select
            value={belongsToHubId || ''}
            onChange={(e) => onHubChange(e.target.value || null)}
            className="w-full bg-[#0a0a0a] border border-[#333] text-white px-3 py-2 text-sm"
          >
            <option value="">Seçiniz...</option>
            {hubs.filter(h => h.status === 'published').map(hub => (
              <option key={hub.id} value={hub.id}>
                {hub.title}
              </option>
            ))}
          </select>
        </div>

        {/* Linked Items Preview */}
        {(linkedService || linkedHub) && (
          <div className="mt-3 pt-3 border-t border-[#222] space-y-2">
            {linkedService && (
              <a
                href={`/hizmetler/${linkedService.seo_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#c8ff00] transition-colors"
              >
                <FileText className="w-3 h-3" />
                <span>{linkedService.name}</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )}
            {linkedHub && (
              <a
                href={`/konular/${linkedHub.seo_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#c8ff00] transition-colors"
              >
                <Layers className="w-3 h-3" />
                <span>{linkedHub.title}</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalLinkHealth;
