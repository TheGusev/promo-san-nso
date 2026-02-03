

# План создания единого плавающего виджета связи

## Проблема

На мобильной версии сайта СЭС «Гордез» пользователь видит:
1. В шапке: иконка телефона, номер телефона, кнопка «Заказать обработку»
2. Справа: три отдельные плавающие кнопки (телефон, WhatsApp, Telegram)

Это визуально перегружает первый экран и дублирует функционал.

---

## Решение

Создать один компактный плавающий виджет с раскрывающимся меню и упростить мобильную шапку.

---

## Структура нового виджета FloatingContact

### Свернутое состояние

```text
┌─────────────────────────────────┐
│                         [📞]    │  ← одна круглая кнопка
└─────────────────────────────────┘
```

### Раскрытое состояние (после нажатия)

```text
┌─────────────────────────────────┐
│                     [Telegram]  │
│                     [WhatsApp]  │
│                     [Телефон]   │
│                         [✕]     │  ← кнопка закрытия
└─────────────────────────────────┘
```

---

## Изменения в файлах

### 1. Создать `src/components/FloatingContact.tsx`

Новый компонент с раскрывающимся меню:

```typescript
interface FloatingContactProps {
  phone?: string;           // из SITE_CONFIG
  whatsapp?: string;        // ссылка на WhatsApp
  telegram?: string;        // ссылка на Telegram
}
```

**Поведение:**
- По умолчанию показывает одну круглую кнопку с иконкой трубки
- При нажатии — раскрывается вертикальный список:
  - Telegram (иконка + действие: открыть ссылку)
  - WhatsApp (иконка + действие: открыть ссылку)
  - Телефон (иконка + действие: `tel:`)
- Нажатие на любую опцию сворачивает виджет и выполняет действие
- Клик вне виджета сворачивает список
- Все клики трекаются через `reachGoal()` и `logTrafficEvent()`

**Стилизация:**
- Позиция: `fixed bottom-6 right-4 z-50`
- Основная кнопка: 56×56px, круглая, цвет primary
- Кнопки в меню: 48×48px, с подписями (на десктопе) или без (на мобиле)
- Анимация раскрытия: fade + slide up

### 2. Обновить `src/components/layout/SiteHeader.tsx`

**Мобильная версия (< 768px):**

Скрыть верхний бар с телефоном и CTA на мобиле:

```diff
- <div className="border-b bg-muted/30">
+ <div className="border-b bg-muted/30 hidden sm:block">
```

**Результат для мобиле:**
- Шапка: только логотип «Гордез» + бургер-меню
- Высота шапки: только основной ряд (h-14)
- Телефон остается в выпадающем мобильном меню (Sheet)

**Результат для десктопа:**
- Без изменений: верхний бар с телефоном и кнопкой остаётся

### 3. Обновить `src/components/layout/MainLayout.tsx`

Заменить старый `FloatingButtons` на новый `FloatingContact`:

```diff
- import FloatingButtons from "@/components/FloatingButtons";
+ import FloatingContact from "@/components/FloatingContact";

- <FloatingButtons />
+ <FloatingContact />
```

### 4. Обновить `src/pages/Index.tsx`

Аналогично заменить `FloatingButtons` на `FloatingContact`.

### 5. Удалить `src/components/FloatingButtons.tsx`

Старый компонент больше не нужен.

---

## Детали реализации FloatingContact

### Состояние

```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Закрытие по клику вне

Используем `useEffect` с обработчиком клика на документ:

```typescript
useEffect(() => {
  if (!isOpen) return;
  
  const handleClickOutside = (e: MouseEvent) => {
    if (!containerRef.current?.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };
  
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, [isOpen]);
```

### Действия

```typescript
const handleCall = () => {
  reachGoal("phone_click");
  logTrafficEvent("phone_click");
  window.location.href = `tel:${SITE_CONFIG.phoneClean}`;
  setIsOpen(false);
};

const handleWhatsApp = () => {
  reachGoal("whatsapp_click");
  logTrafficEvent("whatsapp_click");
  window.open(SITE_CONFIG.links.whatsapp + "?text=...", "_blank");
  setIsOpen(false);
};

const handleTelegram = () => {
  reachGoal("telegram_click");
  logTrafficEvent("telegram_click");
  window.open(SITE_CONFIG.links.telegram, "_blank");
  setIsOpen(false);
};
```

### JSX структура

```tsx
<div ref={containerRef} className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">
  {/* Раскрытое меню */}
  {isOpen && (
    <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-2">
      <ContactButton icon={TelegramIcon} onClick={handleTelegram} color="#0088cc" label="Telegram" />
      <ContactButton icon={WhatsAppIcon} onClick={handleWhatsApp} color="#25D366" label="WhatsApp" />
      <ContactButton icon={Phone} onClick={handleCall} color="primary" label="Позвонить" />
    </div>
  )}
  
  {/* Главная кнопка */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="h-14 w-14 rounded-full bg-primary text-white shadow-lg"
    aria-label="Связаться с нами"
  >
    {isOpen ? <X /> : <Phone />}
  </button>
</div>
```

---

## UX после изменений

### Мобильный первый экран

```text
┌─────────────────────────────────┐
│ Гордез                    [☰]  │  ← чистая шапка
├─────────────────────────────────┤
│                                 │
│  H1: Дезинсекция в Новосибирске │
│  Подзаголовок...               │
│                                 │
│  [Вызвать специалиста]          │
│  📞 8 (383) 312-16-60          │
│                                 │
│  ┌───────────────────────────┐ │
│  │  Цена от 1 500 ₽         │ │
│  │  [Имя] [Телефон]          │ │
│  │  [Заявка → 1 500 ₽]       │ │
│  └───────────────────────────┘ │
│                           [📞] │  ← один виджет
└─────────────────────────────────┘
```

### При нажатии на виджет

```text
│                     [Telegram] │
│                     [WhatsApp] │
│                     [Телефон]  │
│                           [✕]  │
```

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `src/components/FloatingContact.tsx` | Создать |
| `src/components/layout/SiteHeader.tsx` | Скрыть top bar на мобиле |
| `src/components/layout/MainLayout.tsx` | Заменить FloatingButtons → FloatingContact |
| `src/pages/Index.tsx` | Заменить FloatingButtons → FloatingContact |
| `src/components/FloatingButtons.tsx` | Удалить |

---

## Итоговый результат

- Мобильная шапка: только лого + бургер (чисто и минималистично)
- Один плавающий виджет связи в правом нижнем углу на всех страницах
- Три способа связи (Telegram, WhatsApp, телефон) доступны в одном месте
- Нет дублирования элементов
- Все клики трекаются для аналитики
- Десктопная версия сохраняет телефон и CTA в шапке

