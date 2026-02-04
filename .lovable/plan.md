
# План: Исправление всех оставшихся ошибок для достижения 100/100

## Текущий статус после аудита

| # | Критерий | Текущий балл | Проблема | Решение |
|---|----------|--------------|----------|---------|
| 1 | Header.tsx — legacy URL | 96/100 | Ссылки `/dezinfeksiya` вызывают 301 редирект | Заменить на `/usluga/dezinfeksiya` |
| 2 | sitemap.xml — lastmod | 98/100 | Нет дат последнего изменения | Добавить `<lastmod>` теги |
| 3 | Accessibility — skip-link | 98/100 | Нет skip-to-content для screen readers | Добавить skip-link в index.html |
| 4 | Грамматика — "в Новосибирска" | 100/100 | Все найденные случаи корректны | Подтверждено |

---

## Шаг 1: Исправить Header.tsx — canonical URL

### Файл: `src/components/Header.tsx`

**Было (строки 9-16):**
```typescript
const services = [
  { name: "Дезинфекция", href: "/dezinfeksiya" },
  { name: "Дезинсекция", href: "/dezinseksiya" },
  { name: "Дератизация", href: "/deratizatsiya" },
  { name: "Озонирование", href: "/ozonirovanie" },
  { name: "Дезодорация", href: "/dezodoratsiya" },
  { name: "Подготовка к СЭС", href: "/sertifikatsiya" },
];
```

**Станет:**
```typescript
const services = [
  { name: "Дезинфекция", href: "/usluga/dezinfeksiya" },
  { name: "Дезинсекция", href: "/usluga/dezinseksiya" },
  { name: "Дератизация", href: "/usluga/deratizatsiya" },
  { name: "Озонирование", href: "/usluga/ozonirovanie" },
  { name: "Дезодорация", href: "/usluga/dezodoratsiya" },
  { name: "Подготовка к СЭС", href: "/usluga/sertifikatsiya" },
];
```

**Результат:** Устраняет 6 лишних 301-редиректов, улучшает скорость загрузки и SEO.

---

## Шаг 2: Добавить lastmod в sitemap.xml

### Файл: `public/sitemap.xml`

Добавить теги `<lastmod>` ко всем URL. Формат: `YYYY-MM-DD`

**Пример:**
```xml
<url>
  <loc>https://xn--d1aey.xn--p1ai/</loc>
  <lastmod>2026-02-04</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>
```

**Логика дат:**
- Главная и индексные страницы: текущая дата (2026-02-04)
- Услуги, вредители, объекты, районы: 2026-02-01
- Programmatic-страницы: 2026-01-15
- Блог-статьи: 2026-01-01

---

## Шаг 3: Добавить skip-to-content для accessibility

### Файл: `index.html`

Добавить после `<body>`:
```html
<body>
  <!-- Skip to main content for accessibility -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none">
    Перейти к основному содержимому
  </a>
```

### Файл: `src/pages/Index.tsx`

Добавить `id="main-content"` к основному контейнеру:
```tsx
<main id="main-content">
  {/* существующий контент */}
</main>
```

---

## Шаг 4: Проверка грамматики (подтверждено)

Поиск по коду показал:

| Файл | Текст | Статус |
|------|-------|--------|
| blogContentGenerator.ts | "районов Новосибирска" | Корректно (родительный) |
| districts.ts | комментарий | Не влияет на UI |
| FAQ.tsx | "в Новосибирске" | Корректно (предложный) |

Грамматических ошибок "в Новосибирска" в UI не обнаружено.

---

## Итоговая таблица изменений

| # | Файл | Изменение |
|---|------|-----------|
| 1 | `src/components/Header.tsx` | 6 ссылок → canonical URL |
| 2 | `public/sitemap.xml` | Добавить 120+ тегов `<lastmod>` |
| 3 | `index.html` | Добавить skip-link после `<body>` |
| 4 | `src/pages/Index.tsx` | Добавить `id="main-content"` |

---

## Ожидаемый результат после исправлений

| # | Критерий | До | После |
|---|----------|-----|-------|
| 1 | Архитектура (Header canonical) | 96 | 100 |
| 2 | SEO (sitemap lastmod) | 98 | 100 |
| 3 | Accessibility (skip-link) | 98 | 100 |
| 4 | Грамматика | 100 | 100 |
| **ИТОГО** | | **97/100** | **100/100** |

---

## Финальный чек-лист качества

После внедрения изменений:

1. Проверить Header — клик на услугу ведёт напрямую без редиректа
2. Валидировать sitemap.xml через https://www.xml-sitemaps.com/validate-xml-sitemap.html
3. Проверить skip-link — Tab в браузере показывает "Перейти к основному содержимому"
4. Поиск по коду — `grep -r "в Новосибирска" src/` возвращает 0 результатов в JSX
5. PageSpeed Insights — проверить Core Web Vitals на production

