// Массив типов объектов для автогенерации страниц
// Добавляйте новые типы объектов сюда — страницы создадутся автоматически

export type ObjectCategory = "residential" | "commercial" | "industrial" | "public";

export interface ObjectType {
  slug: string;
  name: string;
  nameGenitive: string; // родительный падеж для SEO
  namePlural: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  category: ObjectCategory;
  relatedServices: string[]; // slugs услуг
  order: number;
  isPopular: boolean;
}

export const objects: ObjectType[] = [
  // Жилые объекты
  {
    slug: "kvartira",
    name: "Квартира",
    nameGenitive: "квартиры",
    namePlural: "квартир",
    description: "Обработка квартир любой площади от вредителей.",
    metaTitle: "Обработка квартиры от вредителей в Новосибирске | Гордез",
    metaDescription: "Профессиональная обработка квартир в Новосибирске. Уничтожение клопов, тараканов, блох. Безопасно для детей и животных.",
    category: "residential",
    relatedServices: ["dezinseksiya", "dezinfeksiya", "deratizatsiya"],
    order: 1,
    isPopular: true,
  },
  {
    slug: "dom",
    name: "Частный дом",
    nameGenitive: "частного дома",
    namePlural: "частных домов",
    description: "Комплексная обработка частных домов и коттеджей.",
    metaTitle: "Обработка частного дома от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция и дератизация частных домов в Новосибирске. Обработка дома, участка, подвала.",
    category: "residential",
    relatedServices: ["dezinseksiya", "dezinfeksiya", "deratizatsiya"],
    order: 2,
    isPopular: true,
  },
  {
    slug: "dacha",
    name: "Дача",
    nameGenitive: "дачи",
    namePlural: "дач",
    description: "Сезонная и круглогодичная обработка дачных участков.",
    metaTitle: "Обработка дачи от вредителей в Новосибирске | Гордез",
    metaDescription: "Обработка дачных участков от клещей, комаров, грызунов в Новосибирске. Подготовка к сезону.",
    category: "residential",
    relatedServices: ["dezinseksiya", "deratizatsiya"],
    order: 3,
    isPopular: false,
  },
  {
    slug: "obshezhitie",
    name: "Общежитие",
    nameGenitive: "общежития",
    namePlural: "общежитий",
    description: "Обработка общежитий с учётом специфики проживания.",
    metaTitle: "Обработка общежития от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция общежитий в Новосибирске. Уничтожение клопов, тараканов. Договор на обслуживание.",
    category: "residential",
    relatedServices: ["dezinseksiya", "dezinfeksiya"],
    order: 4,
    isPopular: false,
  },
  
  // Коммерческие объекты
  {
    slug: "ofis",
    name: "Офис",
    nameGenitive: "офиса",
    namePlural: "офисов",
    description: "Обработка офисных помещений без прерывания работы.",
    metaTitle: "Обработка офиса от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция офисов в Новосибирске. Работаем в нерабочее время. Договор, акты для бухгалтерии.",
    category: "commercial",
    relatedServices: ["dezinseksiya", "dezinfeksiya", "deratizatsiya"],
    order: 5,
    isPopular: true,
  },
  {
    slug: "restoran",
    name: "Ресторан",
    nameGenitive: "ресторана",
    namePlural: "ресторанов",
    description: "Обработка ресторанов с соблюдением санитарных норм.",
    metaTitle: "Обработка ресторана от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция ресторанов и кафе в Новосибирске. Соответствие СанПиН. Документы для Роспотребнадзора.",
    category: "commercial",
    relatedServices: ["dezinseksiya", "dezinfeksiya", "deratizatsiya", "sertifikatsiya"],
    order: 6,
    isPopular: true,
  },
  {
    slug: "kafe",
    name: "Кафе",
    nameGenitive: "кафе",
    namePlural: "кафе",
    description: "Профессиональная обработка кафе и столовых.",
    metaTitle: "Обработка кафе от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция кафе в Новосибирске. Уничтожение тараканов, мух. Акты для проверок.",
    category: "commercial",
    relatedServices: ["dezinseksiya", "dezinfeksiya", "deratizatsiya"],
    order: 7,
    isPopular: false,
  },
  {
    slug: "magazin",
    name: "Магазин",
    nameGenitive: "магазина",
    namePlural: "магазинов",
    description: "Обработка продуктовых и непродовольственных магазинов.",
    metaTitle: "Обработка магазина от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция магазинов в Новосибирске. Защита от грызунов и насекомых. Документация СЭС.",
    category: "commercial",
    relatedServices: ["dezinseksiya", "deratizatsiya"],
    order: 8,
    isPopular: false,
  },
  {
    slug: "gostinitsa",
    name: "Гостиница",
    nameGenitive: "гостиницы",
    namePlural: "гостиниц",
    description: "Обработка гостиниц и хостелов от клопов и вредителей.",
    metaTitle: "Обработка гостиницы от клопов в Новосибирске | Гордез",
    metaDescription: "Дезинсекция гостиниц в Новосибирске. Уничтожение клопов в номерах. Договор обслуживания.",
    category: "commercial",
    relatedServices: ["dezinseksiya", "dezinfeksiya"],
    order: 9,
    isPopular: false,
  },
  
  // Промышленные объекты
  {
    slug: "sklad",
    name: "Склад",
    nameGenitive: "склада",
    namePlural: "складов",
    description: "Обработка складских помещений любой площади.",
    metaTitle: "Обработка склада от вредителей в Новосибирске | Гордез",
    metaDescription: "Дератизация и дезинсекция складов в Новосибирске. Защита продукции от грызунов и насекомых.",
    category: "industrial",
    relatedServices: ["dezinseksiya", "deratizatsiya"],
    order: 10,
    isPopular: true,
  },
  {
    slug: "proizvodstvo",
    name: "Производство",
    nameGenitive: "производства",
    namePlural: "производств",
    description: "Обработка производственных цехов и предприятий.",
    metaTitle: "Обработка производства от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция производственных помещений в Новосибирске. Соответствие ХАССП, документация.",
    category: "industrial",
    relatedServices: ["dezinseksiya", "deratizatsiya", "dezinfeksiya", "sertifikatsiya"],
    order: 11,
    isPopular: false,
  },
  
  // Общественные объекты
  {
    slug: "detskiy-sad",
    name: "Детский сад",
    nameGenitive: "детского сада",
    namePlural: "детских садов",
    description: "Безопасная обработка детских учреждений.",
    metaTitle: "Обработка детского сада от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция детских садов в Новосибирске. Безопасные препараты. Документы для проверок.",
    category: "public",
    relatedServices: ["dezinseksiya", "dezinfeksiya"],
    order: 12,
    isPopular: false,
  },
  {
    slug: "shkola",
    name: "Школа",
    nameGenitive: "школы",
    namePlural: "школ",
    description: "Обработка школ и образовательных учреждений.",
    metaTitle: "Обработка школы от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинсекция школ в Новосибирске. Работа в каникулы. Безопасно для детей.",
    category: "public",
    relatedServices: ["dezinseksiya", "dezinfeksiya"],
    order: 13,
    isPopular: false,
  },
  {
    slug: "bolnitsa",
    name: "Больница",
    nameGenitive: "больницы",
    namePlural: "больниц",
    description: "Обработка медицинских учреждений по стандартам.",
    metaTitle: "Обработка больницы от вредителей в Новосибирске | Гордез",
    metaDescription: "Дезинфекция и дезинсекция больниц в Новосибирске. Соответствие СанПиН для медучреждений.",
    category: "public",
    relatedServices: ["dezinfeksiya", "dezinseksiya"],
    order: 14,
    isPopular: false,
  },
];

// Вспомогательные функции
export const getObjectBySlug = (slug: string): ObjectType | undefined => {
  return objects.find((o) => o.slug === slug);
};

export const getObjectsByCategory = (category: ObjectCategory): ObjectType[] => {
  return objects.filter((o) => o.category === category).sort((a, b) => a.order - b.order);
};

export const getPopularObjects = (): ObjectType[] => {
  return objects.filter((o) => o.isPopular).sort((a, b) => a.order - b.order);
};

export const getAllObjects = (): ObjectType[] => {
  return objects.sort((a, b) => a.order - b.order);
};

export const getResidentialObjects = (): ObjectType[] => getObjectsByCategory("residential");
export const getCommercialObjects = (): ObjectType[] => getObjectsByCategory("commercial");
export const getIndustrialObjects = (): ObjectType[] => getObjectsByCategory("industrial");
export const getPublicObjects = (): ObjectType[] => getObjectsByCategory("public");
