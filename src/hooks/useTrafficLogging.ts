import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getTrackingContext } from '@/lib/tracking';
import { useABTest } from '@/contexts/ABTestContext';

/**
 * Log a traffic event to Supabase
 */
export async function logTrafficEvent(
  eventType: string,
  eventData?: Record<string, any>
) {
  try {
    const tracking = getTrackingContext();
    
    await supabase.functions.invoke('log-traffic-event', {
      body: {
        event_type: eventType,
        page_url: window.location.href,
        referrer: document.referrer,
        session_id: tracking.session_id,
        intent: tracking.intent,
        device_type: tracking.device_type,
        utm_source: tracking.utm_source,
        utm_medium: tracking.utm_medium,
        utm_campaign: tracking.utm_campaign,
        utm_content: tracking.utm_content,
        utm_term: tracking.utm_term,
        gclid: tracking.gclid,
        yclid: tracking.yclid,
        variant_id: eventData?.variant_id || null,
        keyword_raw: tracking.keyword || null,
        event_data: eventData || {}
      }
    });
  } catch (error) {
    console.error('Error logging traffic event:', error);
  }
}

/**
 * Hook to automatically log page_view on component mount
 */
export function useTrafficLogging() {
  const { variantId } = useABTest();

  useEffect(() => {
    // Log page view when component mounts
    logTrafficEvent('page_view', {
      variant_id: variantId,
      timestamp: new Date().toISOString()
    });
  }, [variantId]);
}
