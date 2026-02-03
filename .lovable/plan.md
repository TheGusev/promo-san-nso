
# План: Добавление фоновых изображений к карточкам услуг

## Задача
Добавить 6 загруженных изображений в качестве фона для карточек услуг в компоненте Services.

## Распределение изображений

| Услуга | Изображение | Описание |
|--------|-------------|----------|
| Дезинфекция | c2150189-c74f-4338-b42d-220e84b10f8c.png | Салатовое с каплями |
| Дезинсекция | 9ecb229e-0064-409d-894d-06696f9c259a.png | С вирусами/бактериями |
| Дератизация | d7d768d7-82ea-449d-81d0-a4473a4f3318.png | Со щитами и шестиугольниками |
| Озонирование | 34d25589-5075-42c9-9e8d-7388ab4acb4a.png | С волнами воздуха |
| Дезодорация | 5cc9a6f6-8c10-40e1-8ce2-00a82c26279c.png | Со щитом и волнами |
| Сертификация | 76fcd021-605a-49f0-b727-0a597364be12.png | С документом и галочкой |

## Изменения

### 1. Копирование изображений в проект

Скопировать 6 изображений в папку `public/images/services/`:
- `dezinfeksiya.png` (салатовая)
- `dezinseksiya.png` (с бактериями)
- `deratizatsiya.png` (со щитами)
- `ozonirovanie.png` (с волнами)
- `dezodoratsiya.png` (со щитом)
- `sertifikatsiya.png` (с документом)

### 2. Обновление Services.tsx

Добавить поле `bgImage` в массив услуг:

```tsx
const services = [
  {
    icon: Shield,
    title: "Дезинфекция",
    bgImage: "/images/services/dezinfeksiya.png",
    // ...
  },
  // ...
];
```

Обновить рендер карточки для отображения фона:

```tsx
<Card className="relative overflow-hidden p-6 hover:shadow-elevated transition-all duration-300 h-full">
  {/* Background image */}
  <div 
    className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${service.bgImage})` }}
  />
  {/* Content with relative positioning */}
  <div className="relative z-10">
    {/* ... existing content ... */}
  </div>
</Card>
```

## Технические детали

- Изображения будут полупрозрачными (opacity-30) чтобы текст оставался читаемым
- Контент карточки получит `relative z-10` для отображения поверх фона
- Карточка получит `overflow-hidden` для обрезки фона по границам

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `public/images/services/*.png` | Создать 6 файлов изображений |
| `src/components/Services.tsx` | Добавить поле bgImage и обновить рендер карточек |
