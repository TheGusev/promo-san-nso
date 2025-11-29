import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const leadData = await req.json();
    
    console.log('Received lead data:', JSON.stringify(leadData, null, 2));

    // Validate required fields
    if (!leadData.name || !leadData.phone) {
      return new Response(
        JSON.stringify({ error: 'Name and phone are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Honeypot check
    if (leadData.honeypot) {
      console.log('Honeypot triggered, likely bot');
      return new Response(
        JSON.stringify({ success: true, message: 'Lead submitted' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert lead into database
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lead:', insertError);
      throw insertError;
    }

    console.log('Lead created successfully:', lead.id);

    // If this is a conversion (from calculator or popup), increment alpha
    if (leadData.mvt_impression_id && leadData.variant_id && leadData.intent) {
      try {
        const { error: alphaError } = await supabase.rpc('increment_arm_alpha', {
          p_test_name: 'main_variant',
          p_intent: leadData.intent || 'default',
          p_variant_key: leadData.variant_id,
          p_revenue: leadData.final_price || 0
        });
        
        if (alphaError) {
          console.error('Error incrementing alpha:', alphaError);
        } else {
          console.log('Alpha incremented for variant:', leadData.variant_id);
        }
      } catch (err) {
        console.error('Error calling increment_arm_alpha:', err);
      }
    }

    // Send Telegram notification
    try {
      const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
      const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID');

      // Debug logging (masked for security)
      console.log('Telegram config check:', {
        hasToken: !!telegramToken,
        tokenLength: telegramToken?.length || 0,
        tokenPrefix: telegramToken?.substring(0, 10) + '...',
        chatId: telegramChatId,
        chatIdType: typeof telegramChatId
      });

      if (telegramToken && telegramChatId) {
        const message = `
🆕 Новая заявка #${lead.id.substring(0, 8)}

👤 Клиент: ${leadData.name}
📞 Телефон: ${leadData.phone}
${leadData.email ? `📧 Email: ${leadData.email}` : ''}

📋 Услуга: ${leadData.service || 'не указана'}
🏢 Тип объекта: ${leadData.object_type || 'не указан'}
📏 Площадь: ${leadData.area_m2 || 'не указана'} м²

💰 Цена: ${leadData.final_price ? leadData.final_price + '₽' : 'не рассчитана'}
${leadData.discount_percent ? `🎁 Скидка: ${leadData.discount_percent}%` : ''}

🔗 Источник: ${leadData.source}
📱 Устройство: ${leadData.device_type || 'неизвестно'}
🎯 Интент: ${leadData.intent || 'default'}
🔤 Вариант: ${leadData.variant_id || 'unknown'}
${leadData.utm_source ? `📊 UTM Source: ${leadData.utm_source}` : ''}
        `.trim();

        const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
        const telegramResponse = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'HTML'
          })
        });

        if (!telegramResponse.ok) {
          const errorText = await telegramResponse.text();
          console.error('Telegram API error:', {
            status: telegramResponse.status,
            statusText: telegramResponse.statusText,
            error: errorText,
            chatId: telegramChatId,
            requestUrl: telegramUrl
          });
        } else {
          const successData = await telegramResponse.json();
          console.log('Telegram notification sent successfully:', successData);
        }
      }
    } catch (telegramError) {
      console.error('Error sending Telegram notification:', telegramError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead submitted successfully',
        leadId: lead.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in handle-lead:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
