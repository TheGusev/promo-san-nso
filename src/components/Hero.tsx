import { Button } from "./ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { getCopy } from "@/config/copyMap";
import { useABTest } from "@/contexts/ABTestContext";
import { reachGoal } from "@/lib/yandexMetrika";

export default function Hero() {
  const { variantId, intent } = useABTest();
  const copy = getCopy(intent, variantId);
  
  const handleCTAClick = (type: 'primary' | 'secondary') => {
    reachGoal('hero_cta_click', { variant: variantId, button: type });
    
    if (type === 'primary') {
      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-12 md:py-20 lg:py-32 text-primary-foreground min-h-[400px] md:min-h-[500px]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEyYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10" style={{ contain: 'paint', pointerEvents: 'none', height: '100%', width: '100%' }}></div>
      
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
              className="bg-white text-primary hover:bg-white/90 font-semibold shadow-elevated"
              onClick={() => handleCTAClick('primary')}
            >
              {copy.cta_primary}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => handleCTAClick('secondary')}
            >
              {copy.cta_secondary}
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
