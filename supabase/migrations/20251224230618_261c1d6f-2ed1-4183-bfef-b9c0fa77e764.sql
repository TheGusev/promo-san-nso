-- Исправляем функцию с правильным search_path
CREATE OR REPLACE FUNCTION public.generate_review_code()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT upper(substr(md5(random()::text), 1, 6))
$$;