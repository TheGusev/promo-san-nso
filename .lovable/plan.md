

# План комплексных SEO-правок для сайта СЭС «СанРешения»

## Краткое резюме

Большой пакет SEO-правок, включающий:
1. Унификацию домена и canonical-URL
2. Генерацию динамической sitemap.xml
3. Удаление служебных LSI-комментариев
4. Унификацию бренда «СанРешения»
5. Исправление падежей на programmatic-страницах
6. Добавление FAQ в навигацию и создание страницы /sanpin
7. Синхронизацию slug-ов объектов
8. Унификацию контактных данных
9. Добавление Schema.org BreadcrumbList

---

## 1. Canonical и SITE_URL

### Текущая ситуация
- В 85+ местах используется `https://promo-san-nso.lovable.app`
- Нужно заменить на `https://xn--d1aey.xn--p1ai` (punycode гордэз.рф)

### Файлы для изменения

**`src/data/siteConfig.ts`** — добавить SITE_URL:
```typescript
export const SITE_CONFIG = {
  // Добавить в начало:
  siteUrl: "https://xn--d1aey.xn--p1ai",
  
  // Остальные поля без изменений...
}
```

**Файлы с заменой canonical:**

| Файл | Строка | Замена |
|------|--------|--------|
| `src/components/templates/ServicePageTemplate.tsx` | 44 | `${SITE_CONFIG.siteUrl}/usluga/${service.slug}` |
| `src/pages/vreditel/PestPage.tsx` | 37 | `${SITE_CONFIG.siteUrl}/vreditel/${pest.slug}` |
| `src/pages/faq/Index.tsx` | 101 | `${SITE_CONFIG.siteUrl}/faq` |
| `src/pages/vrediteli/Index.tsx` | 69 | `${SITE_CONFIG.siteUrl}/vrediteli` |
| `src/pages/blog/Index.tsx` | 51 | `${SITE_CONFIG.siteUrl}/blog` |
| `src/pages/obekty/Index.tsx` | 128 | `${SITE_CONFIG.siteUrl}/obekty` |
| `src/pages/uslugi/Index.tsx` | 22 | `${SITE_CONFIG.siteUrl}/uslugi` |
| `src/pages/obekt/ObjectPage.tsx` | 35 | `${SITE_CONFIG.siteUrl}/obekt/${objectType.slug}` |
| `src/pages/blog/ArticlePage.tsx` | 39, 46, 51, 87 | Все URL на `SITE_CONFIG.siteUrl` |
| `src/pages/rayon/DistrictPage.tsx` | 36 | `${SITE_CONFIG.siteUrl}/rayon/${district.slug}` |
| `src/pages/rayony/Index.tsx` | 97 | `${SITE_CONFIG.siteUrl}/rayony` |
| `src/pages/programmatic/ComboPage.tsx` | 77 | `${SITE_CONFIG.siteUrl}${generateComboUrl(entry)}` |

**`src/components/shared/Breadcrumbs.tsx`** — заменить hardcoded URL:
```typescript
// Строки 25 и 31:
item: `${SITE_CONFIG.siteUrl}/`,
item: `${SITE_CONFIG.siteUrl}${item.href}`
```

---

## 2. Динамическая sitemap.xml

### Текущая ситуация
- Статический `public/sitemap.xml` с 8 устаревшими URL
- Не включает услуги, вредителей, объекты, районы, блог, programmatic

### Решение
Создать генератор sitemap в `src/lib/sitemapGenerator.ts` и вызывать его при сборке.

Однако, поскольку это SPA на Vite, правильнее создать **статический sitemap через скрипт сборки** или **серверную функцию**.

**Вариант: создать `scripts/generateSitemap.ts`** для запуска при deploy:

```typescript
// scripts/generateSitemap.ts
import { services } from '../src/data/services';
import { pests } from '../src/data/pests';
import { objects } from '../src/data/objects';
import { districts } from '../src/data/districts';
import { BLOG_TOPICS } from '../src/data/blogTopics';
import { PROGRAMMATIC_MATRIX } from '../src/data/programmaticMatrix';

const SITE_URL = 'https://xn--d1aey.xn--p1ai';

function generateSitemap(): string {
  const urls: { loc: string; priority: number; changefreq: string }[] = [];
  
  // Главная
  urls.push({ loc: '/', priority: 1.0, changefreq: 'weekly' });
  
  // Индексные страницы
  urls.push({ loc: '/uslugi', priority: 0.9, changefreq: 'weekly' });
  urls.push({ loc: '/vrediteli', priority: 0.9, changefreq: 'weekly' });
  urls.push({ loc: '/obekty', priority: 0.9, changefreq: 'weekly' });
  urls.push({ loc: '/rayony', priority: 0.9, changefreq: 'weekly' });
  urls.push({ loc: '/blog', priority: 0.8, changefreq: 'weekly' });
  urls.push({ loc: '/faq', priority: 0.7, changefreq: 'monthly' });
  urls.push({ loc: '/sanpin', priority: 0.7, changefreq: 'monthly' });
  
  // Услуги
  services.forEach(s => urls.push({ 
    loc: `/usluga/${s.slug}`, 
    priority: 0.9, 
    changefreq: 'weekly' 
  }));
  
  // Вредители
  pests.forEach(p => urls.push({ 
    loc: `/vreditel/${p.slug}`, 
    priority: 0.8, 
    changefreq: 'monthly' 
  }));
  
  // Объекты
  objects.forEach(o => urls.push({ 
    loc: `/obekt/${o.slug}`, 
    priority: 0.8, 
    changefreq: 'monthly' 
  }));
  
  // Районы
  districts.forEach(d => urls.push({ 
    loc: `/rayon/${d.slug}`, 
    priority: 0.8, 
    changefreq: 'monthly' 
  }));
  
  // Блог
  BLOG_TOPICS.forEach(t => urls.push({ 
    loc: `/blog/${t.slug}`, 
    priority: 0.7, 
    changefreq: 'monthly' 
  }));
  
  // Programmatic (первые 100, чтобы не раздувать)
  PROGRAMMATIC_MATRIX.slice(0, 100).forEach(entry => {
    const parts = [];
    if (entry.pestSlug) parts.push(entry.pestSlug);
    parts.push(entry.objectSlug);
    if (entry.districtSlug) parts.push(entry.districtSlug);
    urls.push({ 
      loc: `/${entry.serviceSlug}/${parts.join('-')}`, 
      priority: 0.6, 
      changefreq: 'monthly' 
    });
  });
  
  // Генерация XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}
```

**Альтернатива (проще для SPA):** Заменить `public/sitemap.xml` на правильный статический файл с ~200 основных URL.

---

## 3. Удаление LSI-комментариев в JSX

### Текущая ситуация
В `src/components/templates/ServicePageTemplate.tsx` есть 5 JSX-комментариев:
- Строка 58: `{/* LSI: основные ключевые фразы услуги в тексте */}`
- Строка 99: `{/* LSI: типы объектов + услуга */}`
- Строка 146: `{/* LSI: методы + услуга в городе */}`
- Строка 288: `{/* LSI: [вредитель] + [услуга] + новосибирск */}`
- Строка 370: `{/* LSI: информационные ключи по теме услуги */}`

### Действие
Удалить все 5 комментариев из `ServicePageTemplate.tsx`.

---

## 4. Унификация бренда «СанРешения»

### Текущая ситуация
- `siteConfig.ts`: `companyName: "Гордез"`, `legalName: "ООО «Гордез»"`
- `index.html`: Уже «СанРешения» в title, og:site_name, Schema.org
- Метаописания в `services.ts`, `pests.ts`, `objects.ts`, `districts.ts`: содержат «Гордез»

### Решение

**`src/data/siteConfig.ts`:**
```typescript
export const SITE_CONFIG = {
  siteUrl: "https://xn--d1aey.xn--p1ai",
  companyName: "СанРешения",
  companyNameFull: "ООО «Санитарные Решения»",
  legalName: "ООО «Санитарные Решения»",
  // остальное без изменений
}
```

**Массовая замена в metaTitle/metaDescription:**

| Файл | Количество замен |
|------|------------------|
| `src/data/services.ts` | 6 (строки 36, 49, 62, 75, 88, 101) |
| `src/data/pests.ts` | 12 (все metaTitle) |
| `src/data/objects.ts` | 14 (все metaTitle) |
| `src/data/districts.ts` | 15 (все metaTitle) |
| `src/data/pestContent.ts` | 6+ (metaTitle в каждом вредителе) |

**Замена паттерна:** `| Гордез` → `| СанРешения`

**`src/pages/blog/ArticlePage.tsx`** строка 235:
```typescript
// Было:
subtitle="Специалисты СЭС «Гордез» готовы помочь..."
// Станет:
subtitle={`Специалисты СЭС «${SITE_CONFIG.companyName}» готовы помочь...`}
```

---

## 5. Programmatic: падежи и отсутствующие объекты

### Проблема 1: Отсутствующий объект `uchastok`

В `programmaticMatrix.ts` строки 470, 494, 503 используют `objectSlug: "uchastok"`, но в `objects.ts` такого объекта нет.

**Решение:** Добавить объект «Участок» в `src/data/objects.ts`:

```typescript
{
  slug: "uchastok",
  name: "Участок",
  nameGenitive: "участка",
  namePlural: "участков",
  description: "Обработка дачных и садовых участков от вредителей.",
  metaTitle: "Обработка участка от вредителей в Новосибирске | СанРешения",
  metaDescription: "Акарицидная обработка участков от клещей, комаров в Новосибирске. Защита территории.",
  category: "residential",
  relatedServices: ["dezinseksiya"],
  order: 4, // после дачи
  isPopular: false,
}
```

### Проблема 2: Наивные окончания в ComboPage.tsx

**Строка 70:** `${entry.objectName}ы` (даёт "квартирыы")
**Строка 155:** `{entry.objectName}ы`
**Строка 248:** `{entry.objectName}ы`
**Строка 307:** `{entry.serviceName.toLowerCase()}у {entry.objectName}ы`

**Решение:** Добавить падежные формы в матрицу

**В `programmaticMatrix.ts` расширить интерфейс:**
```typescript
export interface MatrixEntry {
  // ... существующие поля
  
  // Падежные формы
  objectNameGenitive?: string;  // родительный: "квартиры", "дома"
  serviceNameAccusative?: string; // винительный: "дезинсекцию", "дератизацию"
}
```

**Добавить helper-функцию:**
```typescript
export const getObjectGenitive = (entry: MatrixEntry): string => {
  if (entry.objectNameGenitive) return entry.objectNameGenitive;
  // Fallback: пытаемся автоматически
  const obj = entry.objectName.toLowerCase();
  const genitiveMap: Record<string, string> = {
    'квартира': 'квартиры',
    'частный дом': 'частного дома',
    'склад': 'склада',
    'ресторан': 'ресторана',
    'офис': 'офиса',
    'участок': 'участка',
  };
  return genitiveMap[obj] || obj;
};

export const getServiceAccusative = (entry: MatrixEntry): string => {
  if (entry.serviceNameAccusative) return entry.serviceNameAccusative;
  const accusativeMap: Record<string, string> = {
    'Дезинсекция': 'дезинсекцию',
    'Дератизация': 'дератизацию',
    'Дезинфекция': 'дезинфекцию',
  };
  return accusativeMap[entry.serviceName] || entry.serviceName.toLowerCase();
};
```

**В ComboPage.tsx заменить:**
```typescript
// Было (строка 155):
Как проходит {entry.serviceName.toLowerCase()} {entry.objectName}ы

// Станет:
Как проходит {getServiceAccusative(entry)} {getObjectGenitive(entry)}

// Было (строка 248):
Обработка {entry.objectName}ы

// Станет:
Обработка {getObjectGenitive(entry)}

// Было (строка 307):
Заказать {entry.serviceName.toLowerCase()}у {entry.objectName}ы

// Станет:
Заказать {getServiceAccusative(entry)} {getObjectGenitive(entry)}
```

---

## 6. Навигация: FAQ и СанПиН

### Добавить FAQ в SiteHeader.tsx

**Desktop (после «Блог», около строки 237):**
```typescript
<NavigationMenuItem>
  <Link
    to="/faq"
    className={cn(
      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    )}
  >
    Вопросы
  </Link>
</NavigationMenuItem>
```

**Mobile (после «Блог», около строки 315):**
```typescript
<SheetClose asChild>
  <Link to="/faq" className="py-2 text-sm font-medium hover:text-primary transition-colors">
    Вопросы
  </Link>
</SheetClose>
```

### Создать страницу /sanpin

**Новый файл: `src/pages/sanpin/Index.tsx`**

Лендинг со ссылками на статьи по нормативным требованиям:
- Фильтр статей с `category: "regulations"` из `BLOG_TOPICS`
- Заголовок: «СанПиН и нормативные документы»
- Краткое вступление про требования Роспотребнадзора
- Карточки статей

**Добавить маршрут в `App.tsx`:**
```typescript
<Route path="/sanpin" element={<SanpinIndex />} />
```

---

## 7. Синхронизация slug-ов объектов

### В pestContent.ts

**Строка 93:** `commonObjects: ["kvartira", "chastnyi-dom", "obshchezhitie", "gostinitsa", "hostel"]`

Проблемы:
- `"chastnyi-dom"` → должен быть `"dom"` (как в objects.ts)
- `"hostel"` → не существует (можно использовать `"gostinitsa"` или удалить)

**Замена:**
```typescript
commonObjects: ["kvartira", "dom", "obshezhitie", "gostinitsa"]
```

**Проверить все записи в pestContent.ts** и исправить аналогичные несоответствия.

---

## 8. Контактные данные

### Текущая ситуация
```typescript
phone: "+7 (383) 312-16-60",
whatsapp: "+79628265020",
```

Два разных номера — это корректно, если WhatsApp на отдельном номере.

**Действие:** Добавить комментарий для ясности в siteConfig.ts:
```typescript
// Офисный телефон для звонков
phone: "+7 (383) 312-16-60",
phoneClean: "73833121660",
phoneDisplay: "8 (383) 312-16-60",

// Мобильный номер для мессенджеров (WhatsApp)
whatsapp: "+79628265020",
whatsappClean: "79628265020",
```

**FloatingContact.tsx уже использует SITE_CONFIG** — проверить, что ссылки корректны.

---

## 9. Schema.org BreadcrumbList

### Текущая ситуация
`Breadcrumbs.tsx` уже генерирует JSON-LD, но использует hardcoded `promo-san-nso.lovable.app`.

### Действие
Заменить на `SITE_CONFIG.siteUrl` (уже описано в п.1).

После замены структура будет корректной:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Главная", "item": "https://xn--d1aey.xn--p1ai/"},
    {"@type": "ListItem", "position": 2, "name": "Услуги", "item": "https://xn--d1aey.xn--p1ai/uslugi"}
  ]
}
```

---

## Итоговый список файлов для изменения

| Файл | Тип изменения |
|------|---------------|
| `src/data/siteConfig.ts` | Добавить siteUrl, заменить companyName на «СанРешения» |
| `src/data/services.ts` | Заменить «Гордез» → «СанРешения» в metaTitle (6 мест) |
| `src/data/pests.ts` | Заменить «Гордез» → «СанРешения» в metaTitle (12 мест) |
| `src/data/objects.ts` | Заменить «Гордез» → «СанРешения» + добавить объект «Участок» |
| `src/data/districts.ts` | Заменить «Гордез» → «СанРешения» в metaTitle (15 мест) |
| `src/data/pestContent.ts` | Исправить slug-и в commonObjects, заменить «Гордез» |
| `src/data/programmaticMatrix.ts` | Добавить падежные поля + helper-функции |
| `src/components/templates/ServicePageTemplate.tsx` | Удалить LSI-комментарии, заменить canonical |
| `src/components/shared/Breadcrumbs.tsx` | Заменить hardcoded URL на SITE_CONFIG.siteUrl |
| `src/components/layout/SiteHeader.tsx` | Добавить пункт «Вопросы» (FAQ) |
| `src/pages/programmatic/ComboPage.tsx` | Использовать helper-функции для падежей, заменить canonical |
| `src/pages/vreditel/PestPage.tsx` | Заменить canonical |
| `src/pages/obekt/ObjectPage.tsx` | Заменить canonical |
| `src/pages/rayon/DistrictPage.tsx` | Заменить canonical |
| `src/pages/rayony/Index.tsx` | Заменить canonical |
| `src/pages/uslugi/Index.tsx` | Заменить canonical |
| `src/pages/vrediteli/Index.tsx` | Заменить canonical |
| `src/pages/obekty/Index.tsx` | Заменить canonical |
| `src/pages/blog/Index.tsx` | Заменить canonical |
| `src/pages/blog/ArticlePage.tsx` | Заменить все URL, исправить «Гордез» |
| `src/pages/faq/Index.tsx` | Заменить canonical |
| `src/pages/sanpin/Index.tsx` | **Создать новый файл** |
| `src/App.tsx` | Добавить маршрут /sanpin |
| `public/sitemap.xml` | Заменить на динамически сгенерированный или расширенный статический |

---

## Порядок выполнения

1. **siteConfig.ts** — добавить siteUrl, обновить companyName
2. **Массовая замена canonical** во всех страницах и компонентах
3. **Массовая замена «Гордез» → «СанРешения»** в data-файлах
4. **Удалить LSI-комментарии** из ServicePageTemplate.tsx
5. **Добавить объект «Участок»** в objects.ts
6. **Исправить slug-и** в pestContent.ts
7. **Добавить падежные helper-функции** в programmaticMatrix.ts
8. **Исправить ComboPage.tsx** с использованием helper-функций
9. **Добавить FAQ в навигацию** SiteHeader.tsx
10. **Создать страницу /sanpin** + маршрут
11. **Обновить sitemap.xml** с полным списком URL

