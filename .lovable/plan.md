## Цель

После каждого пуша в `main` GitHub сам собирает `dist/` и заливает его на Beget в `gordezrf/public_html/`. Никакой ручной распаковки ZIP.

## Как будет работать

```
git push → GitHub Actions:
  1. npm ci
  2. npm run build  → dist/
  3. FTP upload dist/* → gordezrf/public_html/
     (с сохранением /api/lead.php и lead.log)
```

Через ~2 минуты после пуша сайт на гордэз.рф обновлён.

## Что я создам в коде

**`.github/workflows/deploy.yml`** — workflow GitHub Actions:
- Триггер: `push` в ветку `main` (+ кнопка ручного запуска `workflow_dispatch`)
- Node 20, `npm ci`, `npm run build`
- Загрузка через `SamKirkland/FTP-Deploy-Action@v4.3.5`:
  - `local-dir: ./dist/`
  - `server-dir: /gordezrf/public_html/`
  - `protocol: ftp` (Beget по умолчанию; если SFTP — поменяем одну строку)
  - `exclude: ['**/api/**', '**/lead.log', '**/.htaccess']` — НЕ трогаем PHP-резерв и логи
  - `dangerous-clean-slate: false` — старые файлы не удаляются, только перезаписываются

**`.github/workflows/README.md`** — короткая инструкция: где смотреть статус, как перезапустить вручную.

## Что нужно от вас (один раз, 5 минут)

В Beget → «Сайты» → у `гордэз.рф` посмотрите блок **FTP-доступ**. Там 3 значения:
- сервер (например `ftp.beget.com` или `xxxx.beget.tech`)
- логин (обычно `xxxxxx_gordezrf` или просто логин аккаунта)
- пароль

Затем в GitHub-репозитории: **Settings → Secrets and variables → Actions → New repository secret**, добавьте 3 секрета:
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

Я в workflow буду их читать как `${{ secrets.FTP_SERVER }}` и т.д. — в логах они не светятся.

## Безопасность и нюансы

- `/api/lead.php` и `lead.log` в `exclude` — деплой их не перетрёт и не удалит.
- Если Beget окажется на SFTP (порт 22) — в `deploy.yml` меняется `protocol: sftp` и `port: 22`, остальное то же.
- Первый запуск загрузит весь `dist/` (~несколько МБ), последующие — только изменённые файлы (action ведёт `.ftp-deploy-sync-state.json` на сервере).
- Если что-то пойдёт не так — Actions покажет красный крестик с логом, сайт продолжит работать на старой версии.

## После того как нажмёте «одобрить»

1. Я создам `.github/workflows/deploy.yml` и README.
2. Лавабл синкнёт в GitHub.
3. Вы добавите 3 секрета в GitHub.
4. Делаете любой пуш (или жмёте «Run workflow» вручную) → проверяем логи → сайт обновлён.
