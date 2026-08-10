// Центральная конфигурация сайта СЭС «Санитарные Решения»

export const SITE_CONFIG = {
  // Production URL (punycode гордэз.рф)
  siteUrl: "https://xn--c1acj0ak3f.xn--p1ai",
  
  // Бренд
  companyName: "Санитарные Решения",
  companyNameFull: "ООО «Санитарные Решения»",
  legalName: "ООО «Санитарные Решения»",
  description: "СЭС служба в Новосибирске: дезинсекция, дератизация и дезинфекция квартир, домов и объектов бизнеса.",
  
  // Контакты (офисный телефон для звонков)
  phone: "+7 (999) 450-16-31",
  phoneClean: "+79994501631",
  phoneDisplay: "8 (999) 450-16-31",
  phoneTel: "+7-999-450-16-31", // для schema.org
  
  // MAX мессенджер
  max: "MAX",
  
  telegram: "@sanitarnye_resheniya_nsk",
  email: "west-centro@mail.ru",
  
  // Адрес (полная структура для Schema.org)
  address: {
    streetAddress: "ул. Державина, 28",
    city: "Новосибирск",
    region: "Новосибирская область",
    postalCode: "630005",
    country: "RU",
  },
  addressShort: "Новосибирск",
  addressFull: "г. Новосибирск, ул. Державина, 28",
  
  workingHours: "24/7",
  workingHoursText: "Работаем круглосуточно",
  
  // SEO
  region: "Новосибирск",
  regionGenitive: "Новосибирска",
  regionPrepositional: "Новосибирске",
  regionFull: "Новосибирску и Новосибирской области",
  
  // Юридические данные
  inn: "5410169338",
  ogrn: "1255400030555",
  
  // Социальные сети и ссылки
  links: {
    twoGis: "https://go.2gis.com/oSzHM",
    max: "https://max.ru/u/f9LHodD0cOLiUyWa_VfefOTALeW3UZQoPjKtoCWCRfLLAk0QxvTZkWtg2Kc",
    telegram: "https://t.me/sanitarnye_resheniya_nsk",
  },
  
  // Координаты для карты (Schema.org GeoCoordinates)
  coordinates: {
    latitude: 55.0302,
    longitude: 82.9274,
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
