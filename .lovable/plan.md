
# План: Централизация DATA-слоя и Schema.org для «СанРешения»

## Анализ текущего состояния

### Что уже есть

**Хорошо структурированные модули данных:**
- `src/data/siteConfig.ts` — базовые контакты, но требует расширения структуры адреса
- `src/data/services.ts` — 6 услуг с полным описанием, иконками, ценами
- `src/data/pests.ts` — 12 вредителей с падежами и категориями  
- `src/data/objects.ts` — 15 объектов с падежами и категориями
- `src/data/districts.ts` — 15 районов с падежами и временем выезда
- `src/data/programmaticMatrix.ts` — ~55 комбинаций с helper-функциями для падежей
- `src/data/blogTopics.ts` — ~50 статей с категориями и связями

**Schema.org:**
- `index.html` — полная разметка LocalBusiness, Organization, WebSite, FAQPage, BreadcrumbList (статичная)
- `Breadcrumbs.tsx` — динамическая генерация BreadcrumbList JSON-LD
- `ArticlePage.tsx` — Article и FAQPage Schema.org

**Отсутствует:**
- Централизованный модуль Schema.org (`src/lib/schema.ts`)
- Service Schema на страницах услуг и programmatic
- Динамическая LocalBusiness разметка из SITE_CONFIG

---

## Задачи

### 1. Расширить siteConfig.ts структурой адреса

Дополнить конфиг полной структурой адреса для Schema.org:

```typescript
// Добавить в SITE_CONFIG
address: {
  streetAddress: "ул. Державина, 28",
  city: "Новосибирск",
  region: "Новосибирская область",
  postalCode: "630005",
  country: "RU"
},
coordinates: {
  latitude: 55.0302,
  longitude: 82.9274,
},
```

---

### 2. Создать централизованный модуль Schema.org

**Новый файл: `src/lib/schema.ts`**

Содержит helper-функции для генерации JSON-LD:

```
getLocalBusinessSchema()
├── Использует SITE_CONFIG для контактов
├── Использует DISTRICTS для areaServed
└── Возвращает готовый JSON-LD объект

getServiceSchema(service, pest?, object?, district?, url)
├── Генерирует Service Schema
├── Связывает с LocalBusiness как provider
└── Включает priceSpecification

getArticleSchema(article)
├── Переносит логику из ArticlePage.tsx
└── Использует SITE_CONFIG для publisher

getFaqSchema(items)
├── Генерирует FAQPage Schema
└── Принимает массив {question, answer}

getBreadcrumbSchema(items)
├── Дублирует логику из Breadcrumbs.tsx
└── Используется как fallback
```

---

### 3. Интегрировать Schema.org в страницы

**Страницы услуг (`ServicePageTemplate.tsx`):**
- Добавить Service Schema с getServiceSchema()
- Добавить FAQPage Schema для секции FAQ

**Programmatic-страницы (`ComboPage.tsx`):**
- Добавить Service Schema с полной комбинацией (service + pest + object + district)

**FAQ-страница (`faq/Index.tsx`):**
- Убедиться, что FAQPage Schema генерируется динамически

---

### 4. Синхронизировать структуры данных

**Убедиться в единообразии типов:**

| Модуль | slug тип | Падежи | Категория |
|--------|----------|--------|-----------|
| services.ts | string | - | main/additional |
| pests.ts | string | nameGenitive, namePlural | insects/rodents/other |
| objects.ts | string | nameGenitive, namePlural | residential/commercial/industrial/public |
| districts.ts | string | nameGenitive, nameLocative | city/suburb/region |

**Добавить недостающие падежи в services.ts:**
- `nameAccusative` — для фраз "заказать дезинсекцию"
- `nameGenitive` — для фраз "стоимость дезинсекции"

---

### 5. Унифицировать использование данных во фронтенде

**Проверить и заменить hardcoded значения:**
- Поиск по проекту `"Дезинсекция"`, `"Дератизация"` и т.п.
- Замена на чтение из SERVICES/PESTS/OBJECTS/DISTRICTS

---

## Файлы для изменения

| Файл | Действие | Приоритет |
|------|----------|-----------|
| `src/data/siteConfig.ts` | Расширить структуру адреса | Высокий |
| `src/data/services.ts` | Добавить падежные формы | Высокий |
| `src/lib/schema.ts` | **Создать новый** — helper-функции Schema.org | Высокий |
| `src/components/templates/ServicePageTemplate.tsx` | Добавить Service + FAQ Schema | Высокий |
| `src/pages/programmatic/ComboPage.tsx` | Добавить Service Schema | Высокий |
| `src/pages/faq/Index.tsx` | Проверить FAQPage Schema | Средний |
| `src/pages/obekty/Index.tsx` | Использовать OBJECTS для ItemList Schema | Средний |
| `src/pages/vrediteli/Index.tsx` | Использовать PESTS для ItemList Schema | Средний |

---

## Детальная реализация

### 1. Расширение siteConfig.ts

```typescript
export const SITE_CONFIG = {
  siteUrl: "https://xn--d1aey.xn--p1ai",
  
  // Бренд
  companyName: "СанРешения",
  companyNameFull: "ООО «Санитарные Решения»",
  legalName: "ООО «Санитарные Решения»",
  description: "СЭС служба в Новосибирске: дезинсекция, дератизация и дезинфекция квартир, домов и объектов бизнеса.",
  
  // Контакты
  phone: "+7 (383) 312-16-60",
  phoneClean: "73833121660",
  phoneDisplay: "8 (383) 312-16-60",
  phoneTel: "+7-383-312-16-60", // для schema.org
  
  whatsapp: "+79628265020",
  whatsappClean: "79628265020",
  telegram: "@sanitarnye_resheniya_nsk",
  email: "west-centro@mail.ru",
  
  // Адрес (полная структура)
  address: {
    streetAddress: "ул. Державина, 28",
    city: "Новосибирск",
    region: "Новосибирская область",
    postalCode: "630005",
    country: "RU",
  },
  
  // Координаты
  coordinates: {
    latitude: 55.0302,
    longitude: 82.9274,
  },
  
  // ... остальные поля
} as const;
```

### 2. Добавление падежей в services.ts

```typescript
export interface Service {
  slug: string;
  name: string;
  shortName: string;
  nameGenitive: string;      // "дезинсекции"
  nameAccusative: string;    // "дезинсекцию"
  description: string;
  // ... остальные поля
}

export const services: Service[] = [
  {
    slug: "dezinseksiya",
    name: "Дезинсекция",
    shortName: "Дезинсекция",
    nameGenitive: "дезинсекции",
    nameAccusative: "дезинсекцию",
    // ...
  },
  // остальные услуги
];
```

### 3. Создание src/lib/schema.ts

```typescript
import { SITE_CONFIG } from "@/data/siteConfig";
import { districts, type District } from "@/data/districts";
import type { Service } from "@/data/services";
import type { Pest } from "@/data/pests";
import type { ObjectType } from "@/data/objects";

// LocalBusiness Schema (для layout или главной)
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": `${SITE_CONFIG.siteUrl}/#business`,
  name: SITE_CONFIG.companyName,
  legalName: SITE_CONFIG.legalName,
  description: SITE_CONFIG.description,
  telephone: SITE_CONFIG.phoneTel,
  email: SITE_CONFIG.email,
  url: SITE_CONFIG.siteUrl,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE_CONFIG.address.streetAddress,
    addressLocality: SITE_CONFIG.address.city,
    addressRegion: SITE_CONFIG.address.region,
    postalCode: SITE_CONFIG.address.postalCode,
    addressCountry: SITE_CONFIG.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE_CONFIG.coordinates.latitude,
    longitude: SITE_CONFIG.coordinates.longitude,
  },
  areaServed: [
    { "@type": "City", name: "Новосибирск" },
    ...districts
      .filter(d => d.type === "city" || d.type === "suburb")
      .map(d => ({ "@type": "City", name: d.name })),
  ],
});

// Service Schema (для страниц услуг и programmatic)
export const getServiceSchema = (params: {
  service: Service;
  pest?: Pest;
  object?: ObjectType;
  district?: District;
  url: string;
  priceFrom?: number;
}) => {
  const nameParts = [params.service.shortName];
  if (params.pest) nameParts.push(`от ${params.pest.nameGenitive}`);
  if (params.object) nameParts.push(params.object.nameGenitive);
  if (params.district) nameParts.push(params.district.name);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nameParts.join(" "),
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_CONFIG.siteUrl}/#business`,
      name: SITE_CONFIG.companyName,
    },
    areaServed: params.district
      ? { "@type": "AdministrativeArea", name: params.district.name }
      : { "@type": "City", name: "Новосибирск" },
    serviceType: params.service.name,
    url: `${SITE_CONFIG.siteUrl}${params.url}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: params.priceFrom || params.service.priceFrom,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: params.priceFrom || params.service.priceFrom,
        priceCurrency: "RUB",
        minPrice: params.priceFrom || params.service.priceFrom,
      },
    },
  };
};

// Article Schema
export const getArticleSchema = (article: {
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  modifiedDate?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  datePublished: article.publishDate,
  dateModified: article.modifiedDate || article.publishDate,
  author: {
    "@type": "Organization",
    name: SITE_CONFIG.companyName,
    url: SITE_CONFIG.siteUrl,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.companyName,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_CONFIG.siteUrl}/og-image.jpg`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.siteUrl}/blog/${article.slug}`,
  },
});

// FAQ Schema
export interface FaqItem {
  question: string;
  answer: string;
}

export const getFaqSchema = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});
```

### 4. Интеграция в ServicePageTemplate.tsx

Добавить после SEOHead:

```typescript
import { getServiceSchema, getFaqSchema } from "@/lib/schema";

// В теле компонента:
const serviceSchema = getServiceSchema({
  service,
  url: `/usluga/${service.slug}`,
  priceFrom: service.priceFrom,
});

const faqSchemaData = hasDetailedContent && content 
  ? getFaqSchema(content.faq) 
  : null;

// В JSX после SEOHead:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
/>
{faqSchemaData && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
  />
)}
```

### 5. Интеграция в ComboPage.tsx

```typescript
import { getServiceSchema, getFaqSchema } from "@/lib/schema";

// В теле компонента:
const serviceSchema = getServiceSchema({
  service: service!,
  pest,
  object,
  district,
  url: generateComboUrl(entry),
  priceFrom: entry.priceFrom,
});

const faqSchemaData = getFaqSchema(faq);

// В JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaData) }}
/>
```

---

## Результат

После выполнения плана:

1. **Единый источник правды** — все данные читаются из TS-модулей
2. **Централизованный Schema.org** — helper-функции в `src/lib/schema.ts`
3. **Service Schema** на всех коммерческих страницах
4. **Консистентные падежи** — услуги и объекты склоняются корректно
5. **Готовность к масштабированию** — добавление новых сущностей требует только редактирования data-файлов

---

## Порядок выполнения

1. Расширить `siteConfig.ts` структурой адреса
2. Добавить падежи в `services.ts`
3. Создать `src/lib/schema.ts`
4. Интегрировать Schema в `ServicePageTemplate.tsx`
5. Интегрировать Schema в `ComboPage.tsx`
6. Рефакторинг `ArticlePage.tsx` — использовать общий `getArticleSchema`
7. Проверить и протестировать
