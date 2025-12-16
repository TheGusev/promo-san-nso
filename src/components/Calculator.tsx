import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

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
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

// ============================================================================
// ТАРИФЫ И КОЭФФИЦИЕНТЫ
// ============================================================================

type ObjectType = 'apartment' | 'house' | 'office' | 'warehouse' | 'shop' | 'restaurant';
type ServiceType = 'disinfection' | 'disinsection' | 'deratization' | 'ozonation' | 'complex';
type MethodType = 'cold_fog' | 'hot_fog' | 'spot' | 'complex_method';
type FrequencyType = 'one_time' | 'monthly' | 'quarterly';
type ClientType = 'individual' | 'ip' | 'company';

interface TariffEntry {
  perM2: number;
  min: number;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  objectType: ObjectType;
  area: string;
  service: ServiceType;
  clientType: ClientType;
  method: MethodType;
  frequency: FrequencyType;
}

interface PriceResult {
  basePrice: number;
  discountPercent: number;
  discountAmount: number;
  finalPrice: number;
}

// Тарифы: clientType → service → objectType → { perM2, min }
const TARIFFS: Record<'fiz' | 'ur', Record<ServiceType, Record<ObjectType, TariffEntry>>> = {
  fiz: {
    disinsection: {
      apartment:    { perM2: 50, min: 2500 },
      house:        { perM2: 60, min: 3500 },
      office:       { perM2: 55, min: 4000 },
      warehouse:    { perM2: 40, min: 5000 },
      shop:         { perM2: 55, min: 3500 },
      restaurant:   { perM2: 65, min: 4500 },
    },
    disinfection: {
      apartment:    { perM2: 45, min: 2500 },
      house:        { perM2: 55, min: 3000 },
      office:       { perM2: 50, min: 3500 },
      warehouse:    { perM2: 35, min: 4500 },
      shop:         { perM2: 50, min: 3000 },
      restaurant:   { perM2: 60, min: 4000 },
    },
    deratization: {
      apartment:    { perM2: 55, min: 3000 },
      house:        { perM2: 65, min: 4000 },
      office:       { perM2: 60, min: 4500 },
      warehouse:    { perM2: 45, min: 5500 },
      shop:         { perM2: 60, min: 4000 },
      restaurant:   { perM2: 70, min: 5000 },
    },
    ozonation: {
      apartment:    { perM2: 40, min: 2000 },
      house:        { perM2: 50, min: 2800 },
      office:       { perM2: 45, min: 3000 },
      warehouse:    { perM2: 30, min: 4000 },
      shop:         { perM2: 45, min: 2800 },
      restaurant:   { perM2: 55, min: 3500 },
    },
    complex: {
      apartment:    { perM2: 80, min: 4500 },
      house:        { perM2: 95, min: 5500 },
      office:       { perM2: 85, min: 6000 },
      warehouse:    { perM2: 70, min: 8000 },
      shop:         { perM2: 85, min: 5500 },
      restaurant:   { perM2: 100, min: 7000 },
    },
  },
  ur: {
    disinsection: {
      apartment:    { perM2: 55, min: 3000 },
      house:        { perM2: 65, min: 4000 },
      office:       { perM2: 60, min: 4500 },
      warehouse:    { perM2: 45, min: 5500 },
      shop:         { perM2: 60, min: 4000 },
      restaurant:   { perM2: 70, min: 5000 },
    },
    disinfection: {
      apartment:    { perM2: 50, min: 3000 },
      house:        { perM2: 60, min: 3500 },
      office:       { perM2: 55, min: 4000 },
      warehouse:    { perM2: 40, min: 5000 },
      shop:         { perM2: 55, min: 3500 },
      restaurant:   { perM2: 65, min: 4500 },
    },
    deratization: {
      apartment:    { perM2: 60, min: 3500 },
      house:        { perM2: 70, min: 4500 },
      office:       { perM2: 65, min: 5000 },
      warehouse:    { perM2: 50, min: 6000 },
      shop:         { perM2: 65, min: 4500 },
      restaurant:   { perM2: 75, min: 5500 },
    },
    ozonation: {
      apartment:    { perM2: 45, min: 2500 },
      house:        { perM2: 55, min: 3200 },
      office:       { perM2: 50, min: 3500 },
      warehouse:    { perM2: 35, min: 4500 },
      shop:         { perM2: 50, min: 3200 },
      restaurant:   { perM2: 60, min: 4000 },
    },
    complex: {
      apartment:    { perM2: 90, min: 5000 },
      house:        { perM2: 105, min: 6000 },
      office:       { perM2: 95, min: 6500 },
      warehouse:    { perM2: 80, min: 9000 },
      shop:         { perM2: 95, min: 6000 },
      restaurant:   { perM2: 110, min: 7500 },
    },
  },
};

// Коэффициенты метода обработки
const METHOD_COEFF: Record<MethodType, number> = {
  cold_fog: 1.0,        // Холодный туман — базовый
  hot_fog: 1.2,         // Горячий туман +20%
  spot: 0.8,            // Точечная -20%
  complex_method: 1.3,  // Комплексная +30%
};

// Коэффициенты периодичности
const FREQ_COEFF: Record<FrequencyType, number> = {
  one_time: 1.0,    // Разово — базовый
  monthly: 0.7,     // Абонемент -30%
  quarterly: 0.85,  // Ежеквартально -15%
};

// Лейблы для UI
const OBJECT_LABELS: Record<ObjectType, string> = {
  apartment: 'Квартира',
  house: 'Частный дом',
  office: 'Офис',
  warehouse: 'Склад',
  shop: 'Магазин',
  restaurant: 'Ресторан/Кафе',
};

const SERVICE_LABELS: Record<ServiceType, string> = {
  disinfection: 'Дезинфекция',
  disinsection: 'Дезинсекция',
  deratization: 'Дератизация',
  ozonation: 'Озонирование',
  complex: 'Комплекс услуг',
};

// ============================================================================
// ФУНКЦИИ РАСЧЁТА ЦЕНЫ
// ============================================================================

function getBaseTariff(form: FormData): TariffEntry {
  const clientBranch = form.clientType === 'company' || form.clientType === 'ip' ? 'ur' : 'fiz';
  const serviceTariffs = TARIFFS[clientBranch][form.service];
  const tariff = serviceTariffs?.[form.objectType] || { perM2: 50, min: 2500 };
  
  // Применяем коэффициенты метода и периодичности к цене за м²
  const perM2Effective = tariff.perM2 * METHOD_COEFF[form.method] * FREQ_COEFF[form.frequency];
  
  return { perM2: perM2Effective, min: tariff.min };
}

function calcBasePrice(form: FormData): number {
  const { perM2, min } = getBaseTariff(form);
  const area = parseInt(form.area) || 0;
  const raw = Math.round(perM2 * area);
  return Math.max(raw, min);
}

function calcDiscountPercent(form: FormData): number {
  let p = 0;

  // Базовая онлайн-скидка: 5%
  p += 0.05;

  // Комплекс услуг: +10%
  if (form.service === 'complex') {
    p += 0.10;
  }

  // Объёмная скидка по площади
  const area = parseInt(form.area) || 0;
  if (area > 50 && area <= 100)       p += 0.05;
  else if (area > 100 && area <= 300) p += 0.10;
  else if (area > 300 && area <= 700) p += 0.15;
  else if (area > 700 && area <= 1500) p += 0.20;
  else if (area > 1500)               p += 0.25;

  // Периодичность
  if (form.frequency === 'monthly')        p += 0.05;
  else if (form.frequency === 'quarterly') p += 0.03;

  // Ограничение до 30%
  return Math.min(p, 0.30);
}

function calcPrice(form: FormData): PriceResult {
  const base = calcBasePrice(form);
  const discountPercent = calcDiscountPercent(form);
  const discountAmount = Math.round(base * discountPercent);
  const final = Math.round(base - discountAmount);

  return {
    basePrice: base,
    discountPercent: Math.round(discountPercent * 100),
    discountAmount,
    finalPrice: final,
  };
}

// ============================================================================
// КОНСОЛЬНЫЕ ТЕСТЫ (только в DEV)
// ============================================================================

if (import.meta.env.DEV) {
  console.log('=== Тесты калькулятора (новая логика) ===');
  
  // Тест 1: Квартира 30м², дезинсекция, разово
  const test1: FormData = { 
    objectType: 'apartment', service: 'disinsection', area: '30', 
    method: 'cold_fog', frequency: 'one_time', clientType: 'individual',
    name: '', phone: '', email: ''
  };
  const result1 = calcPrice(test1);
  console.log('Квартира 30м² дезинсекция разово:', result1);
  // Ожидаем: basePrice=2500 (min), скидка=5%, final=2375₽
  
  // Тест 2: Квартира 120м², комплекс, ежемесячно
  const test2: FormData = { 
    objectType: 'apartment', service: 'complex', area: '120', 
    method: 'cold_fog', frequency: 'monthly', clientType: 'individual',
    name: '', phone: '', email: ''
  };
  const result2 = calcPrice(test2);
  console.log('Квартира 120м² комплекс ежемесячно:', result2);
  // Ожидаем: скидка=30% (5+10+10+5=30%)
  
  // Тест 3: Склад 10м², разово, точечная
  const test3: FormData = { 
    objectType: 'warehouse', service: 'disinsection', area: '10', 
    method: 'spot', frequency: 'one_time', clientType: 'individual',
    name: '', phone: '', email: ''
  };
  const result3 = calcPrice(test3);
  console.log('Склад 10м² точечная разово:', result3);
  // Ожидаем: min=5000₽, скидка=5%
  
  // Тест 4: 2000м², комплекс, ежемесячно (макс скидка)
  const test4: FormData = { 
    objectType: 'warehouse', service: 'complex', area: '2000', 
    method: 'cold_fog', frequency: 'monthly', clientType: 'individual',
    name: '', phone: '', email: ''
  };
  const result4 = calcPrice(test4);
  console.log('Склад 2000м² комплекс ежемесячно:', result4);
  // Ожидаем: скидка=30% (max)
}

// ============================================================================
// КОМПОНЕНТ
// ============================================================================

export default function Calculator() {
  const { toast } = useToast();
  const { variantId, impressionId } = useABTest();
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const calcRef = useRef<HTMLElement>(null);
  const hasTrackedOpen = useRef(false);
  const hasTrackedCalculate = useRef(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    objectType: "apartment",
    area: "50",
    service: "disinsection",
    clientType: "individual",
    method: "cold_fog",
    frequency: "one_time"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Автоматический расчёт цены при любом изменении формы
  const priceResult = useMemo(() => {
    const result = calcPrice(formData);
    
    // Трекинг calc_calculate при первом изменении (после начальных значений)
    if (!hasTrackedCalculate.current && parseInt(formData.area) > 0) {
      hasTrackedCalculate.current = true;
      reachGoal('calc_calculate', {
        service: formData.service,
        objectType: formData.objectType,
        area: parseInt(formData.area),
        price: result.finalPrice
      });
    }
    
    return result;
  }, [formData]);

  // Анимированные значения цен
  const animatedFinalPrice = useAnimatedNumber(priceResult.finalPrice);
  const animatedBasePrice = useAnimatedNumber(priceResult.basePrice);
  const animatedDiscountPercent = useAnimatedNumber(priceResult.discountPercent, { duration: 300 });

  // Process offline queue when coming back online
  useEffect(() => {
    if (isOnline) {
      processQueue().then(({ success }) => {
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
  }, [variantId]);

  // Сброс состояния "отправлено" при изменении параметров расчёта
  useEffect(() => {
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  }, [formData.objectType, formData.area, formData.service, formData.method, formData.frequency, formData.clientType]);

  const handleFieldChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitWithRetry = async (leadData: Record<string, unknown>, maxRetries = 3, timeout = 8000) => {
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
      } catch (err) {
        clearTimeout(timeoutId);
        console.log(`[Calculator] Attempt ${attempt}/${maxRetries} failed:`, err);
        
        if (attempt === maxRetries) {
          throw err;
        }
        
        // Exponential backoff
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
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

    const tracking = getTrackingContext();
    
    const leadData = {
      name: formData.name,
      phone: extractPhoneDigits(formData.phone),
      email: formData.email,
      object_type: formData.objectType,
      area_m2: parseInt(formData.area),
      service: formData.service,
      client_type: formData.clientType,
      method: formData.method,
      frequency: formData.frequency,
      base_price: priceResult.basePrice,
      discount_percent: priceResult.discountPercent,
      discount_amount: priceResult.discountAmount,
      final_price: priceResult.finalPrice,
      source: 'website_calculator',
      ...tracking,
      variant_id: variantId,
      mvt_impression_id: impressionId,
      mvt_arm_key: variantId,
      first_landing_url: window.location.href,
      last_page_url: window.location.href
    };

    // Check if offline - queue the lead
    if (!isOnline) {
      queueLead(leadData);
      
      toast({
        title: "Заявка сохранена",
        description: "Нет интернета. Заявка отправится автоматически при восстановлении связи",
      });

      setIsSubmitted(true);
      setFormData(prev => ({ ...prev, name: "", phone: "", email: "" }));
      return;
    }

    setIsSubmitting(true);
    setRetryCount(0);

    try {
      await submitWithRetry(leadData);

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время"
      });

      // Track lead submission
      reachGoal('lead_submit', {
        price: priceResult.finalPrice,
        service: formData.service,
        objectType: formData.objectType,
        variant: variantId
      });

      logTrafficEvent('calc_submit', {
        variant_id: variantId,
        service: formData.service,
        object_type: formData.objectType,
        final_price: priceResult.finalPrice
      });

      setIsSubmitted(true);
      setFormData(prev => ({ ...prev, name: "", phone: "", email: "" }));

    } catch (error) {
      console.error('[Calculator] Error submitting lead:', error);
      
      const errorMessage = isSlowConnection 
        ? "Медленное соединение. Попробуйте позже или позвоните нам"
        : "Попробуйте ещё раз или позвоните нам: +7 962 826 50 20";
      
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
    <section id="calculator" ref={calcRef} className="py-4 sm:py-8 md:py-16 bg-background">
      <div className="container px-2 sm:px-4">
        {/* Компактный заголовок */}
        <div className="text-center mb-3 sm:mb-6 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
            <CalcIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
            Рассчитайте стоимость
          </h2>
          <p className="hidden sm:block text-sm md:text-base text-muted-foreground mt-2">
            Получите расчёт со скидкой до 30%
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-3 sm:p-5 md:p-8 shadow-elevated">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Основные поля - 2 колонки */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div className="space-y-1">
                <Label htmlFor="objectType" className="text-xs sm:text-sm">Тип объекта</Label>
                <Select 
                  value={formData.objectType} 
                  onValueChange={(value) => handleFieldChange('objectType', value as ObjectType)}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(OBJECT_LABELS) as ObjectType[]).map((type) => (
                      <SelectItem key={type} value={type}>
                        {OBJECT_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="area" className="text-xs sm:text-sm">Площадь (м²)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  placeholder="50"
                  value={formData.area}
                  onChange={(e) => handleFieldChange('area', e.target.value)}
                  min="1"
                  max="100000"
                  autoComplete="off"
                  inputMode="numeric"
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="service" className="text-xs sm:text-sm">Услуга</Label>
                <Select 
                  value={formData.service} 
                  onValueChange={(value) => handleFieldChange('service', value as ServiceType)}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((service) => (
                      <SelectItem key={service} value={service}>
                        {SERVICE_LABELS[service]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="clientType" className="text-xs sm:text-sm">Тип клиента</Label>
                <Select 
                  value={formData.clientType} 
                  onValueChange={(value) => handleFieldChange('clientType', value as ClientType)}
                >
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Физ. лицо</SelectItem>
                    <SelectItem value="ip">ИП</SelectItem>
                    <SelectItem value="company">Юр. лицо</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Расширенные настройки - компактнее */}
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between h-8 text-xs sm:text-sm" type="button">
                  <span>Метод и периодичность</span>
                  <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs">Метод</Label>
                  <ToggleGroup 
                    type="single" 
                    value={formData.method}
                    onValueChange={(value) => value && handleFieldChange('method', value as MethodType)}
                    className="grid grid-cols-4 gap-1"
                  >
                    <ToggleGroupItem value="cold_fog" className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 text-[10px] sm:text-xs">
                      <Snowflake className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Холодный</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="hot_fog" className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 text-[10px] sm:text-xs">
                      <Flame className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Горячий</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="spot" className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 text-[10px] sm:text-xs">
                      <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Точечная</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem value="complex_method" className="flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 text-[10px] sm:text-xs">
                      <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Комплекс</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Периодичность</Label>
                  <ToggleGroup 
                    type="single" 
                    value={formData.frequency}
                    onValueChange={(value) => value && handleFieldChange('frequency', value as FrequencyType)}
                    className="grid grid-cols-3 gap-1"
                  >
                    <ToggleGroupItem value="one_time" className="text-[10px] sm:text-xs h-7 sm:h-8">
                      Разово
                    </ToggleGroupItem>
                    <ToggleGroupItem value="monthly" className="text-[10px] sm:text-xs h-7 sm:h-8">
                      Ежемесячно
                    </ToggleGroupItem>
                    <ToggleGroupItem value="quarterly" className="text-[10px] sm:text-xs h-7 sm:h-8">
                      Ежеквартально
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Компактный блок цены */}
            <div className="p-3 sm:p-4 md:p-5 rounded-lg bg-gradient-hero text-primary-foreground">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums">
                    {animatedFinalPrice.toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="text-[10px] sm:text-xs opacity-70 line-through tabular-nums">
                    {animatedBasePrice.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm flex items-center gap-1 justify-end">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="tabular-nums">−{animatedDiscountPercent}%</span>
                  </p>
                  <p className="text-[10px] sm:text-xs opacity-80">Гарантия 1 год</p>
                </div>
              </div>
            </div>

            {/* Контактные данные - всегда 2 колонки */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs sm:text-sm">Имя *</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Иван"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs sm:text-sm">Телефон *</Label>
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(value) => handleFieldChange('phone', value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Email в отдельном collapsible */}
            <Collapsible>
              <CollapsibleTrigger asChild>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground">
                  + Добавить email
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="ivan@example.com"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                />
              </CollapsibleContent>
            </Collapsible>

            {/* Статусы и кнопка */}
            <div className="space-y-2">
              {!isOnline && (
                <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 p-2 rounded">
                  <WifiOff className="h-3 w-3 flex-shrink-0" />
                  <span>Нет сети — заявка отправится позже</span>
                </div>
              )}
              
              {isSlowConnection && isOnline && (
                <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 p-2 rounded">
                  <WifiOff className="h-3 w-3 flex-shrink-0" />
                  <span>Медленное соединение</span>
                </div>
              )}
              
              {isSubmitting && retryCount > 1 && (
                <div className="text-xs text-orange-500 text-center">
                  Попытка {retryCount}/3...
                </div>
              )}

              {isSubmitted && (
                <div className="text-xs text-secondary bg-secondary/10 p-2 rounded text-center">
                  ✓ Заявка отправлена
                </div>
              )}
              
              <Button type="submit" size="default" className="w-full h-10 sm:h-11 text-sm sm:text-base" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {retryCount > 0 ? `${retryCount}/3...` : "Отправка..."}
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

            <p className="text-[10px] sm:text-xs text-center text-muted-foreground">
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a href="/privacy" className="underline hover:text-primary">
                политикой конфиденциальности
              </a>
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
}
