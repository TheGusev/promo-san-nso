import { useState } from "react";
import { Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { extractPhoneDigits } from "@/hooks/usePhoneMask";
import { trackGoal } from "@/lib/analytics";
import { sendLead } from "@/lib/leadSender";
import { getTrackingContext } from "@/lib/tracking";
import { useToast } from "@/hooks/use-toast";
import { useABTest } from "@/contexts/ABTestContext";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { queueLead } from "@/lib/offlineQueue";
import { useFormStartTime } from "@/hooks/useFormStartTime";
import { popupLeadSchema, sanitizeName } from "@/lib/formValidation";

interface LandingLeadFormProps {
  source: string; // 'lp_klopy' / 'lp_tarakany' / 'lp_uchastok'
  ctaLabel?: string;
  compact?: boolean;
}

export function LandingLeadForm({ source, ctaLabel = "Получить расчёт", compact = false }: LandingLeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { variantId, impressionId } = useABTest();
  const { isOnline } = useNetworkStatus();
  const formStartTime = useFormStartTime();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedName = sanitizeName(name);
    const cleanPhone = extractPhoneDigits(phone);

    const validation = popupLeadSchema.safeParse({ name: sanitizedName, phone: cleanPhone });
    if (!validation.success) {
      toast({ title: "Ошибка", description: validation.error.issues[0].message, variant: "destructive" });
      return;
    }
    if (!agreed) {
      toast({ title: "Ошибка", description: "Необходимо согласие с политикой конфиденциальности", variant: "destructive" });
      return;
    }
    if (website.trim()) return;

    const tracking = getTrackingContext();
    const leadData = {
      name: sanitizedName,
      phone: cleanPhone,
      source,
      honeypot: website,
      form_start_time: formStartTime,
      ...tracking,
      variant_id: variantId,
      mvt_impression_id: impressionId,
      mvt_arm_key: variantId,
      first_landing_url: window.location.href,
      last_page_url: window.location.href,
    };

    if (!isOnline) {
      queueLead(leadData);
      toast({ title: "Заявка сохранена", description: "Отправим, как появится интернет" });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendLead(leadData);
      if (!result.ok) throw new Error("send_failed");

      trackGoal("hero_form_submit", { source, intent: tracking.intent, variant: variantId });
      logTrafficEvent("lead_submit", { source, variant_id: variantId });

      toast({ title: "Заявка отправлена!", description: "Перезвоним в течение 5 минут" });
      setName("");
      setPhone("");
    } catch (err) {
      console.error("[LandingLeadForm]", err);
      toast({
        title: "Ошибка",
        description: "Попробуйте позже или позвоните: 8 (906) 998-98-88",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-3 ${compact ? "" : "rounded-xl bg-card p-5 shadow-elevated border"}`}
    >
      {!compact && (
        <div className="text-center mb-3">
          <p className="text-lg font-semibold">Заявка за 30 секунд</p>
          <p className="text-sm text-muted-foreground">Перезвоним в течение 5 минут</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`lp-name-${source}`} className="sr-only">Имя</Label>
        <Input
          id={`lp-name-${source}`}
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`lp-phone-${source}`} className="sr-only">Телефон</Label>
        <PhoneInput
          id={`lp-phone-${source}`}
          value={phone}
          onChange={setPhone}
          required
        />
      </div>

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Отправка...</>
        ) : (
          ctaLabel
        )}
      </Button>

      {!isOnline && (
        <div className="flex items-center gap-2 text-xs text-orange-500">
          <WifiOff className="h-3 w-3" /> Нет интернета — заявка сохранится
        </div>
      )}

      <div className="flex items-start gap-2">
        <Checkbox
          id={`lp-privacy-${source}`}
          checked={agreed}
          onCheckedChange={(c) => setAgreed(c as boolean)}
        />
        <label htmlFor={`lp-privacy-${source}`} className="text-xs text-muted-foreground leading-tight">
          Согласен с{" "}
          <a href="/privacy" className="text-primary hover:underline">политикой конфиденциальности</a>
        </label>
      </div>
    </form>
  );
}
