import { Phone } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="text-xl font-bold text-primary-foreground">СР</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Санитарные Решения</span>
            <span className="text-xs text-muted-foreground">Новосибирск</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-sm font-medium hover:text-primary transition-colors">
            Услуги
          </a>
          <a href="#calculator" className="text-sm font-medium hover:text-primary transition-colors">
            Цены
          </a>
          <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
            Вопросы
          </a>
          <a href="#reviews" className="text-sm font-medium hover:text-primary transition-colors">
            Отзывы
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a 
            href="tel:+7XXXXXXXXXX" 
            className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>+7 (XXX) XXX-XX-XX</span>
          </a>
          <Button size="sm" className="bg-gradient-hero hover:opacity-90">
            Рассчитать
          </Button>
        </div>
      </div>
    </header>
  );
}
