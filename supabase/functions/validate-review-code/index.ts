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

    const { code } = await req.json();

    if (!code || code.length !== 6) {
      return new Response(
        JSON.stringify({ valid: false, message: "Неверный формат кода" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ищем заявку с этим кодом
    const { data: lead, error } = await supabase
      .from("leads")
      .select("id, object_type, review_code_used, review_code_expires_at")
      .eq("review_code", code.toUpperCase())
      .maybeSingle();

    if (error) {
      console.error("Error finding lead:", error);
      throw new Error("Ошибка поиска кода");
    }

    if (!lead) {
      return new Response(
        JSON.stringify({ valid: false, message: "Код не найден" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (lead.review_code_used) {
      return new Response(
        JSON.stringify({ valid: false, message: "Код уже использован" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (lead.review_code_expires_at && new Date(lead.review_code_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ valid: false, message: "Срок действия кода истёк" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Review code validated: ${code} for lead ${lead.id}`);

    return new Response(
      JSON.stringify({ 
        valid: true, 
        leadId: lead.id,
        objectType: lead.object_type 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error validating review code:", error);
    const message = error instanceof Error ? error.message : "Неизвестная ошибка";
    return new Response(
      JSON.stringify({ valid: false, message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
