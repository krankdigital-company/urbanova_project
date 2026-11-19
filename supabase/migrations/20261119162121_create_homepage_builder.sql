CREATE TABLE public.home_blocks (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  block_type text NOT NULL,
  title text NOT NULL DEFAULT '',
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.home_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.home_blocks TO authenticated;
GRANT ALL ON public.home_blocks TO service_role;

ALTER TABLE public.home_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read visible home blocks" ON public.home_blocks
  FOR SELECT USING (is_visible = true);
CREATE POLICY "admins manage home blocks" ON public.home_blocks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_updated_at_home_blocks
  BEFORE UPDATE ON public.home_blocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.promo_banners
  ADD COLUMN IF NOT EXISTS cta_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS video_url text NOT NULL DEFAULT '';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.sections) THEN
    INSERT INTO public.home_blocks (id, block_type, title, settings, is_visible, sort_order)
    SELECT
      'legacy-' || key,
      key,
      label,
      '{}'::jsonb,
      is_visible,
      sort_order * 100
    FROM public.sections
    WHERE key IN (
      'hero', 'eco', 'collections', 'promos',
      'lookbook', 'sustainability', 'instagram', 'newsletter'
    )
    ON CONFLICT (id) DO NOTHING;
  ELSE
    INSERT INTO public.home_blocks (id, block_type, title, sort_order) VALUES
      ('legacy-hero', 'hero', 'Hero Slider', 0),
      ('legacy-eco', 'eco', 'Eco Impact Ticker', 100),
      ('legacy-collections', 'collections', 'Featured Collections', 200),
      ('legacy-new-arrivals', 'new_arrivals', 'New Arrivals', 210),
      ('legacy-promos', 'promos', 'Promo Banners', 500),
      ('legacy-lookbook', 'lookbook', 'Shop The Look', 600),
      ('legacy-sustainability', 'sustainability', 'Sustainable Lab', 700),
      ('legacy-instagram', 'instagram', 'Instagram Gallery', 800),
      ('legacy-newsletter', 'newsletter', 'Newsletter', 900);
  END IF;
END $$;

INSERT INTO public.home_blocks (id, block_type, title, sort_order)
SELECT
  'legacy-new-arrivals',
  'new_arrivals',
  COALESCE((SELECT label FROM public.sections WHERE key = 'new_arrivals'), 'New Arrivals'),
  (SELECT sort_order FROM public.home_blocks WHERE block_type = 'collections' ORDER BY sort_order LIMIT 1) + 10
WHERE EXISTS (
  SELECT 1 FROM public.home_blocks WHERE block_type = 'collections' AND is_visible = true
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.home_blocks (id, block_type, title, settings, sort_order)
SELECT
  'legacy-category-' || id::text,
  'category',
  name,
  jsonb_build_object('categorySlug', slug, 'layout', 'carousel'),
  (SELECT sort_order FROM public.home_blocks WHERE block_type = 'new_arrivals' AND is_visible = true ORDER BY sort_order LIMIT 1) + 10 + sort_order
FROM public.product_categories
WHERE show_on_home = true
  AND EXISTS (
    SELECT 1 FROM public.home_blocks WHERE block_type = 'collections' AND is_visible = true
  )
ON CONFLICT (id) DO NOTHING;
