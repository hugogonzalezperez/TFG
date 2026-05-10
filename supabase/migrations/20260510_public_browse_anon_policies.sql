-- ================================================================
-- MIGRATION: 20260510_public_browse_anon_policies.sql
-- Contexto: El mapa y la homepage se hicieron públicos (freemium model).
-- fetchGaragesWithSpots() necesita acceso a 7 tablas para anon.
--
-- Antes, todas las rutas con el mapa eran ProtectedRoute → solo
-- usuarios autenticados llegaban aquí → anon nunca hacía queries.
--
-- La migración CRIT-E (20260429) hizo REVOKE SELECT ON bookings FROM anon
-- para evitar PII. Lo restauramos aquí SOLO con columnas no-PII y
-- una policy que restringe a reservas activas/confirmadas.
--
-- Tablas afectadas:
--   garages            → anon SELECT WHERE is_active = true
--   parking_spots      → anon SELECT
--   parking_spot_images→ anon SELECT
--   bookings           → anon SELECT (id, parking_spot_id, start_time, end_time, status ONLY)
--   garage_images      → anon SELECT
--   reviews            → anon SELECT
--   users              → anon SELECT (id, name, avatar_url ONLY, solo owners)
-- ================================================================

-- ── 1. GARAGES ──────────────────────────────────────────────────
-- El mapa y home ahora son públicos. Anon puede ver garajes activos.

DROP POLICY IF EXISTS "Public can view active garages" ON public.garages;
CREATE POLICY "Public can view active garages"
  ON public.garages FOR SELECT TO anon
  USING (is_active = true);

-- ── 2. PARKING_SPOTS ────────────────────────────────────────────
-- Plazas de garajes activos — visibles públicamente.

DROP POLICY IF EXISTS "Public can view spots" ON public.parking_spots;
CREATE POLICY "Public can view spots"
  ON public.parking_spots FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.garages
      WHERE garages.id = parking_spots.garage_id
        AND garages.is_active = true
    )
  );

-- ── 3. PARKING_SPOT_IMAGES ──────────────────────────────────────

DROP POLICY IF EXISTS "Public can view spot images" ON public.parking_spot_images;
CREATE POLICY "Public can view spot images"
  ON public.parking_spot_images FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.parking_spots ps
      JOIN public.garages g ON ps.garage_id = g.id
      WHERE ps.id = parking_spot_images.parking_spot_id
        AND g.is_active = true
    )
  );

-- ── 4. BOOKINGS — restaurar acceso anon MUY restringido ─────────
-- CRIT-E (20260429) hizo REVOKE SELECT ON bookings FROM anon para
-- evitar PII (renter_id, vehicle_plate, etc.) expuesto al público.
--
-- Se restaura con GRANT COLUMN-LEVEL: solo columnas necesarias para
-- mostrar disponibilidad en mapa. PII (renter_id, vehicle_plate,
-- vehicle_description, total_price) siguen sin grant → anon no las lee.
--
-- La policy solo expone reservas activas/confirmadas (no historial).
-- El frontend solo usa estas columnas: id, start_time, end_time, status.

GRANT SELECT (id, parking_spot_id, start_time, end_time, status)
  ON public.bookings TO anon;

DROP POLICY IF EXISTS "Public can view booking slots for availability" ON public.bookings;
CREATE POLICY "Public can view booking slots for availability"
  ON public.bookings FOR SELECT TO anon
  USING (status IN ('confirmed', 'active'));

-- ── 5. GARAGE_IMAGES ────────────────────────────────────────────

DROP POLICY IF EXISTS "Public can view garage images" ON public.garage_images;
CREATE POLICY "Public can view garage images"
  ON public.garage_images FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM public.garages
      WHERE garages.id = garage_images.garage_id
        AND garages.is_active = true
    )
  );

-- ── 6. REVIEWS ──────────────────────────────────────────────────
-- Solo rating y garage_id necesarios para mostrar valoraciones en mapa.
-- user_id y booking_id ya están protegidos por no tener GRANT para anon.

DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews"
  ON public.reviews FOR SELECT TO anon
  USING (true);

-- ── 7. USERS — solo owners de garajes activos, solo columnas públicas ──
-- La query hace owner:users(id, name, avatar_url) para mostrar info
-- del propietario en el mapa. Solo necesitamos esas 3 columnas.
--
-- ATENCIÓN: Supabase da GRANT SELECT (table-level) a anon por defecto.
-- Un GRANT SELECT (cols) adicional sin revocar el table-level es redundante
-- → anon vería TODAS las columnas (email, phone, etc.) si la policy lo permite.
-- Fix: REVOKE table-level SELECT primero, luego GRANT column-level.

REVOKE SELECT ON public.users FROM anon;

-- Solo las 3 columnas públicas necesarias para mostrar el owner en el mapa
GRANT SELECT (id, name, avatar_url)
  ON public.users TO anon;

DROP POLICY IF EXISTS "Public can view owner profiles" ON public.users;
CREATE POLICY "Public can view owner profiles"
  ON public.users FOR SELECT TO anon
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.garages
      WHERE garages.owner_id = users.id
        AND garages.is_active = true
    )
  );
