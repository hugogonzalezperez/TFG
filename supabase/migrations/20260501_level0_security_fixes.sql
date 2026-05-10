-- ============================================================
-- NIVEL 0 — Security Critical Fixes
-- CRIT-1: IDOR en updateBookingStatus (RLS UPDATE policy)
-- CRIT-2: Sin CHECK total_price > 0 / base_price > 0
-- HIGH-1: Sin CHECK end_time > start_time
-- ============================================================

-- HIGH-1: Coherencia temporal de reservas
ALTER TABLE public.bookings
  ADD CONSTRAINT check_booking_time_order CHECK (end_time > start_time);

-- CRIT-2: Precio total debe ser positivo (previene reservas gratuitas)
ALTER TABLE public.bookings
  ADD CONSTRAINT check_booking_price_positive CHECK (total_price > 0);

-- CRIT-2: Precio base de plaza debe ser positivo
ALTER TABLE public.parking_spots
  ADD CONSTRAINT check_base_price_positive CHECK (base_price_per_hour > 0);

ALTER TABLE public.parking_spots
  ADD CONSTRAINT check_current_price_positive CHECK (current_price_per_hour > 0);

-- CRIT-2: Multiplicador de precio debe ser positivo (evita que precios calculados sean 0)
ALTER TABLE public.pricing_rules
  ADD CONSTRAINT check_multiplier_positive CHECK (multiplier > 0);

-- CRIT-1: RLS UPDATE policy — renters solo actualizan sus propias reservas
CREATE POLICY "Renters can update own bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (renter_id = auth.uid())
  WITH CHECK (renter_id = auth.uid());

-- CRIT-1: RLS UPDATE policy — owners actualizan reservas de sus plazas
CREATE POLICY "Owners can update bookings on their spots"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parking_spots ps
      JOIN public.garages g ON ps.garage_id = g.id
      WHERE ps.id = public.bookings.parking_spot_id
        AND g.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.parking_spots ps
      JOIN public.garages g ON ps.garage_id = g.id
      WHERE ps.id = public.bookings.parking_spot_id
        AND g.owner_id = auth.uid()
    )
  );
