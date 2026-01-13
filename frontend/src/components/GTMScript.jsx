/**
 * Google Tag Manager Script Component
 * Dynamically loads GTM based on backend configuration
 */

import { useEffect, useState } from 'react';
import { initMeasurement, getConfig } from '../utils/measurement';

const GTMScript = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    const loadGTM = async () => {
      // First, get configuration from backend
      await initMeasurement();
      const config = getConfig();
      
      if (!config?.gtm?.enabled || !config?.gtm?.containerId) {
        console.log('[GTM] Not configured or disabled');
        return;
      }
      
      const containerId = config.gtm.containerId;
      
      // Check if already loaded
      if (window.google_tag_manager?.[containerId]) {
        setLoaded(true);
        return;
      }
      
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      
      // Create and append GTM script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
      
      script.onload = () => {
        console.log(`[GTM] Loaded: ${containerId}`);
        setLoaded(true);
      };
      
      script.onerror = () => {
        console.error('[GTM] Failed to load');
      };
      
      document.head.appendChild(script);
      
      // Add noscript iframe to body
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${containerId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.insertBefore(noscript, document.body.firstChild);
    };
    
    loadGTM();
  }, []);
  
  return null; // This component doesn't render anything
};

export default GTMScript;
