// Матрица комбинаций для programmatic-страниц
// ~828 URL для Новосибирска и области

export interface MatrixEntry {
  // Обязательные поля
  serviceSlug: string;
  serviceName: string;
  objectSlug: string;
  objectName: string;
  
  // Опциональные поля
  pestSlug?: string;
  pestName?: string;
  districtSlug?: string;
  districtName?: string;
  
  // SEO
  mainKeyword: string;
  secondaryKeywords: string[];
  
  // Контентные блоки (можно переопределить)
  situationOverride?: string;
  priceFrom?: number;
  guaranteeDays?: number;
}

// Генератор URL на основе комбинации
export const generateComboUrl = (entry: MatrixEntry): string => {
  const parts: string[] = [];
  
  if (entry.pestSlug) parts.push(entry.pestSlug);
  parts.push(entry.objectSlug);
  if (entry.districtSlug) parts.push(entry.districtSlug);
  
  return `/${entry.serviceSlug}/${parts.join("-")}`;
};

// Генератор slug для поиска
export const generateComboSlug = (entry: MatrixEntry): string => {
  const parts: string[] = [];
  if (entry.pestSlug) parts.push(entry.pestSlug);
  parts.push(entry.objectSlug);
  if (entry.districtSlug) parts.push(entry.districtSlug);
  return parts.join("-");
};

// Примеры записей матрицы (расширяемо)
export const PROGRAMMATIC_MATRIX: MatrixEntry[] = [
  // === ДЕЗИНСЕКЦИЯ ===
  
  // Клопы в квартире по районам
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "klopy",
    pestName: "Клопы",
    objectSlug: "kvartira",
    objectName: "квартира",
    districtSlug: "centralny-rayon",
    districtName: "Центральный район",
    mainKeyword: "уничтожение клопов в квартире Центральный район Новосибирск",
    secondaryKeywords: [
      "травить клопов в квартире Центральный район",
      "обработка от клопов квартира центр Новосибирска",
      "вывести клопов Центральный район цена"
    ],
    priceFrom: 2500,
    guaranteeDays: 180,
  },
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "klopy",
    pestName: "Клопы",
    objectSlug: "kvartira",
    objectName: "квартира",
    districtSlug: "leninsky-rayon",
    districtName: "Ленинский район",
    mainKeyword: "уничтожение клопов в квартире Ленинский район",
    secondaryKeywords: [
      "травить клопов Левый берег Новосибирск",
      "обработка квартиры от клопов Ленинский",
      "вызвать СЭС от клопов Ленинский район"
    ],
    priceFrom: 2500,
    guaranteeDays: 180,
  },
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "klopy",
    pestName: "Клопы",
    objectSlug: "kvartira",
    objectName: "квартира",
    districtSlug: "oktyabrsky-rayon",
    districtName: "Октябрьский район",
    mainKeyword: "уничтожение клопов в квартире Октябрьский район",
    secondaryKeywords: [
      "вытравить клопов Октябрьский район Новосибирск",
      "дезинсекция квартиры от клопов Октябрьский",
      "СЭС от клопов Октябрьский район цена"
    ],
    priceFrom: 2500,
    guaranteeDays: 180,
  },
  
  // Клопы в квартире без района
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "klopy",
    pestName: "Клопы",
    objectSlug: "kvartira",
    objectName: "квартира",
    mainKeyword: "уничтожение клопов в квартире Новосибирск",
    secondaryKeywords: [
      "травить клопов в квартире Новосибирск цена",
      "обработка квартиры от клопов СЭС",
      "вывести клопов из квартиры профессионально"
    ],
    priceFrom: 2500,
    guaranteeDays: 180,
  },
  
  // Тараканы в квартире
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "tarakany",
    pestName: "Тараканы",
    objectSlug: "kvartira",
    objectName: "квартира",
    districtSlug: "centralny-rayon",
    districtName: "Центральный район",
    mainKeyword: "уничтожение тараканов в квартире Центральный район",
    secondaryKeywords: [
      "травить тараканов Центральный район Новосибирск",
      "обработка от тараканов квартира центр",
      "вывести тараканов СЭС Центральный район"
    ],
    priceFrom: 2000,
    guaranteeDays: 90,
  },
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "tarakany",
    pestName: "Тараканы",
    objectSlug: "kvartira",
    objectName: "квартира",
    mainKeyword: "уничтожение тараканов в квартире Новосибирск",
    secondaryKeywords: [
      "травить тараканов в квартире цена",
      "обработка квартиры от тараканов СЭС",
      "вывести тараканов профессионально Новосибирск"
    ],
    priceFrom: 2000,
    guaranteeDays: 90,
  },
  
  // Тараканы в ресторане
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "tarakany",
    pestName: "Тараканы",
    objectSlug: "restoran",
    objectName: "ресторан",
    districtSlug: "centralny-rayon",
    districtName: "Центральный район",
    mainKeyword: "уничтожение тараканов в ресторане Центральный район",
    secondaryKeywords: [
      "обработка ресторана от тараканов центр Новосибирска",
      "СЭС для ресторанов Центральный район",
      "дезинсекция общепита от тараканов"
    ],
    priceFrom: 4000,
    guaranteeDays: 60,
  },
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "tarakany",
    pestName: "Тараканы",
    objectSlug: "restoran",
    objectName: "ресторан",
    mainKeyword: "уничтожение тараканов в ресторане Новосибирск",
    secondaryKeywords: [
      "обработка ресторана от тараканов цена",
      "СЭС для ресторанов Новосибирск",
      "дезинсекция кафе от тараканов"
    ],
    priceFrom: 4000,
    guaranteeDays: 60,
  },
  
  // Блохи в квартире
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "blohi",
    pestName: "Блохи",
    objectSlug: "kvartira",
    objectName: "квартира",
    mainKeyword: "уничтожение блох в квартире Новосибирск",
    secondaryKeywords: [
      "обработка квартиры от блох цена",
      "травить блох в квартире СЭС",
      "вывести блох из квартиры профессионально"
    ],
    priceFrom: 2500,
    guaranteeDays: 90,
  },
  
  // Муравьи в квартире
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "muravi",
    pestName: "Муравьи",
    objectSlug: "kvartira",
    objectName: "квартира",
    mainKeyword: "уничтожение муравьёв в квартире Новосибирск",
    secondaryKeywords: [
      "травить муравьёв в квартире цена",
      "обработка от муравьёв СЭС Новосибирск",
      "вывести муравьёв из квартиры"
    ],
    priceFrom: 2000,
    guaranteeDays: 90,
  },
  
  // Муравьи в доме
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "muravi",
    pestName: "Муравьи",
    objectSlug: "dom",
    objectName: "частный дом",
    mainKeyword: "уничтожение муравьёв в частном доме Новосибирск",
    secondaryKeywords: [
      "травить муравьёв в доме цена",
      "обработка дома от муравьёв",
      "вывести садовых муравьёв с участка"
    ],
    priceFrom: 3500,
    guaranteeDays: 90,
  },
  
  // === ДЕРАТИЗАЦИЯ ===
  
  // Крысы на складе
  {
    serviceSlug: "deratizatsiya",
    serviceName: "Дератизация",
    pestSlug: "krysy",
    pestName: "Крысы",
    objectSlug: "sklad",
    objectName: "склад",
    mainKeyword: "уничтожение крыс на складе Новосибирск",
    secondaryKeywords: [
      "дератизация склада от крыс цена",
      "травить крыс на складе профессионально",
      "борьба с крысами на складе"
    ],
    priceFrom: 5000,
    guaranteeDays: 90,
  },
  {
    serviceSlug: "deratizatsiya",
    serviceName: "Дератизация",
    pestSlug: "krysy",
    pestName: "Крысы",
    objectSlug: "sklad",
    objectName: "склад",
    districtSlug: "leninsky-rayon",
    districtName: "Ленинский район",
    mainKeyword: "уничтожение крыс на складе Ленинский район",
    secondaryKeywords: [
      "дератизация склада Левый берег Новосибирск",
      "травить крыс на складе Ленинский район",
      "СЭС от крыс склад Ленинский"
    ],
    priceFrom: 5000,
    guaranteeDays: 90,
  },
  
  // Мыши в доме
  {
    serviceSlug: "deratizatsiya",
    serviceName: "Дератизация",
    pestSlug: "myshi",
    pestName: "Мыши",
    objectSlug: "dom",
    objectName: "частный дом",
    mainKeyword: "уничтожение мышей в частном доме Новосибирск",
    secondaryKeywords: [
      "травить мышей в доме цена",
      "дератизация частного дома от мышей",
      "вывести мышей из дома профессионально"
    ],
    priceFrom: 3500,
    guaranteeDays: 120,
  },
  {
    serviceSlug: "deratizatsiya",
    serviceName: "Дератизация",
    pestSlug: "myshi",
    pestName: "Мыши",
    objectSlug: "dom",
    objectName: "частный дом",
    districtSlug: "sovetsky-rayon",
    districtName: "Советский район",
    mainKeyword: "уничтожение мышей в частном доме Академгородок",
    secondaryKeywords: [
      "травить мышей Советский район",
      "дератизация дома Академгородок",
      "борьба с мышами Советский район Новосибирск"
    ],
    priceFrom: 3500,
    guaranteeDays: 120,
  },
  
  // Мыши в квартире
  {
    serviceSlug: "deratizatsiya",
    serviceName: "Дератизация",
    pestSlug: "myshi",
    pestName: "Мыши",
    objectSlug: "kvartira",
    objectName: "квартира",
    mainKeyword: "уничтожение мышей в квартире Новосибирск",
    secondaryKeywords: [
      "травить мышей в квартире цена",
      "дератизация квартиры от мышей",
      "мыши в квартире что делать Новосибирск"
    ],
    priceFrom: 2500,
    guaranteeDays: 90,
  },
  
  // === ДЕЗИНФЕКЦИЯ ===
  
  // Дезинфекция квартиры
  {
    serviceSlug: "dezinfeksiya",
    serviceName: "Дезинфекция",
    objectSlug: "kvartira",
    objectName: "квартира",
    mainKeyword: "дезинфекция квартиры Новосибирск",
    secondaryKeywords: [
      "обеззараживание квартиры цена",
      "дезинфекция квартиры после ремонта",
      "санитарная обработка квартиры СЭС"
    ],
    priceFrom: 3000,
    guaranteeDays: 30,
  },
  {
    serviceSlug: "dezinfeksiya",
    serviceName: "Дезинфекция",
    objectSlug: "kvartira",
    objectName: "квартира",
    districtSlug: "centralny-rayon",
    districtName: "Центральный район",
    mainKeyword: "дезинфекция квартиры Центральный район Новосибирск",
    secondaryKeywords: [
      "обеззараживание квартиры центр города",
      "дезинфекция после ремонта Центральный район",
      "санитарная обработка квартиры центр"
    ],
    priceFrom: 3000,
    guaranteeDays: 30,
  },
  
  // Дезинфекция офиса
  {
    serviceSlug: "dezinfeksiya",
    serviceName: "Дезинфекция",
    objectSlug: "ofis",
    objectName: "офис",
    mainKeyword: "дезинфекция офиса Новосибирск",
    secondaryKeywords: [
      "санитарная обработка офиса цена",
      "дезинфекция офисных помещений",
      "обеззараживание офиса после болезни"
    ],
    priceFrom: 4000,
    guaranteeDays: 30,
  },
  
  // Дезинфекция ресторана
  {
    serviceSlug: "dezinfeksiya",
    serviceName: "Дезинфекция",
    objectSlug: "restoran",
    objectName: "ресторан",
    mainKeyword: "дезинфекция ресторана Новосибирск",
    secondaryKeywords: [
      "санитарная обработка ресторана",
      "дезинфекция кухни ресторана",
      "обеззараживание общепита СанПиН"
    ],
    priceFrom: 5000,
    guaranteeDays: 30,
  },
  
  // === БЕЗ ВРЕДИТЕЛЯ (услуга × объект × район) ===
  
  // Дезинсекция квартиры по районам
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    objectSlug: "kvartira",
    objectName: "квартира",
    districtSlug: "centralny-rayon",
    districtName: "Центральный район",
    mainKeyword: "дезинсекция квартиры Центральный район Новосибирск",
    secondaryKeywords: [
      "обработка квартиры от насекомых центр",
      "вызвать СЭС в квартиру Центральный район",
      "уничтожение насекомых в квартире центр"
    ],
    priceFrom: 2500,
    guaranteeDays: 90,
  },
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    objectSlug: "kvartira",
    objectName: "квартира",
    districtSlug: "leninsky-rayon",
    districtName: "Ленинский район",
    mainKeyword: "дезинсекция квартиры Ленинский район",
    secondaryKeywords: [
      "обработка квартиры от насекомых Левый берег",
      "СЭС в квартиру Ленинский район",
      "уничтожение насекомых Ленинский район"
    ],
    priceFrom: 2500,
    guaranteeDays: 90,
  },
  
  // Дератизация дома по районам
  {
    serviceSlug: "deratizatsiya",
    serviceName: "Дератизация",
    objectSlug: "dom",
    objectName: "частный дом",
    districtSlug: "berdsk",
    districtName: "Бердск",
    mainKeyword: "дератизация частного дома Бердск",
    secondaryKeywords: [
      "уничтожение грызунов в доме Бердск",
      "СЭС от крыс и мышей Бердск",
      "обработка дома от грызунов Бердск цена"
    ],
    priceFrom: 4000,
    guaranteeDays: 120,
  },
  
  // === КЛЕЩИ (сезонная услуга) ===
  
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "kleshchi",
    pestName: "Клещи",
    objectSlug: "uchastok",
    objectName: "участок",
    mainKeyword: "обработка участка от клещей Новосибирск",
    secondaryKeywords: [
      "акарицидная обработка участка цена",
      "травить клещей на даче Новосибирск",
      "опрыскивание от клещей участок"
    ],
    priceFrom: 3000,
    guaranteeDays: 60,
  },
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "kleshchi",
    pestName: "Клещи",
    objectSlug: "uchastok",
    objectName: "участок",
    districtSlug: "sovetsky-rayon",
    districtName: "Советский район",
    mainKeyword: "обработка участка от клещей Академгородок",
    secondaryKeywords: [
      "акарицидная обработка Советский район",
      "травить клещей на участке Академгородок",
      "обработка от клещей дача Советский район"
    ],
    priceFrom: 3000,
    guaranteeDays: 60,
  },
  {
    serviceSlug: "dezinseksiya",
    serviceName: "Дезинсекция",
    pestSlug: "kleshchi",
    pestName: "Клещи",
    objectSlug: "uchastok",
    objectName: "участок",
    districtSlug: "berdsk",
    districtName: "Бердск",
    mainKeyword: "обработка участка от клещей Бердск",
    secondaryKeywords: [
      "акарицидная обработка дачи Бердск",
      "травить клещей Обское море",
      "обработка от клещей Бердск цена"
    ],
    priceFrom: 3000,
    guaranteeDays: 60,
  },
  
  // === ОЗОНИРОВАНИЕ ===
  
  {
    serviceSlug: "ozonirovanie",
    serviceName: "Озонирование",
    objectSlug: "kvartira",
    objectName: "квартира",
    mainKeyword: "озонирование квартиры Новосибирск",
    secondaryKeywords: [
      "озонирование воздуха в квартире цена",
      "удаление запахов озоном квартира",
      "озонирование после ремонта квартира"
    ],
    priceFrom: 2500,
    guaranteeDays: 30,
  },
  {
    serviceSlug: "ozonirovanie",
    serviceName: "Озонирование",
    objectSlug: "avtomobil",
    objectName: "автомобиль",
    mainKeyword: "озонирование автомобиля Новосибирск",
    secondaryKeywords: [
      "озонирование салона авто цена",
      "удаление запахов в машине озоном",
      "озонирование авто после курения"
    ],
    priceFrom: 1500,
    guaranteeDays: 30,
  },
  
  // === ДЕЗОДОРАЦИЯ ===
  
  {
    serviceSlug: "dezodoratsiya",
    serviceName: "Дезодорация",
    objectSlug: "kvartira",
    objectName: "квартира",
    mainKeyword: "удаление запахов в квартире Новосибирск",
    secondaryKeywords: [
      "дезодорация квартиры цена",
      "убрать запах в квартире профессионально",
      "удаление трупного запаха квартира"
    ],
    priceFrom: 4000,
    guaranteeDays: 30,
  },
  {
    serviceSlug: "dezodoratsiya",
    serviceName: "Дезодорация",
    objectSlug: "dom",
    objectName: "частный дом",
    mainKeyword: "удаление запахов в частном доме Новосибирск",
    secondaryKeywords: [
      "дезодорация дома цена",
      "убрать запах в доме после пожара",
      "удаление запаха плесени в доме"
    ],
    priceFrom: 5000,
    guaranteeDays: 30,
  },
];

// Поиск записи по комбинации slug
export const getMatrixEntry = (
  serviceSlug: string,
  comboSlug: string
): MatrixEntry | undefined => {
  return PROGRAMMATIC_MATRIX.find((entry) => {
    if (entry.serviceSlug !== serviceSlug) return false;
    return generateComboSlug(entry) === comboSlug;
  });
};

// Получить все записи для услуги
export const getMatrixEntriesForService = (serviceSlug: string): MatrixEntry[] => {
  return PROGRAMMATIC_MATRIX.filter((entry) => entry.serviceSlug === serviceSlug);
};

// Получить все уникальные комбинации (для sitemap)
export const getAllMatrixUrls = (): string[] => {
  return PROGRAMMATIC_MATRIX.map((entry) => generateComboUrl(entry));
};
