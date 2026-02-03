

# План: Исправление проблем из технического чек-листа

## Обзор

Исправляем 3 технические проблемы, выявленные в аудите. Четвёртая (Core Web Vitals) требует внешней проверки после деплоя.

---

## 1. Удаление console.log в production

### Проблема
Отладочные логи выводятся в консоль браузера и edge functions в production:
- `src/lib/yandexMetrika.ts` — 4 console.log/error (строки 20, 22, 36, 38, 51, 53)
- `src/hooks/useTrafficLogging.ts` — 1 console.error (строка 37)
- Edge functions (7 файлов) — многочисленные console.log

### Решение

**Frontend** — обернуть в `import.meta.env.DEV`:

```typescript
// yandexMetrika.ts
if (import.meta.env.DEV) {
  console.log('[YM] Goal reached:', goalName, params);
}
```

**Edge functions** — оставить console.log для мониторинга в Deno (логи не видны пользователям, полезны для отладки в Cloud Dashboard). Можно обернуть в ENV-переменную DEBUG при необходимости.

### Файлы для изменения

| Файл | Изменение |
|------|-----------|
| `src/lib/yandexMetrika.ts` | Обернуть console.log в DEV check |
| `src/hooks/useTrafficLogging.ts` | Обернуть console.error в DEV check |

---

## 2. Footer ссылки на canonical URL

### Проблема
Ссылки в Footer (строки 37-42) используют старые URL:
- `/dezinfeksiya` → редирект на `/usluga/dezinfeksiya`
- `/dezinseksiya` → редирект на `/usluga/dezinseksiya`
- и т.д.

Это вызывает лишние 301-редиректы и ухудшает SEO.

### Решение
Заменить на canonical URL `/usluga/[slug]`:

```typescript
// Было:
<Link to="/dezinfeksiya">Дезинфекция</Link>

// Станет:
<Link to="/usluga/dezinfeksiya">Дезинфекция</Link>
```

### Файл для изменения

| Файл | Изменение |
|------|-----------|
| `src/components/Footer.tsx` | Заменить 6 ссылок на услуги (строки 37-42) |

---

## 3. Сегментация аналитики — добавление page_type

### Проблема
События в `logTrafficEvent` не передают `page_type`, что затрудняет анализ конверсий по типам страниц в Метрике.

### Решение
Добавить автоматическое определение `page_type` на основе URL:

```typescript
// src/lib/tracking.ts — новая функция
export function getPageType(): string {
  const path = window.location.pathname;
  
  if (path === '/') return 'home';
  if (path.startsWith('/usluga/')) return 'service';
  if (path.startsWith('/vreditel/')) return 'pest';
  if (path.startsWith('/obekt/')) return 'object';
  if (path.startsWith('/rayon/')) return 'district';
  if (path.startsWith('/uslugi')) return 'services_list';
  if (path.startsWith('/vrediteli')) return 'pests_list';
  if (path.startsWith('/obekty')) return 'objects_list';
  if (path.startsWith('/rayony')) return 'districts_list';
  if (path.startsWith('/blog')) return 'blog';
  if (path.startsWith('/faq')) return 'faq';
  if (path.startsWith('/sanpin')) return 'sanpin';
  if (path.includes('/')) return 'programmatic'; // combo pages
  
  return 'other';
}
```

Интегрировать в `logTrafficEvent`:

```typescript
// src/hooks/useTrafficLogging.ts
const tracking = getTrackingContext();
const pageType = getPageType();

await supabase.functions.invoke('log-traffic-event', {
  body: {
    ...existingFields,
    page_type: pageType, // Добавить в event_data
  }
});
```

### Файлы для изменения

| Файл | Изменение |
|------|-----------|
| `src/lib/tracking.ts` | Добавить функцию getPageType() |
| `src/hooks/useTrafficLogging.ts` | Передавать page_type в event_data |

---

## 4. Core Web Vitals

### Статус
Требуется внешняя проверка в PageSpeed Insights после деплоя на production. Это не code change — нужно протестировать https://xn--d1aey.xn--p1ai в PageSpeed.

---

## Итоговый список файлов

| # | Файл | Действие |
|---|------|----------|
| 1 | `src/lib/yandexMetrika.ts` | Обернуть console.log в DEV |
| 2 | `src/hooks/useTrafficLogging.ts` | Обернуть console.error в DEV + добавить page_type |
| 3 | `src/lib/tracking.ts` | Добавить getPageType() |
| 4 | `src/components/Footer.tsx` | Canonical URL для услуг |

## Ожидаемый результат

- Консоль браузера чистая в production
- Нет лишних 301-редиректов из Footer
- Аналитика содержит page_type для сегментации
- Core Web Vitals — ручная проверка после деплоя

