import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { VariantId, Intent } from '@/config/copyMap';
import { getSessionId, detectIntent, getTrackingContext } from '@/lib/tracking';
import { supabase } from '@/integrations/supabase/client';

interface ABTestContextType {
  variantId: VariantId;
  intent: Intent;
  impressionId: string | null;
  isLoading: boolean;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

export function ABTestProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ABTestContextType>({
    variantId: 'A',
    intent: 'default',
    impressionId: null,
    isLoading: true
  });

  useEffect(() => {
    const loadVariant = async () => {
      try {
        const sessionId = getSessionId();
        const detectedIntent = detectIntent() as Intent;
        const trackingContext = getTrackingContext();

        // Check localStorage first (persists across sessions)
        const localVariant = localStorage.getItem(`variant_${detectedIntent}`);
        const localImpressionId = localStorage.getItem(`impression_${detectedIntent}`);
        
        if (localVariant) {
          setState({
            variantId: localVariant as VariantId,
            intent: detectedIntent,
            impressionId: localImpressionId,
            isLoading: false
          });
          return;
        }

        // Check sessionStorage (current session only)
        const cachedVariant = sessionStorage.getItem(`variant_${detectedIntent}`);
        const cachedImpressionId = sessionStorage.getItem(`impression_${detectedIntent}`);
        
        if (cachedVariant && cachedImpressionId) {
          setState({
            variantId: cachedVariant as VariantId,
            intent: detectedIntent,
            impressionId: cachedImpressionId,
            isLoading: false
          });
          return;
        }

        // Create timeout promise (3 seconds)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3000)
        );

        // Race between API call and timeout
        const apiPromise = supabase.functions.invoke('mvt-optimize', {
          body: {
            test_name: 'main_variant',
            intent: detectedIntent,
            session_id: sessionId,
            device_type: trackingContext.device_type,
            utm_source: trackingContext.utm_source
          }
        });

        const { data, error } = await Promise.race([apiPromise, timeoutPromise]) as any;

        if (error) {
          throw error;
        }

        const selectedVariant = data.variant as VariantId;
        const selectedImpressionId = data.impression_id;
        
        setState({
          variantId: selectedVariant,
          intent: detectedIntent,
          impressionId: selectedImpressionId,
          isLoading: false
        });
        
        // Cache in both storages
        sessionStorage.setItem(`variant_${detectedIntent}`, selectedVariant);
        localStorage.setItem(`variant_${detectedIntent}`, selectedVariant);
        
        if (selectedImpressionId) {
          sessionStorage.setItem(`impression_${detectedIntent}`, selectedImpressionId);
          localStorage.setItem(`impression_${detectedIntent}`, selectedImpressionId);
        }
        
        console.log('MVT variant selected:', {
          variant: selectedVariant,
          method: data.method,
          intent: detectedIntent
        });
        
      } catch (error) {
        console.error('Error loading variant (using fallback):', error);
        
        // Fallback to random variant
        const fallbackVariants: VariantId[] = ['A', 'B', 'C', 'D', 'E', 'F'];
        const randomVariant = fallbackVariants[Math.floor(Math.random() * fallbackVariants.length)];
        const detectedIntent = detectIntent() as Intent;
        
        setState({
          variantId: randomVariant,
          intent: detectedIntent,
          impressionId: null,
          isLoading: false
        });
        
        sessionStorage.setItem(`variant_${detectedIntent}`, randomVariant);
        localStorage.setItem(`variant_${detectedIntent}`, randomVariant);
      }
    };

    loadVariant();
  }, []);

  return (
    <ABTestContext.Provider value={state}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within ABTestProvider');
  }
  return context;
}
