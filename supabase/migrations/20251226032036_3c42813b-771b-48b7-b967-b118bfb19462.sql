-- Разрешить админам обновлять заявки
CREATE POLICY "Admins can update leads" ON public.leads
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Разрешить админам удалять заявки  
CREATE POLICY "Admins can delete leads" ON public.leads
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Добавить функцию сброса параметров MVT-теста
CREATE OR REPLACE FUNCTION public.reset_mvt_arm_params(p_test_name TEXT, p_intent TEXT DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_intent IS NULL THEN
    UPDATE mvt_arm_params
    SET alpha = 1, beta = 1, impressions_count = 0, conversions_count = 0, revenue_sum = 0, updated_at = now()
    WHERE test_name = p_test_name;
  ELSE
    UPDATE mvt_arm_params
    SET alpha = 1, beta = 1, impressions_count = 0, conversions_count = 0, revenue_sum = 0, updated_at = now()
    WHERE test_name = p_test_name AND intent = p_intent;
  END IF;
END;
$$;