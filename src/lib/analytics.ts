// Centralized analytics wrapper.
// All Yandex.Metrika goal calls in the app should go through trackGoal.
// This is the single source of truth for conversion goal naming.

import { reachGoal } from "@/lib/yandexMetrika";

/**
 * Whitelist of allowed goal names — keeps reporting clean and consistent.
 *
 * LEAD-GENERATING (included in composite goal `all_conversions` configured
 * manually in Yandex.Metrika dashboard):
 *   - lead_submit       — Calculator form submit
 *   - popup_submit      — PopupForm submit
 *   - hero_form_submit  — HeroService form submit
 *   - phone_click       — any tel: click
 *
 * ENGAGEMENT (NOT included in all_conversions):
 *   - max_click         — FloatingContact MAX button
 *   - telegram_click    — FloatingContact Telegram button
 *   - calc_calculate    — user entered area and got a price
 *   - review_submit     — ReviewFormModal submit
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

/**
 * Send a goal to Yandex.Metrika through the centralized wrapper.
 * Use this function instead of calling reachGoal directly.
 */
export function trackGoal(name: GoalName, params?: Record<string, unknown>) {
  reachGoal(name, params);
}
