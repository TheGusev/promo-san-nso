// Tracking utilities for A/B testing and analytics

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

export function detectIntent(): string {
  const url = window.location.href.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  
  // Check URL parameters
  if (params.get('service') === 'bedbugs' || url.includes('klop')) return 'flat_bedbugs';
  if (params.get('service') === 'cockroaches' || url.includes('tarakan')) return 'flat_cockroaches';
  if (params.get('type') === 'office' || url.includes('ofis')) return 'office_disinfection';
  if (params.get('type') === 'warehouse' || url.includes('sklad')) return 'warehouse_deratization';
  if (params.get('type') === 'restaurant' || url.includes('restoran')) return 'restaurant_disinfection';
  if (params.get('ses') === 'prep' || url.includes('ses')) return 'ses_check_preparation';
  
  return 'default';
}

export function getDeviceType(): string {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
    keyword: params.get('keyword') || '',
    yclid: params.get('yclid') || '',
    gclid: params.get('gclid') || '',
  };
}

export function getTrackingContext() {
  const utm = getUTMParams();
  return {
    session_id: getSessionId(),
    intent: detectIntent(),
    device_type: getDeviceType(),
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,
    keyword: utm.keyword,
    yclid: utm.yclid,
    gclid: utm.gclid,
  };
}
