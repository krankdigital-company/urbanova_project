ALTER TABLE public.payment_methods
  ADD COLUMN IF NOT EXISTS integration_mode text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS merchant_id text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS store_id text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS store_password text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS app_key text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS app_secret text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS api_username text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS api_password text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS api_base_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS success_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS fail_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cancel_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ipn_url text NOT NULL DEFAULT '';

INSERT INTO public.payment_methods (key, label, description, integration_mode, is_enabled, sort_order)
VALUES
  ('sslcommerz', 'SSLCommerz', 'Pay securely through SSLCommerz hosted checkout.', 'manual', false, 4)
ON CONFLICT (key) DO NOTHING;