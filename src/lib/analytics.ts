// Google Analytics (GA4) window type extension
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export type EventNames = 
  | 'page_view'
  | 'test_start'
  | 'test_complete'
  | 'ad_view'
  | 'ad_click'
  | 'affiliate_view'
  | 'affiliate_click'
  | 'share_copy';

export const trackEvent = (eventName: EventNames, params?: Record<string, any>) => {
  // 1. Google Analytics 트래킹 (배포 환경)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
  
  // 2. 개발 환경 콘솔 로깅 (로컬)
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 [Analytics Event] ${eventName}`, params || '');
  }
};

export const trackABTestSelection = (experimentId: string, variantId: string) => {
  trackEvent('page_view', {
    experiment_id: experimentId,
    variant_id: variantId
  });
};
