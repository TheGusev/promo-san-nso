// Новосибирские районы обслуживания

export interface ServiceArea {
  id: string;
  name: string;
  fullName: string;
  available: boolean;
  price: string;
  responseTime?: string;
  center?: [number, number];
  color?: string;
  distance?: string;
}

export const novosibirskDistricts: ServiceArea[] = [
  { 
    id: "central", 
    name: "Центральный", 
    fullName: "Центральный район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "30-60 минут",
    center: [55.0302, 82.9274],
    color: "#4CAF50"
  },
  { 
    id: "zheleznodorozhny", 
    name: "Железнодорожный", 
    fullName: "Железнодорожный район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "30-60 минут",
    center: [55.0415, 82.9191],
    color: "#4CAF50"
  },
  { 
    id: "zaeltsovsky", 
    name: "Заельцовский", 
    fullName: "Заельцовский район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "40-90 минут",
    center: [55.0671, 82.9334],
    color: "#FFC107"
  },
  { 
    id: "kalininsky", 
    name: "Калининский", 
    fullName: "Калининский район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "40-90 минут",
    center: [55.0525, 82.8856],
    color: "#FFC107"
  },
  { 
    id: "kirovsky", 
    name: "Кировский", 
    fullName: "Кировский район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "40-90 минут",
    center: [54.9765, 82.9034],
    color: "#FFC107"
  },
  { 
    id: "leninsky", 
    name: "Ленинский", 
    fullName: "Ленинский район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "40-90 минут",
    center: [54.9898, 82.8834],
    color: "#FFC107"
  },
  { 
    id: "oktyabrsky", 
    name: "Октябрьский", 
    fullName: "Октябрьский район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "40-90 минут",
    center: [54.9876, 82.9512],
    color: "#FFC107"
  },
  { 
    id: "pervomaysky", 
    name: "Первомайский", 
    fullName: "Первомайский район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "40-90 минут",
    center: [54.9634, 82.9812],
    color: "#FFC107"
  },
  { 
    id: "sovetsky", 
    name: "Советский", 
    fullName: "Советский район (Академгородок)", 
    available: true, 
    price: "от 1450₽",
    responseTime: "60-120 минут",
    center: [54.8485, 83.1042],
    color: "#2196F3"
  },
  { 
    id: "dzerzhinsky", 
    name: "Дзержинский", 
    fullName: "Дзержинский район", 
    available: true, 
    price: "от 1200₽",
    responseTime: "40-90 минут",
    center: [54.9765, 83.0234],
    color: "#FFC107"
  }
];

export const novosibirskRegion: ServiceArea[] = [
  { 
    id: "nso_near", 
    name: "Ближнее пригородье", 
    fullName: "Пригород Новосибирска (до 30 км)", 
    available: true, 
    price: "от 1600₽",
    distance: "до 30 км от города",
    responseTime: "1-2 часа"
  },
  { 
    id: "berdsk", 
    name: "Бердск", 
    fullName: "город Бердск", 
    available: true, 
    price: "от 1450₽",
    distance: "35 км",
    responseTime: "1-2 часа"
  },
  { 
    id: "iskitim", 
    name: "Искитим", 
    fullName: "город Искитим", 
    available: true, 
    price: "от 1600₽",
    distance: "60 км",
    responseTime: "2-3 часа"
  },
  { 
    id: "nso_far", 
    name: "Отдалённые районы НСО", 
    fullName: "Районы Новосибирской области", 
    available: true, 
    price: "по запросу",
    distance: "более 60 км",
    responseTime: "по согласованию"
  }
];
