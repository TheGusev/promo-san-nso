---
name: Metrika Goals Complete List
description: All Yandex.Metrika goals tracked via centralized analytics.ts wrapper. Composite goal all_conversions fires from frontend with one-fire-per-event guard (1500ms window, weight-based upgrades).
type: feature
---

# Yandex.Metrika Goals — Counter 104205609

All goals are routed through `src/lib/analytics.ts` `trackGoal()`. Direct calls to `reachGoal()` are forbidden — extend the `GoalName` union type instead.

## Personal goals (tracked individually for funnel analysis)

| Goal name | Weight | Where it fires |
|---|---|---|
| `lead_submit` | 100 | SimpleCalculator / Calculator final form submit |
| `popup_submit` | 100 | PopupForm submit |
| `hero_form_submit` | 100 | HeroService compact form submit (programmatic service pages) |
| `phone_click` | 50 | Any `tel:` click — Header, FloatingContact, PriceTable, HeroService, SimpleCalculator alt |
| `max_click` | 50 | FloatingContact MAX messenger button |
| `telegram_click` | 50 | FloatingContact Telegram button |
| `calc_calculate` | 0 | User entered area / picked place and got a price (engagement, not conversion) |
| `review_submit` | 0 | ReviewFormModal submit |

## Composite goal `all_conversions` (frontend-fired)

`all_conversions` is sent automatically by `trackGoal()` after any goal with weight > 0. It is NOT configured as a composite goal in the Metrika dashboard — it is a JavaScript-event goal `all_conversions` with anti-duplication logic on the frontend.

**Guard rules** (in `src/lib/analytics.ts → fireAllConversionsOnce`):
1. Engagement goals (weight 0) never trigger `all_conversions`.
2. Within a 1500 ms window, equal-or-lower weight repeats are SUPPRESSED.
3. A higher-weight goal arriving inside the window triggers exactly one "upgrade" fire with `upgraded_from: <previous source>`.
4. State persisted in `sessionStorage` (key `all_conversions:lastFired`) to survive React StrictMode double-invokes and soft reloads.

**Parameters sent with `all_conversions`:**
```ts
{ source: GoalName, weight: 50 | 100, upgraded_from?: GoalName, page: string }
```

## Manual setup in Metrika dashboard
Create one JavaScript-event goal with identifier `all_conversions`. No composite/conditional goals required — the frontend already deduplicates.

## Migration history
- Earlier approach: composite goal assembled manually in Metrika dashboard from individual goals → produced double counting on phone_click + lead_submit sequences.
- Current: single frontend-fired `all_conversions` with weight-based upgrade and 1500 ms guard window.
