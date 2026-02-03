
# План редизайна сайта СЭС "Гордез" — Новосибирск

## Обзор проекта

Создание #1 сайта СЭС в Новосибирске с programmatic-подходом для НЧ/СНЧ-запросов. Архитектура на ~828 коммерческих страниц + 40-60 статей блога.

---

## Этап 1: Структура данных и константы

### 1.1 Новый файл `src/data/siteConfig.ts`

Центральная конфигурация сайта:

```text
SITE_CONFIG = {
  companyName: "Гордез",
  phone: "+7 (383) 312-16-60",
  email: "west-centro@mail.ru",
  address: "Новосибирск",
  workingHours: "24/7"
}
```

### 1.2 Новый файл `src/data/services.ts`

Массив услуг для автогенерации страниц:

```text
services[] = [
  {
    slug: "dezinfeksiya",
    name: "Дезинфекция",
    shortName: "Дезинфекция",
    description: "Уничтожение вирусов, бактерий, грибка",
    icon: Shield,
    priceFrom: 1500
  },
  {
    slug: "dezinseksiya",
    name: "Дезинсекция",
    ...
  },
  // + все остальные услуги
]
```

### 1.3 Новый файл `src/data/pests.ts`

Массив вредителей:

```text
pests[] = [
  { slug: "klopy", name: "Клопы", category: "insects" },
  { slug: "tarakany", name: "Тараканы", category: "insects" },
  { slug: "blohi", name: "Блохи", category: "insects" },
  { slug: "krysy", name: "Крысы", category: "rodents" },
  { slug: "myshi", name: "Мыши", category: "rodents" },
  // ... 15-20 вредителей
]
```

### 1.4 Новый файл `src/data/objects.ts`

Массив типов объектов:

```text
objects[] = [
  { slug: "kvartira", name: "Квартира", category: "residential" },
  { slug: "chastnyi-dom", name: "Частный дом", category: "residential" },
  { slug: "ofis", name: "Офис", category: "commercial" },
  { slug: "restoran", name: "Ресторан", category: "commercial" },
  { slug: "sklad", name: "Склад", category: "industrial" },
  // ... 10-15 типов объектов
]
```

### 1.5 Новый файл `src/data/districts.ts`

Районы Новосибирска и области (на базе существующего serviceAreas.ts):

```text
districts[] = [
  { slug: "centralny-rayon", name: "Центральный район", type: "city" },
  { slug: "leninskiy-rayon", name: "Ленинский район", type: "city" },
  { slug: "berdsk", name: "Бердск", type: "region" },
  // ... все районы
]
```

---

## Этап 2: Новый Layout и навигация

### 2.1 Новый `src/components/layout/MainLayout.tsx`

Единый layout для всех страниц:

```text
MainLayout
├── SiteHeader (новый компонент)
├── {children}
├── SiteFooter (новый компонент)
├── FloatingButtons
├── CookieConsent
└── <!-- сюда вставим код Яндекс.Метрики -->
```

### 2.2 Новый `src/components/layout/SiteHeader.tsx`

Шапка с полной навигацией:

```text
+-----------------------------------------------------------------------+
| [Лого Гордез]  | +7 (383) 312-16-60 |      [Заказать обработку]      |
+-----------------------------------------------------------------------+
| Услуги ▼ | Вредители ▼ | Объекты ▼ | Районы | СанПиН | Блог | Цены  |
+-----------------------------------------------------------------------+
```

Меню "Услуги" — dropdown со всеми услугами.
Меню "Вредители" — dropdown с категориями (насекомые, грызуны).
Меню "Объекты" — dropdown (жильё, коммерция, промышленность).

### 2.3 Новый `src/components/layout/SiteFooter.tsx`

Футер с картой и полной навигацией:

```text
+-----------------------------------------------------------------------+
|  [Карта 2GIS]                                                         |
+-----------------------------------------------------------------------+
| О компании     | Услуги (все)    | Популярные    | Контакты          |
| Гордез —       | Дезинфекция     | Клопы         | +7 (383)...       |
| профессиональ- | Дезинсекция     | Тараканы      | email             |
| ная СЭС...     | Дератизация     | Крысы         | Адрес             |
|                | ...             | ...           |                   |
+-----------------------------------------------------------------------+
| Работаем по всем районам Новосибирска и области                      |
| [Центральный] [Ленинский] [Октябрьский] ... [Бердск] [Искитим]       |
+-----------------------------------------------------------------------+
| © 2025 Гордез | ИНН | ОГРН | Политика конфиденциальности             |
+-----------------------------------------------------------------------+
```

---

## Этап 3: Вспомогательные компоненты

### 3.1 `src/components/shared/CostCalculatorPlaceholder.tsx`

Заглушка для встраивания существующего калькулятора:

```tsx
export function CostCalculatorPlaceholder() {
  return (
    <div id="calculator-placeholder">
      {/* Сюда импортируется существующий Calculator */}
      <Calculator />
    </div>
  );
}
```

### 3.2 `src/components/shared/CTABlock.tsx`

Универсальный CTA-блок:

```text
+-----------------------------------------------+
| Вызвать СЭС сейчас                           |
| [Телефон]  [Заказать обработку]              |
| Работаем по Новосибирску и области 24/7      |
+-----------------------------------------------+
```

### 3.3 `src/components/shared/RelatedLinks.tsx`

Блок перелинковки:

```text
Props: type ("services" | "pests" | "objects" | "districts"), currentSlug
Выводит: "Другие услуги" / "Похожие вредители" / "Популярные запросы"
```

### 3.4 `src/components/shared/Breadcrumbs.tsx`

Хлебные крошки с Schema.org:

```text
Главная > Услуги > Дезинсекция
```

---

## Этап 4: Шаблоны страниц

### 4.1 `src/components/templates/ServicePageTemplate.tsx`

Шаблон страницы услуги (`/usluga/[slug]/`):

```text
Структура блоков:
1. Hero: H1 + подзаголовок + CTA + "24/7 по Новосибирску"
2. Блок "Проблема" — какую проблему решаем
3. Блок "Как мы решаем" — методы и подходы
4. Блок "Цены" — таблица цен
5. Блок "Гарантия" — условия гарантии
6. Блок "Как проходит обработка" — шаги 1-2-3-4
7. Блок "С какой химией работаем" — препараты
8. Блок "Почему выбирают нас" — преимущества
9. Блок "Отзывы" — карусель отзывов
10. Блок "FAQ" — вопросы-ответы
11. CTA-блок — финальный призыв
12. RelatedLinks — перелинковка
```

### 4.2 `src/pages/uslugi/Index.tsx`

Раздел услуг (`/uslugi/`):

```text
H1: Услуги СЭС в Новосибирске
Сетка карточек всех услуг с ценами
Перелинковка на вредителей и объекты
```

### 4.3 `src/pages/usluga/[slug].tsx`

Динамическая страница услуги — использует ServicePageTemplate + данные из services.ts

---

## Этап 5: Роутинг

### 5.1 Обновление `src/App.tsx`

Новые маршруты (латиница, транслит):

```text
/                          → Главная (новый дизайн)
/uslugi/                   → Раздел услуг
/usluga/:serviceSlug/      → Карточка услуги
/vrediteli/                → Раздел вредителей (заглушка)
/obekty/                   → Раздел объектов (заглушка)
/rayony/                   → Раздел районов (заглушка)
/blog/                     → Блог (заглушка)
/privacy/                  → Политика конф.
/admin/*                   → Админка (сохраняем)
```

### 5.2 Редиректы со старых URL

```text
/dezinfeksiya    → /usluga/dezinfeksiya
/dezinseksiya    → /usluga/dezinseksiya
/deratizatsiya   → /usluga/deratizatsiya
/ozonirovanie    → /usluga/ozonirovanie
/dezodoratsiya   → /usluga/dezodoratsiya
/sertifikatsiya  → /usluga/sertifikatsiya
```

---

## Этап 6: Главная страница (редизайн)

### 6.1 Обновление `src/pages/Index.tsx`

Новая структура:

```text
MainLayout
├── HeroSection (переработанный)
│   ├── H1 с ключом
│   ├── Подзаголовок
│   ├── [Вызвать СЭС] + [Телефон]
│   └── Плашка "Работаем 24/7"
├── Блок "Проблемы" (новый)
├── Блок "Услуги" (сетка)
├── CostCalculatorPlaceholder
├── Блок "Гарантия"
├── Блок "Как мы работаем"
├── Блок "Почему выбирают нас"
├── Блок "Отзывы"
├── Блок "FAQ"
└── RelatedLinks (районы, вредители)
```

---

## Структура файлов после реализации

```text
src/
├── data/
│   ├── siteConfig.ts         ← конфигурация сайта
│   ├── services.ts           ← массив услуг
│   ├── pests.ts              ← массив вредителей
│   ├── objects.ts            ← массив объектов
│   ├── districts.ts          ← массив районов
│   └── servicesData.ts       ← (существующий, для совместимости)
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── SiteHeader.tsx
│   │   └── SiteFooter.tsx
│   ├── shared/
│   │   ├── CostCalculatorPlaceholder.tsx
│   │   ├── CTABlock.tsx
│   │   ├── RelatedLinks.tsx
│   │   ├── Breadcrumbs.tsx
│   │   └── SEOHead.tsx
│   ├── templates/
│   │   └── ServicePageTemplate.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── ProblemSection.tsx
│       ├── GuaranteeSection.tsx
│       └── ChemistrySection.tsx
├── pages/
│   ├── Index.tsx             ← главная (редизайн)
│   ├── uslugi/
│   │   └── Index.tsx         ← раздел услуг
│   ├── usluga/
│   │   └── ServicePage.tsx   ← динамическая страница услуги
│   ├── vrediteli/
│   │   └── Index.tsx         ← заглушка
│   ├── obekty/
│   │   └── Index.tsx         ← заглушка
│   ├── rayony/
│   │   └── Index.tsx         ← заглушка
│   └── blog/
│       └── Index.tsx         ← заглушка
└── App.tsx                   ← обновлённый роутинг
```

---

## Технические детали

### SEO-оптимизация

- Каждая страница: уникальный title, description, canonical
- Schema.org: LocalBusiness, Service, BreadcrumbList, FAQPage
- Open Graph теги для соцсетей
- Sitemap будет генерироваться из массивов данных

### Перелинковка

- Каждая страница услуги ссылается на вредителей + объекты + районы
- Блок "Другие услуги" на каждой странице
- Футер содержит ссылки на все основные разделы

### Mobile-first

- Адаптивная шапка с hamburger-меню на мобильных
- Touch-friendly кнопки и навигация
- Оптимизированные изображения

---

## Что делаем в этом промпте

1. Создаём файлы данных (services.ts, pests.ts, objects.ts, districts.ts, siteConfig.ts)
2. Создаём MainLayout, SiteHeader, SiteFooter
3. Создаём вспомогательные компоненты (CTABlock, RelatedLinks, Breadcrumbs, CostCalculatorPlaceholder)
4. Создаём шаблон ServicePageTemplate
5. Создаём страницу раздела /uslugi/
6. Создаём динамическую страницу /usluga/:slug/
7. Обновляем роутинг в App.tsx
8. Создаём заглушки для /vrediteli/, /obekty/, /rayony/, /blog/

## Что НЕ делаем (отложено)

- Конкретный контент для услуг (только структура)
- Полные данные по всем вредителям/объектам/районам
- Детальные страницы вредителей, объектов, районов
- Блог и статьи
- Комбинированные страницы (услуга × вредитель × район)
