
# План: Полное обновление sitemap.xml и robots.txt

## Цель

Создать актуальные, корректные файлы `sitemap.xml` и `robots.txt` для production-домена `https://xn--d1aey.xn--p1ai` (гордэз.рф).

---

## Анализ текущего состояния

### sitemap.xml (текущий)
- Содержит ~50 URL
- **Отсутствуют:**
  - 6 вредителей (moli, kozheed, osy, komary, kroty и др.)
  - 10 объектов (dacha, uchastok, obshezhitie, kafe, magazin, gostinitsa, proizvodstvo, detskiy-sad, shkola, bolnitsa)
  - 10 районов (zheleznodorozhny-rayon, zaeltsovsky-rayon, kalininsky-rayon, kirovsky-rayon, pervomaysky-rayon, dzerzhinsky-rayon, iskitim, ob, krasnoobsk)
  - ~55 programmatic-страниц (матрица комбинаций)
  - ~50 статей блога

### robots.txt (текущий)
- Содержит устаревшие Allow-правила для старых URL (`/dezinfeksiya` и т.п.)
- Правила избыточны и могут вводить в заблуждение

---

## Новый sitemap.xml

### Структура и приоритеты

| Раздел | Количество URL | changefreq | priority |
|--------|----------------|------------|----------|
| Главная | 1 | daily | 1.0 |
| Индексные страницы | 8 | weekly | 0.9 |
| Услуги `/usluga/*` | 6 | weekly | 0.9 |
| Вредители `/vreditel/*` | 13 | monthly | 0.8 |
| Объекты `/obekt/*` | 15 | monthly | 0.8 |
| Районы `/rayon/*` | 15 | monthly | 0.8 |
| Блог `/blog/*` | ~50 | monthly | 0.7 |
| Programmatic | ~55 | monthly | 0.6 |
| Служебные (privacy) | 1 | yearly | 0.3 |
| **ИТОГО** | **~164** | | |

### Полный список URL для включения

**Главная:**
```
/
```

**Индексные страницы (8):**
```
/uslugi
/vrediteli
/obekty
/rayony
/blog
/faq
/sanpin
/privacy
```

**Услуги (6):**
```
/usluga/dezinfeksiya
/usluga/dezinseksiya
/usluga/deratizatsiya
/usluga/ozonirovanie
/usluga/dezodoratsiya
/usluga/sertifikatsiya
```

**Вредители (13):**
```
/vreditel/klopy
/vreditel/tarakany
/vreditel/blohi
/vreditel/muravi
/vreditel/moli
/vreditel/kozheed
/vreditel/osy
/vreditel/komary
/vreditel/kleshchi
/vreditel/krysy
/vreditel/myshi
/vreditel/kroty
```

**Объекты (15):**
```
/obekt/kvartira
/obekt/dom
/obekt/dacha
/obekt/uchastok
/obekt/obshezhitie
/obekt/ofis
/obekt/restoran
/obekt/kafe
/obekt/magazin
/obekt/gostinitsa
/obekt/sklad
/obekt/proizvodstvo
/obekt/detskiy-sad
/obekt/shkola
/obekt/bolnitsa
```

**Районы (15):**
```
/rayon/centralny-rayon
/rayon/zheleznodorozhny-rayon
/rayon/zaeltsovsky-rayon
/rayon/kalininsky-rayon
/rayon/kirovsky-rayon
/rayon/leninsky-rayon
/rayon/oktyabrsky-rayon
/rayon/pervomaysky-rayon
/rayon/sovetsky-rayon
/rayon/dzerzhinsky-rayon
/rayon/berdsk
/rayon/iskitim
/rayon/ob
/rayon/krasnoobsk
/rayon/novosibirskaya-oblast
```

**Programmatic-страницы (~55):**
Из матрицы `PROGRAMMATIC_MATRIX`:
```
/dezinseksiya/klopy-kvartira-centralny-rayon
/dezinseksiya/klopy-kvartira-leninsky-rayon
/dezinseksiya/klopy-kvartira-oktyabrsky-rayon
/dezinseksiya/klopy-kvartira
/dezinseksiya/tarakany-kvartira-centralny-rayon
/dezinseksiya/tarakany-kvartira
/dezinseksiya/tarakany-restoran-centralny-rayon
/dezinseksiya/tarakany-restoran
/dezinseksiya/blohi-kvartira
/dezinseksiya/muravi-kvartira
/dezinseksiya/muravi-dom
/deratizatsiya/krysy-sklad
/deratizatsiya/krysy-sklad-leninsky-rayon
/deratizatsiya/myshi-dom
/deratizatsiya/myshi-dom-sovetsky-rayon
/deratizatsiya/myshi-kvartira
/dezinfeksiya/kvartira
/dezinfeksiya/kvartira-centralny-rayon
/dezinfeksiya/ofis
/dezinfeksiya/restoran
/dezinseksiya/kvartira-centralny-rayon
/dezinseksiya/kvartira-leninsky-rayon
... и остальные из матрицы
```

**Блог (~50 статей):**
```
/blog/kak-raspoznat-postelnykh-klopov
/blog/skolko-zhivut-klopy-bez-edy
/blog/otkuda-berutsya-klopy
/blog/tarakany-v-kvartire-prichiny
/blog/blohi-v-kvartire-otkuda
/blog/krysy-v-chastnom-dome
/blog/myshi-v-dome-zimoy
/blog/muravi-v-kvartire
/blog/moli-v-kvartire
/blog/kozheed-v-kvartire
/blog/osy-i-shershni-na-dache
/blog/kleshchi-na-uchastke
/blog/cheshuynitsy-v-vannoy
/blog/mokritsy-v-kvartire
/blog/pauky-v-dome
/blog/dezinfeksiya-posle-smerti
/blog/dezinfeksiya-posle-zatopleniya
/blog/kak-izbavitsya-ot-pleseni
/blog/dezinfeksiya-v-meditsinskikh-uchrezhdeniyakh
... и остальные статьи
```

---

## Новый robots.txt

### Принципы
1. Простой и понятный — минимум правил
2. Блокируем только технические и админские пути
3. Явно указываем Sitemap
4. Без избыточных Allow-правил (Allow: / достаточно)

### Структура

```
# Robots.txt для СанРешения
# https://xn--d1aey.xn--p1ai (гордэз.рф)

User-agent: *
Allow: /

# Технические и служебные пути
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: https://xn--d1aey.xn--p1ai/sitemap.xml
```

### Удаляемые элементы
- Отдельные User-agent для Googlebot, Yandex и т.д. (избыточно)
- Crawl-delay (замедляет индексацию без необходимости)
- Clean-param (можно добавить позже при необходимости)
- Allow для старых URL типа `/dezinfeksiya` (теперь это редиректы)
- Host (устаревшая директива для Яндекса)

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `public/sitemap.xml` | Полная перезапись |
| `public/robots.txt` | Полная перезапись |

---

## Проверки после внедрения

1. **Консистентность URL:**
   - Все URL в sitemap соответствуют canonical-ссылкам на страницах
   - Нет ссылок на `promo-san-nso.lovable.app`
   - Нет старых путей типа `/dezinfeksiya` (только `/usluga/dezinfeksiya`)

2. **Валидность:**
   - sitemap.xml проходит валидацию XML
   - robots.txt корректно парсится

3. **Доступность:**
   - `/sitemap.xml` отдаёт 200
   - `/robots.txt` отдаёт 200

---

## Технические детали

### Формат sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://xn--d1aey.xn--p1ai/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... остальные URL ... -->
</urlset>
```

### Порядок URL в sitemap

1. Главная страница
2. Индексные страницы (uslugi, vrediteli, obekty, rayony, blog, faq, sanpin)
3. Страницы услуг
4. Страницы вредителей
5. Страницы объектов
6. Страницы районов
7. Programmatic-страницы
8. Статьи блога
9. Служебные страницы (privacy)

---

## Итоговый результат

После выполнения плана:
- sitemap.xml содержит ~164 актуальных URL
- robots.txt минималистичен и корректен
- Все URL используют production-домен `https://xn--d1aey.xn--p1ai`
- Нет устаревших путей и редиректов
- Sitemap легко обновлять вручную при добавлении контента
