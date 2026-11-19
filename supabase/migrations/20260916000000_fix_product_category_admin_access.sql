DROP POLICY IF EXISTS "managers manage categories" ON public.product_categories;

CREATE POLICY "managers manage categories" ON public.product_categories
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'manager', 'editor')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'manager', 'editor')
  )
);