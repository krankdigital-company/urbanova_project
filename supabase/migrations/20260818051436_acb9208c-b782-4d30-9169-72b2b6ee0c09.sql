REVOKE SELECT ON public.payment_methods FROM authenticated;

GRANT SELECT (id, key, label, description, requires_txn_id, is_enabled, sort_order)
  ON public.payment_methods TO authenticated;

GRANT ALL ON public.payment_methods TO service_role;
