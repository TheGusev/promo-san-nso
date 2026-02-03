
# План финальной доводки SEO и UX по чек-листу 2026

## Краткое резюме

По результатам аудита выявлено **12 проблем**, требующих исправления. Большая часть технической базы уже в порядке: production-домен используется корректно, canonical URLs настроены, Schema.org присутствует, sitemap.xml и robots.txt соответствуют требованиям.

### Критические проблемы

| # | Проблема | Приоритет |
|---|----------|-----------|
| 1 | Устаревший бренд «Гордез» в 160+ местах кода | Высокий |
| 2 | Отсутствует hreflang для русскоязычной версии | Высокий |
| 3 | Неправильный title карты в футере («Гордез») | Средний |
| 4 | Нет внутренних ссылок с /sanpin на бизнес-страницы | Средний |

---

## Детальный анализ по чек-листу

### 1. Техника, индекс и структура

**Домен и HTTPS** — ПРОЙДЕН
- Production-домен `https://xn--d1aey.xn--p1ai` используется корректно
- Все canonical URL указывают на production-домен
- Нет упоминаний `promo-san-nso.lovable.app` (проверено поиском)

**Crawlability** — ПРОЙДЕН
- `robots.txt`: не блокирует нужные разделы
- `sitemap.xml`: 593 строки, ~120+ URL, только production-домен

**Canonical и дубликаты** — ПРОЙДЕН
- Все типовые страницы имеют canonical = production-URL
- Используется `SITE_CONFIG.siteUrl` централизованно

**Структура URL** — ПРОЙДЕН
- Логичные URL: `/dezinseksiya/klopy-kvartira-centralny-rayon`
- Услуги и вредители доступны за 2 клика

**Core Web Vitals** — НЕ ПРОВЕРЯЛОСЬ
- Требуется проверка в Lighthouse/PageSpeed

---

### 2. On-page SEO и контент

**Title / Description / H1** — ПРОЙДЕН
- Страницы имеют уникальные meta через `SEOHead`
- H1 генерируется динамически для programmatic

**Ключи и падежи** — ПРОЙДЕН
- Есть helper-функции `getObjectGenitive`, `getServiceAccusative`
- LSI-комментарии удалены (поиск `LSI:` пуст)

**ПРОБЛЕМА: Бренд «Гордез»**
Найдено **160+ упоминаний** в 7 файлах:
- `src/lib/blogContentGenerator.ts` — 14 упоминаний
- `src/data/faqData.ts` — 2 упоминания
- `src/components/layout/SiteFooter.tsx` — 1 упоминание (title карты)
- `src/data/pestContent.ts` — ~140+ упоминаний

---

### 3. Внутренняя перелинковка

**Основные связки** — ЧАСТИЧНО ПРОЙДЕН
- Страницы услуг ссылаются на вредителей и объекты
- Programmatic-страницы имеют хлебные крошки и связи

**ПРОБЛЕМА: Перелинковка /sanpin**
- Страница `/sanpin` существует и настроена
- НО: нет ссылок с коммерческих B2B-страниц (рестораны, производство) на `/sanpin`

---

### 4. Schema.org и AI-готовность

**LocalBusiness / Organization** — ПРОЙДЕН
- В `index.html` полная разметка (строки 88-262)
- Бренд «СанРешения», телефон, адрес, areaServed

**Service / FAQ / Article** — ПРОЙДЕН
- `src/lib/schema.ts` содержит helper-функции
- Programmatic и услуги используют `getServiceSchema`
- FAQ использует `getFaqSchema`

**BreadcrumbList** — ПРОЙДЕН
- Генерируется в `Breadcrumbs.tsx` с JSON-LD

**ПРОБЛЕМА: hreflang отсутствует**
- Поиск `hreflang` не дал результатов
- Для русскоязычного сайта нужен `<link rel="alternate" hreflang="ru" href="...">`

---

### 5. UX, мобилка, конверсии

**Мобильная шапка** — ПРОЙДЕН
- Логотип + бургер на мобиле
- Top bar с телефоном скрыт на мобиле (`hidden sm:block`)

**Виджет связи** — ПРОЙДЕН
- Единый `FloatingContact.tsx` с меню
- При тапе открывает Telegram, WhatsApp, Телефон
- Контакты из `SITE_CONFIG`

**Scroll to top** — ПРОЙДЕН
- `ScrollToTop.tsx` используется в `App.tsx`

**Формы и доверие** — ПРОЙДЕН
- Маска телефона через `PhoneInput`
- Блоки гарантий и сертификатов в компонентах

**Аналитика** — ПРОЙДЕН
- Яндекс.Метрика в `index.html` (ID 104205609)
- События: phone_click, whatsapp_click, telegram_click, calc_submit, popup_submit

---

## Задачи для исправления

### Задача 1: Заменить «Гордез» → «СанРешения»

**Файлы:**

| Файл | Строки | Кол-во замен |
|------|--------|--------------|
| `src/lib/blogContentGenerator.ts` | 44, 58, 71, 80, 98, 118, 129, 135, 171 | ~14 |
| `src/data/faqData.ts` | 678, 821 | 2 |
| `src/components/layout/SiteFooter.tsx` | 23 | 1 (title карты) |
| `src/data/pestContent.ts` | множество | ~140+ |

**Паттерн замены:**
```
СЭС «Гордез» → СЭС «СанРешения»
```

---

### Задача 2: Добавить hreflang в index.html

Добавить в `<head>` после canonical:

```html
<link rel="alternate" hreflang="ru" href="https://xn--d1aey.xn--p1ai/" />
<link rel="alternate" hreflang="x-default" href="https://xn--d1aey.xn--p1ai/" />
```

---

### Задача 3: Исправить title карты в футере

**Файл:** `src/components/layout/SiteFooter.tsx`, строка 23

**Было:**
```tsx
title="Карта расположения офиса Гордез в Новосибирске"
```

**Станет:**
```tsx
title="Карта расположения офиса СанРешения в Новосибирске"
```

---

### Задача 4: Добавить перелинковку /sanpin с B2B-страниц

В шаблон объектов (`ObjectPage.tsx`) для категорий `commercial` и `industrial` добавить блок:

```tsx
{(object.category === "commercial" || object.category === "industrial") && (
  <Card className="mt-6 border-primary/20">
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold mb-2">Требования СанПиН для бизнеса</h3>
      <p className="text-muted-foreground mb-4">
        Узнайте, какие документы нужны для проверки Роспотребнадзора
      </p>
      <Link to="/sanpin" className="text-primary hover:underline">
        Нормативные требования →
      </Link>
    </CardContent>
  </Card>
)}
```

---

### Задача 5 (опционально): Добавить hreflang в SEOHead

Для динамических страниц расширить `SEOHead.tsx`:

```tsx
// В useEffect, после canonical:
const updateHreflang = () => {
  let hreflang = document.querySelector('link[rel="alternate"][hreflang="ru"]');
  if (!hreflang) {
    hreflang = document.createElement("link");
    hreflang.setAttribute("rel", "alternate");
    hreflang.setAttribute("hreflang", "ru");
    document.head.appendChild(hreflang);
  }
  hreflang.setAttribute("href", canonical || `${SITE_CONFIG.siteUrl}/`);
};
updateHreflang();
```

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `src/lib/blogContentGenerator.ts` | Замена «Гордез» → «СанРешения» |
| `src/data/faqData.ts` | Замена «Гордез» → «СанРешения» |
| `src/data/pestContent.ts` | Массовая замена «Гордез» → «СанРешения» |
| `src/components/layout/SiteFooter.tsx` | Замена title карты |
| `index.html` | Добавить hreflang |
| `src/components/shared/SEOHead.tsx` | Добавить динамический hreflang |
| `src/pages/obekt/ObjectPage.tsx` | Добавить блок перелинковки на /sanpin |

---

## Порядок выполнения

1. **Массовая замена бренда** — `blogContentGenerator.ts`, `faqData.ts`, `pestContent.ts`
2. **Исправить футер** — title карты
3. **Добавить hreflang** — `index.html`
4. **Расширить SEOHead** — динамический hreflang
5. **Добавить перелинковку** — блок СанПиН на B2B-страницах
6. **Финальная проверка** — поиск по «Гордез» должен быть пустым

---

## Проверки после внедрения

### Поиск по коду
```bash
# Должно вернуть 0 результатов:
grep -r "Гордез" src/
grep -r "promo-san-nso" .
```

### Визуальная проверка
- Открыть `/blog/kak-raspoznat-postelnykh-klopov` — нет «Гордез»
- Открыть `/faq` — нет «Гордез»
- Открыть `/obekt/restoran` — есть блок СанПиН
- View Source главной — есть hreflang="ru"

---

## Что уже в порядке (не требует изменений)

1. Production-домен везде корректен
2. robots.txt минималистичен и правилен
3. sitemap.xml содержит 120+ актуальных URL
4. LocalBusiness и Organization Schema полные
5. Мобильная шапка оптимизирована
6. FloatingContact работает как единый виджет
7. ScrollToTop при навигации работает
8. Яндекс.Метрика настроена с целями
9. Падежи в programmatic-страницах корректны
10. LSI-комментарии удалены
