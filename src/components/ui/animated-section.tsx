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

export function AnimatedSection({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  className,
  threshold = 0.1
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView({ threshold });

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0',
        isInView && `animate-${animation}`,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
