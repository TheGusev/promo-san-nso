// Массив вредителей для автогенерации страниц
// Добавляйте новых вредителей сюда — страницы создадутся автоматически

export type PestCategory = "insects" | "rodents" | "other";

export interface Pest {
  slug: string;
  name: string;
  namePlural: string;
  nameGenitive: string; // родительный падеж для SEO
  description: string;
  metaTitle: string;
  metaDescription: string;
  category: PestCategory;
  relatedServices: string[]; // slugs услуг
  order: number;
  isPopular: boolean;
  heroImage?: string; // путь к hero-фото вредителя
}

export const pests: Pest[] = [
  // Насекомые
  {
    slug: "klopy",
    name: "Клопы",
    namePlural: "клопов",
    nameGenitive: "клопов",
    description: "Постельные клопы — кровососущие насекомые, активные ночью.",
    metaTitle: "Уничтожение клопов в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Профессиональное уничтожение клопов в Новосибирске. Обработка квартир, домов, гостиниц. Гарантия результата до 1 года.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 1,
    isPopular: true,
    heroImage: "/images/pests/klopy.jpg",
  },
  {
    slug: "tarakany",
    name: "Тараканы",
    namePlural: "тараканов",
    nameGenitive: "тараканов",
    description: "Рыжие и чёрные тараканы — переносчики инфекций.",
    metaTitle: "Уничтожение тараканов в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Травля тараканов в Новосибирске. Профессиональная дезинсекция квартир, кафе, ресторанов. Работаем 24/7.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 2,
    isPopular: true,
    heroImage: "/images/pests/tarakany.jpg",
  },
  {
    slug: "blohi",
    name: "Блохи",
    namePlural: "блох",
    nameGenitive: "блох",
    description: "Блохи — паразиты, кусающие людей и животных.",
    metaTitle: "Уничтожение блох в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Обработка от блох в Новосибирске. Уничтожение блох в квартирах, подвалах, частных домах. Безопасно для животных.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 3,
    isPopular: true,
    heroImage: "/images/pests/blohi.jpg",
  },
  {
    slug: "muravi",
    name: "Муравьи",
    namePlural: "муравьёв",
    nameGenitive: "муравьёв",
    description: "Домовые муравьи — портят продукты, создают колонии.",
    metaTitle: "Уничтожение муравьёв в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Избавление от муравьёв в Новосибирске. Обработка квартир, домов, участков. Уничтожение колоний.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 4,
    isPopular: false,
    heroImage: "/images/pests/muravi.jpg",
  },
  {
    slug: "moli",
    name: "Моль",
    namePlural: "моли",
    nameGenitive: "моли",
    description: "Платяная и пищевая моль — портит одежду и продукты.",
    metaTitle: "Уничтожение моли в Новосибирске | СанРешения",
    metaDescription: "Профессиональное уничтожение моли в Новосибирске. Обработка шкафов, складов, квартир.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 5,
    isPopular: false,
    heroImage: "/images/pests/moli.jpg",
  },
  {
    slug: "kozheed",
    name: "Кожеед",
    namePlural: "кожеедов",
    nameGenitive: "кожеедов",
    description: "Жуки-кожееды — повреждают кожу, меха, ткани.",
    metaTitle: "Уничтожение кожеедов в Новосибирске | СанРешения",
    metaDescription: "Обработка от кожеедов в Новосибирске. Защита одежды, мебели, коллекций.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 6,
    isPopular: false,
    heroImage: "/images/pests/kozheed.jpg",
  },
  {
    slug: "osy",
    name: "Осы",
    namePlural: "ос",
    nameGenitive: "ос",
    description: "Осы и шершни — опасны укусами, строят гнёзда.",
    metaTitle: "Уничтожение ос в Новосибирске | СанРешения",
    metaDescription: "Удаление осиных гнёзд в Новосибирске. Безопасная обработка участков, чердаков, балконов.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 7,
    isPopular: false,
    heroImage: "/images/pests/osy.jpg",
  },
  {
    slug: "komary",
    name: "Комары",
    namePlural: "комаров",
    nameGenitive: "комаров",
    description: "Комары — переносчики болезней, мешают отдыху.",
    metaTitle: "Обработка от комаров в Новосибирске | СанРешения",
    metaDescription: "Уничтожение комаров на участках в Новосибирске. Обработка дач, баз отдыха, парков.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 8,
    isPopular: false,
    heroImage: "/images/pests/komary.jpg",
  },
  {
    slug: "kleshchi",
    name: "Клещи",
    namePlural: "клещей",
    nameGenitive: "клещей",
    description: "Иксодовые клещи — переносчики энцефалита и боррелиоза.",
    metaTitle: "Обработка от клещей в Новосибирске | СанРешения",
    metaDescription: "Акарицидная обработка участков от клещей в Новосибирске. Защита дач, парков, детских площадок.",
    category: "insects",
    relatedServices: ["dezinseksiya"],
    order: 9,
    isPopular: true,
    heroImage: "/images/pests/kleshchi.jpg",
  },
  
  // Грызуны
  {
    slug: "krysy",
    name: "Крысы",
    namePlural: "крыс",
    nameGenitive: "крыс",
    description: "Серые и чёрные крысы — опасные переносчики болезней.",
    metaTitle: "Уничтожение крыс в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Профессиональная дератизация в Новосибирске. Уничтожение крыс в подвалах, складах, производствах.",
    category: "rodents",
    relatedServices: ["deratizatsiya"],
    order: 10,
    isPopular: true,
    heroImage: "/images/pests/krysy.jpg",
  },
  {
    slug: "myshi",
    name: "Мыши",
    namePlural: "мышей",
    nameGenitive: "мышей",
    description: "Домовые мыши — портят продукты, провода, утеплитель.",
    metaTitle: "Уничтожение мышей в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Избавление от мышей в Новосибирске. Обработка квартир, домов, складов. Гарантия результата.",
    category: "rodents",
    relatedServices: ["deratizatsiya"],
    order: 11,
    isPopular: true,
    heroImage: "/images/pests/myshi.jpg",
  },
  {
    slug: "kroty",
    name: "Кроты",
    namePlural: "кротов",
    nameGenitive: "кротов",
    description: "Кроты — портят газоны, огороды, корни растений.",
    metaTitle: "Уничтожение кротов в Новосибирске | СанРешения",
    metaDescription: "Избавление от кротов на участке в Новосибирске. Профессиональные методы, гарантия.",
    category: "rodents",
    relatedServices: ["deratizatsiya"],
    order: 12,
    isPopular: false,
    heroImage: "/images/pests/kroty.jpg",
  },
];

// Вспомогательные функции
export const getPestBySlug = (slug: string): Pest | undefined => {
  return pests.find((p) => p.slug === slug);
};

export const getPestsByCategory = (category: PestCategory): Pest[] => {
  return pests.filter((p) => p.category === category).sort((a, b) => a.order - b.order);
};

export const getPopularPests = (): Pest[] => {
  return pests.filter((p) => p.isPopular).sort((a, b) => a.order - b.order);
};

export const getAllPests = (): Pest[] => {
  return pests.sort((a, b) => a.order - b.order);
};

export const getInsects = (): Pest[] => getPestsByCategory("insects");
export const getRodents = (): Pest[] => getPestsByCategory("rodents");
