-- Create enum for user roles
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Leads table (заявки с сайта)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  object_type TEXT,
  area_m2 INTEGER,
  service TEXT,
  method TEXT,
  frequency TEXT,
  client_type TEXT,
  base_price INTEGER,
  discount_percent INTEGER,
  discount_amount INTEGER,
  final_price INTEGER,
  source TEXT DEFAULT 'website_calculator',
  status TEXT DEFAULT 'new',
  session_id TEXT,
  intent TEXT,
  variant_id TEXT,
  device_type TEXT,
  first_landing_url TEXT,
  last_page_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  keyword TEXT,
  yclid TEXT,
  gclid TEXT,
  mvt_impression_id UUID,
  mvt_arm_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read leads" ON leads FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Traffic events table (события без PII)
CREATE TABLE traffic_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  page_url TEXT NOT NULL,
  referrer TEXT,
  intent TEXT,
  variant_id TEXT,
  device_type TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  keyword_raw TEXT,
  yclid TEXT,
  gclid TEXT,
  event_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE traffic_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert traffic_events" ON traffic_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read traffic_events" ON traffic_events FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- MVT test configuration
CREATE TABLE mvt_test_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name TEXT NOT NULL UNIQUE,
  description TEXT,
  variants JSONB NOT NULL DEFAULT '["A", "B", "C", "D", "E", "F"]',
  is_active BOOLEAN DEFAULT TRUE,
  exploration_sessions_per_variant INTEGER DEFAULT 50,
  confidence_threshold NUMERIC DEFAULT 0.95,
  winner_variant TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mvt_test_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active mvt_test_config" ON mvt_test_config FOR SELECT USING (is_active = true);
CREATE POLICY "Only admins can manage mvt_test_config" ON mvt_test_config FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Insert default test config
INSERT INTO mvt_test_config (test_name, description, variants) VALUES 
  ('main_variant', 'Основной A/B/C/D/E/F тест заголовков', '["A","B","C","D","E","F"]');

-- MVT arm parameters (Thompson Sampling)
CREATE TABLE mvt_arm_params (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name TEXT NOT NULL,
  intent TEXT NOT NULL DEFAULT 'default',
  variant_key TEXT NOT NULL,
  alpha NUMERIC NOT NULL DEFAULT 1,
  beta NUMERIC NOT NULL DEFAULT 1,
  impressions_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  revenue_sum NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(test_name, intent, variant_key)
);

ALTER TABLE mvt_arm_params ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read mvt_arm_params" ON mvt_arm_params FOR SELECT USING (true);
CREATE POLICY "Public can insert mvt_arm_params" ON mvt_arm_params FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update mvt_arm_params" ON mvt_arm_params FOR UPDATE USING (true);

-- MVT impressions log
CREATE TABLE mvt_impressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  intent TEXT,
  variant_key TEXT NOT NULL,
  device_type TEXT,
  utm_source TEXT,
  sampled_theta NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mvt_impressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert mvt_impressions" ON mvt_impressions FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read mvt_impressions" ON mvt_impressions FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- RPC functions for Thompson Sampling
CREATE OR REPLACE FUNCTION increment_arm_alpha(
  p_test_name TEXT,
  p_intent TEXT,
  p_variant_key TEXT,
  p_revenue NUMERIC DEFAULT 0
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta, conversions_count, revenue_sum)
  VALUES (p_test_name, p_intent, p_variant_key, 2, 1, 1, p_revenue)
  ON CONFLICT (test_name, intent, variant_key)
  DO UPDATE SET
    alpha = mvt_arm_params.alpha + 1,
    conversions_count = mvt_arm_params.conversions_count + 1,
    revenue_sum = mvt_arm_params.revenue_sum + p_revenue,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION increment_arm_beta(
  p_test_name TEXT,
  p_intent TEXT,
  p_variant_key TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO mvt_arm_params (test_name, intent, variant_key, alpha, beta)
  VALUES (p_test_name, p_intent, p_variant_key, 1, 2)
  ON CONFLICT (test_name, intent, variant_key)
  DO UPDATE SET
    beta = mvt_arm_params.beta + 1,
    updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION increment_arm_impressions(
  p_test_name TEXT,
  p_intent TEXT,
  p_variant_key TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO mvt_arm_params (test_name, intent, variant_key, impressions_count, alpha, beta)
  VALUES (p_test_name, p_intent, p_variant_key, 1, 1, 1)
  ON CONFLICT (test_name, intent, variant_key)
  DO UPDATE SET
    impressions_count = mvt_arm_params.impressions_count + 1,
    updated_at = now();
END;
$$;