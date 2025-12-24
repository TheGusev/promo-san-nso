import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { code, displayName, rating, text, objectType, leadId } = await req.json();

    // Валидация
    if (!code || code.length !== 6) {
      throw new Error("Неверный код");
    }

    if (!displayName || displayName.trim().length === 0) {
      throw new Error("Имя обязательно");
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Оценка должна быть от 1 до 5");
    }

    if (!text || text.trim().length < 10) {
      throw new Error("Отзыв должен содержать минимум 10 символов");
    }

    // Повторная проверка кода
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, name, phone, object_type, review_code_used, review_code_expires_at")
      .eq("review_code", code.toUpperCase())
      .maybeSingle();

    if (leadError || !lead) {
      throw new Error("Код не найден");
    }

    if (lead.review_code_used) {
      throw new Error("Код уже использован");
    }

    if (lead.review_code_expires_at && new Date(lead.review_code_expires_at) < new Date()) {
      throw new Error("Срок действия кода истёк");
    }

    // Создаём отзыв
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        lead_id: lead.id,
        display_name: displayName.trim(),
        rating,
        text: text.trim(),
        object_type: lead.object_type || objectType,
      })
      .select()
      .single();

    if (reviewError) {
      console.error("Error creating review:", reviewError);
      throw new Error("Ошибка сохранения отзыва");
    }

    // Помечаем код как использованный
    const { error: updateError } = await supabase
      .from("leads")
      .update({ review_code_used: true })
      .eq("id", lead.id);

    if (updateError) {
      console.error("Error marking code as used:", updateError);
    }

    // Отправляем уведомление в Telegram
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (telegramBotToken && telegramChatId) {
      const stars = "⭐".repeat(rating);
      const message = `📝 *Новый отзыв на модерацию*

👤 Имя: ${displayName}
${stars} (${rating}/5)

💬 "${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"

🏠 Объект: ${lead.object_type || "Не указан"}
📱 Клиент: ${lead.name} (${lead.phone})

Перейдите в админ-панель для модерации.`;

      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });
    }

    console.log(`Review submitted: ${review.id} from lead ${lead.id}`);

    return new Response(
      JSON.stringify({ success: true, reviewId: review.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    const message = error instanceof Error ? error.message : "Неизвестная ошибка";
    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
