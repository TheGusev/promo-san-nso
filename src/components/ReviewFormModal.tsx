import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star, CheckCircle } from "lucide-react";

interface ReviewFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "code" | "form" | "success";

export default function ReviewFormModal({ open, onOpenChange }: ReviewFormModalProps) {
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState("");
  const [objectType, setObjectType] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();

  const resetForm = () => {
    setStep("code");
    setCode("");
    setObjectType(null);
    setLeadId(null);
    setDisplayName("");
    setRating(5);
    setText("");
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const validateCode = async () => {
    if (code.length !== 6) {
      toast({
        title: "Неверный формат кода",
        description: "Код должен содержать 6 символов",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await supabase.functions.invoke("validate-review-code", {
        body: { code: code.toUpperCase() },
      });

      if (response.error) throw new Error(response.error.message);

      const data = response.data;

      if (!data.valid) {
        throw new Error(data.message || "Недействительный код");
      }

      setObjectType(data.objectType);
      setLeadId(data.leadId);
      setStep("form");
    } catch (error: any) {
      toast({
        title: "Ошибка проверки кода",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Введите имя",
        variant: "destructive",
      });
      return;
    }

    if (!text.trim() || text.length < 10) {
      toast({
        title: "Отзыв слишком короткий",
        description: "Минимум 10 символов",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await supabase.functions.invoke("submit-review", {
        body: {
          code: code.toUpperCase(),
          displayName: displayName.trim(),
          rating,
          text: text.trim(),
          objectType,
          leadId,
        },
      });

      if (response.error) throw new Error(response.error.message);

      if (!response.data.success) {
        throw new Error(response.data.message || "Ошибка отправки отзыва");
      }

      setStep("success");
    } catch (error: any) {
      toast({
        title: "Ошибка отправки",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "code" && (
          <>
            <DialogHeader>
              <DialogTitle>Оставить отзыв</DialogTitle>
              <DialogDescription>
                Введите код, который вы получили после выполнения заказа
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Код отзыва</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXX"
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest"
                />
              </div>
              <Button 
                onClick={validateCode} 
                className="w-full" 
                disabled={loading || code.length !== 6}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Продолжить"
                )}
              </Button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Ваш отзыв</DialogTitle>
              <DialogDescription>
                {objectType && `Объект: ${objectType}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ваше имя</Label>
                <Input
                  id="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Как вас представить?"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label>Оценка</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Отзыв</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Расскажите о вашем опыте работы с нами..."
                  rows={4}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {text.length}/1000
                </p>
              </div>

              <Button 
                onClick={submitReview} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Отправить отзыв"
                )}
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="mb-2">Спасибо за отзыв!</DialogTitle>
            <DialogDescription>
              Ваш отзыв отправлен на модерацию и скоро появится на сайте.
            </DialogDescription>
            <Button onClick={() => handleClose(false)} className="mt-6">
              Закрыть
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
