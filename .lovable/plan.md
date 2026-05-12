## Цель
Поднять баллы аудита owndev.ru: GEO 47→~95, CRO 11→~85, SEO 70→~95, Директ 50→~90, AI 58→~95.

## Корневая причина
Сайт — SPA, аудит-боты не выполняют JS и видят пустой `index.html`. Это объясняет почти все нули в отчёте (телефоны, формы, цены, H1, семантика — всё есть в JSX, но бот их не видит). Главная мера — пререндеринг ключевых страниц в статический HTML на этапе сборки.

## Шаги

### 1. Пререндеринг (закрывает ~70% ошибок)
- Подключить `vite-plugin-prerender` + `puppeteer` в `vite.config.ts`.
- Пререндерить роуты: `/`, `/uslugi`, все `/usluga/:slug`, `/vrediteli`, `/obekty`, `/rayony`, `/blog`, `/faq`, `/sanpin`, `/privacy`.
- Обновить `.github/workflows/deploy.yml` — установить Chromium перед `npm run build`.

### 2. `/llms.txt` (GEO +20, AI +10)
Создать `public/llms.txt` по стандарту llmstxt.org: описание, услуги с ценами, гарантии, контакты, FAQ — plain text для LLM.

### 3. CRO-блоки доверия (CRO +60)
- Видимый блок реквизитов в `Footer`: ИНН/ОГРН, юр.адрес, email, телефон, гарантии.
- В Hero: видимый телефон, email, мини-форма «Перезвоните мне» (имя+телефон), кнопки Telegram/MAX/WhatsApp/обратный звонок.
- Прайс-таблица в `Services` с явными цифрами в HTML.

### 4. Контент-минимум и цитируемость (SEO +17, GEO +15, AI +10)
- Расширить текст главной до ≥600 слов в `AboutSection`.
- Добавить короткие самостоятельные блоки 2–3 предложения (для цитирования LLM): цены, сроки выезда, гарантии, безопасность.
- Добавить таблицы и маркированные списки (структура контента).

### 5. E-E-A-T + актуальность (GEO +5, AI +5)
- Видимая дата обновления в footer и шаблонах статей.
- Автор «ООО Санитарные Решения» в `meta` и Schema.org `author`.
- `datePublished`/`dateModified` в JSON-LD статей.

### 6. Яндекс.Директ (Директ +50)
- Конкретизировать H1 на programmatic-страницах (услуга+вредитель+район).
- Краткий заголовок ≤35 символов в `<meta name="ya:title">` и Schema.org `alternateName`.
- Связный вводный абзац на главной (когерентность).

### 7. Технические мелочи (SEO +3)
- `font-display: swap`, `loading="lazy"` + `decoding="async"` для всех некритичных изображений.
- HSTS + gzip — добавить `.htaccess` в `public/` (Beget — Apache).

## Технические детали
- Пререндер: после `vite build` Puppeteer открывает каждый маршрут, ждёт `document.title`, сохраняет HTML в `dist/<route>/index.html`. Клиентский React продолжит «оживлять» страницу.
- На Beget Apache отдаст статичные HTML напрямую; SPA-фолбэк для неизвестных URL — через `.htaccess`.
- Не трогаем калькулятор, лид-пайплайн, MVT, Telegram-роутинг, политику FZ-152.

## Файлы
**Создать:** `public/llms.txt`, `public/.htaccess`
**Обновить:** `vite.config.ts`, `package.json`, `.github/workflows/deploy.yml`, `index.html`, `src/components/Hero.tsx`, `src/components/AboutSection.tsx`, `src/components/Footer.tsx`, `src/components/Services.tsx`, `src/components/FAQ.tsx`, шаблоны программных страниц.
