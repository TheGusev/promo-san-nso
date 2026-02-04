import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { reachGoal } from "@/lib/yandexMetrika";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";

const services = [
  { name: "Дезинфекция", href: "/usluga/dezinfeksiya" },
  { name: "Дезинсекция", href: "/usluga/dezinseksiya" },
  { name: "Дератизация", href: "/usluga/deratizatsiya" },
  { name: "Озонирование", href: "/usluga/ozonirovanie" },
  { name: "Дезодорация", href: "/usluga/dezodoratsiya" },
  { name: "Подготовка к СЭС", href: "/usluga/sertifikatsiya" },
];

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const handlePhoneClick = () => {
    reachGoal('phone_click');
    logTrafficEvent('phone_click');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="СанРешения — главная страница">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-hero">
            <span className="text-base sm:text-xl font-bold text-primary-foreground">СР</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-semibold leading-none">СанРешения</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">Дезинфекция • Новосибирск</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Основная навигация">
          <div 
            className="relative"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button 
              className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
              aria-expanded={isServicesOpen}
              aria-haspopup="true"
            >
              Услуги
              <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isServicesOpen && (
              <div className="absolute top-full left-0 pt-2 w-48">
                <div className="bg-background border rounded-lg shadow-lg py-2">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      to={service.href}
                      className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a href="/#prices" className="text-sm font-medium hover:text-primary transition-colors">Цены</a>
          <a href="/#calculator" className="text-sm font-medium hover:text-primary transition-colors">Калькулятор</a>
          <a href="/#reviews" className="text-sm font-medium hover:text-primary transition-colors">Отзывы</a>
          <a href="/#faq" className="text-sm font-medium hover:text-primary transition-colors">FAQ</a>
          <a href="/#footer" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a 
            href="tel:+73833121660" 
            className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            onClick={handlePhoneClick}
            aria-label="Позвонить: +7 (383) 312-16-60"
          >
            <Phone className="h-4 w-4" />
            <span>+7 (383) 312-16-60</span>
          </a>
          <Button 
            size="sm" 
            className="bg-gradient-hero hover:opacity-90 text-xs sm:text-sm px-3 sm:px-4"
            onClick={() => {
              const calculator = document.getElementById('calculator');
              if (calculator) {
                calculator.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#calculator';
              }
            }}
          >
            Рассчитать
          </Button>
        </div>
      </div>
    </header>
  );
}
