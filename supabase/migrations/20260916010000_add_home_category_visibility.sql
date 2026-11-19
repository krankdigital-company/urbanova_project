ALTER TABLE public.product_categories
ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT true;