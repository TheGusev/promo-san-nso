import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting map: IP:session_id -> [timestamps]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_EVENTS_PER_WINDOW = 30;

// Whitelist for event types
const ALLOWED_EVENT_TYPES = [
  'page_view',
  'hero_view',
  'calc_open',
  'calc_submit',
  'popup_submit',
  'whatsapp_click',
  'telegram_click',
  'phone_click',
  'service_click',
  // Engagement metrics
  'scroll_25',
  'scroll_50',
  'scroll_75',
  'scroll_100',
  'engagement_summary'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const eventData = await req.json();
    
    // Validate event_type whitelist
    if (!ALLOWED_EVENT_TYPES.includes(eventData.event_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid event_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `${clientIp}:${eventData.session_id}`;
    
    const now = Date.now();
    const timestamps = rateLimitMap.get(rateLimitKey) || [];
    const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
    
    if (recentTimestamps.length >= MAX_EVENTS_PER_WINDOW) {
      console.log('Rate limit exceeded for:', rateLimitKey);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    recentTimestamps.push(now);
    rateLimitMap.set(rateLimitKey, recentTimestamps);

    // Sanitize UTM parameters (whitelist)
    const sanitizedEvent = {
      session_id: eventData.session_id,
      event_type: eventData.event_type,
      page_url: eventData.page_url,
      referrer: eventData.referrer,
      intent: eventData.intent,
      variant_id: eventData.variant_id,
      device_type: eventData.device_type,
      utm_source: eventData.utm_source,
      utm_medium: eventData.utm_medium,
      utm_campaign: eventData.utm_campaign,
      utm_content: eventData.utm_content,
      utm_term: eventData.utm_term,
      keyword_raw: eventData.keyword_raw,
      yclid: eventData.yclid,
      gclid: eventData.gclid,
      event_data: eventData.event_data || {}
    };

    const { error: insertError } = await supabase
      .from('traffic_events')
      .insert([sanitizedEvent]);

    if (insertError) {
      console.error('Error inserting traffic event:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in log-traffic-event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
