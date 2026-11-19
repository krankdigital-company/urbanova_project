ALTER TABLE public.hero_slides
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS video_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cta_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS secondary_cta_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS secondary_cta_url text NOT NULL DEFAULT '';
