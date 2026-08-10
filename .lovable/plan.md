# Смена телефона на +7 999 450-16-31

## Что меняем
Новый номер связи по всему сайту: **8 (999) 450-16-31** (`tel:+79994501631`).
WhatsApp — на этот же номер. Telegram не трогаем. Ссылка MAX — жду от вас новую (по QR); до этого момента оставляю текущую.

## Где правим
- `src/data/siteConfig.ts` — источник правды: `phone`, `phoneClean`, `phoneDisplay`, `phoneTel`.
- Хардкод в компонентах: `Header.tsx`, `Footer.tsx`, `PriceTable.tsx`, `lp/LandingLeadForm.tsx` (текст ошибки), `pages/Privacy.tsx`.
- Контент/данные: `src/data/landingContent.ts` (3 описания), `src/data/faqData.ts`.
- `index.html` — meta description, og/twitter description, JSON-LD `telephone` (3 места), контактные блоки внизу.
- `public/llms.txt` — телефон и tel-ссылка.
- WhatsApp уже строится из `phoneClean` в `FloatingContact.tsx` — поменяется автоматически.

## Технические детали
- Форматы: display `8 (999) 450-16-31`, tel `+79994501631`, schema.org `+7-999-450-16-31`.
- Где возможно, хардкод заменяем на `SITE_CONFIG`, чтобы номер больше не дублировался.
- Логика форм, аналитики и отправки заявок не затрагивается.
- Память проекта (контактный телефон) обновляется на новый номер.

## Открытый пункт
Ссылку MAX обновлю отдельным шагом, как только пришлёте QR/ссылку.
