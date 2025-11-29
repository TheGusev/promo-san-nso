// Yandex.Metrika tracking utilities

declare global {
  interface Window {
    ym: (counterId: number, action: string, ...args: any[]) => void;
  }
}

const COUNTER_ID = 'XXXXXXXXX' as any; // Replace with actual counter ID

/**
 * Send a goal to Yandex.Metrika
 * @param goalName - Goal identifier (e.g., 'lead_submit', 'calc_open')
 * @param params - Optional parameters to attach to the goal
 */
export function reachGoal(goalName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.ym) {
    try {
      window.ym(COUNTER_ID, 'reachGoal', goalName, params);
      console.log('[YM] Goal reached:', goalName, params);
    } catch (error) {
      console.error('[YM] Error reaching goal:', error);
    }
  }
}

/**
 * Send a hit for SPA navigation
 * @param url - Page URL (optional, defaults to current pathname)
 * @param options - Additional options (title, referer)
 */
export function hit(url?: string, options?: { title?: string; referer?: string }) {
  if (typeof window !== 'undefined' && window.ym) {
    try {
      window.ym(COUNTER_ID, 'hit', url || window.location.pathname, options);
      console.log('[YM] Hit sent:', url || window.location.pathname);
    } catch (error) {
      console.error('[YM] Error sending hit:', error);
    }
  }
}

/**
 * Send user parameters (visit context)
 * @param params - User parameters to attach to the visit
 */
export function userParams(params: Record<string, any>) {
  if (typeof window !== 'undefined' && window.ym) {
    try {
      window.ym(COUNTER_ID, 'userParams', params);
      console.log('[YM] User params sent:', params);
    } catch (error) {
      console.error('[YM] Error sending user params:', error);
    }
  }
}
