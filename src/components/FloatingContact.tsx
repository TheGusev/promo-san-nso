import { useState, useRef, useEffect } from "react";
import { Phone, X } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";
import { reachGoal } from "@/lib/yandexMetrika";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";
import { cn } from "@/lib/utils";



export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрытие по клику вне виджета
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const handleCall = () => {
    reachGoal("phone_click");
    logTrafficEvent("phone_click");
    window.location.href = `tel:${SITE_CONFIG.phoneClean}`;
    setIsOpen(false);
  };

  const handleMax = () => {
    reachGoal("max_click");
    logTrafficEvent("max_click");
    window.open(SITE_CONFIG.links.max, "_blank");
    setIsOpen(false);
  };

  const handleTelegram = () => {
    reachGoal("telegram_click");
    logTrafficEvent("telegram_click");
    window.open(SITE_CONFIG.links.telegram, "_blank");
    setIsOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2"
    >
      {/* Раскрытое меню */}
      {isOpen && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
          {/* Telegram */}
          <button
            onClick={handleTelegram}
            className="h-12 w-12 rounded-full bg-[#0088cc] hover:bg-[#006699] shadow-lg flex items-center justify-center transition-colors"
            aria-label="Telegram"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </button>

          {/* MAX */}
          <button
            onClick={handleMax}
            className="h-12 w-12 rounded-full bg-[#0077FF] hover:bg-[#0066DD] shadow-lg flex items-center justify-center transition-colors"
            aria-label="MAX"
          >
            <span className="text-white font-bold text-xs">MAX</span>
          </button>

          {/* Телефон */}
          <button
            onClick={handleCall}
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center transition-colors"
            aria-label="Позвонить"
          >
            <Phone className="h-6 w-6 text-primary-foreground" />
          </button>
        </div>
      )}

      {/* Главная кнопка */}
      <button
        onClick={handleToggle}
        className={cn(
          "h-14 w-14 rounded-full shadow-elevated flex items-center justify-center transition-all",
          isOpen
            ? "bg-muted hover:bg-muted/80"
            : "bg-primary hover:bg-primary/90"
        )}
        aria-label={isOpen ? "Закрыть меню связи" : "Связаться с нами"}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-foreground" />
        ) : (
          <Phone className="h-7 w-7 text-primary-foreground" />
        )}
      </button>
    </div>
  );
}
