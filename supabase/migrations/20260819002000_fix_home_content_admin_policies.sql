-- Use a direct role check for home-content writes. This avoids depending on
-- EXECUTE permissions for helper functions in RLS policies.
DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'products',
    'collections',
    'hero_slides',
    'promo_banners',
    'eco_metrics',
    'materials',
    'lookbook_outfits',
    'instagram_posts',
    'sections',
    'site_settings'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admins manage %1$s" ON public.%1$I', table_name);
    EXECUTE format(
      'CREATE POLICY "admins manage %1$s" ON public.%1$I FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = ''admin''::public.app_role)) WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = ''admin''::public.app_role))',
      table_name
    );
  END LOOP;
END $$;
