
# План: Плавная анимация открытия/закрытия секций с framer-motion

## Задача
Добавить плавную анимацию высоты и прозрачности при открытии/закрытии раскрывающихся секций "Отзывы" и "FAQ" на мобильных устройствах.

## Текущее состояние
- Компонент `MobileCollapsibleSection` использует Radix UI `Collapsible`
- Анимация иконки (поворот стрелки) уже работает через CSS transition
- Контент раскрывается мгновенно, без плавной анимации высоты

## Решение
Заменить Radix `CollapsibleContent` на `motion.div` из framer-motion с анимацией `height: auto`.

---

## Изменения

### 1. Установить framer-motion

Добавить зависимость в `package.json`:

```json
"framer-motion": "^11.0.0"
```

---

### 2. Обновить `src/components/MobileCollapsibleSection.tsx`

**Изменения:**

| Элемент | Было | Станет |
|---------|------|--------|
| Импорты | Radix Collapsible | framer-motion `motion`, `AnimatePresence` |
| Контейнер контента | `<CollapsibleContent>` | `<motion.div>` с анимацией |
| Анимация | Нет | Плавное раскрытие высоты + fade |

**Новый код:**

```tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
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

  // На мобильных — с плавной анимацией
  return (
    <div className="w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-4 bg-muted/50 rounded-lg flex items-center justify-between"
      >
        <div className="text-left">
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.04, 0.62, 0.23, 0.98] 
            }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## Детали анимации

| Параметр | Значение | Описание |
|----------|----------|----------|
| `height` | `0` → `auto` | Плавное раскрытие высоты |
| `opacity` | `0` → `1` | Fade эффект |
| `duration` | `0.3s` | Длительность анимации |
| `ease` | `[0.04, 0.62, 0.23, 0.98]` | Кастомная кривая для естественного движения |
| Иконка | CSS → framer-motion | Более плавный поворот стрелки |

---

## Визуальный результат

**Открытие:**
1. Пользователь нажимает на заголовок
2. Стрелка плавно поворачивается на 180°
3. Контент плавно "выезжает" сверху вниз с fade-in

**Закрытие:**
1. Пользователь нажимает на заголовок
2. Стрелка плавно возвращается в исходное положение
3. Контент плавно "уезжает" снизу вверх с fade-out

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `package.json` | Добавить `framer-motion` |
| `src/components/MobileCollapsibleSection.tsx` | Переписать с использованием framer-motion |
