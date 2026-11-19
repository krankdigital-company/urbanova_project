-- Supabase Storage Setup
-- This script creates the required 'site-assets' storage bucket for admin uploads.
-- Run this in the Supabase SQL Editor to set up storage.

-- Create storage bucket for site assets (logos, favicons, product images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public read access to the bucket
CREATE POLICY "Allow public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

-- Allow authenticated admins to upload files
CREATE POLICY "Allow admin uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'site-assets'
    AND auth.role() = 'authenticated'
  );

-- Allow admins to delete their own uploads
CREATE POLICY "Allow admin deletes"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'site-assets'
    AND auth.role() = 'authenticated'
  );
