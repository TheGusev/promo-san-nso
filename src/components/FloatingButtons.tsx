import { MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { reachGoal } from "@/lib/yandexMetrika";

export default function FloatingButtons() {
  const handleWhatsAppClick = () => {
    reachGoal('whatsapp_click');
    const phone = "7XXXXXXXXXX"; // Replace with actual number
    const message = "Здравствуйте! Интересует дезинфекция/дезинсекция.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleTelegramClick = () => {
    reachGoal('telegram_click');
    const username = "your_telegram"; // Replace with actual username
    window.open(`https://t.me/${username}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-elevated bg-[#25D366] hover:bg-[#20BA5A] text-white p-0"
        onClick={handleWhatsAppClick}
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-elevated bg-[#0088cc] hover:bg-[#006699] text-white p-0"
        onClick={handleTelegramClick}
        aria-label="Telegram"
      >
        <Send className="h-6 w-6" />
      </Button>
    </div>
  );
}
