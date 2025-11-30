import { useEffect, useRef } from 'react';
import { logTrafficEvent } from './useTrafficLogging';
import { reachGoal } from '@/lib/yandexMetrika';
import { useABTest } from '@/contexts/ABTestContext';

/**
 * Hook to track user engagement metrics:
 * - Time on page (sent on page exit)
 * - Maximum scroll depth (sent on page exit)
 * - Scroll milestones at 25%, 50%, 75%, 100% (sent when reached)
 */
export function useEngagementTracking() {
  const { variantId } = useABTest();
  const startTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const scrollMilestones = useRef<Record<number, boolean>>({ 
    25: false, 
    50: false, 
    75: false, 
    100: false 
  });
  const engagementSent = useRef(false);

  useEffect(() => {
    let lastScrollTime = 0;

    // Track scroll depth and milestones with throttling
    const handleScroll = () => {
      // Throttle: only run once every 200ms for performance
      const now = Date.now();
      if (now - lastScrollTime < 200) return;
      lastScrollTime = now;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);
      maxScrollDepth.current = Math.max(maxScrollDepth.current, scrollPercent);

      // Log scroll milestones to DB and Yandex.Metrika
      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPercent >= milestone && !scrollMilestones.current[milestone]) {
          scrollMilestones.current[milestone] = true;
          reachGoal(`scroll_${milestone}`);
          logTrafficEvent(`scroll_${milestone}`, { variant_id: variantId });
        }
      });
    };

    // Send engagement summary when leaving the page
    const sendEngagementSummary = () => {
      if (engagementSent.current) return;
      engagementSent.current = true;
      
      const timeOnPage = Math.round((Date.now() - startTime.current) / 1000);
      
      logTrafficEvent('engagement_summary', {
        variant_id: variantId,
        time_on_page: timeOnPage,
        max_scroll_depth: maxScrollDepth.current
      });
    };

    // Handle page visibility changes (tab switching, minimizing)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendEngagementSummary();
      }
    };

    // Handle page unload
    const handleBeforeUnload = () => {
      sendEngagementSummary();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [variantId]);
}
