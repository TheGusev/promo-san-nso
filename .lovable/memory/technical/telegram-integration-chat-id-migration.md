---
name: Telegram chat migration history
description: Telegram group chat_id history. Current: -5244841627 (regular group "DZN"). Bot @dznovisib_bot must remain admin with send-message permission.
type: feature
---

Текущий chat_id: **-5244841627** (обычная группа "DZN", тип `group`, не супергруппа — без префикса `-100`).

Бот: `@dznovisib_bot` (id 8263029786). Должен оставаться админом группы с правом «Отправка сообщений», иначе Telegram API вернёт `chat not found` или `bot was kicked`.

История миграций:
- `-5045944005` — первая обычная группа (устарела).
- `-1003211592275` — супергруппа (устарела, чат удалён/переименован).
- `-1003429956285` — невалидный id, пробовали 21.04.2026, получили `chat not found`.
- **`-5244841627`** — актуальный (обновлён 21.04.2026, тест прошёл, `ok: true`).

Если снова `chat not found`:
1. Написать `/test` в группе DZN.
2. Открыть `https://api.telegram.org/bot<TOKEN>/getUpdates`, найти `chat.id`.
3. Обновить секрет `TELEGRAM_CHAT_ID`.
4. Если id поменялся на формат `-100…` — группа стала супергруппой, это нормально.

Используется в: `supabase/functions/handle-lead/index.ts`, `supabase/functions/test-telegram/index.ts`.
