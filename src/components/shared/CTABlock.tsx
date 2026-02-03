import { Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

interface CTABlockProps {
  title?: string;
  subtitle?: string;
  showPhone?: boolean;
  showWorkingHours?: boolean;
  variant?: "default" | "compact" | "hero";
  className?: string;
}

export function CTABlock({
  title = "Вызвать СЭС сейчас",
  subtitle,
  showPhone = true,
  showWorkingHours = true,
  variant = "default",
  className,
}: CTABlockProps) {
  const isHero = variant === "hero";
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "rounded-lg bg-primary/5 border border-primary/20",
        isHero && "bg-gradient-to-r from-primary/10 to-primary/5",
        isCompact ? "p-4" : "p-6 md:p-8",
        className
      )}
    >
      <div className={cn(
        "flex flex-col gap-4",
        !isCompact && "md:flex-row md:items-center md:justify-between"
      )}>
        <div>
          <h3 className={cn(
            "font-bold",
            isHero ? "text-2xl md:text-3xl" : isCompact ? "text-lg" : "text-xl md:text-2xl"
          )}>
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          )}
          {showWorkingHours && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Работаем по {SITE_CONFIG.regionFull} {SITE_CONFIG.workingHours}</span>
            </div>
          )}
        </div>

        <div className={cn(
          "flex gap-3",
          isCompact ? "flex-col sm:flex-row" : "flex-col sm:flex-row"
        )}>
          {showPhone && (
            <Button
              variant="outline"
              size={isCompact ? "default" : "lg"}
              className="gap-2"
              asChild
            >
              <a href={`tel:${SITE_CONFIG.phoneClean}`}>
                <Phone className="h-4 w-4" />
                {SITE_CONFIG.phoneDisplay}
              </a>
            </Button>
          )}
          <Button
            size={isCompact ? "default" : "lg"}
            asChild
          >
            <a href={`tel:${SITE_CONFIG.phoneClean}`}>
              Заказать обработку
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
