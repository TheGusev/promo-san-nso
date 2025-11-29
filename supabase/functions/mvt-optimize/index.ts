import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Beta distribution sampling helper
function betaSample(alpha: number, beta: number): number {
  // Using gamma distribution to sample from beta
  const gammaAlpha = gammaRandom(alpha);
  const gammaBeta = gammaRandom(beta);
  return gammaAlpha / (gammaAlpha + gammaBeta);
}

function gammaRandom(shape: number): number {
  // Simple gamma distribution using Marsaglia and Tsang method
  if (shape < 1) {
    return gammaRandom(shape + 1) * Math.pow(Math.random(), 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x, v;
    do {
      x = normalRandom();
      v = 1 + c * x;
    } while (v <= 0);

    v = v * v * v;
    const u = Math.random();
    const x2 = x * x;

    if (u < 1 - 0.0331 * x2 * x2) {
      return d * v;
    }

    if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) {
      return d * v;
    }
  }
}

function normalRandom(): number {
  // Box-Muller transform
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { test_name = 'main_variant', intent = 'default', session_id, device_type, utm_source } = await req.json();

    console.log('MVT optimize request:', { test_name, intent, session_id });

    // Get test configuration and arm parameters in parallel
    const [configResult, armResult] = await Promise.all([
      supabase
        .from('mvt_test_config')
        .select('*')
        .eq('test_name', test_name)
        .eq('is_active', true)
        .single(),
      supabase
        .from('mvt_arm_params')
        .select('*')
        .eq('test_name', test_name)
        .eq('intent', intent)
    ]);

    const { data: testConfig, error: configError } = configResult;
    const { data: armParams, error: armError } = armResult;

    if (configError || !testConfig) {
      console.error('Test config not found:', configError);
      // Fallback to random variant
      const fallbackVariants = ['A', 'B', 'C', 'D', 'E', 'F'];
      const randomVariant = fallbackVariants[Math.floor(Math.random() * fallbackVariants.length)];
      
      return new Response(
        JSON.stringify({ variant: randomVariant, method: 'fallback' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (armError) {
      console.error('Error fetching arm params:', armError);
      throw armError;
    }

    const variants = testConfig.variants as string[];

    // Initialize missing variants
    const existingVariants = new Set(armParams?.map(p => p.variant_key) || []);
    const missingVariants = variants.filter(v => !existingVariants.has(v));

    let allArmParams = armParams || [];

    if (missingVariants.length > 0) {
      const newParams = missingVariants.map(v => ({
        test_name,
        intent,
        variant_key: v,
        alpha: 1,
        beta: 1,
        impressions_count: 0,
        conversions_count: 0,
        revenue_sum: 0
      }));

      const { data: inserted, error: insertError } = await supabase
        .from('mvt_arm_params')
        .insert(newParams)
        .select();

      if (insertError) {
        console.error('Error inserting missing variants:', insertError);
      } else {
        // Merge inserted params with existing ones
        allArmParams = [...allArmParams, ...(inserted || [])];
      }
    }

    const armMap = new Map(allArmParams.map(p => [p.variant_key, p]));

    // Check if in exploration phase
    const totalImpressions = allArmParams?.reduce((sum, p) => sum + (p.impressions_count || 0), 0) || 0;
    const explorationThreshold = testConfig.exploration_sessions_per_variant * variants.length;

    let selectedVariant: string;
    let sampledTheta: number | null = null;
    let method: string;

    if (totalImpressions < explorationThreshold) {
      // Exploration phase: round-robin or random
      const impressionCounts = variants.map(v => armMap.get(v)?.impressions_count || 0);
      const minImpressions = Math.min(...impressionCounts);
      const candidateVariants = variants.filter((v, i) => impressionCounts[i] === minImpressions);
      selectedVariant = candidateVariants[Math.floor(Math.random() * candidateVariants.length)];
      method = 'exploration';
      console.log('Exploration phase:', { selectedVariant, totalImpressions, explorationThreshold });
    } else {
      // Exploitation phase: Thompson Sampling
      const samples = variants.map(v => {
        const param = armMap.get(v);
        const alpha = param?.alpha || 1;
        const beta = param?.beta || 1;
        const theta = betaSample(alpha, beta);
        return { variant: v, theta };
      });

      samples.sort((a, b) => b.theta - a.theta);
      selectedVariant = samples[0].variant;
      sampledTheta = samples[0].theta;
      method = 'thompson_sampling';
      console.log('Thompson Sampling:', { samples, selected: selectedVariant });
    }

    // Log impression and increment count in parallel
    const impressionData = {
      session_id,
      test_name,
      intent,
      variant_key: selectedVariant,
      device_type,
      utm_source,
      sampled_theta: sampledTheta
    };

    const [impressionResult, incrementResult] = await Promise.all([
      supabase
        .from('mvt_impressions')
        .insert([impressionData])
        .select()
        .single(),
      supabase.rpc('increment_arm_impressions', {
        p_test_name: test_name,
        p_intent: intent,
        p_variant_key: selectedVariant
      })
    ]);

    if (impressionResult.error) {
      console.error('Error logging impression:', impressionResult.error);
    } else {
      console.log('Impression logged:', impressionResult.data.id);
    }

    if (incrementResult.error) {
      console.error('Error incrementing impressions:', incrementResult.error);
    }

    return new Response(
      JSON.stringify({ 
        variant: selectedVariant, 
        method,
        impression_id: impressionResult.data?.id,
        sampled_theta: sampledTheta
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in mvt-optimize:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
