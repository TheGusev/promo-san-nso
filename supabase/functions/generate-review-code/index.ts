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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Требуется авторизация");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Проверяем админа
    const userClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      throw new Error("Пользователь не авторизован");
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      throw new Error("Недостаточно прав");
    }

    const { leadId } = await req.json();

    if (!leadId) {
      throw new Error("leadId обязателен");
    }

    // Получаем заявку
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, name, phone, object_type, review_code")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      throw new Error("Заявка не найдена");
    }

    if (lead.review_code) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          code: lead.review_code,
          message: "Код уже был сгенерирован" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Генерируем уникальный код
    let code: string;
    let attempts = 0;
    do {
      const { data: codeData } = await supabase.rpc("generate_review_code");
      code = codeData;
      
      // Проверяем уникальность
      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("review_code", code)
        .maybeSingle();
      
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    // Устанавливаем срок действия 30 дней
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Сохраняем код
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        review_code: code,
        review_code_used: false,
        review_code_expires_at: expiresAt.toISOString(),
      })
      .eq("id", leadId);

    if (updateError) {
      throw new Error("Ошибка сохранения кода");
    }

    // Отправляем в Telegram
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

    if (telegramBotToken && telegramChatId) {
      const message = `📝 *Код для отзыва*

👤 Клиент: ${lead.name}
📞 Телефон: ${lead.phone}
🏠 Объект: ${lead.object_type || "Не указан"}

🔑 *Код: \`${code}\`*

Срок действия: 30 дней`;

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

    console.log(`Review code generated for lead ${leadId}: ${code}`);

    return new Response(
      JSON.stringify({ success: true, code }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating review code:", error);
    const message = error instanceof Error ? error.message : "Неизвестная ошибка";
    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
