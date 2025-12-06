-- Включаем расширения для планировщика задач
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Даём доступ к cron схеме
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

-- Индексы для быстрого удаления по дате
CREATE INDEX IF NOT EXISTS idx_traffic_events_timestamp ON traffic_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Таблица логов очистки
CREATE TABLE IF NOT EXISTS public.data_cleanup_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deleted_traffic_events INTEGER NOT NULL DEFAULT 0,
  deleted_leads INTEGER NOT NULL DEFAULT 0,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS для логов
ALTER TABLE public.data_cleanup_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read cleanup logs"
  ON public.data_cleanup_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Функция очистки старых данных
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_traffic_events INTEGER;
  deleted_leads INTEGER;
  retention_days INTEGER := 90;
BEGIN
  -- Удаляем старые traffic_events
  DELETE FROM traffic_events
  WHERE timestamp < NOW() - (retention_days || ' days')::INTERVAL;
  GET DIAGNOSTICS deleted_traffic_events = ROW_COUNT;

  -- Удаляем старые leads
  DELETE FROM leads
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
  GET DIAGNOSTICS deleted_leads = ROW_COUNT;

  -- Логируем результат
  INSERT INTO data_cleanup_logs (deleted_traffic_events, deleted_leads)
  VALUES (deleted_traffic_events, deleted_leads);

  -- Возвращаем результат
  RETURN jsonb_build_object(
    'deleted_traffic_events', deleted_traffic_events,
    'deleted_leads', deleted_leads,
    'retention_days', retention_days,
    'executed_at', NOW()
  );
END;
$$;

-- Cron задача: каждый день в 03:00 UTC (06:00 Новосибирск)
SELECT cron.schedule(
  'cleanup-old-data-daily',
  '0 3 * * *',
  $$SELECT cleanup_old_data()$$
);