// Компонент-тизер FAQ для коммерческих страниц
// Показывает 1-2 популярных вопроса и ссылку на /faq/

import { Link } from "react-router-dom";
import { HelpCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS, FAQItem, FAQ_CATEGORIES } from "@/data/faqData";

interface FAQTeaserProps {
  // Фильтры для выбора релевантных вопросов
  serviceSlug?: string;
  pestSlug?: string;
  objectSlug?: string;
  // Или явный список ID вопросов
  questionIds?: string[];
  // Количество вопросов
  limit?: number;
  // Заголовок блока
  title?: string;
  // Вариант отображения
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export function FAQTeaser({
  serviceSlug,
  pestSlug,
  objectSlug,
  questionIds,
  limit = 2,
  title = "Частые вопросы",
  variant = "default",
  className,
}: FAQTeaserProps) {
  // Получаем релевантные вопросы
  let relevantQuestions: FAQItem[] = [];

  if (questionIds?.length) {
    // Если указаны конкретные ID
    relevantQuestions = questionIds
      .map((id) => FAQ_ITEMS.find((q) => q.id === id))
      .filter((q): q is FAQItem => q !== undefined);
  } else {
    // Фильтруем по связям
    relevantQuestions = FAQ_ITEMS.filter((item) => {
      if (serviceSlug && item.relatedServices?.includes(serviceSlug)) return true;
      if (pestSlug && item.relatedPests?.includes(pestSlug)) return true;
      if (objectSlug && item.relatedObjects?.includes(objectSlug)) return true;
      return false;
    });

    // Если ничего не нашли — берём популярные
    if (relevantQuestions.length === 0) {
      relevantQuestions = FAQ_ITEMS.filter((item) => item.isPopular);
    }
  }

  // Ограничиваем количество
  const displayQuestions = relevantQuestions.slice(0, limit);

  if (displayQuestions.length === 0) return null;

  // Инлайн-вариант (просто ссылки)
  if (variant === "inline") {
    return (
      <div className={className}>
        <div className="flex items-center gap-2 text-sm">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Частые вопросы:</span>
          {displayQuestions.map((q, i) => (
            <span key={q.id}>
              <Link
                to={`/faq#${q.id}`}
                className="text-primary hover:underline"
              >
                {q.question.length > 40 ? q.question.slice(0, 40) + "..." : q.question}
              </Link>
              {i < displayQuestions.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Компактный вариант
  if (variant === "compact") {
    return (
      <div className={`p-4 bg-muted/50 rounded-lg ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span className="font-medium">{title}</span>
          </div>
          <Button variant="link" size="sm" asChild className="p-0 h-auto">
            <Link to="/faq">
              Все вопросы
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="mt-3 space-y-2">
          {displayQuestions.map((q) => (
            <Link
              key={q.id}
              to={`/faq#${q.id}`}
              className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{q.question}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Дефолтный вариант (карточка)
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/faq">
              Все вопросы
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {displayQuestions.map((q) => (
            <div key={q.id} className="border-l-2 border-primary/20 pl-4">
              <Link
                to={`/faq#${q.id}`}
                className="font-medium text-sm hover:text-primary transition-colors block"
              >
                {q.question}
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {q.answer.replace(/\*\*/g, "").replace(/\n/g, " ").slice(0, 120)}...
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Экспорт предустановленных наборов вопросов для разных страниц
export const FAQ_PRESETS = {
  // Для страниц услуг
  dezinseksiya: ["prep-1", "safety-1", "price-1", "guarantee-1"],
  deratizatsiya: ["prep-5", "safety-3", "guarantee-1"],
  dezinfeksiya: ["safety-4", "reg-1", "price-3"],
  
  // Для страниц вредителей
  klopy: ["pest-1", "safety-1", "guarantee-2", "price-1"],
  tarakany: ["pest-2", "prep-1", "safety-5", "price-2"],
  blohi: ["pest-3", "prep-1", "safety-1"],
  krysy: ["prep-5", "guarantee-1"],
  
  // Для страниц объектов
  kvartira: ["prep-1", "safety-1", "safety-5", "guarantee-4"],
  dom: ["prep-5", "safety-3", "general-3"],
  restoran: ["reg-2", "reg-3", "price-5"],
  
  // Общие
  default: ["prep-1", "safety-1", "price-1", "guarantee-1"],
};
