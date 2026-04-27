// Centralized analytics wrapper.
// All Yandex.Metrika goal calls in the app should go through trackGoal.
// This is the single source of truth for conversion goal naming.

import { reachGoal } from "@/lib/yandexMetrika";

/**
 * Whitelist of allowed goal names — keeps reporting clean and consistent.
 *
 * LEAD-GENERATING (weight 100, fire `all_conversions`):
 *   - lead_submit       — Calculator form submit
 *   - popup_submit      — PopupForm submit
 *   - hero_form_submit  — HeroService form submit
 *
 * CONTACT (weight 50, fire `all_conversions`):
 *   - phone_click       — any tel: click
 *   - max_click         — FloatingContact MAX button
 *   - telegram_click    — FloatingContact Telegram button
 *
 * ENGAGEMENT (weight 0, NOT included in all_conversions):
 *   - calc_calculate    — user entered area and got a price
 *   - review_submit     — ReviewFormModal submit
 *
 * `all_conversions` is a single composite goal in Yandex.Metrika that fires
 * AT MOST ONCE per user event with a 1500 ms guard window. If a higher-weight
 * goal arrives within the window, exactly one upgrade-fire is allowed
 * (e.g. phone_click → lead_submit).
 */
export type GoalName =
  | "lead_submit"
  | "popup_submit"
  | "hero_form_submit"
  | "phone_click"
  | "max_click"
  | "telegram_click"
  | "calc_calculate"
  | "review_submit";

const WEIGHTS: Record<GoalName, number> = {
  lead_submit: 100,
  popup_submit: 100,
  hero_form_submit: 100,
  phone_click: 50,
  max_click: 50,
  telegram_click: 50,
  calc_calculate: 0,
  review_submit: 0,
};

const WINDOW_MS = 1500;
const STORAGE_KEY = "all_conversions:lastFired";

interface LastFire {
  ts: number;
  weight: number;
  source: GoalName;
}

let lastFire: LastFire | null = null;

// Restore guard state from sessionStorage (survives soft reloads within a tab)
if (typeof window !== "undefined") {
  try {
    const raw = window.sessionStorage?.getItem(STORAGE_KEY);
    if (raw) lastFire = JSON.parse(raw) as LastFire;
  } catch {
    /* sessionStorage may be unavailable (private mode / SSR) */
  }
}

function persistLastFire(value: LastFire) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy errors */
  }
}

/**
 * Fire the composite `all_conversions` goal at most once per event window.
 * - Skips engagement goals (weight = 0).
 * - Within WINDOW_MS, suppresses equal-or-lower weight repeats.
 * - Allows one "upgrade" fire when a higher-weight goal arrives in window.
 */
function fireAllConversionsOnce(name: GoalName) {
  const weight = WEIGHTS[name];
  if (weight === 0) return;

  const now = Date.now();
  const inWindow = lastFire && now - lastFire.ts < WINDOW_MS;

  if (inWindow && weight <= lastFire!.weight) {
    if (import.meta.env.DEV) {
      console.log("[YM] all_conversions suppressed (guard)", {
        incoming: name,
        weight,
        previous: lastFire,
      });
    }
    return;
  }

  const upgradedFrom = inWindow ? lastFire!.source : undefined;

  reachGoal("all_conversions", {
    source: name,
    weight,
    upgraded_from: upgradedFrom,
    page: typeof location !== "undefined" ? location.pathname : undefined,
  });

  const next: LastFire = { ts: now, weight, source: name };
  lastFire = next;
  persistLastFire(next);
}

/**
 * Send a goal to Yandex.Metrika through the centralized wrapper.
 * Use this function instead of calling reachGoal directly.
 *
 * Side effect: also triggers the composite `all_conversions` goal,
 * subject to the one-fire-per-event guard described above.
 */
export function trackGoal(name: GoalName, params?: Record<string, unknown>) {
  reachGoal(name, params);
  fireAllConversionsOnce(name);
}
