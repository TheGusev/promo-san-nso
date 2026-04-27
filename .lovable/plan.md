# Единая составная цель `all_conversions` с защитой «one-fire-per-event»

## Задача
Сейчас в Метрике (счётчик 104205609) цели регистрируются по-отдельности (`lead_submit`, `popup_submit`, `hero_form_submit`, `phone_click`, `max_click`, `telegram_click`, `calc_calculate`, `review_submit`). В предыдущем сообщении я лишь перечислил их, но **не реализовал составную цель и защиту от двойных срабатываний**, как требовалось.

Нужно:
1. Добавить **единую составную цель `all_conversions`**, которая срабатывает один раз на любое значимое действие (лид, клик по контакту).
2. Гарантировать, что **на одно пользовательское событие в Метрику уходит ровно одно срабатывание `all_conversions`** (не 2-3, даже если рядом отрабатывают `lead_submit` + `phone_click` + `calc_calculate`).
3. Не ломать существующие персональные цели (они нужны для аналитики воронки).

## Что именно меняется (только код, без правок в кабинете Метрики)

### 1. `src/lib/analytics.ts` — единственный источник правды
- Расширить `GoalName` атрибутом «уровень»: лидогенерирующие vs вовлечение.
- Ввести два уровня важности:
  - **conversion** (вес 100): `lead_submit`, `popup_submit`, `hero_form_submit`
  - **contact** (вес 50): `phone_click`, `max_click`, `telegram_click`
  - **engagement** (вес 0, в `all_conversions` не идёт): `calc_calculate`, `review_submit`
- В `trackGoal()` после отправки персональной цели **в том же тике** вызывать `fireAllConversionsOnce()`:
  - guard через `Map<eventKey, timestamp>` в модульной области;
  - eventKey = `${goalName}|${JSON.stringify(params)}` + дебаунс-окно 1500 мс на ЛЮБУЮ цель уровня ≥ contact;
  - если в окне уже было срабатывание с бóльшим или равным весом — `all_conversions` НЕ отправляется повторно;
  - если пришла цель с бóльшим весом (например, через 200 мс после `phone_click` пришёл `lead_submit`) — допускается ровно одно «апгрейд»-срабатывание `all_conversions` с параметром `upgraded_from`.
- Параметры `all_conversions`: `{ source: goalName, weight, page: location.pathname }` — пригодится для отчётов в Метрике.

### 2. Дедупликация по сессии (вторичный слой)
Дополнительно в `sessionStorage` хранить `all_conversions:lastFired` (timestamp). Если последний fire был < 1500 мс назад с тем же или большим весом — пропускаем. Это защищает от React-двойного рендера в StrictMode и повторных кликов «нервным пальцем».

### 3. Никаких изменений в местах вызова
`HeroService.tsx`, `SimpleCalculator.tsx`, `PopupForm.tsx`, `Calculator.tsx`, `FloatingContact.tsx`, `Header.tsx`, `PriceTable.tsx` — **не трогаем**. Они продолжают звать `trackGoal('phone_click' | 'lead_submit' | …)`. Логика составной цели и анти-дубль полностью инкапсулирована в `analytics.ts`.

### 4. Обновить документацию в памяти
`mem://analytics/metrika-goals-complete-list` — переписать секцию «Композитные цели»:
- `all_conversions` теперь технически отправляется фронтом (а не настраивается в кабинете как «составная»);
- описать guard-логику и веса;
- список конкретных goalName, которые её триггерят.

## Технические детали

### Сценарии и ожидаемое поведение
| Действие пользователя | Персональные цели | `all_conversions` |
|---|---|---|
| Клик по телефону в Header | `phone_click` | 1 раз (weight=50, source=phone_click) |
| Клик по телефону + через 500 мс отправка формы калькулятора | `phone_click`, `lead_submit` | 1 раз (апгрейд до weight=100, source=lead_submit, upgraded_from=phone_click) |
| Двойной клик по кнопке MAX за 300 мс | `max_click` ×2 | 1 раз |
| Расчёт цены в калькуляторе (без отправки) | `calc_calculate` | 0 раз (engagement) |
| Отправка отзыва | `review_submit` | 0 раз |
| Отправка PopupForm | `popup_submit` | 1 раз (weight=100) |

### Псевдокод guard
```ts
const WEIGHTS: Record<GoalName, number> = {
  lead_submit: 100, popup_submit: 100, hero_form_submit: 100,
  phone_click: 50, max_click: 50, telegram_click: 50,
  calc_calculate: 0, review_submit: 0,
};
const WINDOW_MS = 1500;
let lastFire: { ts: number; weight: number; source: GoalName } | null = null;

function fireAllConversionsOnce(name: GoalName) {
  const w = WEIGHTS[name];
  if (w === 0) return;
  const now = Date.now();
  if (lastFire && now - lastFire.ts < WINDOW_MS && w <= lastFire.weight) return;
  reachGoal('all_conversions', {
    source: name, weight: w,
    upgraded_from: lastFire && now - lastFire.ts < WINDOW_MS ? lastFire.source : undefined,
    page: location.pathname,
  });
  lastFire = { ts: now, weight: w, source: name };
  sessionStorage.setItem('all_conversions:lastFired', String(now));
}
```
Восстановление `lastFire` из `sessionStorage` при инициализации модуля — для устойчивости к перезагрузкам страницы внутри одной сессии.

## Что нужно сделать в кабинете Метрики (вручную, после деплоя)
Создать в кабинете Я.Метрики 104205609 одну цель типа **JavaScript-событие** с идентификатором `all_conversions`. Никаких составных целей собирать не нужно — фронт сам шлёт ровно одно срабатывание.

## Файлы
- `src/lib/analytics.ts` — основная правка (~40 строк).
- `mem://analytics/metrika-goals-complete-list` — обновление документации.

## Риски и проверка
- Риск: SSR/preload вызывает `trackGoal` до загрузки `window.ym` — уже защищено внутри `reachGoal` (проверка `window.ym`).
- Проверка после деплоя: в DEV-консоли по логу `[YM] Goal reached: all_conversions` убедиться, что при последовательности `phone_click` → `lead_submit` (в течение 1.5 с) уходит ровно 2 записи: одна для `phone_click`/`all_conversions`, вторая — апгрейд для `lead_submit`/`all_conversions` с `upgraded_from: 'phone_click'`. При двойном клике — одна запись.

## Итог
1 файл правки + 1 обновление памяти. Без изменений в компонентах и без работы в кабинете Метрики (кроме создания одной цели `all_conversions` типа JS-событие).
