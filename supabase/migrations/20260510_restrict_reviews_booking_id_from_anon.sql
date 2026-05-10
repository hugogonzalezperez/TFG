-- MED-2: Restringir columnas visibles de reviews para anon.
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, garage_id, user_id, rating, comment, created_at, updated_at) ON public.reviews TO anon;
DROP POLICY IF EXISTS "Authenticated can view reviews" ON public.reviews;
CREATE POLICY "Authenticated can view reviews" ON public.reviews FOR SELECT TO authenticated USING (true);
