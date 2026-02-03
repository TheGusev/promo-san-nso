
# План: Удаление раздела "Полезные статьи" с главной страницы

## Обоснование

Раздел "Полезные статьи" дублируется:
- На главной странице — компонент `Articles`
- В блоге `/blog` — полноценная страница с фильтрами, поиском и категориями

Блог предоставляет лучший UX для работы со статьями, поэтому дублирование на главной излишне.

---

## Изменения в Index.tsx

1. **Удалить lazy-импорт:**
   ```tsx
   const Articles = lazy(() => import("@/components/Articles"));
   ```

2. **Удалить Suspense + section с Articles:**
   ```tsx
   <Suspense fallback={<div className="h-96" />}>
     <section id="articles">
       <Articles />
     </section>
   </Suspense>
   ```

---

## Новая структура главной страницы

После удаления:

```text
Hero
  ↓
PriceTable
  ↓
Calculator
  ↓
Reviews
  ↓
Services
  ↓
AboutSection
  ↓
FAQ
  ↓
Footer
```

---

## Файлы для изменения

| Файл | Действие |
|------|----------|
| `src/pages/Index.tsx` | Удалить импорт и использование `Articles` |

**Примечание:** Файл `src/components/Articles.tsx` сохраняется — он может использоваться в других местах или понадобиться позже.
