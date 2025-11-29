import { Phone } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { reachGoal } from "@/lib/yandexMetrika";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";

export default function Header() {
  const handlePhoneClick = () => {
    reachGoal('phone_click');
    logTrafficEvent('phone_click');
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="text-base sm:text-xl font-bold text-primary-foreground">СР</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold leading-none">Санитарные Решения</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Дезинфекция • Новосибирск</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
            Услуги
          </a>
          <a href="#calculator" className="text-sm font-medium hover:text-primary transition-colors">
            Калькулятор
          </a>
          <a href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">
            Отзывы
          </a>
          <a href="#articles" className="text-sm font-medium hover:text-primary transition-colors">
            Блог
          </a>
          <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </a>
          <a href="#footer" className="text-sm font-medium hover:text-primary transition-colors">
            Контакты
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a 
            href="tel:+73833121660" 
            className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            onClick={handlePhoneClick}
          >
            <Phone className="h-4 w-4" />
            <span>+7 (383) 312-16-60</span>
          </a>
          <Button 
            size="sm" 
            className="bg-gradient-hero hover:opacity-90 text-xs sm:text-sm px-3 sm:px-4"
            onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Рассчитать
          </Button>
        </div>
      </div>
    </header>
  );
}
