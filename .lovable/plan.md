## Цель

Расширить разметку Schema.org так, чтобы Яндекс/Google/AI-боты точнее распознавали сущность бизнеса и оффер на главной — без переделок дизайна и логики.

## Что уже есть (не трогаем)

`index.html` содержит JSON-LD: WebSite, LocalBusiness (с `hasOfferCatalog`, `aggregateRating`, `areaServed`, `openingHours`), Organization (ИНН/ОГРН), BreadcrumbList, FAQPage, Service. Эти блоки сохраняются как есть.

## Что добавляем

### 1. Усиление LocalBusiness в `index.html`
В существующий LocalBusiness-блок добавить (без ломки структуры):
- `"@type": ["LocalBusiness", "PestControlService", "HomeAndConstructionBusiness"]` — точный тип по Schema.org;
- `slogan` — «Дезинфекция и СЭС в Новосибирске под ключ»;
- `knowsAbout` — массив тем (дезинфекция, дезинсекция, дератизация, СанПиН, СЭС, тараканы, клопы, крысы);
- `serviceArea` с `GeoCircle` (центр = текущие координаты, радиус 50 км);
- `makesOffer` — массив `Offer`, дублирующий ключевые услуги с `priceCurrency`, `price`, `priceValidUntil`, `availability`, `itemOffered: Service`;
- `hasMap` — ссылка на 2GIS;
- `image` — массив (WebP hero + PNG fallback).

### 2. Новый JSON-LD «WebPage + Speakable» для главной
Отдельный `<script type="application/ld+json">` в `index.html` после WebSite:
- `WebPage` с `@id`, `primaryImageOfPage` (hero-bg-1.webp), `speakable` (`SpeakableSpecification` для H1 и блока KeyFacts) — помогает голосовым ассистентам Яндекс.Алиса.

### 3. Микроразметка Hero (visible HTML, не JSON)
В `src/components/Hero.tsx`:
- Обернуть корневой `<section>` атрибутами `itemScope itemType="https://schema.org/Service"` с `itemProp="provider"` (ссылкой по `@id`);
- На `<h1>` повесить `itemProp="name"`, на подзаголовок `itemProp="description"`;
- На телефонный CTA — `itemProp="telephone"`.

Это даёт Яндексу второй сигнал помимо JSON-LD (микроразметка в DOM).

### 4. Микроразметка PriceTeaser и PriceTable
`src/components/PriceTeaser.tsx`:
- Корневой `<section>` → `itemScope itemType="https://schema.org/OfferCatalog"`, добавить скрытый `<meta itemProp="name">`;
- Каждый `<li>` → `itemScope itemType="https://schema.org/Offer"` с `itemProp="itemOffered"` (вложенный Service), `itemProp="price"`, `itemProp="priceCurrency"="RUB"`, `itemProp="availability"`.

`src/components/PriceTable.tsx`:
- Аналогично — каждая карточка услуги получает `itemScope itemType="https://schema.org/Product"` с вложенными `Offer`-ами для квартиры/дома/коммерции (`AggregateOffer` с lowPrice/highPrice).
- На блоке `features` — `itemProp="additionalProperty"` (`PropertyValue`).

### 5. Hero JSON-LD для оффера на главной
В `src/pages/Index.tsx` через `react-helmet-async` (уже стоит в проекте) добавить страничный `Product`-блок:
- `@type: ["Product", "Service"]`, `name: "Дезинфекция СЭС в Новосибирске"`, `brand: Organization @id`, `aggregateRating` (ссылкой по `@id` LocalBusiness), `offers: AggregateOffer (lowPrice 1200, highPrice 150000, offerCount 6)`.

Если `react-helmet-async` ещё не подключён в `Index.tsx`, добавить локально (импорт + `<Helmet>`), HelmetProvider уже стоит в `src/main.tsx` — проверю при имплементации.

## Что НЕ трогаем

- Дизайн, размеры, цвета, контент и тексты компонентов;
- Логику калькулятора, формы, аналитику, edge-функции;
- Тарифы и цены — только зеркалим существующие;
- Программные страницы услуг (там уже есть `getServiceSchema`).

## Файлы

- `index.html` — расширение существующих JSON-LD + новый WebPage/Speakable блок;
- `src/components/Hero.tsx` — itemScope/itemProp атрибуты;
- `src/components/PriceTeaser.tsx` — Offer microdata;
- `src/components/PriceTable.tsx` — Product/AggregateOffer microdata;
- `src/pages/Index.tsx` — `<Helmet>` с Product+AggregateOffer JSON-LD.

## Проверка

После имплементации прогнать через Яндекс.Вебмастер «Валидатор микроразметки» и Google Rich Results Test (вручную, ссылки в финальном сообщении).
