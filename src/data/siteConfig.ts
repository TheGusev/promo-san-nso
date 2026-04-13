// Центральная конфигурация сайта СЭС «СанРешения»

export const SITE_CONFIG = {
  // Production URL (punycode гордэз.рф)
  siteUrl: "https://xn--c1acj0ak3f.xn--p1ai",
  
  // Бренд
  companyName: "СанРешения",
  companyNameFull: "ООО «Санитарные Решения»",
  legalName: "ООО «Санитарные Решения»",
  description: "СЭС служба в Новосибирске: дезинсекция, дератизация и дезинфекция квартир, домов и объектов бизнеса.",
  
  // Контакты (офисный телефон для звонков)
  phone: "+7 (383) 312-23-30",
  phoneClean: "+73833122330",
  phoneDisplay: "8 (383) 312-23-30",
  phoneTel: "+7-383-312-23-30", // для schema.org
  
  // Мобильный номер для мессенджеров (WhatsApp)
  whatsapp: "+79628265020",
  whatsappClean: "79628265020",
  
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
  regionFull: "Новосибирск и Новосибирская область",
  
  // Юридические данные
  inn: "5410169338",
  ogrn: "1255400030555",
  
  // Социальные сети и ссылки
  links: {
    twoGis: "https://go.2gis.com/oSzHM",
    whatsapp: "https://wa.me/79628265020",
    telegram: "https://t.me/sanitarnye_resheniya_nsk",
  },
  
  // Координаты для карты (Schema.org GeoCoordinates)
  coordinates: {
    latitude: 55.0302,
    longitude: 82.9274,
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
