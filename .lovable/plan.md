

# Исправление домена: xn--d1aey.xn--p1ai (дко.рф) на xn--c1acj0ak3f.xn--p1ai (гордэз.рф)

## Корневая причина всех проблем

В коде везде используется **неправильный punycode**:

| Что записано | Какой домен на самом деле | Что нужно |
|---|---|---|
| `xn--d1aey.xn--p1ai` | **дко.рф** | Это чужой/другой домен |
| `xn--c1acj0ak3f.xn--p1ai` | **гордэз.рф** | Это правильный домен |

Именно из-за этого:
- Яндекс Вебмастер не принимал URL на переобход (домен не совпадает с сайтом)
- Sitemap из robots.txt показывал 0 ссылок (другой домен)
- Вручную добавленный `https://гордэз.рф/sitemap.xml` работает (115 ссылок, статус ОК) -- потому что домен совпадает

---

## Файлы для исправления

### 1. src/data/siteConfig.ts (1 замена)
Строка 5: заменить `xn--d1aey.xn--p1ai` на `xn--c1acj0ak3f.xn--p1ai`

Это центральная конфигурация -- от неё зависят canonical URL, Schema.org и все динамические ссылки.

### 2. public/robots.txt (2 замены)
- Строка 2: комментарий
- Строка 12: `Sitemap: https://xn--c1acj0ak3f.xn--p1ai/sitemap.xml`

### 3. public/sitemap.xml (~115 замен)
Заменить все `xn--d1aey.xn--p1ai` на `xn--c1acj0ak3f.xn--p1ai` во всех 115 тегах `<loc>`.

### 4. index.html (~20 замен)
Заменить все `xn--d1aey.xn--p1ai` на `xn--c1acj0ak3f.xn--p1ai` в:
- canonical URL
- hreflang ссылках
- og:url, og:image
- twitter:image
- Schema.org (WebSite, LocalBusiness, Organization, BreadcrumbList, Service)

---

## Список URL для переобхода (после исправления)

После публикации исправлений -- вот готовый список для вставки в Яндекс Вебмастер (Переобход страниц). Можно использовать **относительные URL** чтобы точно не было ошибок:

**Основные (8 страниц):**
```
/
/uslugi
/vrediteli
/obekty
/rayony
/blog
/faq
/sanpin
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

**Вредители (12):**
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

**Programmatic (30):**
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
/deratizatsiya/dom-berdsk
/dezinseksiya/kleshchi-uchastok
/dezinseksiya/kleshchi-uchastok-sovetsky-rayon
/dezinseksiya/kleshchi-uchastok-berdsk
/ozonirovanie/kvartira
/ozonirovanie/avtomobil
/dezodoratsiya/kvartira
/dezodoratsiya/dom
```

**Блог (28):**
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
/blog/dezinfeksiya-posle-bolezni
/blog/ozonirovanie-pomeshcheniy
/blog/udalenie-zapakha-v-kvartire
/blog/dezinfeksiya-sklada
/blog/deratizatsiya-sklada
/blog/obrabotka-podvala-ot-bloh
/blog/dezinfeksiya-avtomobilya
/blog/fumigatsiya-sklada
/blog/sanpin-dlya-obshchepita
```

---

## Действия в Яндекс Вебмастере после публикации

1. Удалить проблемный sitemap `https://xn--d1aey.xn--p1ai/sitemap.xml` (он от чужого домена)
2. Обновить вручную добавленный sitemap -- нажать "отправить на переобход"
3. В "Переобход страниц" вставить относительные URL из списка выше (по 20 штук за раз -- лимит Яндекса)

---

## Итого

| # | Файл | Количество замен |
|---|------|-----------------|
| 1 | `src/data/siteConfig.ts` | 1 (siteUrl) |
| 2 | `public/robots.txt` | 2 |
| 3 | `public/sitemap.xml` | ~115 |
| 4 | `index.html` | ~20 |
| **Итого** | | **~138 замен** |

Все замены одинаковые: `xn--d1aey.xn--p1ai` заменяется на `xn--c1acj0ak3f.xn--p1ai`.

