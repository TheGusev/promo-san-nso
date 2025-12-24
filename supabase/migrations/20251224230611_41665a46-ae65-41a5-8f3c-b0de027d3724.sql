-- Добавляем поля для кода отзыва в таблицу leads
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS review_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS review_code_used BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS review_code_expires_at TIMESTAMPTZ;

-- Создаём таблицу отзывов
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    display_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    object_type TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    is_rejected BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID
);

-- Включаем RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Политика: публичное чтение одобренных отзывов
CREATE POLICY "Public can read approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true);

-- Политика: публичная вставка отзывов (проверка кода в edge function)
CREATE POLICY "Public can insert reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

-- Политика: админы могут читать все отзывы
CREATE POLICY "Admins can read all reviews" ON public.reviews
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Политика: админы могут обновлять отзывы (модерация)
CREATE POLICY "Admins can update reviews" ON public.reviews
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Политика: админы могут удалять отзывы
CREATE POLICY "Admins can delete reviews" ON public.reviews
    FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Функция генерации 6-символьного кода
CREATE OR REPLACE FUNCTION public.generate_review_code()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT upper(substr(md5(random()::text), 1, 6))
$$;