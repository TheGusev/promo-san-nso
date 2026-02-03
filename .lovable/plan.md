
# План: Исправление склонений топонима "Новосибирск"

## Обнаруженная проблема

По сайту встречается грамматическая ошибка **"в Новосибирска"** вместо правильного **"в Новосибирске"**. Причина — использование `regionGenitive` (родительный падеж) вместо `regionPrepositional` (предложный падеж) с предлогом "в".

### Правильные формы

| Падеж | Форма | Пример использования |
|-------|-------|---------------------|
| Родительный | Новосибирска | "из Новосибирска", "районы Новосибирска" |
| Предложный | Новосибирске | "в Новосибирске", "о Новосибирске" |

---

## Файлы с ошибками

### 1. src/components/templates/ServicePageTemplate.tsx

| Строка | Ошибка | Исправление |
|--------|--------|-------------|
| 76 | `в ${SITE_CONFIG.regionGenitive}` | `в ${SITE_CONFIG.regionPrepositional}` |
| 197 | `в ${SITE_CONFIG.regionGenitive}` | `в ${SITE_CONFIG.regionPrepositional}` |
| 451 | `в ${SITE_CONFIG.regionGenitive}` | `в ${SITE_CONFIG.regionPrepositional}` |
| 429 | `по районам ${regionGenitive}` | **Правильно** (родительный) |

**Результат:** "Дезинфекция в Новосибирске" вместо "Дезинфекция в Новосибирска"

---

### 2. src/pages/uslugi/Index.tsx

| Строка | Ошибка | Исправление |
|--------|--------|-------------|
| 31 | `в ${SITE_CONFIG.regionGenitive}` | `в ${SITE_CONFIG.regionPrepositional}` |

**Результат:** "Услуги СЭС в Новосибирске"

---

### 3. src/lib/programmaticContent.ts

Проблема: используется конструкция `${SITE_CONFIG.region}е` — это даёт "Новосибирске" буквально добавляя "е" к "Новосибирск", но при этом не склоняет слово.

| Строки | Ошибка | Исправление |
|--------|--------|-------------|
| 15 | `в ${SITE_CONFIG.region}е` | `в ${SITE_CONFIG.regionPrepositional}` |
| 25-26 | `в ${SITE_CONFIG.region}е` | `в ${SITE_CONFIG.regionPrepositional}` |
| 50-51 | `в ${entry.districtName}е (${SITE_CONFIG.region})` → `(${SITE_CONFIG.region})` | Использовать `entry.districtName` без добавления "е" + `${SITE_CONFIG.region}` корректен (именительный) |
| 143, 171 | `в ${SITE_CONFIG.region}е` | `в ${SITE_CONFIG.regionPrepositional}` |

**Примечание:** Для районов нужно использовать поле `nameLocative` вместо `${districtName}е`.

---

### 4. src/pages/programmatic/ComboPage.tsx

| Строки | Ошибка | Исправление |
|--------|--------|-------------|
| 71 | `в ${entry.districtName}е` / `в ${SITE_CONFIG.region}е` | Использовать `district?.nameLocative` и `SITE_CONFIG.regionPrepositional` |
| 166 | `в ${entry.districtName}е` / `в ${SITE_CONFIG.region}е` | Аналогично |

---

## Структура данных (уже корректна)

В `siteConfig.ts` поля уже существуют:
```typescript
region: "Новосибирск",
regionGenitive: "Новосибирска",
regionPrepositional: "Новосибирске",
```

В `districts.ts` каждый район имеет `nameLocative`:
```typescript
nameLocative: "Центральном районе",  // для "в Центральном районе"
```

---

## План изменений

### Шаг 1: ServicePageTemplate.tsx
Заменить 3 использования `regionGenitive` на `regionPrepositional` в контексте предлога "в".

### Шаг 2: uslugi/Index.tsx
Заменить `regionGenitive` на `regionPrepositional` в заголовке H1.

### Шаг 3: programmaticContent.ts
- Заменить все `${SITE_CONFIG.region}е` на `${SITE_CONFIG.regionPrepositional}`
- Добавить параметр `districtLocative` в функции генерации или использовать lookup из districts
- Обновить шаблоны для использования корректных падежных форм

### Шаг 4: ComboPage.tsx
- Передавать `district?.nameLocative` в meta description
- Использовать `SITE_CONFIG.regionPrepositional` вместо `${SITE_CONFIG.region}е`

---

## Технические детали

### Изменение в programmaticContent.ts

Текущий код:
```typescript
const location = entry.districtSlug 
  ? `в ${entry.districtName}е (${SITE_CONFIG.region})` 
  : `в ${SITE_CONFIG.region}е и области`;
```

Исправленный код:
```typescript
const location = entry.districtSlug 
  ? `в ${entry.districtLocative} (${SITE_CONFIG.region})` 
  : `в ${SITE_CONFIG.regionPrepositional} и области`;
```

Для этого нужно:
1. Расширить интерфейс `MatrixEntry` полем `districtLocative?: string`
2. Или делать lookup по `districtSlug` в runtime

### Рекомендуемый подход

Добавить helper-функцию для получения предложного падежа района:

```typescript
import { getDistrictBySlug } from "@/data/districts";

function getDistrictLocative(entry: MatrixEntry): string {
  if (!entry.districtSlug) return SITE_CONFIG.regionPrepositional;
  const district = getDistrictBySlug(entry.districtSlug);
  return district?.nameLocative || entry.districtName;
}
```

---

## Ожидаемый результат

**Было:**
- "Дезинфекция в Новосибирска" ❌
- "Услуги СЭС в Новосибирска" ❌
- "Цены на дезинфекцию в Новосибирска" ❌

**Станет:**
- "Дезинфекция в Новосибирске" ✅
- "Услуги СЭС в Новосибирске" ✅
- "Цены на дезинфекцию в Новосибирске" ✅

---

## Проверка после исправлений

1. Открыть страницы:
   - `/uslugi` — заголовок H1
   - `/usluga/dezinfeksiya` — заголовок и CTA блоки
   - Любая programmatic страница — meta description и заголовки

2. Поиск по коду: `grep -r "в Новосибирска" src/` должен вернуть 0 результатов

---

## Итого файлов для редактирования

| # | Файл | Количество изменений |
|---|------|---------------------|
| 1 | `src/components/templates/ServicePageTemplate.tsx` | 3 замены |
| 2 | `src/pages/uslugi/Index.tsx` | 1 замена |
| 3 | `src/lib/programmaticContent.ts` | ~8 замен + helper |
| 4 | `src/pages/programmatic/ComboPage.tsx` | 2 замены + import |

