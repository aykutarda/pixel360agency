/**
 * React Hooks for Measurement & Tracking
 */

import { useEffect, useRef } from 'react';
import {
  initMeasurement,
  trackPageView,
  initScrollTracking,
  initTimeTracking,
  getConfig,
} from './measurement';

/**
 * Initialize measurement on app load
 * Place this in your App.js or root component
 */
export const useMeasurementInit = () => {
  const initialized = useRef(false);
  
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initMeasurement();
    }
  }, []);
};

/**
 * Track page views and engagement
 * @param {Object} params - Page parameters
 * @param {string} params.serviceName - Service name for service pages
 * @param {string} params.pageType - Override auto-detected page type
 * @param {string} params.contentId - Override auto-detected content ID
 */
export const usePageTracking = (params = {}) => {
  const { serviceName, pageType, contentId } = params;
  
  useEffect(() => {
    // Track page view
    trackPageView({ serviceName, pageType, contentId });
    
    // Initialize scroll tracking
    const cleanupScroll = initScrollTracking(serviceName);
    
    // Initialize time tracking
    const cleanupTime = initTimeTracking(serviceName);
    
    return () => {
      if (cleanupScroll) cleanupScroll();
      if (cleanupTime) cleanupTime();
    };
  }, [serviceName, pageType, contentId]);
};

/**
 * Get measurement configuration
 */
export const useMeasurementConfig = () => {
  return getConfig();
};

export default {
  useMeasurementInit,
  usePageTracking,
  useMeasurementConfig,
};
