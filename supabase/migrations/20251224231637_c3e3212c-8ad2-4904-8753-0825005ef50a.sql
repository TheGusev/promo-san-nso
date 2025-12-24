INSERT INTO public.user_roles (user_id, role)
VALUES ('ae31df52-923b-4df4-b79d-714306cd640a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;