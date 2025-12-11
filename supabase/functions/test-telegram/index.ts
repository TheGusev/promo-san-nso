import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

    // Диагностическая информация
    const diagnostics = {
      hasToken: !!telegramToken,
      tokenLength: telegramToken?.length || 0,
      tokenPrefix: telegramToken ? telegramToken.substring(0, 10) + '...' : null,
      chatId: telegramChatId,
      chatIdType: typeof telegramChatId,
      timestamp: new Date().toISOString()
    };

    console.log('Telegram diagnostics:', diagnostics);

    if (!telegramToken || !telegramChatId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing Telegram credentials',
          diagnostics 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Отправляем тестовое сообщение
    const testMessage = `
🧪 Тестовое сообщение

✅ Telegram интеграция работает!
📅 Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Novosibirsk' })}
🆔 Chat ID: ${telegramChatId}

Это сообщение отправлено через тестовый endpoint.
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: testMessage,
      })
    });

    const responseData = await response.json();
    console.log('Telegram API response:', responseData);

    if (!response.ok) {
      // Проверяем, не мигрировала ли группа
      if (responseData.parameters?.migrate_to_chat_id) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Chat migrated to supergroup',
            currentChatId: telegramChatId,
            newChatId: responseData.parameters.migrate_to_chat_id,
            message: `Обновите TELEGRAM_CHAT_ID на: ${responseData.parameters.migrate_to_chat_id}`,
            telegramResponse: responseData
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: responseData.description || 'Telegram API error',
          telegramResponse: responseData,
          diagnostics
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Тестовое сообщение успешно отправлено!',
        telegramResponse: responseData,
        diagnostics
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in test-telegram:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
