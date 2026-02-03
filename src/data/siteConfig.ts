// Центральная конфигурация сайта СЭС "Гордез"

export const SITE_CONFIG = {
  companyName: "Гордез",
  companyNameFull: "ООО «Гордез»",
  legalName: "ООО «Гордез»",
  phone: "+7 (383) 312-16-60",
  phoneClean: "73833121660",
  phoneDisplay: "8 (383) 312-16-60",
  whatsapp: "+79628265020",
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
  
  // Юридические данные (заглушки)
  inn: "5402000000",
  ogrn: "1225400000000",
  
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
