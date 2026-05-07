# Резервный канал отправки лидов через PHP-прокси на гордэз.рф

## Цель
Если `supabase.functions.invoke('handle-lead')` не отвечает (заблокирован у клиента в РФ, таймаут, CDN-сбой) — лид всё равно уходит в Telegram через PHP на Beget.

## Архитектура

```text
форма → supabase handle-lead ──ok──► Telegram
                │
                └─fail/timeout 6s──► fetch гордэз.рф/api/lead.php → Telegram
                                          │
                                          └─fail──► offlineQueue (localStorage)
```

## Что меняется в коде

### 1. Новая утилита `src/lib/leadSender.ts`
Единая функция `sendLead(leadData)`:
- Пробует `supabase.functions.invoke('handle-lead', body)` с таймаутом 6 сек (через `AbortController`).
- При ошибке/таймауте — `fetch('https://гордэз.рф/api/lead.php', { method:'POST', body: JSON.stringify(leadData) })` с таймаутом 6 сек.
- При полной неудаче — `queueLead(leadData)` (уже есть).
- Возвращает `{ ok: true, channel: 'supabase'|'php'|'queued' }`.

### 2. Заменить прямые вызовы во всех 6 формах на `sendLead`:
- `src/components/Calculator.tsx`
- `src/components/SimpleCalculator.tsx`
- `src/components/lp/LandingLeadForm.tsx`
- `src/components/HeroService.tsx`
- `src/components/PopupForm.tsx`
- `src/lib/offlineQueue.ts` (processQueue → тоже через sendLead)

### 3. PHP-файл (нужно загрузить на Beget вручную)
Лежит в репо как `public-php/lead.php` — пользователь сам кладёт его в корень `гордэз.рф` через FTP/панель Beget. Содержит:
- CORS заголовки (`Access-Control-Allow-Origin: *`)
- Приём JSON, базовая валидация имени/телефона
- Honeypot-проверка
- Отправка в Telegram через `file_get_contents('https://api.telegram.org/bot<TOKEN>/sendMessage', ...)` — токен и chat_id хардкодятся в PHP-файле (Beget блокирует .env)
- Лог в `lead.log` рядом

### 4. Метрика канала
В Telegram-сообщение добавим метку `📡 канал: php-fallback` чтобы вы видели когда сработал резерв.

## Что НЕ меняется
- Edge function `handle-lead` — остаётся основным каналом.
- Структура данных лида — та же.
- БД и RLS — без изменений (PHP в БД не пишет, только TG).

## Риски
- PHP-канал не сохранит лид в БД — только в Telegram + лог-файл на Beget. Это сознательный компромисс ради надёжности.
- Дубликаты возможны если supabase ответил с задержкой >6с. Решается дедупом по телефону+времени на стороне TG (визуально).

## После аппрува
1. Создаю `src/lib/leadSender.ts`.
2. Правлю 6 форм + offlineQueue.
3. Кладу `public-php/lead.php` с инструкцией в README.
4. Прошу вас залить `lead.php` на Beget в корень `гордэз.рф` и проверить `https://гордэз.рф/api/lead.php` (должен вернуть `{"ok":false,"error":"method"}` на GET).
