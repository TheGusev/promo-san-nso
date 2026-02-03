// Центральная конфигурация сайта СЭС «СанРешения»

export const SITE_CONFIG = {
  // Production URL (punycode гордэз.рф)
  siteUrl: "https://xn--d1aey.xn--p1ai",
  
  // Бренд
  companyName: "СанРешения",
  companyNameFull: "ООО «Санитарные Решения»",
  legalName: "ООО «Санитарные Решения»",
  
  // Контакты (офисный телефон для звонков)
  phone: "+7 (383) 312-16-60",
  phoneClean: "73833121660",
  phoneDisplay: "8 (383) 312-16-60",
  
  // Мобильный номер для мессенджеров (WhatsApp)
  whatsapp: "+79628265020",
  whatsappClean: "79628265020",
  
  telegram: "@sanitarnye_resheniya_nsk",
  email: "west-centro@mail.ru",
  address: "Новосибирск",
  addressFull: "г. Новосибирск",
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
  
  // Координаты для карты
  coordinates: {
    lat: 55.0304,
    lng: 82.9204,
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
