
## 1. Грамматика на programmatic-страницах (главная причина «участокы», «дезинсекцияу», «дезинсекцияу участокы» и т. п.)

Корень проблемы: в `src/lib/programmaticContent.ts` имена объектов и услуг склоняются «по букве» — `${entry.objectName}е/ы/у`, `${entry.serviceName.toLowerCase()}у/и`. Это работает только для «квартира» и ломается на «участок», «дом», «автомобиль», «офис», «склад», «ресторан», а также на любых услугах («дезинсекцияу», «дератизацияи»).

### Что сделаю
В `src/data/programmaticMatrix.ts` (или рядом, в helpers) добавлю полные карты падежей и хелперы:

- `OBJECT_CASES` — для каждого `objectName`: `nominative` («участок»), `genitive` («участка»), `accusative` («участок»), `dative` («участку»), `locative` («участке»).
- `SERVICE_CASES` — для каждой услуги: `accusative` («дезинсекцию»), `genitive` («дезинсекции»), `dative` («дезинсекции»).
- Хелперы: `getObjectLocative`, `getObjectGenitive`, `getObjectAccusative`, `getServiceAccusative`, `getServiceGenitive`.

В `src/lib/programmaticContent.ts` заменю все «склейки»:
- `${objectName}е` → `getObjectLocative(entry)` (H1, intro, situation, шаги).
- `${objectName}ы` → `getObjectGenitive(entry)`.
- `${objectName}у` → `getObjectAccusative(entry)`.
- `${serviceName.toLowerCase()}у` → `getServiceAccusative(entry)`.
- `${serviceName.toLowerCase()}и` → `getServiceGenitive(entry)`.

Проверю и FAQ, и шаги, и гарантию, и pricing-блок (там же «На дезинсекцияу участокы от клещей предоставляем гарантию…»).

Также пройдусь grep’ом по строкам в `src/data/*.ts` (faqData, serviceContent, objectContent, landingContent) на «участокы / участоку / дезинсекцияу / по Новосибирск» — там, где такие склейки оказались вручную, поправлю по месту.

## 2. Телефон → 8 906 998 98 88 (везде)

Главный источник правды — `src/data/siteConfig.ts`. Обновлю:
- `phone: "+7 (906) 998-98-88"`
- `phoneClean: "+79069989888"`
- `phoneDisplay: "8 (906) 998-98-88"`
- `phoneTel: "+7-906-998-98-88"`

Затем grep’ом заменю все хардкоды (там, где не используется siteConfig):
`index.html`, `public/404.html`, `public/llms.txt`, `public/robots.txt`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/PriceTable.tsx`, `src/components/lp/LandingLeadForm.tsx`, `src/pages/Privacy.tsx`, `src/data/faqData.ts`, `src/data/landingContent.ts` (metaDescription × 3), schema.org / JSON-LD блоки в `index.html`.

Заменяемые шаблоны:
- `+7 (383) 312-23-30` → `+7 (906) 998-98-88`
- `8 (383) 312-23-30` → `8 (906) 998-98-88`
- `tel:+73833122330` → `tel:+79069989888`
- `+7-383-312-23-30` (schema) → `+7-906-998-98-88`

## 3. Бренд: «СанРешения» → «Санитарные Решения»

Где «СанРешения» как название компании (не как часть оборота «СЭС „Санитарные Решения“ / ООО „Санитарные Решения“»), заменю на «Санитарные Решения»:
- `src/data/siteConfig.ts`: `companyName: "Санитарные Решения"`.
- `src/components/Header.tsx` (логотип, aria-label).
- `src/components/Footer.tsx`.
- `src/pages/blog/Index.tsx` (заголовок-чип).
- `src/pages/lp/LandingPage.tsx` (`Все услуги …`).
- `src/pages/NotFound.tsx`, `public/404.html`, `public/llms.txt`, `public/robots.txt`.
- `index.html`: `<title>`, `og:site_name`, JSON-LD `name`, видимые H1/strong-блоки.
- `src/components/Articles.tsx` (schema.org publisher.name).
- `src/data/districtContent.ts`, `src/data/objectContent.ts`, `src/data/landingContent.ts`, `src/data/faqData.ts`, `src/lib/blogContentGenerator.ts` — везде в meta-title и текстах.

Юр. оборот «ООО „Санитарные Решения“ (СанРешения)» в `public/llms.txt` и `index.html` оставлю с пометкой, что коротко = «Санитарные Решения» (СЭС). Это сохранит SEO и не запутает поиск.

## 4. Единый прайс на programmatic-страницах

Сейчас на `/uslugi/dezinseksiya/.../uchastok` показывается «От 2400₽», тогда как на лендинге `/lp/uchastok` и в калькуляторе участок до 6 соток = 2000₽. Источник — `priceFrom` в `src/data/programmaticMatrix.ts`.

Приведу `priceFrom` в матрице к единой базе по тарифу с лендингов и калькулятора:

```text
квартира (дезинсекция, дератизация, дезинфекция)   1500 ₽
частный дом                                         2000 ₽
офис                                                1800 ₽
склад                                               2400 ₽
ресторан / кафе                                     2000 ₽
участок (до 6 соток, клещи/комары)                  2000 ₽
автомобиль                                          1200 ₽
озонирование квартиры                               2000 ₽
комплекс (2 услуги)                                 2800 ₽
```

В матрице переоценю все 30+ записей по этой таблице, чтобы убрать разнобой (2400/3200/4000 для одних и тех же объектов из разных строк). В `src/data/serviceContent.ts` поправлю строки «от 2 400 ₽» (подвал, плесень, холодильная камера, договор) на согласованные значения. В тексте FAQ-генератора минимальная цена тоже подтянется из `priceFrom`.

## 5. Проверка

После правок:
- Grep на `СанРешения`, `312-23-30`, `73833122330`, `участокы`, `участоку`, `дезинсекцияу`, `дезинсекцияи`, `по Новосибирск ` — должен возвращать только разрешённые места (юр. оборот, URL ассета).
- Открою `/uslugi/dezinseksiya/kleshchi-uchastok` в превью на мобиле и проверю H1, breadcrumbs, цену, гарантию, FAQ, нижнюю CTA — везде корректные падежи и новый номер.

## Что НЕ трогаю
- Бизнес-логику лидов, edge-функции, RLS, аналитику, дизайн-токены, фоновые фото (это правилось в прошлых итерациях).
- Калькулятор/прайс-матрицу (`calculatorPricing.ts`) — там уже актуальные значения.
