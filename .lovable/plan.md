

# Полный аудит сайта: найденные расхождения и план исправления

## Сводка состояния

| Раздел | Статус | Деталь |
|---|---|---|
| Маршруты `App.tsx` | ✅ корректно | Все 9 базовых типов страниц + admin |
| Услуги | ✅ 6/6 в коде = 6/6 в sitemap |
| Вредители | ✅ 12/12 = 12/12 |
| Объекты | ✅ 15/15 = 15/15 |
| Районы | ✅ 15/15 = 15/15 |
| Programmatic-комбо | ✅ 30/30 в коде = 30/30 в sitemap |
| **Блог** | ❌ **52 статьи в коде, в sitemap только 28** — **24 статьи (46%) потеряны** |
| Калькулятор | ✅ 3-шаговый, цены = PriceTable |
| TypeScript | ✅ чистая сборка |
| Дубли в sitemap | ✅ нет |
| Robots.txt | ✅ корректно блокирует /admin и /api |
| 404 | ✅ статичный + SPA-фолбэк на NotFound |

## Найденные проблемы

### 🔴 КРИТИЧНО — отсутствует половина статей в sitemap (главная причина «отвалилось из поиска»)

В `BLOG_TOPICS` (`src/data/blogTopics.ts`) **52 статьи**, в `public/sitemap.xml` — только **28**. Все эти статьи реально работают на сайте (`/blog/<slug>`), просто Яндекс/Google о них не знают, потому что их нет в sitemap.

**Пропущенные slug-и (24 шт.):**

```text
Раздел "Регламенты":
  akty-dezinfeksii-obraztsy
  dogovor-na-dezinsekciyu-obrazets
  licenzirovanie-deyatelnosti-ses
  periodichnost-dezinseksii-po-sanpin
  podgotovka-k-proverke-rospotrebnadzora
  sanitarnaya-knizshka-trebovaniya
  sanpin-dlya-detskikh-uchrezhdeniy
  shtrafy-za-narusheniya-sanpin
  trebovaniya-k-prodovolstvennym-magazinam
  zhurnaly-dezinfeksii-obraztsy
  zhaloby-v-rospotrebnadzor

Раздел "FAQ":
  bezopasnost-preparatov
  chto-delat-posle-obrabotki
  garantiya-na-obrabotku
  kak-podgotovit-dom-k-deratizatsii
  kak-podgotovit-kvartiru-k-dezinseksii
  kak-vybrat-ses-kompaniu
  kogda-mozhno-vernutsya-s-detmi
  mozhno-li-ostavatsya-v-kvartire
  nuzhno-li-myt-posudu-posle-obrabotki
  obrabotka-kvartiry-ot-klopov
  obrabotka-semnoy-kvartiry
  skolko-stoit-obrabotka-kvartiry
  zapakh-posle-obrabotki
```

### 🟡 СРЕДНЕ — `<title>` на 404 показывает старый бренд

`src/pages/NotFound.tsx:11` и `public/404.html:7` указывают `| ГорДЭЗ`, а компания давно переименована в **СанРешения**.

### 🟡 СРЕДНЕ — потенциальная коллизия маршрута `/:serviceSlug/:comboSlug`

В `App.tsx` маршрут `/:serviceSlug/:comboSlug` ловит **любые** двухсегментные пути. Сейчас это безопасно, потому что `ComboPage` при `getMatrixEntry === undefined` редиректит на `/usluga/:serviceSlug`. Но если `serviceSlug` тоже невалидный (например, `/random/random`), то ServicePage опять выдаст редирект на `/uslugi`. Нужна явная валидация: если `serviceSlug` не входит в список 6 услуг — отправлять на `NotFound` со статусом 404, а не на тихий редирект (для SEO-чистоты).

### 🟢 МИНОР — sitemap устарел по дате

Все `<lastmod>` в sitemap — `2026-02-04` или `2026-01-15`, хотя сегодня **2026-04-21**. Поисковики могут чаще переиндексировать, если даты свежие.

### 🟢 МИНОР — `og-image.jpg` отсутствует физически

`index.html` ссылается на `https://xn--c1acj0ak3f.xn--p1ai/og-image.jpg`, но в `public/` нет такого файла. OG-превью при шеринге будет битым.

### 🟢 МИНОР — phoneClean уже починен

В мемори было сказано про bug, проверил `siteConfig.ts:15` — теперь `+73833122330` с плюсом. ✅

---

## План исправления

### 1. Добавить 24 статьи блога в `public/sitemap.xml`
Вставить блок `<url>` для каждого недостающего slug (priority 0.7, changefreq monthly, lastmod 2026-04-21). После правки в sitemap станет **139 URL** вместо 115.

### 2. Обновить даты `<lastmod>` в sitemap
Все `2026-02-04` и `2026-02-01` → **2026-04-21**, programmatic — 2026-04-15. Это сигнал поисковикам перепроверить страницы.

### 3. Починить бренд на 404-странице
- `src/pages/NotFound.tsx:11` — `"404 — Страница не найдена | СанРешения"`
- `public/404.html:7` — `"404 — Страница не найдена | СанРешения"`

### 4. Усилить guard в `ComboPage.tsx`
Если `serviceSlug` не входит в список 6 валидных услуг (`getServiceBySlug(serviceSlug) === undefined`), рендерить `NotFound` вместо тихого редиректа. Это закроет дорвеи: любой `/мусор/мусор` → 404 noindex.

### 5. Добавить `og-image.jpg`
Скопировать имеющуюся фотобазу (например, `public/images/hero-bg-1.png`) в `public/og-image.jpg` (формат можно оставить png, но переименовать → `.jpg` подтолкнёт правильный mime-тип не получится; правильнее подменить ссылку в `index.html` на реально существующий файл `/images/hero-bg-1.png`).

### 6. Авто-генератор sitemap (профилактика на будущее)
Добавить `scripts/generate-sitemap.ts`, который собирает sitemap из:
- статичных индексных URL,
- `services.ts`, `pests.ts`, `objects.ts`, `districts.ts`,
- `BLOG_TOPICS`,
- `getAllMatrixUrls()`.

Запускать вручную одной командой `npx tsx scripts/generate-sitemap.ts > public/sitemap.xml`. Это устраняет первопричину расхождения навсегда — добавление новой статьи или programmatic-страницы будет автоматически попадать в sitemap.

---

## Что НЕ нашли (всё в порядке)

- Калькулятор работает: 3 шага, цены 1500–2500 ₽ совпадают с `PriceTable`, лиды уходят в `handle-lead` через `trackGoal`.
- Аналитика: `all_conversions` уже настроена через `src/lib/analytics.ts`, шумовые цели вычищены.
- Перелинковка: все `Link to=` ведут на существующие маршруты, hover-эффекты работают.
- Schema.org: WebSite, LocalBusiness, Organization, BreadcrumbList, FAQPage, Service, Article — все валидны и присутствуют.
- Hreflang `ru` + canonical обновляются на каждой странице через `SEOHead`.
- SPA-роутинг: Lovable hosting сам отдаёт `index.html` для глубоких ссылок, BrowserRouter подхватывает.
- Mobile-collapsible секции, FloatingContact (MAX/Telegram/Phone), CookieConsent — без изменений.

## Итог

**6 правок** (5 — точечные, 1 — превентивный скрипт), главная — **возврат 24 потерянных страниц блога в sitemap.xml**. После выкатки нужно отправить обновлённый sitemap на переиндексацию в **Яндекс.Вебмастере** и **Google Search Console** — поисковики увидят все статьи в течение 1–7 дней.

