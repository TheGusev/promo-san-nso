import { useRef, useEffect } from 'react';

/**
 * Hook to track when a form component was first rendered.
 * Used to detect bots that submit forms too quickly.
 * 
 * @returns The timestamp when the component was mounted
 */
export function useFormStartTime(): number {
  const startTimeRef = useRef<number>(Date.now());
  
  useEffect(() => {
    // Reset on mount to get accurate timing
    startTimeRef.current = Date.now();
  }, []);
  
  return startTimeRef.current;
}
