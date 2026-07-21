// Детерминированный счётчик выполненных объектов.
// Растёт каждый день на +3..+5 (в воскресенье 0). Одинаков для всех посетителей
// в один и тот же день (сид = дата), не «прыгает» при перезагрузке.

const BASE_DATE = new Date(Date.UTC(2026, 6, 21)); // 2026-07-21
const BASE_COUNT = 420;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateSeed(d: Date): number {
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

function dailyIncrement(d: Date): number {
  // Воскресенье в UTC — выходной
  if (d.getUTCDay() === 0) return 0;
  const rand = mulberry32(dateSeed(d))();
  // 3, 4 или 5
  return 3 + Math.floor(rand * 3);
}

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

const DAY_MS = 86_400_000;

export function getCompletedObjectsCount(now: Date = new Date()): number {
  const today = startOfUtcDay(now);
  if (today.getTime() <= BASE_DATE.getTime()) return BASE_COUNT;

  const days = Math.round((today.getTime() - BASE_DATE.getTime()) / DAY_MS);
  let total = BASE_COUNT;
  for (let i = 1; i <= days; i++) {
    const d = new Date(BASE_DATE.getTime() + i * DAY_MS);
    total += dailyIncrement(d);
  }
  return total;
}
