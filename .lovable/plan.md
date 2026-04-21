

# Скролл к якорю с учётом смещения под фиксированный хедер

## Проблема
Сейчас все кнопки используют `element.scrollIntoView({ behavior: 'smooth' })` — это прокручивает якорь к самому верху окна (top: 0), но `SiteHeader` фиксированный (`sticky top-0`) высотой ~96px на десктопе (10px topbar + 56px main = ~66px) и ~56px на мобиле (topbar скрыт). В итоге верх калькулятора уезжает под шапку, и пользователь видит обрезанный заголовок секции.

## Решение
Создать утилиту `scrollToAnchor(id)` с учётом высоты sticky-хедера и заменить ей все 5 точек вызова.

### 1. Новый файл `src/lib/scrollToAnchor.ts`

```ts
export function scrollToAnchor(id: string, extraOffset = 16) {
  const el = document.getElementById(id);
  if (!el) return false;

  // Высота фиксированного хедера: ищем <header> в DOM, fallback 64px
  const header = document.querySelector('header');
  const headerHeight = header?.getBoundingClientRect().height ?? 64;

  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReduced ? 'auto' : 'smooth',
  });
  return true;
}
```

Преимущества:
- Динамически читает реальную высоту хедера (одинаково работает и на мобиле, где topbar скрыт, и на десктопе с topbar).
- `extraOffset = 16px` — небольшой воздух между шапкой и заголовком секции.
- Уважает `prefers-reduced-motion`.
- Возвращает `false`, если якорь не найден — удобно для fallback на `/#calculator`.

### 2. Заменить вызовы в 4 файлах

| Файл | Строки | Замена |
|---|---|---|
| `src/components/Hero.tsx` | 39, 41 | `scrollToAnchor('calculator')` / `scrollToAnchor('services')` |
| `src/components/Header.tsx` | 90–97 | `if (!scrollToAnchor('calculator')) window.location.href = '/#calculator'` |
| `src/components/Services.tsx` | 109 | `scrollToAnchor('calculator')` |
| `src/components/PriceTable.tsx` | 63–68 | `scrollToAnchor('calculator')` |

Импорт: `import { scrollToAnchor } from '@/lib/scrollToAnchor';`

### 3. Дополнительно — глобальный CSS fallback для якорных переходов через URL `/#calculator`

В `src/index.css` добавить:
```css
html { scroll-padding-top: 80px; }
@media (max-width: 640px) { html { scroll-padding-top: 64px; } }
```
Это страхует переходы через нативные `<a href="/#calculator">` (когда пользователь приходит по прямой ссылке с якорем) и не мешает программному скроллу.

## Итог
- 1 новая утилита (~15 строк).
- 4 файла отредактировать (5 точек вызова).
- 1 правка в `index.css` для нативных hash-переходов.
- Поведение единое: якорь всегда оказывается на 16px ниже фиксированного хедера, без обрезки заголовка.

