import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting map: composite key (IP:session_id) -> [timestamps]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_LEADS_PER_WINDOW = 5; // Max 5 leads per minute per IP+session

// Validation patterns
const PHONE_REGEX = /^\+7\d{10}$/; // +7 и 10 цифр
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
const NAME_REGEX = /^[\p{L}\s\-']{2,100}$/u; // Unicode letters, spaces, hyphens, apostrophes

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_STRING_LENGTH = 500;

// Minimum time (ms) between page load and form submit to detect bots
const MIN_FORM_FILL_TIME = 2000;

// Sanitize name: remove HTML tags and dangerous characters
function sanitizeName(name: string): string {
  return name
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"&;{}|\\^~\[\]`]/g, '') // Remove dangerous characters
    .trim()
    .substring(0, MAX_NAME_LENGTH);
}

// Mask PII for logging
function maskPhone(phone: string): string {
  if (!phone || phone.length < 5) return '***';
  return phone.substring(0, 5) + '*****';
}

function maskName(name: string): string {
  if (!name || name.length < 2) return '***';
  return name.substring(0, 2) + '***';
}

function maskEmail(email: string | null | undefined): string {
  if (!email) return '***';
  const [local, domain] = email.split('@');
  if (!domain) return '***@***';
  return local.substring(0, 2) + '***@' + domain;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const leadData = await req.json();
    
    // Log with masked PII
    console.log('Received lead data:', {
      name: maskName(leadData.name),
      phone: maskPhone(leadData.phone),
      email: maskEmail(leadData.email),
      source: leadData.source,
      service: leadData.service,
      object_type: leadData.object_type,
      area_m2: leadData.area_m2,
      session_id: leadData.session_id?.substring(0, 20) + '...',
      has_form_start_time: !!leadData.form_start_time
    });

    // Rate limiting check with composite key (IP + session_id)
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const sessionId = leadData.session_id?.substring(0, 100) || 'unknown';
    const rateLimitKey = `${clientIp}:${sessionId}`;
    const now = Date.now();
    const timestamps = rateLimitMap.get(rateLimitKey) || [];
    const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);

    if (recentTimestamps.length >= MAX_LEADS_PER_WINDOW) {
      console.log('Rate limit exceeded for key:', rateLimitKey.substring(0, 30) + '...');
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    recentTimestamps.push(now);
    rateLimitMap.set(rateLimitKey, recentTimestamps);

    // Bot detection: check form fill time
    if (leadData.form_start_time) {
      const fillTime = now - leadData.form_start_time;
      if (fillTime < MIN_FORM_FILL_TIME) {
        console.log('Form submitted too quickly, likely bot. Fill time:', fillTime + 'ms');
        // Silent success for bots
        return new Response(
          JSON.stringify({ success: true, message: 'Lead submitted' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Honeypot check
    if (leadData.honeypot) {
      console.log('Honeypot triggered, likely bot');
      return new Response(
        JSON.stringify({ success: true, message: 'Lead submitted' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize name
    if (!leadData.name || typeof leadData.name !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedName = sanitizeName(leadData.name);
    
    if (sanitizedName.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Name is too short' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!NAME_REGEX.test(sanitizedName)) {
      console.log('Invalid name format detected:', maskName(sanitizedName));
      return new Response(
        JSON.stringify({ error: 'Invalid name format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate phone
    if (!leadData.phone || !PHONE_REGEX.test(leadData.phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone format. Use +7XXXXXXXXXX' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format if provided
    if (leadData.email && typeof leadData.email === 'string' && leadData.email.trim()) {
      const trimmedEmail = leadData.email.trim();
      if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
        return new Response(
          JSON.stringify({ error: 'Email is too long' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (!EMAIL_REGEX.test(trimmedEmail)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check for duplicate leads (same phone within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: existingLead, error: dupeCheckError } = await supabase
      .from('leads')
      .select('id')
      .eq('phone', leadData.phone)
      .gte('created_at', fiveMinutesAgo)
      .maybeSingle();

    if (dupeCheckError) {
      console.error('Error checking for duplicate:', dupeCheckError);
      // Continue anyway - better to have a duplicate than lose a lead
    }

    if (existingLead) {
      console.log('Duplicate lead detected for phone:', maskPhone(leadData.phone));
      return new Response(
        JSON.stringify({ error: 'Lead already submitted recently. Please wait a few minutes.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize and truncate all string fields
    const sanitizedLead = {
      name: sanitizedName,
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
      console.log('Invalid area_m2 value detected, setting to null');
      sanitizedLead.area_m2 = null;
    }

    // Cap prices at safe maximum (10 million)
    const MAX_PRICE = 10000000;
    if (sanitizedLead.base_price && sanitizedLead.base_price > MAX_PRICE) {
      console.log('base_price exceeds maximum, setting to null');
      sanitizedLead.base_price = null;
    }
    if (sanitizedLead.final_price && sanitizedLead.final_price > MAX_PRICE) {
      console.log('final_price exceeds maximum, setting to null');
      sanitizedLead.final_price = null;
    }
    if (sanitizedLead.discount_amount && sanitizedLead.discount_amount > MAX_PRICE) {
      console.log('discount_amount exceeds maximum, setting to null');
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
        chatId: telegramChatId ? 'configured' : 'missing'
      });

      if (telegramToken && telegramChatId) {
        // Use sanitized name in notification
        const message = `
🆕 Новая заявка #${lead.id.substring(0, 8)}

👤 Клиент: ${sanitizedLead.name}
📞 Телефон: ${sanitizedLead.phone}
${sanitizedLead.email ? `📧 Email: ${sanitizedLead.email}` : ''}

📋 Услуга: ${sanitizedLead.service || 'не указана'}
🏢 Тип объекта: ${sanitizedLead.object_type || 'не указан'}
📏 Площадь: ${sanitizedLead.area_m2 || 'не указана'} м²

💰 Цена: ${sanitizedLead.final_price ? sanitizedLead.final_price + '₽' : 'не рассчитана'}
${sanitizedLead.discount_percent ? `🎁 Скидка: ${sanitizedLead.discount_percent}%` : ''}

🔗 Источник: ${sanitizedLead.source}
📱 Устройство: ${sanitizedLead.device_type || 'неизвестно'}
🎯 Интент: ${sanitizedLead.intent || 'default'}
🔤 Вариант: ${sanitizedLead.variant_id || 'unknown'}
${sanitizedLead.utm_source ? `📊 UTM Source: ${sanitizedLead.utm_source}` : ''}
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
            error: errorText
          });
        } else {
          console.log('Telegram notification sent successfully');
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
