import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting map: IP -> [timestamps]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_LEADS_PER_WINDOW = 5; // Max 5 leads per minute per IP

// Validation patterns
const PHONE_REGEX = /^\+7\d{10}$/; // +7 и 10 цифр
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_STRING_LENGTH = 500;

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

    // Rate limiting check
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const timestamps = rateLimitMap.get(clientIp) || [];
    const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);

    if (recentTimestamps.length >= MAX_LEADS_PER_WINDOW) {
      console.log('Rate limit exceeded for IP:', clientIp);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    recentTimestamps.push(now);
    rateLimitMap.set(clientIp, recentTimestamps);

    // Input validation
    if (!leadData.name || typeof leadData.name !== 'string' || leadData.name.trim().length === 0 || leadData.name.length > MAX_NAME_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Invalid name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!leadData.phone || !PHONE_REGEX.test(leadData.phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone format. Use +7XXXXXXXXXX' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (leadData.email && (typeof leadData.email !== 'string' || leadData.email.length > MAX_EMAIL_LENGTH)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email' }),
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

    // Sanitize and truncate string fields
    const sanitizedLead = {
      name: leadData.name.trim().substring(0, MAX_NAME_LENGTH),
      phone: leadData.phone,
      email: leadData.email?.trim()?.substring(0, MAX_EMAIL_LENGTH) || null,
      service: leadData.service?.substring(0, MAX_STRING_LENGTH) || null,
      object_type: leadData.object_type?.substring(0, MAX_STRING_LENGTH) || null,
      area_m2: typeof leadData.area_m2 === 'number' ? leadData.area_m2 : null,
      base_price: typeof leadData.base_price === 'number' ? leadData.base_price : null,
      final_price: typeof leadData.final_price === 'number' ? leadData.final_price : null,
      discount_amount: typeof leadData.discount_amount === 'number' ? leadData.discount_amount : null,
      discount_percent: typeof leadData.discount_percent === 'number' ? leadData.discount_percent : null,
      frequency: leadData.frequency?.substring(0, 50) || null,
      method: leadData.method?.substring(0, 100) || null,
      client_type: leadData.client_type?.substring(0, 50) || null,
      source: leadData.source?.substring(0, 50) || null,
      session_id: leadData.session_id?.substring(0, 100) || null,
      device_type: leadData.device_type?.substring(0, 50) || null,
      intent: leadData.intent?.substring(0, 50) || null,
      variant_id: leadData.variant_id?.substring(0, 10) || null,
      mvt_impression_id: leadData.mvt_impression_id || null,
      utm_source: leadData.utm_source?.substring(0, 100) || null,
      utm_medium: leadData.utm_medium?.substring(0, 100) || null,
      utm_campaign: leadData.utm_campaign?.substring(0, 100) || null,
      utm_content: leadData.utm_content?.substring(0, 100) || null,
      utm_term: leadData.utm_term?.substring(0, 100) || null,
      gclid: leadData.gclid?.substring(0, 100) || null,
      yclid: leadData.yclid?.substring(0, 100) || null,
      keyword: leadData.keyword?.substring(0, 200) || null,
      first_landing_url: leadData.first_landing_url?.substring(0, 500) || null,
      last_page_url: leadData.last_page_url?.substring(0, 500) || null,
    };

    // Backend validation for area_m2 (prevent overflow from Android autofill)
    if (sanitizedLead.area_m2 && (sanitizedLead.area_m2 < 0 || sanitizedLead.area_m2 > 100000)) {
      console.log('Invalid area_m2 value detected:', sanitizedLead.area_m2);
      sanitizedLead.area_m2 = null;
    }

    // Cap prices at safe maximum (10 million)
    const MAX_PRICE = 10000000;
    if (sanitizedLead.base_price && sanitizedLead.base_price > MAX_PRICE) {
      console.log('base_price exceeds maximum:', sanitizedLead.base_price);
      sanitizedLead.base_price = null;
    }
    if (sanitizedLead.final_price && sanitizedLead.final_price > MAX_PRICE) {
      console.log('final_price exceeds maximum:', sanitizedLead.final_price);
      sanitizedLead.final_price = null;
    }
    if (sanitizedLead.discount_amount && sanitizedLead.discount_amount > MAX_PRICE) {
      console.log('discount_amount exceeds maximum:', sanitizedLead.discount_amount);
      sanitizedLead.discount_amount = null;
    }

    // Insert lead into database
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert([sanitizedLead])
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
    return new Response(
      JSON.stringify({ error: 'An error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
