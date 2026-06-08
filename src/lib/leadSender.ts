import { supabase } from "@/integrations/supabase/client";

/**
 * Универсальная отправка лида с резервным каналом.
 *
 * Каналы по приоритету:
 *  1) supabase edge function `handle-lead` (основной, пишет в БД + TG)
 *  2) PHP-прокси на гордэз.рф/api/lead.php (резерв, шлёт только в TG)
 *
 * Возвращает channel = 'supabase' | 'php' | 'failed'
 * При 'failed' вызывающий код кладёт лид в offlineQueue.
 */

const PRIMARY_TIMEOUT_MS = 6000;
const FALLBACK_TIMEOUT_MS = 6000;

// Punycode-домен надёжнее для fetch чем кириллица.
// гордэз.рф === xn--c1acj0ak3f.xn--p1ai
const FALLBACK_URL = "https://xn--c1acj0ak3f.xn--p1ai/api/lead.php";

export type LeadChannel = "supabase" | "php" | "failed";

export interface SendLeadResult {
  ok: boolean;
  channel: LeadChannel;
  error?: unknown;
}

async function trySupabase(leadData: Record<string, unknown>): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PRIMARY_TIMEOUT_MS);
  try {
    const invokePromise = supabase.functions.invoke("handle-lead", { body: leadData });
    const result = await Promise.race([
      invokePromise,
      new Promise((_, reject) => {
        controller.signal.addEventListener("abort", () =>
          reject(new Error("supabase_timeout"))
        );
      }),
    ]);
    clearTimeout(timer);
    const { error } = result as { error: unknown };
    if (error) throw error;
    return true;
  } catch (e) {
    clearTimeout(timer);
    if (import.meta.env.DEV) console.warn("[leadSender] supabase failed:", e);
    return false;
  }
}

async function tryPhpFallback(leadData: Record<string, unknown>): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FALLBACK_TIMEOUT_MS);
  try {
    const res = await fetch(FALLBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...leadData, _channel: "php-fallback" }),
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
    if (import.meta.env.DEV) console.warn("[leadSender] php fallback failed:", e);
    return false;
  }
}

export async function sendLead(leadData: Record<string, unknown>): Promise<SendLeadResult> {
  const okPrimary = await trySupabase(leadData);
  if (okPrimary) return { ok: true, channel: "supabase" };

  const okFallback = await tryPhpFallback(leadData);
  if (okFallback) return { ok: true, channel: "php" };

  return { ok: false, channel: "failed" };
}
