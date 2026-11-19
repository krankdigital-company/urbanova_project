DROP VIEW IF EXISTS public.payment_methods_public;

-- Column-level access: public may read payment options but NOT account numbers
GRANT SELECT (id, key, label, description, requires_txn_id, is_enabled, sort_order)
  ON public.payment_methods TO anon, authenticated;

CREATE POLICY "public read enabled payment_methods"
ON public.payment_methods FOR SELECT TO anon, authenticated
USING (is_enabled = true);
