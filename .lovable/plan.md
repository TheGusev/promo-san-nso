
# План: Раскрывающиеся секции "Отзывы" и "FAQ" на мобильных

## Проблема
На мобильных устройствах секции "Отзывы" и "Часто задаваемые вопросы" занимают много места на экране. Нужно спрятать их под раскрывающиеся заголовки.

## Решение
Создать обёрточный компонент `MobileCollapsibleSection`, который:
- На **мобильных** (< 768px): показывает заголовок с иконкой-стрелкой, при клике раскрывает контент
- На **десктопе**: показывает контент полностью без возможности сворачивания

---

## Файлы для создания/изменения

### 1. Создать `src/components/MobileCollapsibleSection.tsx`

Новый компонент-обёртка:

```tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface MobileCollapsibleSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function MobileCollapsibleSection({ 
  title, 
  subtitle, 
  children, 
  defaultOpen = false 
}: MobileCollapsibleSectionProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // На десктопе — показываем как обычно
  if (!isMobile) {
    return <>{children}</>;
  }

  // На мобильных — Collapsible с заголовком
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full py-4 px-4 bg-muted/50 flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <ChevronDown className={cn(
          "h-5 w-5 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
```

---

### 2. Изменить `src/pages/Index.tsx`

Обернуть секции Reviews и FAQ в `MobileCollapsibleSection`:

```tsx
import { MobileCollapsibleSection } from "@/components/MobileCollapsibleSection";

// ...

<Suspense fallback={<div className="h-96" />}>
  <MobileCollapsibleSection 
    title="Отзывы наших клиентов" 
    subtitle="Нажмите, чтобы развернуть"
  >
    <section id="reviews">
      <Reviews />
    </section>
  </MobileCollapsibleSection>
</Suspense>

<Suspense fallback={<div className="h-64" />}>
  <MobileCollapsibleSection 
    title="Часто задаваемые вопросы" 
    subtitle="Нажмите, чтобы развернуть"
  >
    <FAQ />
  </MobileCollapsibleSection>
</Suspense>
```

---

## Визуальный результат

### Мобильная версия (свёрнуто):

```text
┌────────────────────────────────────┐
│ Отзывы наших клиентов          ▼  │
│ Нажмите, чтобы развернуть          │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ Часто задаваемые вопросы       ▼  │
│ Нажмите, чтобы развернуть          │
└────────────────────────────────────┘
```

### Мобильная версия (развёрнуто):

```text
┌────────────────────────────────────┐
│ Отзывы наших клиентов          ▲  │
│ Нажмите, чтобы развернуть          │
├────────────────────────────────────┤
│ [Карточки отзывов...]              │
└────────────────────────────────────┘
```

### Десктоп версия:

Без изменений — секции отображаются полностью как раньше.

---

## Итого файлов

| Файл | Действие |
|------|----------|
| `src/components/MobileCollapsibleSection.tsx` | Создать |
| `src/pages/Index.tsx` | Обернуть Reviews и FAQ в MobileCollapsibleSection |
