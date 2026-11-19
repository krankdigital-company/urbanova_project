ALTER TABLE public.product_categories
ADD COLUMN IF NOT EXISTS home_tag text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS home_description text NOT NULL DEFAULT '';