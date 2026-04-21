

# Составная цель `all_conversions` для Яндекс.Метрики

## Что делаем
По образцу другого проекта настраиваем единую составную цель `all_conversions`, которая агрегирует все лид-генерирующие события сайта. Это нужно для:
- единой метрики конверсии сайта в дашборде Метрики
- использования как primary success metric в MVT (Thompson Sampling)
- очистки отчётов от шумовых микро-конверсий

## Текущее состояние

В коде сейчас **22 разных вызова `reachGoal`**, среди которых смешаны:
- настоящие лиды (`lead_submit`, `popup_submit`, `hero_form_submit`)
- микро-конверсии-шум (`scroll_25/50/75/100`, `calc_open`, `popup_open`, `hero_cta_click`)
- клики по контактам (`phone_click`, `max_click`, `telegram_click`)

Нет единой точки правды — `reachGoal` вызывается напрямую из 9 файлов, цели названы непоследовательно.

## Архитектура (3 слоя — как в файле-образце)

```text
┌─────────────────────────────────────────────────┐
│ СЛОЙ 1: Источник правды                         │
│ src/lib/analytics.ts → trackGoal(name, params)  │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│ СЛОЙ 2: Точки вызова в компонентах              │
│ Calculator, PopupForm, HeroService, FloatingC.  │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│ СЛОЙ 3: Яндекс.Метрика (счётчик 104205609)      │
│ Атомарные цели + составная all_conversions      │
└─────────────────────────────────────────────────┘
```

## Финальный список целей (после чистки)

### Лид-генерирующие (входят в `all_conversions`)

| # | Цель | Где срабатывает |
|---|------|-----------------|
| 1 | `lead_submit` | Calculator — отправка формы расчёта |
| 2 | `popup_submit` | PopupForm — отправка попап-формы |
| 3 | `hero_form_submit` | HeroService — форма на сервисных страницах |
| 4 | `phone_click` | Все клики `tel:` (Header, FloatingContact, HeroService, PriceTable) |

### Engagement / контакты (НЕ входят в `all_conversions`)

| # | Цель | Где срабатывает |
|---|------|-----------------|
| 5 | `max_click` | FloatingContact — кнопка MAX |
| 6 | `telegram_click` | FloatingContact — кнопка Telegram |
| 7 | `calc_calculate` | Calculator — пользователь ввёл площадь и получил цену |
| 8 | `review_submit` | ReviewFormModal — отправка отзыва |

### Удаляем (шум, искажают конверсию)

- `scroll_25`, `scroll_50`, `scroll_75`, `scroll_100` — в `useEngagementTracking.ts`
- `calc_open` — открытие калькулятора (не намерение)
- `popup_open` — показ попапа (не действие пользователя)
- `hero_cta_click` — клик по CTA-кнопке без отправки формы

## Файлы для изменения (8 файлов)

### 1. `src/lib/analytics.ts` — НОВЫЙ
Единая обёртка `trackGoal(name, params)` поверх `reachGoal`. Все компоненты импортируют только её. Добавляет автоматический контекст (intent, variantId, utm) ко всем целям.

### 2. `src/hooks/useEngagementTracking.ts`
Удалить вызовы `reachGoal('scroll_*')` — оставить только локальное логирование в `traffic_events` (для внутренней аналитики), но не слать в Метрику.

### 3. `src/components/Calculator.tsx`
- Удалить `reachGoal('calc_open')` (строка 331)
- Оставить `reachGoal('calc_calculate', ...)` и `reachGoal('lead_submit', ...)` через новый `trackGoal`

### 4. `src/components/PopupForm.tsx`
- Удалить `reachGoal('popup_open')` (строки 62, 73)
- Оставить `reachGoal('popup_submit', ...)` через `trackGoal`

### 5. `src/components/Hero.tsx`
- Удалить `reachGoal('hero_cta_click', ...)` (строка 38) — это просто скролл, не конверсия

### 6. `src/components/HeroService.tsx`, `Header.tsx`, `FloatingContact.tsx`, `PriceTable.tsx`
Заменить прямые вызовы `reachGoal` на `trackGoal` из нового `analytics.ts`.

### 7. `mem://analytics/metrika-goals-complete-list`
Обновить мемори — актуальный список из 8 целей и описание `all_conversions`.

## Что нужно сделать ВРУЧНУЮ в кабинете Яндекс.Метрики

После выкатки кода:

1. Открыть **Метрика → Счётчик 104205609 → Цели**
2. Удалить старые цели: `scroll_25/50/75/100`, `calc_open`, `popup_open`, `hero_cta_click`, `whatsapp_click`
3. Создать (если ещё нет) атомарные цели типа JavaScript-событие с идентификаторами из таблицы выше
4. Создать **составную цель** с именем `all_conversions`, тип «Составная», шаги:
   - `lead_submit` ИЛИ
   - `popup_submit` ИЛИ
   - `hero_form_submit` ИЛИ
   - `phone_click`

## Итого
- **1 новый файл** (`src/lib/analytics.ts`)
- **7 файлов отредактировать** (чистка целей + переход на `trackGoal`)
- **1 мемори** обновить
- **Ручная настройка** в кабинете Метрики (без неё составная цель не заработает — она существует только на стороне Метрики)

