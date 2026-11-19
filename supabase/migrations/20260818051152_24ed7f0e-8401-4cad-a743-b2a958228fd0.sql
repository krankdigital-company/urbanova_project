-- 1. Payment methods: stop exposing merchant account numbers publicly
DROP POLICY IF EXISTS "public read payment_methods" ON public.payment_methods;

REVOKE SELECT ON public.payment_methods FROM anon;

CREATE OR REPLACE VIEW public.payment_methods_public AS
SELECT id, key, label, description, requires_txn_id, is_enabled, sort_order
FROM public.payment_methods
WHERE is_enabled = true;

GRANT SELECT ON public.payment_methods_public TO anon, authenticated;

-- staff can still read the full table
CREATE POLICY "staff read payment_methods"
ON public.payment_methods FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

-- 2. Site settings: only whitelisted public keys are world-readable
DROP POLICY IF EXISTS "public read site_settings" ON public.site_settings;

CREATE POLICY "public read general site_settings"
ON public.site_settings FOR SELECT TO anon, authenticated
USING (key = 'general');
