import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, ArrowRight, Shield } from 'lucide-react';

/**
 * PublishGuard - SEO validation before publishing
 * Checks required fields and shows warnings
 */

// Validation rules
const VALIDATION_RULES = {
  service: [
    { field: 'seo_title', label: 'SEO Title', required: true, minLength: 30, maxLength: 60 },
    { field: 'seo_description', label: 'SEO Description', required: true, minLength: 120, maxLength: 160 },
    { field: 'seo_slug', label: 'SEO Slug', required: true },
    { field: 'seo_focus_keyword', label: 'Focus Keyword', required: true },
    { field: 'hero_h1', label: 'H1 Başlık', required: true },
    { field: 'hero_summary', label: 'Hero Özeti', required: true, minLength: 50 },
    { field: 'problem_block', label: 'Problem Bloğu', required: false },
    { field: 'solution_block', label: 'Çözüm Bloğu', required: false },
  ],
  blog: [
    { field: 'seo_title', label: 'SEO Title', required: true, minLength: 30, maxLength: 60 },
    { field: 'seo_description', label: 'SEO Description', required: true, minLength: 120, maxLength: 160 },
    { field: 'seo_slug', label: 'SEO Slug', required: true },
    { field: 'focus_keyword', label: 'Focus Keyword', required: true },
    { field: 'title', label: 'Başlık', required: true },
    { field: 'excerpt', label: 'Özet', required: true, minLength: 50 },
    { field: 'content', label: 'İçerik', required: true, minLength: 300 },
    { field: 'belongs_to_hub_id', label: 'Bağlı Hub', required: false, warning: 'Hub bağlantısı SEO için önerilir' },
    { field: 'supports_service_id', label: 'Desteklenen Hizmet', required: false, warning: 'Hizmet bağlantısı dönüşüm için önerilir' },
  ],
  hub: [
    { field: 'seo_title', label: 'SEO Title', required: true, minLength: 30, maxLength: 60 },
    { field: 'seo_description', label: 'SEO Description', required: true, minLength: 120, maxLength: 160 },
    { field: 'seo_slug', label: 'SEO Slug', required: true },
    { field: 'primary_keyword', label: 'Primary Keyword', required: true },
    { field: 'title', label: 'Başlık', required: true },
    { field: 'intro', label: 'Giriş Metni', required: true, minLength: 100 },
  ]
};

// Validate data against rules
export const validatePublish = (data, contentType = 'service') => {
  const rules = VALIDATION_RULES[contentType] || VALIDATION_RULES.service;
  const errors = [];
  const warnings = [];
  
  rules.forEach(rule => {
    const value = data[rule.field];
    const hasValue = value && value.toString().trim().length > 0;
    
    // Required check
    if (rule.required && !hasValue) {
      errors.push({
        field: rule.field,
        label: rule.label,
        message: `${rule.label} boş olamaz`,
        type: 'error'
      });
      return;
    }
    
    // If not required but has warning
    if (!rule.required && !hasValue && rule.warning) {
      warnings.push({
        field: rule.field,
        label: rule.label,
        message: rule.warning,
        type: 'warning'
      });
      return;
    }
    
    // Min length check
    if (hasValue && rule.minLength && value.length < rule.minLength) {
      errors.push({
        field: rule.field,
        label: rule.label,
        message: `${rule.label} en az ${rule.minLength} karakter olmalı (şu an: ${value.length})`,
        type: 'error'
      });
    }
    
    // Max length check
    if (hasValue && rule.maxLength && value.length > rule.maxLength) {
      warnings.push({
        field: rule.field,
        label: rule.label,
        message: `${rule.label} ${rule.maxLength} karakteri geçmemeli (şu an: ${value.length})`,
        type: 'warning'
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    hasWarnings: warnings.length > 0,
    errors,
    warnings,
    canPublish: errors.length === 0
  };
};

// PublishGuard Modal Component
const PublishGuardModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  data, 
  contentType = 'service',
  isLoading = false 
}) => {
  const [forcePublish, setForcePublish] = useState(false);
  
  if (!isOpen) return null;
  
  const validation = validatePublish(data, contentType);
  const { errors, warnings, canPublish } = validation;
  const hasIssues = errors.length > 0 || warnings.length > 0;
  
  const handleConfirm = () => {
    if (canPublish || forcePublish) {
      onConfirm();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-[#111] border border-[#222] w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#222] flex items-center gap-3">
          <Shield className={`w-6 h-6 ${canPublish ? 'text-green-500' : 'text-red-500'}`} />
          <div>
            <h3 className="text-white font-semibold">Yayınlama Kontrolü</h3>
            <p className="text-gray-500 text-sm">SEO ve içerik doğrulaması</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* No issues */}
          {!hasIssues && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-green-400 font-medium">Tüm kontroller başarılı!</p>
                <p className="text-gray-400 text-sm">İçerik yayına hazır.</p>
              </div>
            </div>
          )}
          
          {/* Errors */}
          {errors.length > 0 && (
            <div className="space-y-2">
              <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Hatalar ({errors.length})
              </p>
              {errors.map((error, idx) => (
                <div key={idx} className="p-3 bg-red-500/10 border border-red-500/30">
                  <p className="text-red-400 text-sm">{error.message}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              <p className="text-yellow-400 text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Uyarılar ({warnings.length})
              </p>
              {warnings.map((warning, idx) => (
                <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm">{warning.message}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Force publish option (only for warnings) */}
          {!canPublish && errors.length === 0 && warnings.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer p-3 bg-[#0a0a0a] border border-[#333]">
              <input
                type="checkbox"
                checked={forcePublish}
                onChange={(e) => setForcePublish(e.target.checked)}
                className="w-4 h-4 accent-[#c8ff00]"
              />
              <span className="text-gray-400 text-sm">Uyarılara rağmen yayınla</span>
            </label>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[#222] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleConfirm}
            disabled={(!canPublish && !forcePublish) || isLoading}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              canPublish || forcePublish
                ? 'bg-[#c8ff00] text-black hover:bg-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Yayınlanıyor...' : 'Yayınla'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishGuardModal;
export { validatePublish, VALIDATION_RULES };
