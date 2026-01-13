/**
 * Measurement & Tracking Utilities
 * Phase 2.5 - Event tracking for GA4, Google Ads, Meta Pixel
 */

// ============================================
// CONFIGURATION
// ============================================

let measurementConfig = null;
let isInitialized = false;

/**
 * Initialize measurement configuration from backend
 */
export const initMeasurement = async () => {
  if (isInitialized) return measurementConfig;
  
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/measurement/config`);
    measurementConfig = await response.json();
    isInitialized = true;
    
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    console.log('[Measurement] Config loaded:', {
      gtm: measurementConfig.gtm?.containerId ? 'configured' : 'not configured',
      ga4: measurementConfig.ga4?.measurementId ? 'configured' : 'not configured',
      metaPixel: measurementConfig.metaPixel?.pixelId ? 'configured' : 'not configured',
    });
    
    return measurementConfig;
  } catch (error) {
    console.error('[Measurement] Failed to load config:', error);
    return null;
  }
};

/**
 * Get current configuration
 */
export const getConfig = () => measurementConfig;

// ============================================
// DATA LAYER PUSH
// ============================================

/**
 * Push event to dataLayer (GTM will pick this up)
 */
export const pushToDataLayer = (eventName, eventParams = {}) => {
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  
  const eventData = {
    event: eventName,
    ...eventParams,
    // Add common parameters
    timestamp: new Date().toISOString(),
  };
  
  window.dataLayer.push(eventData);
  
  if (measurementConfig?.ga4?.debugMode) {
    console.log('[DataLayer]', eventName, eventData);
  }
};

// ============================================
// PAGE CONTEXT HELPERS
// ============================================

/**
 * Determine page type from pathname
 */
export const getPageType = (pathname = window.location.pathname) => {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/hizmetler/') || pathname.startsWith('/services/')) return 'service';
  if (pathname.startsWith('/blog/')) return 'blog';
  if (pathname.startsWith('/konu/') || pathname.startsWith('/hub/')) return 'hub';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'other';
};

/**
 * Extract content ID (slug) from pathname
 */
export const getContentId = (pathname = window.location.pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] || null;
};

/**
 * Get device type
 */
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'unknown';
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
};

/**
 * Get traffic source from URL params or referrer
 */
export const getTrafficSource = () => {
  if (typeof window === 'undefined') return 'direct';
  
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const gclid = params.get('gclid');
  const fbclid = params.get('fbclid');
  
  if (gclid) return 'google_ads';
  if (fbclid) return 'meta_ads';
  if (utmSource) return utmSource;
  
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  if (referrer.includes('google.')) return 'organic_google';
  if (referrer.includes('facebook.') || referrer.includes('fb.')) return 'organic_meta';
  
  return 'referral';
};

/**
 * Get common event parameters
 */
export const getCommonParams = (serviceName = null) => ({
  page_type: getPageType(),
  content_id: getContentId(),
  service_name: serviceName,
  source: getTrafficSource(),
  device_type: getDeviceType(),
  page_url: window.location.href,
  page_path: window.location.pathname,
});

// ============================================
// STANDARD EVENTS
// ============================================

/**
 * Track page view with enhanced parameters
 */
export const trackPageView = (params = {}) => {
  pushToDataLayer('page_view', {
    ...getCommonParams(params.serviceName),
    page_title: document.title,
    ...params,
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percentage, serviceName = null) => {
  pushToDataLayer('scroll_depth', {
    scroll_percentage: percentage,
    ...getCommonParams(serviceName),
  });
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (seconds, serviceName = null) => {
  pushToDataLayer('time_on_page', {
    time_threshold: `${seconds}s`,
    time_seconds: seconds,
    ...getCommonParams(serviceName),
  });
};

// ============================================
// CONVERSION EVENTS
// ============================================

/**
 * Track lead form submission (PRIMARY CONVERSION)
 * @param {Object} params - Form parameters
 * @param {string} params.formId - Form identifier
 * @param {string} params.serviceName - Related service (if any)
 * @param {string} params.leadType - 'general' | 'service_specific'
 */
export const trackLeadFormSubmit = (params = {}) => {
  const eventParams = {
    event: 'lead_form_submit',
    form_id: params.formId || 'contact_form',
    lead_type: params.leadType || 'general',
    ...getCommonParams(params.serviceName),
  };
  
  pushToDataLayer('lead_form_submit', eventParams);
  
  // Also push for Google Ads conversion
  if (measurementConfig?.googleAds?.enabled && measurementConfig?.googleAds?.id) {
    const primaryConversion = measurementConfig.googleAds.conversions?.find(c => c.is_primary);
    if (primaryConversion?.conversion_label) {
      pushToDataLayer('conversion', {
        send_to: `${measurementConfig.googleAds.id}/${primaryConversion.conversion_label}`,
        ...eventParams,
      });
    }
  }
};

/**
 * Track contact click (phone, whatsapp, email)
 */
export const trackContactClick = (contactType, serviceName = null) => {
  pushToDataLayer('contact_click', {
    contact_type: contactType, // 'phone' | 'whatsapp' | 'email'
    ...getCommonParams(serviceName),
  });
};

/**
 * Track service CTA click
 */
export const trackServiceCtaClick = (serviceName, ctaLocation = 'hero') => {
  pushToDataLayer('service_cta_click', {
    service_name: serviceName,
    cta_location: ctaLocation, // 'hero' | 'mid' | 'footer'
    ...getCommonParams(serviceName),
  });
};

/**
 * Track blog to service navigation
 */
export const trackBlogToServiceClick = (fromPost, toService) => {
  pushToDataLayer('blog_to_service_click', {
    from_post: fromPost,
    to_service: toService,
    ...getCommonParams(toService),
  });
};

/**
 * Track any CTA click
 */
export const trackCtaClick = (ctaName, ctaLocation, serviceName = null) => {
  pushToDataLayer('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
    ...getCommonParams(serviceName),
  });
};

// ============================================
// SCROLL & TIME TRACKING HOOKS
// ============================================

let scrollTracked = { 25: false, 50: false, 75: false };
let timeTracked = { 30: false, 60: false };

/**
 * Initialize scroll depth tracking
 */
export const initScrollTracking = (serviceName = null) => {
  if (typeof window === 'undefined') return;
  
  // Reset tracking state for new page
  scrollTracked = { 25: false, 50: false, 75: false };
  
  const thresholds = measurementConfig?.events?.scrollDepthThresholds || [25, 50, 75];
  
  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
    
    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !scrollTracked[threshold]) {
        scrollTracked[threshold] = true;
        trackScrollDepth(threshold, serviceName);
      }
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Return cleanup function
  return () => window.removeEventListener('scroll', handleScroll);
};

/**
 * Initialize time on page tracking
 */
export const initTimeTracking = (serviceName = null) => {
  if (typeof window === 'undefined') return;
  
  // Reset tracking state for new page
  timeTracked = { 30: false, 60: false };
  
  const thresholds = measurementConfig?.events?.timeOnPageThresholds || [30, 60];
  const timers = [];
  
  thresholds.forEach(seconds => {
    const timer = setTimeout(() => {
      if (!timeTracked[seconds]) {
        timeTracked[seconds] = true;
        trackTimeOnPage(seconds, serviceName);
      }
    }, seconds * 1000);
    timers.push(timer);
  });
  
  // Return cleanup function
  return () => timers.forEach(t => clearTimeout(t));
};

// ============================================
// REACT HOOK
// ============================================

/**
 * React hook for page tracking
 * Usage: usePageTracking({ serviceName: 'google-ads-yonetimi' })
 */
export const usePageTracking = (params = {}) => {
  // This will be imported in React components
  // Implementation moved to a separate hook file
};

export default {
  initMeasurement,
  getConfig,
  pushToDataLayer,
  trackPageView,
  trackScrollDepth,
  trackTimeOnPage,
  trackLeadFormSubmit,
  trackContactClick,
  trackServiceCtaClick,
  trackBlogToServiceClick,
  trackCtaClick,
  initScrollTracking,
  initTimeTracking,
  getPageType,
  getContentId,
  getDeviceType,
  getTrafficSource,
  getCommonParams,
};
