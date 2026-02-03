
# План: Добавление фоновых изображений с плавной сменой в Hero

## Цель
Добавить 2 профессиональных фотографии на задний план Hero-секции с плавной анимацией смены каждые 2 секунды, сохраняя читаемость текста.

---

## Анализ

### Текущее состояние Hero
- Градиентный фон `bg-gradient-hero` (сине-зеленый)
- SVG-паттерн поверх градиента с opacity 10%
- Белый текст поверх

### Загруженные изображения
1. `user-uploads://2026-02-03_20-24-17.png` — скриншот текущего дизайна (референс, не использовать)
2. `user-uploads://9604872c-0b8f-425f-bc0a-6a50bdcac662.png` — специалист в коридоре с туманом
3. `user-uploads://c4a42d5c-22d5-49e5-b38a-942df4af3fa1.png` — специалист в квартире

---

## Решение

### Техническая реализация

1. **Копирование изображений в проект**
   - `public/images/hero-bg-1.png` — специалист в коридоре
   - `public/images/hero-bg-2.png` — специалист в квартире

2. **Модификация Hero.tsx**
   - Добавить state для отслеживания текущего изображения
   - Добавить useEffect с setInterval для смены изображений каждые 2 секунды
   - Реализовать плавный crossfade через CSS transitions

3. **Структура слоев (снизу вверх)**
   ```
   [Изображение 1] opacity: activeIndex === 0 ? 1 : 0
   [Изображение 2] opacity: activeIndex === 1 ? 1 : 0
   [Темный overlay] — для читаемости текста
   [Gradient overlay] — сохраняем брендовые цвета
   [Контент]
   ```

4. **CSS для читаемости текста**
   - Добавить темный overlay с opacity ~50-60%
   - Сохранить легкий gradient overlay для брендовых цветов
   - Transition duration: 1s для плавности

---

## Детальная реализация

### Структура компонента

```tsx
import { useState, useEffect } from "react";

const backgroundImages = [
  "/images/hero-bg-1.png",
  "/images/hero-bg-2.png"
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px]">
      {/* Background images with crossfade */}
      {backgroundImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${src})`,
            opacity: activeIndex === index ? 1 : 0
          }}
        />
      ))}
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Gradient overlay for brand colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/30" />
      
      {/* Content */}
      <div className="relative container ...">
        {/* existing content */}
      </div>
    </section>
  );
}
```

### Оптимизации

- Preload изображений для мгновенной первой смены
- `will-change: opacity` для GPU-ускорения
- Респонсив: `bg-cover bg-center` для корректного масштабирования
- Уважение `prefers-reduced-motion`: отключить анимацию

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `public/images/hero-bg-1.png` | Создать (скопировать из user-uploads) |
| `public/images/hero-bg-2.png` | Создать (скопировать из user-uploads) |
| `src/components/Hero.tsx` | Модифицировать — добавить фоновые изображения с анимацией |

---

## Визуальный результат

- Hero с профессиональными фотографиями, показывающими работу специалистов
- Плавная смена изображений каждые 2 секунды (crossfade 1 сек)
- Текст остается читаемым благодаря темному overlay
- Сохранены брендовые цвета через полупрозрачный gradient overlay
- Адаптивно работает на мобильных устройствах
