import React from 'react';
import { History, User, Clock } from 'lucide-react';

/**
 * ChangeLog - Light audit trail display
 * Shows who made changes and when
 */
const ChangeLog = ({ 
  createdAt, 
  createdBy, 
  updatedAt, 
  updatedBy, 
  lastChangeSummary 
}) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return '';
  };

  const relativeUpdated = formatRelativeTime(updatedAt);

  return (
    <div className="bg-[#111] border border-[#222]">
      {/* Header */}
      <div className="p-4 border-b border-[#222] flex items-center gap-2">
        <History className="w-5 h-5 text-[#c8ff00]" />
        <span className="text-white font-medium">Değişiklik Geçmişi</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Last Update */}
        {updatedAt && (
          <div className="space-y-1">
            <p className="text-gray-500 text-xs uppercase tracking-wide">Son Güncelleme</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-white text-sm">{formatDate(updatedAt)}</span>
              {relativeUpdated && (
                <span className="text-gray-500 text-xs">({relativeUpdated})</span>
              )}
            </div>
            {updatedBy && (
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">{updatedBy}</span>
              </div>
            )}
            {lastChangeSummary && (
              <p className="text-gray-500 text-xs mt-2 italic">
                "{lastChangeSummary}"
              </p>
            )}
          </div>
        )}

        {/* Created */}
        {createdAt && (
          <div className="space-y-1 pt-3 border-t border-[#222]">
            <p className="text-gray-500 text-xs uppercase tracking-wide">Oluşturulma</p>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">{formatDate(createdAt)}</span>
            </div>
            {createdBy && (
              <div className="flex items-center gap-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">{createdBy}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeLog;
