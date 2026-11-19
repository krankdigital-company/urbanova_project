-- The storefront only needs these non-sensitive payment fields.
-- Merchant account numbers and customer instructions remain private.
GRANT SELECT (id, key, label, description, requires_txn_id, is_enabled, sort_order)
  ON public.payment_methods TO anon, authenticated;

DROP POLICY IF EXISTS "public read enabled payment_methods" ON public.payment_methods;
CREATE POLICY "public read enabled payment_methods"
ON public.payment_methods FOR SELECT TO anon, authenticated
USING (is_enabled = true);
