-- ================================================================
-- MIGRATION: 20260502_performance_security_cleanup.sql
-- Auditoría: 2026-05-02
--
-- P-1  3 foreign keys sin índice → joins lentos en carga real
--      booking_access_logs.booking_id, favorites.parking_spot_id,
--      pricing_rules.parking_spot_id
--
-- P-2  auth_rls_initplan en ~40 policies
--      auth.uid() es VOLATILE → PostgreSQL la re-evalúa por cada fila.
--      (SELECT auth.uid()) fuerza un scalar subplan evaluado una vez
--      por statement. Impacto: O(n) → O(1) en tablas con carga real.
--
-- P-3  6 policies redundantes eliminadas (misma lógica cubierta por ALL):
--      - bookings: "Users can view their own bookings" (duplicado exacto)
--      - garage_images: DELETE + INSERT + UPDATE individuales (ALL las cubre)
--      - parking_spots: "Users can delete their own spots" (ALL la cubre)
--      - users: "Users can update their own session ID" (duplicado exacto)
--
-- S-1  2 policies SELECT de favorites con rol {public} → {authenticated}
--      auth.uid()=NULL para anon las hace inofensivas en la práctica,
--      pero el rol correcto es authenticated.
--
-- S-2  Bucket listing restringido: avatars + garage_images
--      Policy SELECT actual: bucket_id = 'X' → cualquier anon puede listar
--      TODOS los archivos del bucket via storage API.
--      Fix: restringir SELECT al propio folder del usuario autenticado.
--      URLs públicas directas (object/public/...) NO se ven afectadas
--      porque los buckets son públicos — RLS solo aplica a listings SDK.
--
-- Notas:
--   - Policies sobre public (is_active=true, true) no usan auth.uid(),
--     no necesitan initplan fix y se mantienen sin cambio.
--   - Toda la lógica de negocio de cada policy es idéntica a la original.
--     Solo cambian: rol, search eval, y eliminación de duplicados.
-- ================================================================


-- ================================================================
-- SECCIÓN A: Índices en foreign keys sin cubrir (P-1)
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_booking_access_logs_booking_id
  ON public.booking_access_logs (booking_id);

CREATE INDEX IF NOT EXISTS idx_favorites_parking_spot_id
  ON public.favorites (parking_spot_id);

CREATE INDEX IF NOT EXISTS idx_pricing_rules_parking_spot_id
  ON public.pricing_rules (parking_spot_id);


-- ================================================================
-- SECCIÓN B: Buckets — prevenir listing sin romper URLs públicas (S-2)
-- Los buckets son públicos → los archivos son accesibles via URL directa
-- sin pasar por RLS. La policy SELECT en storage.objects solo afecta
-- al listing via SDK (.list(), storage/v1/object/list).
-- Nuevo comportamiento: cada usuario puede listar su propio folder,
-- nadie puede listar el bucket completo.
-- ================================================================

DROP POLICY IF EXISTS "Avatar Public Select" ON storage.objects;
CREATE POLICY "Avatar Public Select"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Garage Public Select" ON storage.objects;
CREATE POLICY "Garage Public Select"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'garage_images'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );


-- ================================================================
-- SECCIÓN C: Eliminar policies redundantes (P-3)
-- ================================================================

-- bookings: "Users can view their own bookings" es duplicado exacto de
-- "Users can view own bookings" (misma USING, mismo rol, mismo cmd)
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- garage_images: "Owners can manage garage images" (ALL) ya cubre
-- DELETE, INSERT y UPDATE. Las individuales son OR redundante.
-- Para INSERT: cuando ALL no tiene WITH CHECK, PostgreSQL usa USING
-- como WITH CHECK → comportamiento idéntico a la policy individual.
DROP POLICY IF EXISTS "Owners can delete their garage images" ON public.garage_images;
DROP POLICY IF EXISTS "Owners can insert garage images" ON public.garage_images;
DROP POLICY IF EXISTS "Owners can update garage images" ON public.garage_images;

-- parking_spots: "Users can delete their own spots" duplica la cobertura
-- DELETE de "Owners can manage own spots" (ALL)
DROP POLICY IF EXISTS "Users can delete their own spots" ON public.parking_spots;

-- users: "Users can update their own session ID" es duplicado exacto de
-- "Users can update own data" (mismo USING, mismo cmd)
DROP POLICY IF EXISTS "Users can update their own session ID" ON public.users;


-- ================================================================
-- SECCIÓN D: Reescribir todas las policies con auth.uid() (P-2 + S-1)
-- Patrón: auth.uid() → (SELECT auth.uid())
-- Se incluyen también los cambios S-1 (favorites {public} → {authenticated})
-- ================================================================

-- ── booking_access_logs ──────────────────────────────────────────

DROP POLICY IF EXISTS "Users can insert access logs for their own bookings" ON public.booking_access_logs;
CREATE POLICY "Users can insert access logs for their own bookings"
  ON public.booking_access_logs FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = booking_access_logs.booking_id
      AND b.renter_id = (SELECT auth.uid())
      AND b.status = 'active'::booking_status
  ));

DROP POLICY IF EXISTS "Owners can view access logs of their spots" ON public.booking_access_logs;
CREATE POLICY "Owners can view access logs of their spots"
  ON public.booking_access_logs FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM bookings b
    JOIN parking_spots ps ON b.parking_spot_id = ps.id
    JOIN garages g ON ps.garage_id = g.id
    WHERE b.id = booking_access_logs.booking_id
      AND g.owner_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can view their own booking logs" ON public.booking_access_logs;
CREATE POLICY "Users can view their own booking logs"
  ON public.booking_access_logs FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id = booking_access_logs.booking_id
      AND bookings.renter_id = (SELECT auth.uid())
  ));

-- ── bookings ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Owners can delete bookings for their garages" ON public.bookings;
CREATE POLICY "Owners can delete bookings for their garages"
  ON public.bookings FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parking_spots ps
    JOIN garages g ON ps.garage_id = g.id
    WHERE ps.id = bookings.parking_spot_id
      AND g.owner_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
CREATE POLICY "Users can delete their own bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (renter_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = renter_id);

DROP POLICY IF EXISTS "Owners can view bookings for their garages" ON public.bookings;
CREATE POLICY "Owners can view bookings for their garages"
  ON public.bookings FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parking_spots ps
    JOIN garages g ON ps.garage_id = g.id
    WHERE ps.id = bookings.parking_spot_id
      AND g.owner_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = renter_id);

DROP POLICY IF EXISTS "Owners can update bookings on their spots" ON public.bookings;
CREATE POLICY "Owners can update bookings on their spots"
  ON public.bookings FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parking_spots ps
    JOIN garages g ON ps.garage_id = g.id
    WHERE ps.id = bookings.parking_spot_id
      AND g.owner_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM parking_spots ps
    JOIN garages g ON ps.garage_id = g.id
    WHERE ps.id = bookings.parking_spot_id
      AND g.owner_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Renters can update own bookings" ON public.bookings;
CREATE POLICY "Renters can update own bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (renter_id = (SELECT auth.uid()))
  WITH CHECK (renter_id = (SELECT auth.uid()));

-- ── favorites ────────────────────────────────────────────────────
-- S-1: {public} → {authenticated} en las dos SELECT policies

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
CREATE POLICY "Users can insert their own favorites"
  ON public.favorites FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Owners can view who favorited their spots" ON public.favorites;
CREATE POLICY "Owners can view who favorited their spots"
  ON public.favorites FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parking_spots
    WHERE parking_spots.id = favorites.parking_spot_id
      AND parking_spots.owner_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ── garage_images ────────────────────────────────────────────────
-- Solo se reescribe el ALL (los individuales ya se borraron en sección C)

DROP POLICY IF EXISTS "Owners can manage garage images" ON public.garage_images;
CREATE POLICY "Owners can manage garage images"
  ON public.garage_images FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM garages
    WHERE garages.id = garage_images.garage_id
      AND garages.owner_id = (SELECT auth.uid())
  ));

-- ── garages ──────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can delete their own garages" ON public.garages;
CREATE POLICY "Users can delete their own garages"
  ON public.garages FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Owners can insert garages" ON public.garages;
CREATE POLICY "Owners can insert garages"
  ON public.garages FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Owners can view own garages" ON public.garages;
CREATE POLICY "Owners can view own garages"
  ON public.garages FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Owners can update own garages" ON public.garages;
CREATE POLICY "Owners can update own garages"
  ON public.garages FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

-- ── parking_spot_images ──────────────────────────────────────────

DROP POLICY IF EXISTS "Owners can delete parking spot images" ON public.parking_spot_images;
CREATE POLICY "Owners can delete parking spot images"
  ON public.parking_spot_images FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parking_spots
    WHERE parking_spots.id = parking_spot_images.parking_spot_id
      AND parking_spots.owner_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Owners can insert parking spot images" ON public.parking_spot_images;
CREATE POLICY "Owners can insert parking spot images"
  ON public.parking_spot_images FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM parking_spots
    WHERE parking_spots.id = parking_spot_images.parking_spot_id
      AND parking_spots.owner_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Owners can update parking spot images" ON public.parking_spot_images;
CREATE POLICY "Owners can update parking spot images"
  ON public.parking_spot_images FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parking_spots
    WHERE parking_spots.id = parking_spot_images.parking_spot_id
      AND parking_spots.owner_id = (SELECT auth.uid())
  ));

-- ── parking_spots ────────────────────────────────────────────────
-- Solo reescribir ALL (el DELETE individual ya se borró en sección C)

DROP POLICY IF EXISTS "Owners can manage own spots" ON public.parking_spots;
CREATE POLICY "Owners can manage own spots"
  ON public.parking_spots FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

-- ── price_history ────────────────────────────────────────────────

DROP POLICY IF EXISTS "Owners can insert in price_history via triggers" ON public.price_history;
CREATE POLICY "Owners can insert in price_history via triggers"
  ON public.price_history FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM parking_spots
    WHERE parking_spots.id = price_history.parking_spot_id
      AND parking_spots.owner_id = (SELECT auth.uid())
  ));

DROP POLICY IF EXISTS "Owners can view their spot price history" ON public.price_history;
CREATE POLICY "Owners can view their spot price history"
  ON public.price_history FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parking_spots
    WHERE parking_spots.id = price_history.parking_spot_id
      AND parking_spots.owner_id = (SELECT auth.uid())
  ));

-- ── pricing_rules ────────────────────────────────────────────────

DROP POLICY IF EXISTS "Owners manage pricing rules" ON public.pricing_rules;
CREATE POLICY "Owners manage pricing rules"
  ON public.pricing_rules FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM parking_spots
    WHERE parking_spots.id = pricing_rules.parking_spot_id
      AND parking_spots.owner_id = (SELECT auth.uid())
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM parking_spots
    WHERE parking_spots.id = pricing_rules.parking_spot_id
      AND parking_spots.owner_id = (SELECT auth.uid())
  ));

-- ── reviews ──────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
CREATE POLICY "Users can create reviews"
  ON public.reviews FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ── user_roles ───────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ── users ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
CREATE POLICY "Enable insert for authenticated users"
  ON public.users FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

-- Fusiona "Users can update own data" + "Users can update their own session ID"
-- (el segundo ya se borró en sección C — solo reescribir el primero)
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);
