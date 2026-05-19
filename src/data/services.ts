// Массив услуг для автогенерации страниц
// Добавляйте новые услуги сюда — страницы создадутся автоматически

import { 
  Shield, 
  Bug, 
  Rat, 
  Wind, 
  Sparkles, 
  FileCheck,
  Zap,
  Droplets,
  type LucideIcon 
} from "lucide-react";

export interface Service {
  slug: string;
  name: string;
  shortName: string;
  nameGenitive: string;      // "дезинсекции" — для "стоимость дезинсекции"
  nameAccusative: string;    // "дезинсекцию" — для "заказать дезинсекцию"
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: LucideIcon;
  priceFrom: number;
  priceUnit: string;
  category: "main" | "additional";
  order: number;
}

export const services: Service[] = [
  {
    slug: "dezinfeksiya",
    name: "Дезинфекция",
    shortName: "Дезинфекция",
    nameGenitive: "дезинфекции",
    nameAccusative: "дезинфекцию",
    description: "Уничтожение вирусов, бактерий, грибка и плесени. Профессиональная обработка помещений.",
    metaTitle: "Дезинфекция в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Профессиональная дезинфекция помещений в Новосибирске. Уничтожение вирусов, бактерий, грибка. Гарантия результата. Работаем 24/7.",
    icon: Shield,
    priceFrom: 1500,
    priceUnit: "от",
    category: "main",
    order: 1,
  },
  {
    slug: "dezinseksiya",
    name: "Дезинсекция",
    shortName: "Дезинсекция",
    nameGenitive: "дезинсекции",
    nameAccusative: "дезинсекцию",
    description: "Уничтожение насекомых: тараканов, клопов, блох, муравьёв и других вредителей.",
    metaTitle: "Дезинсекция в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Уничтожение насекомых в Новосибирске: тараканы, клопы, блохи, муравьи. Профессиональная обработка с гарантией. Выезд 24/7.",
    icon: Bug,
    priceFrom: 1500,
    priceUnit: "от",
    category: "main",
    order: 2,
  },
  {
    slug: "deratizatsiya",
    name: "Дератизация",
    shortName: "Дератизация",
    nameGenitive: "дератизации",
    nameAccusative: "дератизацию",
    description: "Уничтожение грызунов: крыс, мышей, кротов. Защита от повторного появления.",
    metaTitle: "Дератизация в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Уничтожение крыс и мышей в Новосибирске. Профессиональная дератизация с гарантией результата. Работаем по всей области.",
    icon: Rat,
    priceFrom: 1500,
    priceUnit: "от",
    category: "main",
    order: 3,
  },
  {
    slug: "ozonirovanie",
    name: "Озонирование",
    shortName: "Озонирование",
    nameGenitive: "озонирования",
    nameAccusative: "озонирование",
    description: "Очистка воздуха озоном. Удаление запахов, обеззараживание помещений.",
    metaTitle: "Озонирование в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Озонирование помещений в Новосибирске. Удаление запахов, обеззараживание воздуха. Безопасно и эффективно.",
    icon: Wind,
    priceFrom: 1500,
    priceUnit: "от",
    category: "additional",
    order: 4,
  },
  {
    slug: "dezodoratsiya",
    name: "Дезодорация",
    shortName: "Дезодорация",
    nameGenitive: "дезодорации",
    nameAccusative: "дезодорацию",
    description: "Устранение неприятных запахов любого происхождения.",
    metaTitle: "Дезодорация в Новосибирске — от 1200₽ | СанРешения",
    metaDescription: "Профессиональная дезодорация в Новосибирске. Устранение запахов гари, табака, плесени, животных. Гарантия результата.",
    icon: Sparkles,
    priceFrom: 1500,
    priceUnit: "от",
    category: "additional",
    order: 5,
  },
  {
    slug: "sertifikatsiya",
    name: "Сертификация СЭС",
    shortName: "Сертификация",
    nameGenitive: "сертификации СЭС",
    nameAccusative: "сертификацию СЭС",
    description: "Оформление санитарных документов для бизнеса. Акты СЭС, журналы учёта.",
    metaTitle: "Сертификация СЭС в Новосибирске | СанРешения",
    metaDescription: "Оформление санитарных документов в Новосибирске. Акты СЭС, журналы дезинсекции. Помощь в получении сертификатов.",
    icon: FileCheck,
    priceFrom: 2000,
    priceUnit: "от",
    category: "additional",
    order: 6,
  },
];

// Вспомогательные функции
export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find((s) => s.slug === slug);
};

export const getMainServices = (): Service[] => {
  return services.filter((s) => s.category === "main").sort((a, b) => a.order - b.order);
};

export const getAdditionalServices = (): Service[] => {
  return services.filter((s) => s.category === "additional").sort((a, b) => a.order - b.order);
};

export const getAllServices = (): Service[] => {
  return services.sort((a, b) => a.order - b.order);
};
