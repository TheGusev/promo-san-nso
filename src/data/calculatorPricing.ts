// Источник правды для цен в простом калькуляторе.
// Цены синхронизированы с PriceTable.tsx и страницами услуг.

import type { Pest } from "./pests";

export type PlaceKey =
  | "apt-1"
  | "apt-2"
  | "apt-3"
  | "apt-4"
  | "house"
  | "plot"
  | "commercial";

export interface PlaceOption {
  key: PlaceKey;
  label: string;
  hint: string;
  // object_type для лида (значения, понятные текущему пайплайну)
  objectType: "apartment" | "house" | "plot" | "office";
}

export const PLACES: PlaceOption[] = [
  { key: "apt-1", label: "Квартира 1-комн", hint: "до 40 м²", objectType: "apartment" },
  { key: "apt-2", label: "Квартира 2-комн", hint: "до 60 м²", objectType: "apartment" },
  { key: "apt-3", label: "Квартира 3-комн", hint: "до 90 м²", objectType: "apartment" },
  { key: "apt-4", label: "Квартира 4+ комн", hint: "от 90 м²", objectType: "apartment" },
  { key: "house", label: "Частный дом", hint: "коттедж, дача", objectType: "house" },
  { key: "plot", label: "Участок / двор", hint: "огород, территория", objectType: "plot" },
  { key: "commercial", label: "Офис / кафе / магазин", hint: "коммерция", objectType: "office" },
];

// Тип значения цены: фикс или "от N"
export type PriceValue = number | { from: number };

// Лукап: pest.slug -> place.key -> цена | undefined (недоступно)
type PriceMatrix = Record<string, Partial<Record<PlaceKey, PriceValue>>>;

// Группа "Дезинсекция" (квартирная) — клопы, тараканы, блохи, муравьи, моль, кожеед
const DISINSECTION_RESIDENTIAL: Partial<Record<PlaceKey, PriceValue>> = {
  "apt-1": 1500,
  "apt-2": 1800,
  "apt-3": 2100,
  "apt-4": 2500,
  "house": 2500,
  "commercial": { from: 2500 },
};

// Дератизация — крысы, мыши
const DERATIZATION_RESIDENTIAL: Partial<Record<PlaceKey, PriceValue>> = {
  "apt-1": 1800,
  "apt-2": 2000,
  "apt-3": 2300,
  "apt-4": 2500,
  "house": 2500,
  "plot": 2500,
  "commercial": { from: 2500 },
};

export const PRICING: PriceMatrix = {
  // Насекомые (дезинсекция)
  klopy: { ...DISINSECTION_RESIDENTIAL },
  tarakany: { ...DISINSECTION_RESIDENTIAL },
  blohi: { ...DISINSECTION_RESIDENTIAL, plot: 2500 },
  muravi: { ...DISINSECTION_RESIDENTIAL, plot: 2500 },
  moli: { ...DISINSECTION_RESIDENTIAL },
  kozheed: { ...DISINSECTION_RESIDENTIAL },

  // Осы — только дом/участок/коммерция (удаление гнезда)
  osy: {
    house: 2000,
    plot: 2000,
    commercial: 2000,
  },

  // Комары / клещи — только участок
  komary: { plot: 2500 },
  kleshchi: { plot: 2500 },

  // Грызуны
  krysy: { ...DERATIZATION_RESIDENTIAL },
  myshi: { ...DERATIZATION_RESIDENTIAL },

  // Кроты — только участок
  kroty: { plot: 2500 },
};

/** Возвращает только те места, где есть цена для выбранного вредителя. */
export function getAvailablePlaces(pestSlug: string): PlaceOption[] {
  const matrix = PRICING[pestSlug] ?? {};
  return PLACES.filter((p) => matrix[p.key] !== undefined);
}

/** Возвращает цену для пары [вредитель, место]. */
export function getPrice(pestSlug: string, placeKey: PlaceKey): PriceValue | undefined {
  return PRICING[pestSlug]?.[placeKey];
}

/** Числовое значение для отправки в лид (для "от N" возвращаем N). */
export function getNumericPrice(value: PriceValue): number {
  return typeof value === "number" ? value : value.from;
}

/** Форматирование цены для UI. */
export function formatPriceLabel(value: PriceValue): string {
  if (typeof value === "number") return `${value.toLocaleString("ru-RU")} ₽`;
  return `от ${value.from.toLocaleString("ru-RU")} ₽`;
}

/** Маппинг вредителя на основной service slug для лида. */
export function getServiceForPest(pest: Pest): string {
  return pest.relatedServices[0] ?? "dezinseksiya";
}
