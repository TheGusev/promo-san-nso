import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getTrackingContext } from "@/lib/tracking";
import { useABTest } from "@/contexts/ABTestContext";
import { Calculator as CalcIcon, Sparkles, ChevronDown, Snowflake, Flame, Target, Layers } from "lucide-react";
import { reachGoal } from "@/lib/yandexMetrika";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";

const objectTypes = [
  { value: "apartment", label: "Квартира", basePrice: 2500 },
  { value: "house", label: "Частный дом", basePrice: 3500 },
  { value: "office", label: "Офис", basePrice: 4000 },
  { value: "warehouse", label: "Склад", basePrice: 5000 },
  { value: "shop", label: "Магазин", basePrice: 3500 },
  { value: "restaurant", label: "Ресторан/Кафе", basePrice: 4500 },
];

const services = [
  { value: "disinfection", label: "Дезинфекция", multiplier: 1.0 },
  { value: "disinsection", label: "Дезинсекция", multiplier: 1.0 },
  { value: "deratization", label: "Дератизация", multiplier: 1.2 },
  { value: "ozonation", label: "Озонирование", multiplier: 0.8 },
  { value: "complex", label: "Комплекс услуг", multiplier: 1.5 },
];

export default function Calculator() {
  const { toast } = useToast();
  const { variantId, intent, impressionId } = useABTest();
  const calcRef = useRef<HTMLElement>(null);
  const hasTrackedOpen = useRef(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    objectType: "",
    area: "",
    service: "",
    clientType: "individual",
    method: "cold_fog",
    frequency: "one_time"
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track calculator visibility with Intersection Observer
  useEffect(() => {
    if (!calcRef.current || hasTrackedOpen.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedOpen.current) {
            hasTrackedOpen.current = true;
            reachGoal('calc_open');
            logTrafficEvent('calc_open', { variant_id: variantId });
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(calcRef.current);

    return () => observer.disconnect();
  }, []);

  const calculatePrice = () => {
    if (!formData.objectType || !formData.area || !formData.service) {
      toast({
        title: "Заполните все поля",
        description: "Укажите тип объекта, площадь и услугу для расчёта",
        variant: "destructive"
      });
      return;
    }

    const objectType = objectTypes.find(t => t.value === formData.objectType);
    const service = services.find(s => s.value === formData.service);
    const area = parseInt(formData.area);

    if (!objectType || !service || isNaN(area) || area <= 0) {
      return;
    }

    // Price calculation formula
    let basePrice = objectType.basePrice;
    let pricePerSqm = 50; // базовая цена за м²

    if (area > 100) pricePerSqm = 40;
    if (area > 200) pricePerSqm = 30;

    const totalPrice = Math.round(
      (basePrice + (area * pricePerSqm)) * service.multiplier
    );

    // Apply discount for online orders (variant F focus)
    const discount = variantId === 'F' || variantId === 'E' ? 0.25 : 0.15;
    const discountedPrice = Math.round(totalPrice * (1 - discount));

    setCalculatedPrice(discountedPrice);
    
    // Track calculation
    reachGoal('calc_calculate', {
      service: formData.service,
      objectType: formData.objectType,
      area: area,
      price: discountedPrice
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast({
        title: "Заполните контактные данные",
        description: "Имя и телефон обязательны для отправки заявки",
        variant: "destructive"
      });
      return;
    }

    if (!calculatedPrice) {
      calculatePrice();
      return;
    }

    setIsSubmitting(true);

    try {
      const tracking = getTrackingContext();
      const objectType = objectTypes.find(t => t.value === formData.objectType);
      const service = services.find(s => s.value === formData.service);
      
      const basePrice = objectType && service 
        ? Math.round((objectType.basePrice + (parseInt(formData.area) * 50)) * service.multiplier)
        : 0;
      
      const discountPercent = variantId === 'F' || variantId === 'E' ? 25 : 15;
      const discountAmount = Math.round(basePrice * (discountPercent / 100));

      const { error } = await supabase.functions.invoke('handle-lead', {
        body: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          object_type: formData.objectType,
          area_m2: parseInt(formData.area),
          service: formData.service,
          client_type: formData.clientType,
          base_price: basePrice,
          discount_percent: discountPercent,
          discount_amount: discountAmount,
          final_price: calculatedPrice,
          source: 'website_calculator',
          ...tracking,
          variant_id: variantId,
          mvt_impression_id: impressionId,
          mvt_arm_key: variantId,
          first_landing_url: window.location.href,
          last_page_url: window.location.href
        }
      });

      if (error) throw error;

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время"
      });

      // Track lead submission
      reachGoal('lead_submit', {
        price: calculatedPrice,
        service: formData.service,
        objectType: formData.objectType,
        variant: variantId
      });

      logTrafficEvent('calc_submit', {
        variant_id: variantId,
        service: formData.service,
        object_type: formData.objectType,
        final_price: calculatedPrice
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        objectType: "",
        area: "",
        service: "",
        clientType: "individual",
        method: "cold_fog",
        frequency: "one_time"
      });
      setCalculatedPrice(null);

    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте ещё раз или позвоните нам",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="calculator" ref={calcRef} className="py-12 md:py-20 bg-background">
      <div className="container px-4">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <CalcIcon className="h-8 w-8 text-primary" />
              <h2 className="text-3xl lg:text-4xl font-bold">Рассчитайте стоимость</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Заполните форму и получите точный расчёт со скидкой до 30%
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="blur-in" delay={200}>
          <Card className="max-w-2xl mx-auto p-8 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="objectType">Тип объекта *</Label>
                <Select value={formData.objectType} onValueChange={(value) => setFormData({ ...formData, objectType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Площадь (м²) *</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="50"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Услуга *</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.value} value={service.value}>
                        {service.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientType">Тип клиента</Label>
                <Select value={formData.clientType} onValueChange={(value) => setFormData({ ...formData, clientType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Физическое лицо</SelectItem>
                    <SelectItem value="ip">ИП</SelectItem>
                    <SelectItem value="company">Юридическое лицо</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Settings */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between" type="button">
                  <span className="font-semibold">Расширенные настройки</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 pt-4">
                {/* Treatment Method */}
                <div className="space-y-3">
                  <Label>Метод обработки</Label>
                  <ToggleGroup 
                    type="single" 
                    value={formData.method}
                    onValueChange={(value) => value && setFormData({ ...formData, method: value })}
                    className="grid grid-cols-2 gap-2"
                  >
                    <ToggleGroupItem value="cold_fog" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Snowflake className="h-5 w-5" />
                      <span className="text-xs">Холодный туман</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="hot_fog" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Flame className="h-5 w-5" />
                      <span className="text-xs">Горячий туман</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="spot" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Target className="h-5 w-5" />
                      <span className="text-xs">Точечная</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="complex" className="flex flex-col items-center gap-1 h-auto py-3">
                      <Layers className="h-5 w-5" />
                      <span className="text-xs">Комплексная</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Frequency */}
                <div className="space-y-3">
                  <Label>Периодичность</Label>
                  <ToggleGroup 
                    type="single" 
                    value={formData.frequency}
                    onValueChange={(value) => value && setFormData({ ...formData, frequency: value })}
                    className="grid grid-cols-3 gap-2"
                  >
                    <ToggleGroupItem value="one_time" className="text-xs">
                      Разово
                    </ToggleGroupItem>
                    <ToggleGroupItem value="monthly" className="text-xs">
                      Ежемесячно
                    </ToggleGroupItem>
                    <ToggleGroupItem value="quarterly" className="text-xs">
                      Ежеквартально
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Price Comparison Table */}
                {formData.area && parseInt(formData.area) === 50 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3">Сравнение методов при 50 м²</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Холодный туман:</span>
                        <div className="flex gap-2 items-center">
                          <span className="line-through text-muted-foreground">3500₽</span>
                          <span className="font-semibold text-secondary">2800₽</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Горячий туман:</span>
                        <div className="flex gap-2 items-center">
                          <span className="line-through text-muted-foreground">4000₽</span>
                          <span className="font-semibold text-secondary">3200₽</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Точечная:</span>
                        <div className="flex gap-2 items-center">
                          <span className="line-through text-muted-foreground">3000₽</span>
                          <span className="font-semibold text-secondary">2400₽</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Комплексная:</span>
                        <div className="flex gap-2 items-center">
                          <span className="line-through text-muted-foreground">5000₽</span>
                          <span className="font-semibold text-secondary">4000₽</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>

            {calculatedPrice && (
              <div className="p-6 rounded-lg bg-gradient-hero text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Стоимость со скидкой</p>
                    <p className="text-4xl font-bold">{calculatedPrice.toLocaleString('ru-RU')} ₽</p>
                    <p className="text-sm opacity-90 mt-1 flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      Скидка {variantId === 'F' || variantId === 'E' ? '25%' : '15%'} за онлайн-заказ
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!calculatedPrice ? (
              <Button type="button" onClick={calculatePrice} size="lg" className="w-full">
                Рассчитать стоимость
              </Button>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя *</Label>
                    <Input
                      id="name"
                      placeholder="Иван"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (необязательно)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ivan@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Отправка..." : "Оставить заявку"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href="/privacy" className="underline hover:text-primary">
                    политикой конфиденциальности
                  </a>
                </p>
              </>
            )}
          </form>
        </Card>
        </AnimatedSection>
      </div>
    </section>
  );
}
