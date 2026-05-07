# Автодеплой на Beget

При каждом пуше в `main` GitHub собирает проект и заливает `dist/` на хостинг.

## Настройка (один раз)

В **Settings → Secrets and variables → Actions** добавьте 3 секрета:

| Имя | Где взять (Beget → Сайты → FTP) |
|---|---|
| `FTP_SERVER` | например `ftp.beget.com` или `xxxx.beget.tech` |
| `FTP_USERNAME` | логин FTP |
| `FTP_PASSWORD` | пароль FTP |

## Запуск

- Автоматически: `git push` в `main`.
- Вручную: вкладка **Actions → Build and Deploy to Beget → Run workflow**.

## Что НЕ перезаписывается

В `exclude` указаны:
- `api/**` — PHP-резервный канал лидов (`/api/lead.php`)
- `lead.log` — логи PHP
- `.htaccess`, `.well-known/**`

## Если Beget на SFTP

В `deploy.yml` поменять:
```yaml
protocol: sftp
port: 22
```
