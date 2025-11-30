import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Detect low-end devices
const isLowEndDevice = (): boolean => {
  const memory = (navigator as any).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  
  // Consider device low-end if:
  // - Has 4GB RAM or less
  // - Has 4 cores or less
  // - Is a mobile device with unknown specs
  return (memory && memory <= 4) || (cores && cores <= 4) || (isMobile && !memory);
};

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  
  // For low-end devices, skip intersection observer and show immediately
  const [isInView, setIsInView] = useState(isLowEndDevice());

  useEffect(() => {
    // Skip observer setup on low-end devices
    if (isLowEndDevice()) return;
    
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
}
