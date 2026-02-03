
# План: Уменьшение расстояния между секциями на мобильных до ~1 см

## Проблема

На скриншоте видно большое расстояние между секцией "Рассчитайте стоимость" (Calculator) и "Профессиональная дезинфекция" (AboutSection). Пользователь хочет уменьшить это расстояние до примерно 1 см (~40px).

## Текущие отступы

| Секция | Отступы | Мобильные |
|--------|---------|-----------|
| Calculator | `py-4 sm:py-8 md:py-16 pb-32 sm:pb-8` | py-4 + pb-32 = 96px+ нижний |
| AboutSection | `py-12 sm:py-16` | py-12 = 48px верх+низ |
| Services | `py-12 md:py-20` | py-12 = 48px |

**Проблема**: Calculator имеет `pb-32` для sticky-формы на мобильных (резервирует место под fixed кнопку), но это создаёт большой разрыв между секциями.

## Решение

Уменьшить вертикальные отступы всех секций на мобильных:

| Секция | Было | Станет |
|--------|------|--------|
| Services | `py-12 md:py-20` | `py-4 md:py-20` |
| Calculator | `py-4 sm:py-8 md:py-16 pb-32 sm:pb-8` | `py-4 sm:py-8 md:py-16 pb-24 sm:pb-8` |
| AboutSection | `py-12 sm:py-16` | `py-4 sm:py-16` |
| Reviews (в секции) | `py-16` | `py-4 sm:py-16` |
| FAQ | `py-16` или аналог | `py-4 sm:py-16` |
| MobileCollapsibleSection | - | добавить `mt-2` на мобильных между секциями |

**Расчёт**: `py-4` = 16px сверху + 16px снизу = 32px. Между секциями будет ~32-40px ≈ 1 см.

## Файлы для изменения

| Файл | Изменение |
|------|-----------|
| `src/components/Services.tsx` | `py-12 md:py-20` → `py-4 md:py-20` |
| `src/components/Calculator.tsx` | `pb-32` → `pb-24` (меньше резерва) |
| `src/components/AboutSection.tsx` | `py-12 sm:py-16` → `py-4 sm:py-16` |
| `src/components/Reviews.tsx` | `py-16` → `py-4 sm:py-16` |
| `src/components/FAQ.tsx` | Уменьшить верхний отступ |
| `src/components/MobileCollapsibleSection.tsx` | Добавить `rounded-lg` для лучшего вида |

## Визуальный результат

**До** (суммарный gap между секциями):
- Calculator pb-32 (128px) + AboutSection py-12 (48px верх) = ~176px

**После**:
- Calculator pb-24 (96px) + AboutSection py-4 (16px верх) = ~112px ≈ 2.8 см

Для достижения ~1 см между секциями можно ещё уменьшить pb до `pb-20` (80px).
