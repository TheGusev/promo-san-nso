import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Shield, Check } from "lucide-react";
import { getCopy } from "@/config/copyMap";
import { useABTest } from "@/contexts/ABTestContext";
import { scrollToAnchor } from "@/lib/scrollToAnchor";

const backgroundImages = [
  "/images/hero-bg-1.png",
  "/images/hero-bg-2.png"
];

export default function Hero() {
  const { variantId, intent } = useABTest();
  const navigate = useNavigate();
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
    // hero_cta_click removed from Metrika — pure scroll, not a conversion.
    if (type === 'primary') {
      scrollToAnchor('calculator');
    } else {
      navigate('/uslugi');
    }
  };

  return (
    <section className="relative overflow-hidden py-10 md:py-20 lg:py-32 text-primary-foreground min-h-[560px] md:min-h-[500px]">
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

      {/* Gradient overlay: lighter so photos remain visible, with text-shadow for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/40 to-transparent md:bg-black/30 md:bg-none" aria-hidden="true" />

      <div className="container relative px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 md:mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md border border-white/15">
            <Shield className="h-3.5 w-3.5" />
            <span className="text-[10px] md:text-sm font-bold md:font-medium uppercase md:normal-case tracking-widest md:tracking-normal">Сертифицированные услуги</span>
          </div>

          <h1 className="mb-4 md:mb-6 text-[30px] leading-[1.15] md:text-5xl lg:text-6xl font-bold tracking-tight [text-shadow:0_2px_14px_rgba(0,0,0,0.65)]">
            {copy.title}
            {copy.highlight && (
              <>
                <br />
                <span className="relative inline-block mt-1">
                  <span className="relative z-10 bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent md:text-white/90 md:bg-none">
                    {copy.highlight}
                  </span>
                  <span className="hidden md:block absolute -bottom-1 left-0 w-full h-1 bg-secondary rounded-full" aria-hidden="true" />
                </span>
              </>
            )}
          </h1>

          <p className="mb-6 md:mb-8 text-sm md:text-lg lg:text-xl text-slate-300 md:text-primary-foreground/90 max-w-[90%] mx-auto">
            {copy.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-2xl py-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/30 group"
              onClick={() => handleCTAClick('primary')}
            >
              Рассчитать стоимость
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-2xl py-4 border-white/20 bg-white/5 text-white hover:bg-white/10 font-semibold backdrop-blur-md"
              onClick={() => handleCTAClick('secondary')}
            >
              Все услуги
            </Button>
          </div>

          <div className="mt-8 md:mt-12 grid grid-cols-1 md:flex md:flex-wrap md:justify-center gap-2.5 md:gap-8 text-sm max-w-xs md:max-w-none mx-auto text-left md:text-center">
            <div className="flex items-center gap-3 md:gap-2">
              <div className="flex h-5 w-5 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 md:bg-white/20">
                <Check className="h-3 w-3 md:h-4 md:w-4 text-secondary md:text-white" strokeWidth={3} />
              </div>
              <span className="text-[13px] md:text-sm font-medium text-white/90">Выезд в день обращения</span>
            </div>
            <div className="flex items-center gap-3 md:gap-2">
              <div className="flex h-5 w-5 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 md:bg-white/20">
                <Check className="h-3 w-3 md:h-4 md:w-4 text-secondary md:text-white" strokeWidth={3} />
              </div>
              <span className="text-[13px] md:text-sm font-medium text-white/90">Гарантия результата</span>
            </div>
            <div className="flex items-center gap-3 md:gap-2">
              <div className="flex h-5 w-5 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-secondary/20 md:bg-white/20">
                <Check className="h-3 w-3 md:h-4 md:w-4 text-secondary md:text-white" strokeWidth={3} />
              </div>
              <span className="text-[13px] md:text-sm font-medium text-white/90">Полный пакет документов</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
