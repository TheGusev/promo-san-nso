

# Исправление номера телефона: 359-20-50 → 359-50-20

## Ошибка

Текущий номер `359-20-50` — неправильный. Правильный: **8 (383) 359-50-20**.

## Новые значения

| Формат | Значение |
|--------|----------|
| Отображение | 8 (383) 359-50-20 |
| Международный | +7 (383) 359-50-20 |
| Чистый (tel:) | 73833595020 |
| Schema.org | +7-383-359-50-20 |

## Файлы для изменения (7 файлов, ~25 замен)

| # | Файл | Замены |
|---|------|--------|
| 1 | `src/data/siteConfig.ts` | 4 поля: phone, phoneClean, phoneDisplay, phoneTel |
| 2 | `index.html` | ~7: meta description, og:description, twitter:description, 3× Schema.org telephone |
| 3 | `src/components/Header.tsx` | 2: href tel: + отображение + aria-label |
| 4 | `src/components/Footer.tsx` | 2: href tel: + отображение |
| 5 | `src/components/PriceTable.tsx` | 2: href tel: + отображение |
| 6 | `src/pages/Privacy.tsx` | 2: href tel: + отображение |
| 7 | `src/data/faqData.ts` | 2: номер в тексте FAQ |

Глобальная замена: `359-20-50` → `359-50-20` и `3592050` → `3595020`.

