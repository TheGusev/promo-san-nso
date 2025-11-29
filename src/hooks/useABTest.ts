import { useState, useEffect } from 'react';
import type { VariantId, Intent } from '@/config/copyMap';
import { getSessionId, detectIntent, getTrackingContext } from '@/lib/tracking';
import { supabase } from '@/integrations/supabase/client';

export function useABTest() {
  const [variantId, setVariantId] = useState<VariantId>('A');
  const [intent, setIntent] = useState<Intent>('default');
  const [impressionId, setImpressionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVariant = async () => {
      try {
        const sessionId = getSessionId();
        const detectedIntent = detectIntent() as Intent;
        const trackingContext = getTrackingContext();
        
        setIntent(detectedIntent);

        // Check if variant is already assigned in session
        const cachedVariant = sessionStorage.getItem(`variant_${detectedIntent}`);
        const cachedImpressionId = sessionStorage.getItem(`impression_${detectedIntent}`);
        
        if (cachedVariant && cachedImpressionId) {
          setVariantId(cachedVariant as VariantId);
          setImpressionId(cachedImpressionId);
          setIsLoading(false);
          return;
        }

        // Call mvt-optimize edge function
        const { data, error } = await supabase.functions.invoke('mvt-optimize', {
          body: {
            test_name: 'main_variant',
            intent: detectedIntent,
            session_id: sessionId,
            device_type: trackingContext.device_type,
            utm_source: trackingContext.utm_source
          }
        });

        if (error) {
          console.error('Error calling mvt-optimize:', error);
          // Fallback to random
          const fallbackVariants: VariantId[] = ['A', 'B', 'C', 'D', 'E', 'F'];
          const randomVariant = fallbackVariants[Math.floor(Math.random() * fallbackVariants.length)];
          setVariantId(randomVariant);
          sessionStorage.setItem(`variant_${detectedIntent}`, randomVariant);
        } else {
          const selectedVariant = data.variant as VariantId;
          const selectedImpressionId = data.impression_id;
          
          setVariantId(selectedVariant);
          setImpressionId(selectedImpressionId);
          sessionStorage.setItem(`variant_${detectedIntent}`, selectedVariant);
          if (selectedImpressionId) {
            sessionStorage.setItem(`impression_${detectedIntent}`, selectedImpressionId);
          }
          
          console.log('MVT variant selected:', {
            variant: selectedVariant,
            method: data.method,
            intent: detectedIntent
          });
        }
        
      } catch (error) {
        console.error('Error loading variant:', error);
        setVariantId('A'); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadVariant();
  }, []);

  return { variantId, intent, impressionId, isLoading };
}
