import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getTrackingContext } from "@/lib/tracking";
import { useABTest } from "@/hooks/useABTest";
import { Calculator as CalcIcon, Sparkles } from "lucide-react";

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
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    objectType: "",
    area: "",
    service: "",
    clientType: "individual"
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        objectType: "",
        area: "",
        service: "",
        clientType: "individual"
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
    <section id="calculator" className="py-20 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <CalcIcon className="h-8 w-8 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold">Рассчитайте стоимость</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Заполните форму и получите точный расчёт со скидкой до 30%
          </p>
        </div>

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
      </div>
    </section>
  );
}
