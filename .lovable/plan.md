## Что делаем

Заявки идут только через PHP-файл на гордэз.рф, минуя Supabase edge function. Никакие компоненты форм не правим — все они уже используют единую функцию `sendLead()` из `src/lib/leadSender.ts`.

## Файлы

### 1. `public-php/lead.php` — переписать
- Принимать расширенный набор полей: `name`, `phone`, `city`, `object_type`/`objectType`, `problem`/`pest`, `service`, `urgency`, `comment`, `form_name`/`source`, `price`/`final_price`, `page`, `utm_source`, `utm_campaign`.
- Сообщение в Telegram в новом формате: «🔥 Заявка с гордэз.рф» + эмодзи-разметка по полям + время.
- Отправка через cURL (с fallback на `file_get_contents`) — на Beget cURL надёжнее.
- Сохранить: honeypot (`website`, `honeypot`), валидацию телефона (10–11 цифр, нормализация в `+7XXXXXXXXXX`), rate-limit 5/мин/IP, лог в `lead.log`, CORS-заголовки.
- `chat_id` = `-5244841627` зашит. Токен — placeholder `PASTE_YOUR_BOT_TOKEN_HERE`, вписывается вручную на Beget (Vite его не подставит).
- Убрать пометку «резерв» — теперь это основной канал.

### 2. `src/lib/leadSender.ts` — упростить
- Удалить `trySupabase()` и весь импорт `supabase` целиком.
- Оставить одну функцию `postLead()` → POST на `https://xn--c1acj0ak3f.xn--p1ai/api/lead.php` (punycode для надёжного fetch).
- `SendLeadResult.channel` теперь `'php' | 'failed'`.
- При `failed` вызывающий код по-прежнему кладёт лид в `offlineQueue` (логика не меняется).

### 3. Тосты — поправить две неточности
- `src/components/HeroService.tsx` (стр. 84): «в течение 15 минут» → «в течение 5 минут»; текст ошибки «Попробуйте позвонить нам напрямую» → `Позвоните: ${SITE_CONFIG.phoneDisplay}`.
- Остальные формы (`Hero`, `PopupForm`, `SimpleCalculator`, `Calculator`, `LandingLeadForm`, `WarrantyModal`) уже показывают «5 минут» и корректный номер — не трогаем.

### 4. Память
- `mem://technical/lead-processing-pipeline` — обновить: edge function `handle-lead` больше НЕ вызывается фронтом, основной канал — PHP `/api/lead.php` на Beget. Лиды не пишутся в БД.
- Core-памятка про «Edge functions validate leads» — переформулировать.

## Что НЕ трогаем
- Edge function `handle-lead` физически остаётся в `supabase/functions/` (для возможного отката и для `test-telegram`).
- Secret `TELEGRAM_BOT_TOKEN` в Supabase — нужен другим функциям.
- Все компоненты форм — они идут через `sendLead()` и переключатся автоматически.
- `offlineQueue`, `useTrafficLogging`, Я.Метрика goals — без изменений.
- Edge function `log-traffic-event` — продолжает работать для аналитики посещений.

## После деплоя — действия пользователя на Beget
1. В `/api/lead.php` заменить `PASTE_YOUR_BOT_TOKEN_HERE` на реальный токен бота (тот же, что в Supabase-секрете `TELEGRAM_BOT_TOKEN`).
2. Проверить `https://гордэз.рф/api/lead.php` — должен вернуть JSON `{"ok":false,"error":"method"}` на GET.
3. Отправить тестовую заявку с сайта → должна прийти в группу DZN (`-5244841627`).

## Принимаемые компромиссы
- Лиды больше не пишутся в таблицу `leads` → `/admin/leads` будет показывать только исторические записи.
- MVT Thompson Sampling перестаёт обучаться на конверсиях (показы продолжают логироваться).
- На preview-доменах `*.lovable.app` отправка будет падать из-за CORS — заявки уходят только с продакшна `гордэз.рф`. Это явное следствие выбранного варианта «только PHP».
