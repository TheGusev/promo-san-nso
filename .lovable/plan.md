

# Обновить TELEGRAM_CHAT_ID на `-5244841627` и протестировать

## Что делаем
Пользователь прислал актуальный chat_id новой группы DZN: `-5244841627` (формат обычной группы, не супергруппы — без префикса `-100`). Текущий секрет `-1003429956285` невалиден, отсюда `chat not found`.

### Шаг 1. Обновить секрет
Через `add_secret` запросить обновление:
- **`TELEGRAM_CHAT_ID`** → `-5244841627`

`TELEGRAM_BOT_TOKEN` не трогаем — он валиден (логи `test-telegram` показывают `tokenLength: 46`, `tokenPrefix: "8263029786..."`, ошибка только на стадии поиска чата).

### Шаг 2. Тест соединения через `test-telegram`
Вызвать `supabase--curl_edge_functions` POST `/test-telegram`. Ожидание: в группе DZN появляется «🧪 Тестовое сообщение… ✅ Telegram интеграция работает!». В логах — `ok: true`.

Если снова `chat not found` — значит группа уже мигрировала в супергруппу. Функция `test-telegram` (строки 65–78) автоматически вернёт `migrate_to_chat_id` с новым id вида `-100…` — обновлю секрет на него и повторю.

Если `bot was kicked` или `not enough rights` — попрошу проверить, что бот всё ещё админ группы с правом «Отправка сообщений».

### Шаг 3. Сквозной тест от калькулятора через `handle-lead`
Вызвать `supabase--curl_edge_functions` POST `/handle-lead` с payload:
```json
{
  "name": "Тест Калькулятор",
  "phone": "+79991234567",
  "source": "website_calculator_simple",
  "service": "Дезинсекция",
  "object_type": "Квартира",
  "area_m2": 50,
  "final_price": 2500,
  "session_id": "test-session-manual-002",
  "form_start_time": <now - 5000>,
  "device_type": "desktop",
  "intent": "default",
  "variant_id": "A"
}
```
Ожидание: в группе появляется сообщение «🆕 Новая заявка #...» со всеми полями (имя, телефон, услуга, объект, площадь, цена, источник).

### Шаг 4. Проверка логов
Прочитать `edge_function_logs` для `test-telegram` и `handle-lead`. Подтвердить: `Telegram notification sent successfully`, `ok: true`, отсутствие 4xx.

### Шаг 5. Обновить память
В `mem://technical/telegram-integration-chat-id-migration` записать актуальный chat_id `-5244841627` (или новый, если в шаге 2 пришёл `migrate_to_chat_id`), обновить дату миграции.

## Что НЕ трогаем
- Код `handle-lead/index.ts`, `test-telegram/index.ts`, `SimpleCalculator.tsx` — без изменений.
- `TELEGRAM_BOT_TOKEN`, валидации, rate-limit, структуру лида.

## Итог
0 правок в коде. 1 обновление секрета → 2 вызова edge-функций → проверка логов → обновление памяти. Если после Шага 2 заявка уйдёт в группу — задача закрыта.

