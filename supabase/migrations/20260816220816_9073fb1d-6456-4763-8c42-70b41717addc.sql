DROP POLICY IF EXISTS "staff manage site images" ON storage.objects;
CREATE POLICY "staff manage site images" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'site-images' AND public.is_staff(auth.uid()))
WITH CHECK (bucket_id = 'site-images' AND public.is_staff(auth.uid()));