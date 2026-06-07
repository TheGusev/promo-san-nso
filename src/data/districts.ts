// Массив районов Новосибирска и области для автогенерации страниц
// Добавляйте новые районы сюда — страницы создадутся автоматически

export type DistrictType = "city" | "suburb" | "region";

export interface District {
  slug: string;
  name: string;
  nameGenitive: string; // родительный падеж
  nameLocative: string; // предложный падеж (в районе)
  description: string;
  metaTitle: string;
  metaDescription: string;
  type: DistrictType;
  responseTime: string; // время выезда
  order: number;
  isPopular: boolean;
  heroImage?: string; // путь к hero-фото района
}

export const districts: District[] = [
  // Районы города Новосибирска
  {
    slug: "centralny-rayon",
    name: "Центральный район",
    nameGenitive: "Центрального района",
    nameLocative: "Центральном районе",
    description: "Исторический центр Новосибирска.",
    metaTitle: "СЭС в Центральном районе Новосибирска | Санитарные Решения",
    metaDescription: "Вызов СЭС в Центральном районе Новосибирска. Выезд за 30 минут. Уничтожение клопов, тараканов, грызунов.",
    type: "city",
    responseTime: "30-60 мин",
    order: 1,
    isPopular: true,
    heroImage: "/images/districts/centralny-rayon.jpg",
  },
  {
    slug: "zheleznodorozhny-rayon",
    name: "Железнодорожный район",
    nameGenitive: "Железнодорожного района",
    nameLocative: "Железнодорожном районе",
    description: "Район вокзала Новосибирск-Главный.",
    metaTitle: "СЭС в Железнодорожном районе Новосибирска | Санитарные Решения",
    metaDescription: "Вызов СЭС в Железнодорожном районе. Быстрый выезд. Дезинсекция, дератизация.",
    type: "city",
    responseTime: "30-60 мин",
    order: 2,
    isPopular: true,
    heroImage: "/images/districts/zheleznodorozhny-rayon.jpg",
  },
  {
    slug: "zaeltsovsky-rayon",
    name: "Заельцовский район",
    nameGenitive: "Заельцовского района",
    nameLocative: "Заельцовском районе",
    description: "Северная часть города с парком.",
    metaTitle: "СЭС в Заельцовском районе Новосибирска | Санитарные Решения",
    metaDescription: "СЭС Заельцовский район. Обработка квартир, домов от вредителей. Выезд 24/7.",
    type: "city",
    responseTime: "40-70 мин",
    order: 3,
    isPopular: false,
    heroImage: "/images/districts/zaeltsovsky-rayon.jpg",
  },
  {
    slug: "kalininsky-rayon",
    name: "Калининский район",
    nameGenitive: "Калининского района",
    nameLocative: "Калининском районе",
    description: "Крупный жилой район на правом берегу.",
    metaTitle: "СЭС в Калининском районе Новосибирска | Санитарные Решения",
    metaDescription: "Вызов СЭС в Калининском районе Новосибирска. Уничтожение вредителей с гарантией.",
    type: "city",
    responseTime: "40-70 мин",
    order: 4,
    isPopular: false,
    heroImage: "/images/districts/kalininsky-rayon.jpg",
  },
  {
    slug: "kirovsky-rayon",
    name: "Кировский район",
    nameGenitive: "Кировского района",
    nameLocative: "Кировском районе",
    description: "Левобережный район города.",
    metaTitle: "СЭС в Кировском районе Новосибирска | Санитарные Решения",
    metaDescription: "СЭС Кировский район. Дезинсекция, дератизация. Работаем круглосуточно.",
    type: "city",
    responseTime: "40-70 мин",
    order: 5,
    isPopular: false,
    heroImage: "/images/districts/kirovsky-rayon.jpg",
  },
  {
    slug: "leninsky-rayon",
    name: "Ленинский район",
    nameGenitive: "Ленинского района",
    nameLocative: "Ленинском районе",
    description: "Крупнейший район на левом берегу.",
    metaTitle: "СЭС в Ленинском районе Новосибирска | Санитарные Решения",
    metaDescription: "Вызов СЭС в Ленинском районе. Обработка от клопов, тараканов, крыс.",
    type: "city",
    responseTime: "40-70 мин",
    order: 6,
    isPopular: true,
    heroImage: "/images/districts/leninsky-rayon.jpg",
  },
  {
    slug: "oktyabrsky-rayon",
    name: "Октябрьский район",
    nameGenitive: "Октябрьского района",
    nameLocative: "Октябрьском районе",
    description: "Район с развитой инфраструктурой.",
    metaTitle: "СЭС в Октябрьском районе Новосибирска | Санитарные Решения",
    metaDescription: "СЭС Октябрьский район Новосибирска. Профессиональная обработка помещений.",
    type: "city",
    responseTime: "30-60 мин",
    order: 7,
    isPopular: true,
    heroImage: "/images/districts/oktyabrsky-rayon.jpg",
  },
  {
    slug: "pervomaysky-rayon",
    name: "Первомайский район",
    nameGenitive: "Первомайского района",
    nameLocative: "Первомайском районе",
    description: "Левобережный район с частным сектором.",
    metaTitle: "СЭС в Первомайском районе Новосибирска | Санитарные Решения",
    metaDescription: "Вызов СЭС в Первомайском районе. Обработка квартир и домов.",
    type: "city",
    responseTime: "50-80 мин",
    order: 8,
    isPopular: false,
    heroImage: "/images/districts/pervomaysky-rayon.jpg",
  },
  {
    slug: "sovetsky-rayon",
    name: "Советский район",
    nameGenitive: "Советского района",
    nameLocative: "Советском районе",
    description: "Академгородок и окрестности.",
    metaTitle: "СЭС в Советском районе (Академгородок) | Санитарные Решения",
    metaDescription: "СЭС Советский район, Академгородок. Выезд в день обращения.",
    type: "city",
    responseTime: "60-90 мин",
    order: 9,
    isPopular: true,
    heroImage: "/images/districts/sovetsky-rayon.jpg",
  },
  {
    slug: "dzerzhinsky-rayon",
    name: "Дзержинский район",
    nameGenitive: "Дзержинского района",
    nameLocative: "Дзержинском районе",
    description: "Левобережный промышленный район.",
    metaTitle: "СЭС в Дзержинском районе Новосибирска | Санитарные Решения",
    metaDescription: "Вызов СЭС в Дзержинском районе. Обработка складов, производств, жилья.",
    type: "city",
    responseTime: "40-70 мин",
    order: 10,
    isPopular: false,
    heroImage: "/images/districts/dzerzhinsky-rayon.jpg",
  },
  
  // Пригороды
  {
    slug: "berdsk",
    name: "Бердск",
    nameGenitive: "Бердска",
    nameLocative: "Бердске",
    description: "Город-спутник Новосибирска.",
    metaTitle: "СЭС в Бердске | Санитарные Решения",
    metaDescription: "Вызов СЭС в Бердске. Уничтожение вредителей в квартирах, домах, на предприятиях.",
    type: "suburb",
    responseTime: "60-90 мин",
    order: 11,
    isPopular: true,
    heroImage: "/images/districts/berdsk.jpg",
  },
  {
    slug: "iskitim",
    name: "Искитим",
    nameGenitive: "Искитима",
    nameLocative: "Искитиме",
    description: "Город в Новосибирской области.",
    metaTitle: "СЭС в Искитиме | Санитарные Решения",
    metaDescription: "Вызов СЭС в Искитиме. Профессиональная дезинсекция и дератизация.",
    type: "suburb",
    responseTime: "90-120 мин",
    order: 12,
    isPopular: false,
    heroImage: "/images/districts/iskitim.jpg",
  },
  {
    slug: "ob",
    name: "Обь",
    nameGenitive: "Оби",
    nameLocative: "Оби",
    description: "Город рядом с аэропортом Толмачёво.",
    metaTitle: "СЭС в городе Обь | Санитарные Решения",
    metaDescription: "СЭС город Обь. Обработка от вредителей. Выезд в день обращения.",
    type: "suburb",
    responseTime: "60-90 мин",
    order: 13,
    isPopular: false,
    heroImage: "/images/districts/ob.jpg",
  },
  {
    slug: "krasnoobsk",
    name: "Краснообск",
    nameGenitive: "Краснообска",
    nameLocative: "Краснообске",
    description: "Посёлок рядом с Новосибирском.",
    metaTitle: "СЭС в Краснообске | Санитарные Решения",
    metaDescription: "Вызов СЭС в Краснообске. Обработка квартир, домов, участков.",
    type: "suburb",
    responseTime: "50-80 мин",
    order: 14,
    isPopular: false,
    heroImage: "/images/districts/krasnoobsk.jpg",
  },
  
  // Новосибирская область
  {
    slug: "novosibirskaya-oblast",
    name: "Новосибирская область",
    nameGenitive: "Новосибирской области",
    nameLocative: "Новосибирской области",
    description: "Выезд по всей Новосибирской области.",
    metaTitle: "СЭС по Новосибирской области | Санитарные Решения",
    metaDescription: "Выезд СЭС по Новосибирской области. Обработка от вредителей в любом населённом пункте.",
    type: "region",
    responseTime: "по договорённости",
    order: 15,
    isPopular: true,
    heroImage: "/images/districts/novosibirskaya-oblast.jpg",
  },
];

// Вспомогательные функции
export const getDistrictBySlug = (slug: string): District | undefined => {
  return districts.find((d) => d.slug === slug);
};

export const getDistrictsByType = (type: DistrictType): District[] => {
  return districts.filter((d) => d.type === type).sort((a, b) => a.order - b.order);
};

export const getPopularDistricts = (): District[] => {
  return districts.filter((d) => d.isPopular).sort((a, b) => a.order - b.order);
};

export const getAllDistricts = (): District[] => {
  return districts.sort((a, b) => a.order - b.order);
};

export const getCityDistricts = (): District[] => getDistrictsByType("city");
export const getSuburbDistricts = (): District[] => getDistrictsByType("suburb");
export const getRegionDistricts = (): District[] => getDistrictsByType("region");
