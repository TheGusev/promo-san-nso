---
name: Lead processing pipeline (PHP-only)
description: Все заявки идут единственным каналом — POST на https://xn--c1acj0ak3f.xn--p1ai/api/lead.php (PHP на Beget). Supabase edge `handle-lead` НЕ используется фронтом.
type: feature
---

С 08.06.2026 фронт отправляет лиды ТОЛЬКО через `src/lib/leadSender.ts` → POST `/api/lead.php` на гордэз.рф.

PHP-файл: `public-php/lead.php` (заливается на Beget как `/api/lead.php`).
- chat_id Telegram: `-5244841627` (зашит), бот `@dznovisib_bot`.
- Токен бота вставляется вручную в файл на Beget (placeholder `PASTE_YOUR_BOT_TOKEN_HERE`).
- Поля: name, phone, city, object_type/objectType, problem/pest, service, urgency, comment, form_name/source, price/final_price, page, utm_source, utm_campaign, honeypot.
- Валидация: телефон 10-11 цифр → нормализуется в `+7XXXXXXXXXX`, honeypot (`website`/`honeypot`), rate-limit 5/мин/IP, лог в `/api/lead.log`.
- Сообщение: «🔥 Заявка с гордэз.рф» + эмодзи-разметка по полям, parse_mode HTML.

Edge function `supabase/functions/handle-lead` физически осталась (для возможного отката и для `test-telegram`), но НЕ вызывается из фронта. Лиды НЕ пишутся в таблицу `leads`. MVT Thompson Sampling больше не обучается на конверсиях (показы продолжают логироваться через `log-traffic-event`).

При неуспехе PHP — лид кладётся в `offlineQueue` (localStorage) и переотправляется по событию `online`.

CORS: `Access-Control-Allow-Origin: *`. На preview `*.lovable.app` отправка работает; основной домен — гордэз.рф.
