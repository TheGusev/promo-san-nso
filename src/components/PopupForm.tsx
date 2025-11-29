import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { reachGoal } from "@/lib/yandexMetrika";
import { supabase } from "@/integrations/supabase/client";
import { getTrackingContext } from "@/lib/tracking";
import { useToast } from "@/hooks/use-toast";

export default function PopupForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(() => {
    return localStorage.getItem('popup_shown') === 'true' ||
           localStorage.getItem('popup_dismissed') === 'true' ||
           localStorage.getItem('popup_submitted') === 'true';
  });
  const { toast } = useToast();

  useEffect(() => {
    if (hasBeenShown) return;

    // Show popup after 30 seconds
    const timer = setTimeout(() => {
      setOpen(true);
      setHasBeenShown(true);
      localStorage.setItem('popup_shown', 'true');
      reachGoal('popup_open');
    }, 30000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !open) {
        setOpen(true);
        setHasBeenShown(true);
        localStorage.setItem('popup_shown', 'true');
        reachGoal('popup_open', { trigger: 'exit_intent' });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasBeenShown, open]);

  const handleClose = () => {
    setOpen(false);
    setHasBeenShown(true);
    localStorage.setItem('popup_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
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

    try {
      const tracking = getTrackingContext();

      await supabase.from('leads').insert({
        name: name.trim(),
        phone: phone.trim(),
        source: 'popup',
        session_id: tracking.session_id,
        intent: tracking.intent,
        device_type: tracking.device_type,
        utm_source: tracking.utm_source,
        utm_medium: tracking.utm_medium,
        utm_campaign: tracking.utm_campaign,
        first_landing_url: window.location.href,
        last_page_url: window.location.href,
      });

      reachGoal('popup_submit', {
        source: 'popup',
        intent: tracking.intent,
      });

      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время",
      });

      setHasBeenShown(true);
      localStorage.setItem('popup_submitted', 'true');
      setOpen(false);
    } catch (error) {
      console.error('Error submitting popup form:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      });
    }
  };

  if (hasBeenShown) return null;

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
            <Input
              id="popup-phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

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

          <Button type="submit" className="w-full" size="lg">
            Продолжить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
