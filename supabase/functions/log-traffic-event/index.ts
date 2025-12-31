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
  'calc_whatsapp_click',
  'calc_telegram_click',
  'popup_open',
  'popup_submit',
  'max_click',
  'whatsapp_click',
  'telegram_click',
  'phone_click',
  'service_click',
  'service_cta_click',
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

// Helper to safely truncate strings
    const truncateString = (str: unknown, maxLength: number): string | null => {
      if (str === null || str === undefined) return null;
      return String(str).substring(0, maxLength);
    };

    // Sanitize UTM parameters (whitelist) with length limits
    const sanitizedEvent = {
      session_id: truncateString(eventData.session_id, 100),
      event_type: eventData.event_type,
      page_url: truncateString(eventData.page_url, 500),
      referrer: truncateString(eventData.referrer, 500),
      intent: truncateString(eventData.intent, 50),
      variant_id: truncateString(eventData.variant_id, 10),
      device_type: truncateString(eventData.device_type, 20),
      utm_source: truncateString(eventData.utm_source, 100),
      utm_medium: truncateString(eventData.utm_medium, 100),
      utm_campaign: truncateString(eventData.utm_campaign, 200),
      utm_content: truncateString(eventData.utm_content, 200),
      utm_term: truncateString(eventData.utm_term, 200),
      keyword_raw: truncateString(eventData.keyword_raw, 200),
      yclid: truncateString(eventData.yclid, 100),
      gclid: truncateString(eventData.gclid, 100),
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
    return new Response(
      JSON.stringify({ error: 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
