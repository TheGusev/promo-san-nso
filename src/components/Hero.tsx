import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { getCopy } from "@/config/copyMap";
import { useABTest } from "@/contexts/ABTestContext";
import { reachGoal } from "@/lib/yandexMetrika";

const backgroundImages = [
  "/images/hero-bg-1.png",
  "/images/hero-bg-2.png"
];

export default function Hero() {
  const { variantId, intent } = useABTest();
  const copy = getCopy(intent, variantId);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Preload images for smooth transitions
  useEffect(() => {
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Auto-rotate background images every 2 seconds
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const handleCTAClick = (type: 'primary' | 'secondary') => {
    reachGoal('hero_cta_click', { variant: variantId, button: type });
    
    if (type === 'primary') {
      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-32 text-primary-foreground min-h-[400px] md:min-h-[500px]">
      {/* Background images with crossfade */}
      {backgroundImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 will-change-[opacity]"
          style={{
            backgroundImage: `url(${src})`,
            opacity: activeIndex === index ? 1 : 0
          }}
          aria-hidden="true"
        />
      ))}
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      
      
      <div className="container relative px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Сертифицированные услуги</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
            {copy.title}
            {copy.highlight && (
              <>
                <br />
                <span className="text-white/90 underline decoration-secondary decoration-4 underline-offset-4">{copy.highlight}</span>
              </>
            )}
          </h1>
          
          <p className="mb-8 text-lg lg:text-xl text-primary-foreground/90">
            {copy.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-elevated group"
              onClick={() => handleCTAClick('primary')}
            >
              Рассчитать стоимость
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => handleCTAClick('secondary')}
            >
              Все услуги
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">✓</div>
              <span>Выезд в день обращения</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">✓</div>
              <span>Гарантия результата</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">✓</div>
              <span>Полный пакет документов</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
