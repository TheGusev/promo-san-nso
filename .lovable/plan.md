

# Реалистичные фото для разделов «Районы», «Вредители» и индексных страниц

## Что меняем
Заменяю иконочные «кружки-плейсхолдеры» на реалистичные фотографии в hero-блоках 4 индексных страниц + 27 внутренних (15 районов + 12 вредителей). Итого **~31 фото**, генерация через Nano banana (`google/gemini-2.5-flash-image`).

## Структура фото

| Раздел | Кол-во | Папка | Что на фото |
|---|---|---|---|
| `/rayony` | 1 hero | `public/images/districts/_index.jpg` | Панорама Новосибирска (Бугринский мост / набережная Оби) |
| `/rayon/[slug]` | 15 | `public/images/districts/{slug}.jpg` | Узнаваемый вид района (Центральный — Часовня и Красный пр.; Академгородок — лес и НГУ; Бердск — пляж Обского моря и т.д.) |
| `/vrediteli` | 1 hero | `public/images/pests/_index.jpg` | Нейтральная сцена «специалист с оборудованием в квартире» (без насекомых крупным планом — индекс) |
| `/vreditel/[slug]` | 12 | `public/images/pests/{slug}.jpg` | Реалистичные но **нейтральные** макро-фото вредителей в типичной среде, мягкое освещение, без шок-крупняка (клопы — на ткани матраса, мыши — у плинтуса и т.д.) |
| `/obekty` | 1 hero | `public/images/objects/_index.jpg` | Коллаж/панорама: квартира + офис + склад в одном кадре, чистый интерьер |
| `/uslugi` | 1 hero | `public/images/services/_index.jpg` | Специалист в СИЗ с генератором тумана |

`obekt/[slug]` — **уже есть фото**, не трогаю.

## Технические правки

### 1. Генерация (одноразовый скрипт, не попадает в проект)
- Скопировать `knowledge://skill/ai-gateway/scripts/lovable_ai.py` в `/tmp/lovable_ai.py`
- Запустить пакетный скрипт `/tmp/gen_images.py` который:
  - Для каждого slug формирует промпт на английском (для качества модели) с указанием стиля: «realistic photograph, natural lighting, professional photography, 16:9 horizontal composition»
  - Вызывает `generate_image()` с моделью `google/gemini-2.5-flash-image`
  - Сохраняет PNG в `/tmp/imgs/`, конвертирует через PIL в JPG (качество 85, ~150-300КБ) сразу в `public/images/{districts|pests}/{slug}.jpg`
  - Между запросами `time.sleep(1.5)` чтобы не словить 429

Промпты:
- **Районы**: «Realistic daytime photograph of {district landmark/feature} in Novosibirsk, Russia. Professional editorial photography, natural light, slight depth of field, no people, 16:9.»
- **Вредители**: «Realistic close-up photograph of {pest} in typical urban environment ({habitat}). Soft natural lighting, neutral muted colors, editorial pest control photo, single subject, 16:9. No gore, no shock imagery.»
- **Индексы**: тематические сцены (специалист в СИЗ, городская панорама, интерьеры).

### 2. Расширение data-слоя
**`src/data/districts.ts`**: добавить опциональное поле `heroImage?: string` в `interface District` + проставить путь `/images/districts/{slug}.jpg` для всех 15 районов.

**`src/data/pests.ts`**: добавить опциональное поле `heroImage?: string` в `interface Pest` + проставить путь `/images/pests/{slug}.jpg` для всех 12 вредителей.

### 3. Замена hero-блоков (5 файлов)

Везде один паттерн — заменить «декоративный кружок с иконкой» на:
```tsx
<div className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
  <img src={heroSrc} alt={heroAlt} loading="eager" 
       className="w-full h-64 md:h-80 object-cover" />
</div>
```

Файлы:
- `src/pages/rayon/DistrictPage.tsx` — `district.heroImage ?? '/images/districts/_default.jpg'`
- `src/pages/rayony/Index.tsx` — `/images/districts/_index.jpg`
- `src/pages/vreditel/PestPage.tsx` — `pest.heroImage ?? '/images/pests/_default.jpg'`
- `src/pages/vrediteli/Index.tsx` — `/images/pests/_index.jpg`
- `src/pages/obekty/Index.tsx` — `/images/objects/_index.jpg`

### 4. QA после генерации
- Проверить размер файлов: каждый <500КБ.
- Открыть 3-4 случайных в `code--view` (как изображение) — убедиться, что нет артефактов и контент соответствует.
- Если какое-то фото получилось плохо — перегенерировать индивидуально.

## Что НЕ трогаем
- Страницы `/obekt/[slug]` — фото уже есть.
- Страницы `/usluga/[slug]` — там свой `HeroService` со своими изображениями, не входит в задачу.
- Логика, SEO, маршруты, темы — без изменений.

## Итог
- 31 новый JPG в `public/images/districts/` и `public/images/pests/` + 3 индексных
- 2 data-файла дополнены полем `heroImage`
- 5 страниц переписаны на `<img>` вместо иконок
- Один проход генерации (~3-4 мин) + QA

