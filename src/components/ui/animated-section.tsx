import { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'blur-in';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  threshold?: number;
}

const animationClasses: Record<AnimationType, string> = {
  'fade-up': 'animate-fade-up',
  'fade-down': 'animate-fade-down',
  'fade-left': 'animate-fade-left',
  'fade-right': 'animate-fade-right',
  'scale-up': 'animate-scale-up',
  'blur-in': 'animate-blur-in',
};

export function AnimatedSection({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  className,
  threshold = 0.1
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView({ threshold });
  
  // Detect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Skip animations if reduced motion is preferred
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={cn(
        !isInView && 'opacity-0',
        isInView && animationClasses[animation],
        className
      )}
      style={{ 
        animationDelay: isInView ? `${delay}ms` : undefined,
        contain: 'layout style paint'
      }}
    >
      {children}
    </div>
  );
}
