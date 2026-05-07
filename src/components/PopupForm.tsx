import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { extractPhoneDigits } from "@/hooks/usePhoneMask";
import { X, Loader2, WifiOff } from "lucide-react";
import { trackGoal } from "@/lib/analytics";
import { sendLead } from "@/lib/leadSender";
import { getTrackingContext } from "@/lib/tracking";
import { useToast } from "@/hooks/use-toast";
import { useABTest } from "@/contexts/ABTestContext";
import { logTrafficEvent } from "@/hooks/useTrafficLogging";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { queueLead, processQueue } from "@/lib/offlineQueue";
import { useFormStartTime } from "@/hooks/useFormStartTime";
import { popupLeadSchema, sanitizeName } from "@/lib/formValidation";

export default function PopupForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [hasBeenShown, setHasBeenShown] = useState(() => {
    return localStorage.getItem('popup_shown') === 'true' ||
           localStorage.getItem('popup_dismissed') === 'true' ||
           localStorage.getItem('popup_submitted') === 'true';
  });
  const { toast } = useToast();
  const { variantId, impressionId, isLoading } = useABTest();
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const formStartTime = useFormStartTime();

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

  useEffect(() => {
    if (hasBeenShown || isLoading) return;

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      if (!isLoading) {
        setOpen(true);
        setHasBeenShown(true);
        localStorage.setItem('popup_shown', 'true');
        // popup_open removed from Metrika as noise — kept in DB only.
        logTrafficEvent('popup_open', { trigger: 'timer' });
      }
    }, 30000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !open && !isLoading) {
        setOpen(true);
        setHasBeenShown(true);
        localStorage.setItem('popup_shown', 'true');
        logTrafficEvent('popup_open', { trigger: 'exit_intent' });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasBeenShown, open, isLoading]);

  const handleClose = () => {
    setOpen(false);
    setHasBeenShown(true);
    localStorage.setItem('popup_dismissed', 'true');
  };

  const submitWithRetry = async (leadData: any, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      setRetryCount(attempt);
      try {
        const result = await sendLead(leadData);
        if (!result.ok) throw new Error('send_failed');
        return { success: true, channel: result.channel };
      } catch (err: any) {
        console.log(`[PopupForm] Attempt ${attempt}/${maxRetries} failed:`, err);
        if (attempt === maxRetries) throw err;
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sanitize name before validation
    const sanitizedName = sanitizeName(name);
    const cleanPhone = extractPhoneDigits(phone);

    // Zod validation
    const validation = popupLeadSchema.safeParse({
      name: sanitizedName,
      phone: cleanPhone,
    });

    if (!validation.success) {
      const errors = validation.error.issues.map(issue => issue.message);
      toast({
        title: "Ошибка",
        description: errors[0],
        variant: "destructive",
      });
      return;
    }

    if (!agreed) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласие с политикой конфиденциальности",
        variant: "destructive",
      });
      return;
    }

    // Honeypot check
    if (website.trim()) {
      console.log('Bot detected via honeypot');
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
      return;
    }

    const tracking = getTrackingContext();
    const leadData = {
      name: sanitizedName,
      phone: cleanPhone,
      source: 'popup',
      honeypot: website,
      form_start_time: formStartTime, // Bot detection
      ...tracking,
      variant_id: variantId,
      mvt_impression_id: impressionId,
      mvt_arm_key: variantId,
      first_landing_url: window.location.href,
      last_page_url: window.location.href,
    };

    // If offline, queue the lead
    if (!isOnline) {
      queueLead(leadData);
      
      toast({
        title: "Заявка сохранена",
        description: "Нет интернета. Заявка отправится автоматически при восстановлении связи",
      });

      setHasBeenShown(true);
      localStorage.setItem('popup_submitted', 'true');
      setOpen(false);
      return;
    }

    setIsSubmitting(true);
    setRetryCount(0);

    try {
      await submitWithRetry(leadData);

      trackGoal('popup_submit', {
        source: 'popup',
        intent: tracking.intent,
        variant: variantId
      });

      logTrafficEvent('popup_submit', {
        variant_id: variantId,
        intent: tracking.intent
      });

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время",
      });

      setHasBeenShown(true);
      localStorage.setItem('popup_submitted', 'true');
      setOpen(false);
    } catch (error: any) {
      console.error('[PopupForm] Error submitting:', error);
      
      let errorMessage = "Попробуйте позже или позвоните нам: +7 962 826 50 20";
      
      if (error.name === 'AbortError') {
        errorMessage = isSlowConnection 
          ? "Медленное соединение. Попробуйте позже"
          : "Превышено время ожидания. Проверьте интернет";
      }
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setRetryCount(0);
    }
  };

  if (isLoading || hasBeenShown) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="bg-accent text-accent-foreground text-center py-3 -mx-6 -mt-6 mb-4 rounded-t-lg">
          <p className="text-2xl font-bold">До -30%</p>
          <p className="text-sm">на первый заказ при онлайн-заявке</p>
        </div>

        <DialogHeader>
          <DialogTitle className="text-xl">Оставьте заявку</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Получите консультацию и расчёт стоимости
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="popup-name">Ваше имя</Label>
            <Input
              id="popup-name"
              placeholder="Иван"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="popup-phone">Телефон</Label>
            <PhoneInput
              id="popup-phone"
              value={phone}
              onChange={setPhone}
              required
            />
          </div>

          {/* Honeypot field - hidden from users */}
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

          <div className="flex items-start space-x-2">
            <Checkbox
              id="popup-privacy"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="popup-privacy"
              className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Я согласен с{" "}
              <a href="/privacy" className="text-primary hover:underline">
                политикой конфиденциальности
              </a>
            </label>
          </div>

          <div className="space-y-3">
            {!isOnline && (
              <div className="flex items-center gap-2 text-sm text-orange-500 bg-orange-500/10 p-3 rounded-lg">
                <WifiOff className="h-4 w-4 flex-shrink-0" />
                <span>Нет интернета. Заявка будет сохранена</span>
              </div>
            )}
            
            {isSubmitting && retryCount > 1 && (
              <div className="text-sm text-orange-500 animate-pulse text-center">
                Повторная попытка ({retryCount}/3)...
              </div>
            )}
            
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {retryCount > 0 ? `Попытка ${retryCount}/3...` : "Отправка..."}
                </>
              ) : (
                "Продолжить"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
