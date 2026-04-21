import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Phone, CheckCircle2, Loader2, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { extractPhoneDigits, isValidRussianPhone } from "@/hooks/usePhoneMask";
import { useToast } from "@/hooks/use-toast";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useFormStartTime } from "@/hooks/useFormStartTime";
import { useABTest } from "@/contexts/ABTestContext";
import { getTrackingContext } from "@/lib/tracking";
import { trackGoal } from "@/lib/analytics";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";
import { queueLead, processQueue } from "@/lib/offlineQueue";
import { supabase } from "@/integrations/supabase/client";
import { SITE_CONFIG } from "@/data/siteConfig";
import { getAllPests, type Pest } from "@/data/pests";
import {
  getAvailablePlaces,
  getPrice,
  getNumericPrice,
  formatPriceLabel,
  getServiceForPest,
  type PlaceOption,
} from "@/data/calculatorPricing";
import { Link } from "react-router-dom";

type Step = 1 | 2 | 3;

const PEST_GROUP_LABELS: Record<"insects" | "rodents" | "other", string> = {
  insects: "Насекомые",
  rodents: "Грызуны",
  other: "Другое",
};

export default function SimpleCalculator() {
  const { toast } = useToast();
  const { isOnline } = useNetworkStatus();
  const { variantId, impressionId } = useABTest();
  const formStartTime = useFormStartTime();

  const pests = useMemo(() => getAllPests(), []);

  const [step, setStep] = useState<Step>(1);
  const [pestSlug, setPestSlug] = useState<string | null>(null);
  const [placeKey, setPlaceKey] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedPest = useMemo(
    () => pests.find((p) => p.slug === pestSlug) ?? null,
    [pests, pestSlug]
  );

  const availablePlaces: PlaceOption[] = useMemo(
    () => (pestSlug ? getAvailablePlaces(pestSlug) : []),
    [pestSlug]
  );

  const selectedPlace = useMemo(
    () => availablePlaces.find((p) => p.key === placeKey) ?? null,
    [availablePlaces, placeKey]
  );

  const priceValue = useMemo(() => {
    if (!pestSlug || !placeKey) return undefined;
    return getPrice(pestSlug, placeKey as PlaceOption["key"]);
  }, [pestSlug, placeKey]);

  const numericPrice = priceValue ? getNumericPrice(priceValue) : 0;
  const animatedPrice = useAnimatedNumber(numericPrice);

  // Process queue when online
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

  // Выбор вредителя в селекте — сбрасываем место (могло быть невалидное для нового вредителя)
  const handleSelectPest = (slug: string) => {
    setPestSlug(slug);
    setPlaceKey(null);
  };

  const handleSelectPlace = (key: string) => {
    setPlaceKey(key);
  };

  // «Далее» с шага 1 → если у вредителя только одно место, сразу на шаг 3
  const handleNextFromStep1 = () => {
    if (!pestSlug) return;
    const places = getAvailablePlaces(pestSlug);
    if (places.length === 1) {
      setPlaceKey(places[0].key);
      setStep(3);
      trackGoal("calc_calculate", { pest: pestSlug, place: places[0].key });
    } else {
      setStep(2);
    }
  };

  // «Далее» с шага 2 → шаг 3
  const handleNextFromStep2 = () => {
    if (!pestSlug || !placeKey) return;
    setStep(3);
    trackGoal("calc_calculate", { pest: pestSlug, place: placeKey });
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(availablePlaces.length === 1 ? 1 : 2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPestSlug(null);
    setPlaceKey(null);
    setPhone("");
    setConsent(false);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPest || !selectedPlace || !priceValue) return;

    if (!isValidRussianPhone(phone)) {
      toast({
        title: "Введите корректный телефон",
        description: "Формат: +7 (XXX) XXX-XX-XX",
        variant: "destructive",
      });
      return;
    }
    if (!consent) {
      toast({
        title: "Нужно согласие на обработку данных",
        description: "Поставьте галочку ниже",
        variant: "destructive",
      });
      return;
    }

    const tracking = getTrackingContext();
    const leadData = {
      name: "Клиент", // менеджер уточнит при звонке
      phone: extractPhoneDigits(phone),
      email: "",
      object_type: selectedPlace.objectType,
      service: getServiceForPest(selectedPest),
      final_price: getNumericPrice(priceValue),
      base_price: getNumericPrice(priceValue),
      source: "website_calculator_simple",
      form_start_time: formStartTime,
      ...tracking,
      variant_id: variantId,
      mvt_impression_id: impressionId,
      mvt_arm_key: variantId,
      first_landing_url: window.location.href,
      last_page_url: window.location.href,
      // Дополнительный контекст для понимания заявки
      pest_slug: selectedPest.slug,
      place_key: selectedPlace.key,
    };

    if (!isOnline) {
      queueLead(leadData);
      toast({
        title: "Заявка сохранена",
        description: "Нет интернета. Отправим автоматически при восстановлении связи",
      });
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("handle-lead", {
        body: leadData,
      });
      if (error) throw error;

      trackGoal("lead_submit", {
        price: getNumericPrice(priceValue),
        service: getServiceForPest(selectedPest),
        objectType: selectedPlace.objectType,
        pest: selectedPest.slug,
        variant: variantId,
      });

      logTrafficEvent("calc_submit", {
        variant_id: variantId,
        pest: selectedPest.slug,
        place: selectedPlace.key,
        final_price: getNumericPrice(priceValue),
      });

      toast({
        title: "Заявка отправлена!",
        description: "Перезвоним в течение 5 минут",
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("[SimpleCalculator] Submit error:", err);
      toast({
        title: "Ошибка отправки",
        description: `Попробуйте позже или позвоните: ${SITE_CONFIG.phoneDisplay}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneClickAlt = () => {
    trackGoal("phone_click", { source: "calculator_alt" });
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-2 md:px-4 max-w-3xl">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
            Рассчитать стоимость
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            3 простых шага — узнайте цену и оставьте заявку
          </p>
        </div>

        <Card className="p-4 md:p-8 shadow-lg border-border/50">
          {/* Прогресс */}
          {!isSubmitted && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Назад"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Назад
                </button>
                <span className="text-sm font-medium text-muted-foreground">
                  Шаг {step} / 3
                </span>
                {!isOnline && (
                  <span className="inline-flex items-center gap-1 text-xs text-destructive">
                    <WifiOff className="w-3 h-3" /> Офлайн
                  </span>
                )}
              </div>
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={false}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Подтверждение */}
            {isSubmitted && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Заявка принята!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Перезвоним в течение 5 минут и подтвердим время выезда.
                </p>
                <Button variant="outline" onClick={handleReset}>
                  Рассчитать ещё раз
                </Button>
              </motion.div>
            )}

            {/* ШАГ 1 — выбор вредителя */}
            {!isSubmitted && step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4 text-center">
                  Кто беспокоит?
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                  {pests.map((pest) => {
                    const Icon = pestIcon(pest);
                    return (
                      <button
                        key={pest.slug}
                        type="button"
                        onClick={() => handlePickPest(pest.slug)}
                        className="group flex flex-col items-center justify-center gap-2 p-3 md:p-4 min-h-[88px] rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all active:scale-95"
                      >
                        <Icon className="w-7 h-7 text-primary" />
                        <span className="text-sm md:text-base font-medium text-foreground text-center leading-tight">
                          {pest.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ШАГ 2 — выбор места */}
            {!isSubmitted && step === 2 && selectedPest && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1 text-center">
                  Где проблема?
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {selectedPest.name} · выберите объект
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {availablePlaces.map((place) => (
                    <button
                      key={place.key}
                      type="button"
                      onClick={() => handlePickPlace(place.key)}
                      className="flex items-center justify-between gap-3 p-4 min-h-[64px] rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all active:scale-[0.98] text-left"
                    >
                      <div>
                        <div className="font-medium text-foreground">{place.label}</div>
                        <div className="text-xs text-muted-foreground">{place.hint}</div>
                      </div>
                      <ArrowLeft className="w-5 h-5 text-primary rotate-180 shrink-0" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ШАГ 3 — цена + телефон */}
            {!isSubmitted && step === 3 && selectedPest && selectedPlace && priceValue && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
              >
                <div className="text-center mb-6">
                  <div className="text-sm text-muted-foreground mb-1">
                    {selectedPest.name} · {selectedPlace.label}
                  </div>
                  <div className="text-4xl md:text-6xl font-bold text-primary mb-1 tabular-nums">
                    {typeof priceValue === "number" ? "" : "от "}
                    {animatedPrice.toLocaleString("ru-RU")} ₽
                  </div>
                  {typeof priceValue !== "number" && (
                    <p className="text-xs text-muted-foreground">
                      Точную цену уточнит менеджер
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="simple-calc-phone" className="mb-2 block">
                      Телефон для связи
                    </Label>
                    <PhoneInput
                      id="simple-calc-phone"
                      value={phone}
                      onChange={setPhone}
                      className="h-12 text-base"
                      required
                    />
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <Checkbox
                      checked={consent}
                      onCheckedChange={(v) => setConsent(v === true)}
                      className="mt-0.5"
                    />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      Согласен на{" "}
                      <Link to="/privacy" className="underline hover:text-foreground">
                        обработку персональных данных
                      </Link>
                    </span>
                  </label>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Отправляем...
                      </>
                    ) : (
                      "Вызвать мастера"
                    )}
                  </Button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-3 text-xs text-muted-foreground">
                        или
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full h-14 text-base"
                    onClick={handlePhoneClickAlt}
                  >
                    <a href={`tel:${SITE_CONFIG.phoneClean}`}>
                      <Phone className="w-5 h-5" />
                      Позвонить {SITE_CONFIG.phoneDisplay}
                    </a>
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </section>
  );
}
