import { useState } from "react";
import { Phone, Clock, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SITE_CONFIG } from "@/data/siteConfig";
import { supabase } from "@/integrations/supabase/client";
import { isValidRussianPhone, extractPhoneDigits } from "@/hooks/usePhoneMask";
import { reachGoal } from "@/lib/yandexMetrika";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface HeroServiceProps {
  title: string;
  heading: string;
  description: string;
  priceFrom: number;
  icon: LucideIcon;
  serviceSlug: string;
  breadcrumbItems?: { label: string; href?: string }[];
}

export function HeroService({
  title,
  heading,
  description,
  priceFrom,
  icon: Icon,
  serviceSlug,
  breadcrumbItems,
}: HeroServiceProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const defaultBreadcrumbs = breadcrumbItems || [
    { label: "Услуги", href: "/uslugi" },
    { label: title },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Введите имя",
        variant: "destructive",
      });
      return;
    }

    if (!isValidRussianPhone(formData.phone)) {
      toast({
        title: "Введите корректный номер телефона",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanPhone = `+7${extractPhoneDigits(formData.phone).slice(-10)}`;
      
      const { error } = await supabase.functions.invoke("handle-lead", {
        body: {
          name: formData.name.trim(),
          phone: cleanPhone,
          service: serviceSlug,
          source: "hero_service_form",
        },
      });

      if (error) throw error;

      reachGoal("hero_form_submit");
      logTrafficEvent("hero_form_submit");

      toast({
        title: "Заявка отправлена!",
        description: "Мы перезвоним в течение 15 минут",
      });

      setFormData({ name: "", phone: "" });
    } catch (err) {
      console.error("Form submit error:", err);
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте позвонить нам напрямую",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneClick = () => {
    reachGoal("phone_click");
    logTrafficEvent("phone_click");
  };

  const scrollToForm = () => {
    const formElement = document.getElementById("hero-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-gradient-to-b from-primary/5 to-background py-6 md:py-12">
      <div className="container px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs items={defaultBreadcrumbs} className="py-0 mb-4" />

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* Left Column: Info */}
          <div className="space-y-4">
            {/* Service Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Icon className="h-4 w-4" />
              {title}
            </div>

            {/* H1 */}
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
              {heading}
            </h1>

            {/* Description */}
            <p className="text-base text-muted-foreground sm:text-lg max-w-xl">
              {description}
            </p>

            {/* CTA Button + Phone */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
              <Button
                size="lg"
                className="gap-2 w-full sm:w-auto"
                onClick={scrollToForm}
              >
                <Phone className="h-5 w-5" />
                Вызвать специалиста
              </Button>
              <a
                href={`tel:${SITE_CONFIG.phoneClean}`}
                onClick={handlePhoneClick}
                className="flex items-center justify-center gap-2 text-base font-medium text-primary hover:underline sm:text-lg"
              >
                <Phone className="h-4 w-4 sm:hidden" />
                {SITE_CONFIG.phoneDisplay}
              </a>
            </div>

            {/* Working Hours */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Работаем по {SITE_CONFIG.regionFull} {SITE_CONFIG.workingHours}</span>
            </div>
          </div>

          {/* Right Column: Price Card + Form */}
          <div className="space-y-4" id="hero-form">
            {/* Price Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardContent className="pt-6 text-center">
                <div className="text-sm text-muted-foreground mb-1">Цена</div>
                <div className="text-3xl font-bold text-primary sm:text-4xl">
                  от {priceFrom.toLocaleString("ru-RU")} ₽
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Точная цена после диагностики
                </div>
              </CardContent>
            </Card>

            {/* Compact Form */}
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      maxLength={100}
                      autoComplete="name"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, phone: value }))
                      }
                      className="h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Отправка..."
                      : `Заявка → ${priceFrom.toLocaleString("ru-RU")} ₽`}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Нажимая кнопку, вы соглашаетесь с{" "}
                    <a href="/privacy" className="underline hover:text-primary">
                      политикой конфиденциальности
                    </a>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
