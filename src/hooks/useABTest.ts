import { useState, useEffect } from 'react';
import type { VariantId, Intent } from '@/config/copyMap';
import { getSessionId, detectIntent } from '@/lib/tracking';

export function useABTest() {
  const [variantId, setVariantId] = useState<VariantId>('A');
  const [intent, setIntent] = useState<Intent>('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVariant = async () => {
      try {
        const sessionId = getSessionId();
        const detectedIntent = detectIntent() as Intent;
        setIntent(detectedIntent);

        // Check if variant is already assigned in session
        const cachedVariant = sessionStorage.getItem(`variant_${detectedIntent}`);
        if (cachedVariant) {
          setVariantId(cachedVariant as VariantId);
          setIsLoading(false);
          return;
        }

        // For now, use simple random selection
        // TODO: Integrate with mvt-optimize edge function
        const variants: VariantId[] = ['A', 'B', 'C', 'D', 'E', 'F'];
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
        
        setVariantId(randomVariant);
        sessionStorage.setItem(`variant_${detectedIntent}`, randomVariant);
        
      } catch (error) {
        console.error('Error loading variant:', error);
        setVariantId('A'); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadVariant();
  }, []);

  return { variantId, intent, isLoading };
}
