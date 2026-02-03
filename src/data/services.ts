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
    description: "Уничтожение вирусов, бактерий, грибка и плесени. Профессиональная обработка помещений.",
    metaTitle: "Дезинфекция в Новосибирске — от 1500₽ | Гордез",
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
    description: "Уничтожение насекомых: тараканов, клопов, блох, муравьёв и других вредителей.",
    metaTitle: "Дезинсекция в Новосибирске — от 1500₽ | Гордез",
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
    description: "Уничтожение грызунов: крыс, мышей, кротов. Защита от повторного появления.",
    metaTitle: "Дератизация в Новосибирске — от 1500₽ | Гордез",
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
    description: "Очистка воздуха озоном. Удаление запахов, обеззараживание помещений.",
    metaTitle: "Озонирование в Новосибирске — от 1500₽ | Гордез",
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
    description: "Устранение неприятных запахов любого происхождения.",
    metaTitle: "Дезодорация в Новосибирске — от 1500₽ | Гордез",
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
    description: "Оформление санитарных документов для бизнеса. Акты СЭС, журналы учёта.",
    metaTitle: "Сертификация СЭС в Новосибирске | Гордез",
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
