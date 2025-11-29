import { useEffect, useRef } from 'react';
import { reachGoal } from '@/lib/yandexMetrika';

/**
 * Hook to track scroll depth milestones (25%, 50%, 75%, 100%)
 * Sends goals to Yandex.Metrika when user reaches each milestone
 */
export function useScrollTracking() {
  const milestones = useRef<Record<number, boolean>>({ 
    25: false, 
    50: false, 
    75: false, 
    100: false 
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      // Check each milestone
      [25, 50, 75, 100].forEach((milestone) => {
        if (scrollPercent >= milestone && !milestones.current[milestone]) {
          milestones.current[milestone] = true;
          reachGoal(`scroll_${milestone}`);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}
