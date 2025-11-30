import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { PhoneInput } from "@/components/ui/phone-input";
import { extractPhoneDigits, isValidRussianPhone } from "@/hooks/usePhoneMask";
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
import { Calculator as CalcIcon, Sparkles, ChevronDown, Snowflake, Flame, Target, Layers, Loader2, WifiOff } from "lucide-react";
import { reachGoal } from "@/lib/yandexMetrika";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { queueLead, processQueue } from "@/lib/offlineQueue";

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
  const { isOnline, isSlowConnection } = useNetworkStatus();
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
  const [retryCount, setRetryCount] = useState(0);

  // Process offline queue when coming back online
  useEffect(() => {
    if (isOnline) {
      processQueue().then(({ success, failed }) => {
        if (success > 0) {
          toast({
            title: "Заявки отправлены",
            description: `${success} заявок из очереди успешно отправлено`,
          });
        }
      });
    }
  }, [isOnline, toast]);

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

    if (!objectType || !service || isNaN(area) || area <= 0 || area > 100000) {
      toast({
        title: "Некорректная площадь",
        description: "Укажите площадь от 1 до 100 000 м²",
        variant: "destructive"
      });
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

  const submitWithRetry = async (leadData: any, maxRetries = 3, timeout = 8000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      setRetryCount(attempt);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const { error, data: response } = await supabase.functions.invoke('handle-lead', {
          body: leadData,
        });
        
        clearTimeout(timeoutId);
        
        if (error) throw error;
        return { success: true, data: response };
      } catch (err: any) {
        clearTimeout(timeoutId);
        console.log(`[Calculator] Attempt ${attempt}/${maxRetries} failed:`, err);
        
        if (attempt === maxRetries) {
          throw err;
        }
        
        // Exponential backoff: wait longer between retries
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
  };

  // Generate pre-filled message for WhatsApp/Telegram
  const generateMessage = () => {
    const objectType = objectTypes.find(t => t.value === formData.objectType);
    const service = services.find(s => s.value === formData.service);
    
    let message = "Здравствуйте! Интересует ";
    if (service) message += service.label.toLowerCase();
    if (objectType) message += ` для ${objectType.label.toLowerCase()}`;
    if (formData.area) message += `, площадь ${formData.area} м²`;
    if (calculatedPrice) message += `. Рассчитанная стоимость: ${calculatedPrice.toLocaleString('ru-RU')} ₽`;
    message += ". Прошу связаться со мной.";
    
    return message;
  };

  // WhatsApp click handler
  const handleCalcWhatsAppClick = () => {
    reachGoal('calc_whatsapp_click');
    logTrafficEvent('calc_whatsapp_click', {
      service: formData.service,
      object_type: formData.objectType,
      area: formData.area,
      price: calculatedPrice
    });
    const phone = "79628265020";
    const message = generateMessage();
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Telegram click handler
  const handleCalcTelegramClick = () => {
    reachGoal('calc_telegram_click');
    logTrafficEvent('calc_telegram_click', {
      service: formData.service,
      object_type: formData.objectType,
      area: formData.area,
      price: calculatedPrice
    });
    const phone = "79628265020";
    window.open(`https://t.me/+${phone}`, '_blank');
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

    if (!isValidRussianPhone(formData.phone)) {
      toast({
        title: "Некорректный номер телефона",
        description: "Введите номер в формате +7 (XXX) XXX-XX-XX",
        variant: "destructive"
      });
      return;
    }

    if (!calculatedPrice) {
      calculatePrice();
      return;
    }

    // Check if offline - queue the lead
    if (!isOnline) {
      const tracking = getTrackingContext();
      const objectType = objectTypes.find(t => t.value === formData.objectType);
      const service = services.find(s => s.value === formData.service);
      
      const basePrice = objectType && service 
        ? Math.round((objectType.basePrice + (parseInt(formData.area) * 50)) * service.multiplier)
        : 0;
      
      const discountPercent = variantId === 'F' || variantId === 'E' ? 25 : 15;
      const discountAmount = Math.round(basePrice * (discountPercent / 100));

      const leadData = {
        name: formData.name,
        phone: extractPhoneDigits(formData.phone),
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
      };

      queueLead(leadData);
      
      toast({
        title: "Заявка сохранена",
        description: "Нет интернета. Заявка отправится автоматически при восстановлении связи",
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
      return;
    }

    setIsSubmitting(true);
    setRetryCount(0);

    try {
      const tracking = getTrackingContext();
      const objectType = objectTypes.find(t => t.value === formData.objectType);
      const service = services.find(s => s.value === formData.service);
      
      const basePrice = objectType && service 
        ? Math.round((objectType.basePrice + (parseInt(formData.area) * 50)) * service.multiplier)
        : 0;
      
      const discountPercent = variantId === 'F' || variantId === 'E' ? 25 : 15;
      const discountAmount = Math.round(basePrice * (discountPercent / 100));

      const leadData = {
        name: formData.name,
        phone: extractPhoneDigits(formData.phone),
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
      };

      // Try to submit with retry logic
      await submitWithRetry(leadData);

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

    } catch (error: any) {
      console.error('[Calculator] Error submitting lead:', error);
      
      let errorMessage = "Попробуйте ещё раз или позвоните нам: +7 962 826 50 20";
      
      if (error.name === 'AbortError') {
        errorMessage = isSlowConnection 
          ? "Медленное соединение. Попробуйте позже или позвоните нам"
          : "Превышено время ожидания. Проверьте интернет-соединение";
      }
      
      toast({
        title: "Ошибка отправки",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setRetryCount(0);
    }
  };

  return (
    <section id="calculator" ref={calcRef} className="py-12 md:py-20 bg-background">
      <div className="container px-2 sm:px-4">
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
                  name="area"
                  type="number"
                  placeholder="50"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  min="1"
                  max="100000"
                  autoComplete="off"
                  inputMode="numeric"
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
              <>
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

                <div className="space-y-3">
                  <p className="text-sm text-center text-muted-foreground">
                    Или свяжитесь с нами напрямую:
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 max-w-[180px] gap-2 bg-[#25D366]/10 border-[#25D366]/30 hover:bg-[#25D366]/20 hover:border-[#25D366]/50"
                      onClick={handleCalcWhatsAppClick}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25D366]">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 max-w-[180px] gap-2 bg-[#0088cc]/10 border-[#0088cc]/30 hover:bg-[#0088cc]/20 hover:border-[#0088cc]/50"
                      onClick={handleCalcTelegramClick}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#0088cc]">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      Telegram
                    </Button>
                  </div>
                </div>
              </>
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
                      name="name"
                      autoComplete="name"
                      placeholder="Иван"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <PhoneInput
                      id="phone"
                      value={formData.phone}
                      onChange={(value) => setFormData({ ...formData, phone: value })}
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

                <div className="space-y-3">
                  {!isOnline && (
                    <div className="flex items-center gap-2 text-sm text-orange-500 bg-orange-500/10 p-3 rounded-lg">
                      <WifiOff className="h-4 w-4 flex-shrink-0" />
                      <span>Нет интернета. Заявка будет отправлена автоматически</span>
                    </div>
                  )}
                  
                  {isSlowConnection && isOnline && (
                    <div className="flex items-center gap-2 text-sm text-orange-500 bg-orange-500/10 p-3 rounded-lg">
                      <WifiOff className="h-4 w-4 flex-shrink-0" />
                      <span>Медленное соединение. Отправка может занять время</span>
                    </div>
                  )}
                  
                  {isSubmitting && retryCount > 1 && (
                    <div className="text-sm text-orange-500 animate-pulse text-center">
                      Повторная попытка ({retryCount}/3)...
                    </div>
                  )}
                  
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {retryCount > 0 ? `Попытка ${retryCount}/3...` : "Отправка..."}
                      </>
                    ) : !isOnline ? (
                      <>
                        <WifiOff className="h-4 w-4 mr-2" />
                        Сохранить заявку
                      </>
                    ) : (
                      "Оставить заявку"
                    )}
                  </Button>
                </div>

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
