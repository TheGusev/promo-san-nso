## Решение: гибрид Supabase + PHP-резерв

Возвращаю `leadSender` к двухканальной схеме. Работает сразу без действий с вашей стороны, PHP подхватится автоматически, когда (и если) зальёте на Beget.

## Шаги

### 1. Откатить `src/lib/leadSender.ts`
- Канал 1 (основной): `supabase.functions.invoke("handle-lead")`, таймаут 6 сек.
- Канал 2 (резерв): POST на `https://xn--c1acj0ak3f.xn--p1ai/api/lead.php`, таймаут 6 сек.
- При обоих fail → offlineQueue в localStorage (как и было).
- `LeadChannel = "supabase" | "php" | "failed"`.

### 2. Проверить секреты edge-функции
- `TELEGRAM_BOT_TOKEN` — есть.
- `TELEGRAM_CHAT_ID` — есть, но в памяти указано, что актуальный chat_id `-5244841627`. Проверю через логи после первого теста: если функция пишет «chat not found», нужно будет обновить секрет. Спрошу вас отдельно, если потребуется.

### 3. Задеплоить `handle-lead`
- `supabase--deploy_edge_functions(["handle-lead"])`.

### 4. Реальный smoke-test
- `supabase--curl_edge_functions` с тестовыми данными:
  `{ name: "Lovable Test", phone: "+79999999999", source: "lovable_smoke", honeypot: "" }`.
- Прочитать логи `supabase--edge_function_logs("handle-lead")`.
- Если в логах «sent to telegram ok» и в группе DZN пришло сообщение — всё работает.
- Если ошибка — отдиагностирую (неверный chat_id / бот не в группе / валидация).

### 5. Память
- Обновить `mem://technical/lead-processing-pipeline` — снова гибрид.

## Что НЕ трогаем
- Компоненты форм (Hero, PopupForm, SimpleCalculator, Calculator, LandingLeadForm, HeroService) — они через `sendLead()`, переключаются автоматически.
- Тосты «5 минут» уже исправлены.
- `public-php/lead.php` оставляю как заготовку для Beget.
- Edge function `handle-lead` уже существует — только деплою заново.

## Итог
- Заявки заработают сразу после деплоя.
- Появляются записи в `/admin/leads`, MVT снова обучается.
- Когда зальёте PHP на Beget — резерв включится сам, ничего больше делать не нужно.
