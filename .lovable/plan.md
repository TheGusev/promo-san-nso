

# Тест Telegram-интеграции после выдачи прав боту

## Что делаем
Бот теперь имеет права на отправку сообщений в новой группе. Проверяем сквозной путь без правок кода.

### Шаг 1. Тест соединения через `test-telegram`
Вызвать edge-функцию `test-telegram` (POST). Ожидание: в группе DZN появляется «🧪 Тестовое сообщение… ✅ Telegram интеграция работает!». В логах — `ok: true` от Telegram API.

Если снова `chat not found` — попрошу заново снять `chat_id` через `getUpdates` (после смены прав id мог обновиться) и обновлю секрет `TELEGRAM_CHAT_ID`.

### Шаг 2. Сквозной тест от калькулятора через `handle-lead`
Вызвать `handle-lead` (POST) с реалистичным payload, имитирующим заявку калькулятора:
```json
{
  "name": "Тест Калькулятор",
  "phone": "+79991234567",
  "source": "website_calculator_simple",
  "service": "Дезинсекция",
  "object_type": "Квартира",
  "area_m2": 50,
  "final_price": 2500,
  "session_id": "test-session-manual-001",
  "form_start_time": <now - 5000>,
  "device_type": "desktop",
  "intent": "default",
  "variant_id": "A"
}
```
Ожидание: в группе появляется сообщение «🆕 Новая заявка #...» со всеми полями.

### Шаг 3. Проверка логов
Прочитать `edge_function_logs` для `handle-lead` и `test-telegram`. Подтвердить: `Telegram notification sent successfully`, отсутствие 4xx/5xx.

### Шаг 4. Обновить память проекта
В `mem://technical/telegram-integration-chat-id-migration` заменить старый `chat_id` `-1003211592275` на актуальный `-1003429956285` (или новый, если потребуется переснять).

## Что НЕ трогаем
- Код `SimpleCalculator.tsx`, `handle-lead/index.ts`, `test-telegram/index.ts` — без изменений.
- Структура лида, валидации, rate-limit, секрет `TELEGRAM_BOT_TOKEN` (валиден).

## Если тест провалится
Возможные причины и фиксы:
- `chat not found` повторно → обновить `TELEGRAM_CHAT_ID` (через `add_secret`) после переснятия id из `getUpdates`.
- `bot was kicked` → попросить добавить бота заново админом с правом «Отправка сообщений».
- Любая другая 4xx → разобрать по тексту ошибки из логов.

## Итог
0 правок в коде. 2 вызова edge-функций + чтение логов + 1 обновление памяти. Если оба теста зелёные — задача закрыта, заявки с калькулятора уходят в группу DZN.

