-- =====================================================
-- CRITICAL SECURITY FIX: MVT Tables RLS Policies
-- Removing public access, restricting to admin-only
-- =====================================================

-- 1. Drop insecure public policies on mvt_arm_params
DROP POLICY IF EXISTS "Public can read mvt_arm_params" ON mvt_arm_params;
DROP POLICY IF EXISTS "Public can insert mvt_arm_params" ON mvt_arm_params;
DROP POLICY IF EXISTS "Public can update mvt_arm_params" ON mvt_arm_params;

-- 2. Drop insecure public read policy on mvt_test_config
DROP POLICY IF EXISTS "Public can read active mvt_test_config" ON mvt_test_config;

-- 3. Create secure admin-only policies for mvt_arm_params
CREATE POLICY "Only admins can read mvt_arm_params" 
ON mvt_arm_params
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage mvt_arm_params" 
ON mvt_arm_params
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- 4. Create secure admin-only policy for mvt_test_config
CREATE POLICY "Only admins can read mvt_test_config" 
ON mvt_test_config
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Note: Edge functions use service_role key and will continue to work
-- This protects sensitive MVT data from public access while maintaining functionality