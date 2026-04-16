

# Замена WhatsApp на MAX (VK Teams)

## Что делаем
Убираем WhatsApp со всего сайта и заменяем на MAX с ссылкой `https://max.ru/u/f9LHodD0cOLpbsvDSn1NINA4hi9531hIqb1SAy6xUzvVnOUhOCvyXk9AG0w`.

## Файлы для изменения (6 файлов)

### 1. `src/data/siteConfig.ts`
- Удалить `whatsapp`, `whatsappClean`
- Заменить `links.whatsapp` на `links.max` с новой ссылкой

### 2. `src/components/FloatingContact.tsx`
- Заменить кнопку WhatsApp на MAX (иконка MAX, синий цвет #0077FF)
- Переименовать `handleWhatsApp` → `handleMax`, событие → `max_click`

### 3. `src/components/layout/SiteFooter.tsx` (строки 103-113)
- Заменить иконку и ссылку WhatsApp на MAX

### 4. `src/components/FAQ.tsx` (строка 24)
- Заменить текст "в WhatsApp" → "в MAX"

### 5. `src/data/faqData.ts` (строки 823, 872)
- Заменить упоминания WhatsApp → MAX в текстах FAQ

### 6. `src/components/Footer.tsx`
- Проверить и убрать WhatsApp если есть (используется на некоторых страницах)

## Иконка MAX
Будет использована стилизованная буква "M" или текст "MAX" в круглой кнопке с фирменным синим цветом (#0077FF).

