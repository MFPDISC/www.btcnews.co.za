// Analytics and tracking utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track referral link clicks
export const trackReferralClick = (exchange: string, link: string) => {
  trackEvent('referral_click', 'affiliate', exchange);
  
  // Also save to our database
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'referral_click',
      exchange,
      link,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }),
  }).catch(console.error);
};

// Track page visits
export const trackVisit = (page: string) => {
  fetch('/api/analytics/visit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    }),
  }).catch(console.error);
};

// Track user interactions
export const trackInteraction = (element: string, action: string) => {
  trackEvent(action, 'interaction', element);
  
  fetch('/api/analytics/interaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      element,
      action,
      timestamp: new Date().toISOString(),
    }),
  }).catch(console.error);
};
