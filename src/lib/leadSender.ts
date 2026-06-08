/**
 * Отправка лида. Канал один — PHP-эндпоинт на гордэз.рф.
 *
 * Лиды НЕ пишутся в БД и НЕ проходят edge function `handle-lead`
 * (решение от 08.06.2026 — основной канал PHP на Beget,
 *  Supabase edge на проде нестабилен с TG).
 *
 * Возвращает channel = 'php' | 'failed'.
 * При 'failed' вызывающий код кладёт лид в offlineQueue.
 */

const TIMEOUT_MS = 8000;

// Punycode-домен надёжнее для fetch чем кириллица.
// гордэз.рф === xn--c1acj0ak3f.xn--p1ai
const ENDPOINT_URL = "https://xn--c1acj0ak3f.xn--p1ai/api/lead.php";

export type LeadChannel = "php" | "failed";

export interface SendLeadResult {
  ok: boolean;
  channel: LeadChannel;
  error?: unknown;
}

async function postLead(leadData: Record<string, unknown>): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadData),
      signal: controller.signal,
      credentials: "omit",
      mode: "cors",
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json().catch(() => ({ ok: false }));
    return data?.ok === true;
  } catch (e) {
    clearTimeout(timer);
    if (import.meta.env.DEV) console.warn("[leadSender] php failed:", e);
    return false;
  }
}

export async function sendLead(leadData: Record<string, unknown>): Promise<SendLeadResult> {
  const ok = await postLead(leadData);
  if (ok) return { ok: true, channel: "php" };
  return { ok: false, channel: "failed" };
}
