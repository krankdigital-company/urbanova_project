INSERT INTO public.site_settings (key, value)
VALUES ('general', jsonb_build_object('favicon_url', '/favicon.ico'))
ON CONFLICT (key)
DO UPDATE SET
  value = COALESCE(public.site_settings.value, '{}'::jsonb) || EXCLUDED.value,
  updated_at = now();
