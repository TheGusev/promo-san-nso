---
name: Simple Calculator Wizard
description: 3-step wizard calculator (Pest → Place → Price+Phone). Replaces complex 6-param Calculator. Fixed price matrix.
type: feature
---
Калькулятор полностью упрощён: вместо 6 параметров — 3 шага в одной карточке.

**Поток:**
1. Шаг 1 — выбор вредителя (12 карточек из `src/data/pests.ts`, сетка 2/3/4 колонки).
2. Шаг 2 — выбор места из доступных для этого вредителя (фильтрация через `getAvailablePlaces`). Если доступно одно место (например, кроты → только участок) — шаг 2 пропускается.
3. Шаг 3 — большая анимированная цена + 1 поле телефона + чекбокс согласия + кнопка «Вызвать мастера». Альтернатива — кнопка «Позвонить».

**Места (PlaceKey):** `apt-1` (1-комн до 40 м²), `apt-2` (2-комн до 60 м²), `apt-3` (3-комн до 90 м²), `apt-4` (4+ комн от 90 м²), `house`, `plot`, `commercial`. Маппинг на `object_type` для лида: apartment/house/plot/office.

**Прайс-матрица (источник правды — `src/data/calculatorPricing.ts`):**
- Дезинсекция (клопы, тараканы, блохи, муравьи, моль, кожеед): 1500/1800/2100/2500 для 1-4 комн, 2500 для дома, «от 2500» для коммерции.
- Дератизация (крысы, мыши): 1800/2000/2300/2500/2500/2500/«от 2500».
- Осы: только дом/участок/коммерция = 2000.
- Клещи, комары: только участок = 2500.
- Кроты: только участок = 2500.

**Поля лида (handle-lead):** `name: "Клиент"` (дефолт, менеджер уточнит при звонке), `phone`, `service` (из `pest.relatedServices[0]`), `object_type`, `final_price`, `base_price`, `pest_slug`, `place_key`, `source: "website_calculator_simple"`. Email пустой.

**Аналитика:** `calc_calculate` после выбора места (есть цена), `lead_submit` после отправки, `phone_click` для альтернативной кнопки. Все через `trackGoal`.

**Использование:** `<SimpleCalculator />` в `src/pages/Index.tsx` и `src/components/shared/CostCalculatorPlaceholder.tsx` (программные страницы). Старый `Calculator.tsx` оставлен в репозитории, но не импортируется — удалить позже.

**Технические детали:** анимация цены через `useAnimatedNumber`, переходы шагов через `framer-motion` AnimatePresence. Поддержка офлайн через `queueLead`. Тач-таргеты ≥ 56px.
