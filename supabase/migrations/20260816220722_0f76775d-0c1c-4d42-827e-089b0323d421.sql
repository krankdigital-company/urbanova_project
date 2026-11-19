ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator';

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS detail_blocks jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  show_in_header boolean NOT NULL DEFAULT false,
  show_in_footer boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read categories" ON public.product_categories;
CREATE POLICY "public read categories" ON public.product_categories FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "managers manage categories" ON public.product_categories;
CREATE POLICY "managers manage categories" ON public.product_categories FOR ALL TO authenticated
USING (public.is_manager(auth.uid())) WITH CHECK (public.is_manager(auth.uid()));

DROP TRIGGER IF EXISTS set_product_categories_updated_at ON public.product_categories;
CREATE TRIGGER set_product_categories_updated_at BEFORE UPDATE ON public.product_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();