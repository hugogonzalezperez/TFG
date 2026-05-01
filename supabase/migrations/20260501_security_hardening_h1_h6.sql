-- =============================================================
-- MIGRATION: 20260501_security_hardening_h1_h6.sql
-- Auditoría: 2026-05-01 — Pentest / Supabase Advisor
-- Issues resueltos:
--
--   H-1  4 RLS policies con rol {public} en vez de {authenticated}
--        → bookings DELETE x2, favorites INSERT+DELETE
--        → auth.uid()=NULL protege en la práctica, pero la configuración
--          es incorrecta y frágil ante cambios futuros de autenticación.
--
--   H-2  complete_past_bookings() ejecutable por anon como SECURITY DEFINER
--        → Cualquier usuario anónimo podía forzar transiciones de estado
--          en TODAS las reservas via POST /rest/v1/rpc/complete_past_bookings.
--        → Solo se revoca anon (authenticated necesita la función; la llaman
--          booking.dal.ts:123 y profile.dal.ts:90 desde el cliente React).
--
--   H-3  check_parking_spot_availability() SECURITY INVOKER roto para anon
--        → La migración 20260429_fix_bookings_rls_pii.sql revocó SELECT en
--          bookings para anon. Como la función es SECURITY INVOKER, corre con
--          los permisos del caller (anon). Al no poder leer bookings, el query
--          devuelve count=0 → siempre retorna TRUE (plaza disponible). BUG silencioso.
--        → Fix: cambiar a SECURITY DEFINER + SET search_path = 'public'.
--          El resultado sigue siendo solo BOOLEAN — no expone datos de reservas.
--
--   H-4  11 funciones sin SET search_path (search_path hijacking)
--        → Una función SECURITY DEFINER sin search_path fijo puede ser víctima
--          de hijacking: un atacante con permisos de crear schemas puede crear
--          objetos en otro schema que la función ejecutaría en lugar de public.
--        → Fix: SET search_path = 'public' en todas las funciones.
--          Se aplica también a SECURITY INVOKER por defense in depth.
--
--   H-5  Funciones de trigger expuestas via RPC a anon/authenticated
--        → handle_new_user, handle_updated_at, promote_to_owner_on_garage_insert,
--          check_booking_overlap, log_price_change, prevent_email_change,
--          update_updated_at_column son trigger functions. El mecanismo de trigger
--          de PostgreSQL no requiere EXECUTE privilege para el usuario que dispara
--          el DML — lo llama el engine internamente. Exponerlas via RPC es surface
--          de ataque sin utilidad legítima.
--
--   H-6  check_spot_availability dead code con acceso público
--        → Confirmado: ningún fichero del frontend la llama (check_spot_availability
--          vs check_parking_spot_availability son dos funciones distintas).
--          Se revoca acceso público; se mantiene solo para service_role por si
--          se usa desde Edge Functions en el futuro.
--
-- Precauciones tomadas:
--   - Los cuerpos de todas las funciones son idénticos a los actuales.
--     Solo se añade SET search_path y se cambia SECURITY en H-3.
--   - Se verifica que los grants post-OR REPLACE son explícitos (sección D).
--   - Las policies nuevas son funcionalmente equivalentes a las anteriores
--     excepto por el cambio de rol {public} → {authenticated}.
-- =============================================================


-- =============================================================
-- SECCIÓN A: Corregir RLS policies con rol {public}
-- PostgreSQL asigna PUBLIC por defecto cuando no se especifica TO <role>.
-- Estas 4 policies permiten intentos de escritura/borrado por anon.
-- auth.uid() devuelve NULL para anon → el WHERE falla → no hay efecto real.
-- Pero un cambio en el comportamiento de auth.uid() o en la lógica de
-- la policy podría abrir la brecha. Corregir ahora mientras el coste es cero.
-- =============================================================

-- H-1a: bookings — DELETE policies
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
CREATE POLICY "Users can delete their own bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (renter_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete bookings for their garages" ON public.bookings;
CREATE POLICY "Owners can delete bookings for their garages"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1
    FROM parking_spots ps
    JOIN garages g ON ps.garage_id = g.id
    WHERE ps.id = bookings.parking_spot_id
      AND g.owner_id = auth.uid()
  ));

-- H-1b: favorites — INSERT + DELETE policies
DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
CREATE POLICY "Users can insert their own favorites"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- =============================================================
-- SECCIÓN B: Revocar EXECUTE FROM PUBLIC en todas las funciones
-- PostgreSQL asigna GRANT EXECUTE TO PUBLIC por defecto al crear funciones
-- en un schema público. Esto significa que anon puede llamar cualquier
-- función via /rest/v1/rpc/<nombre> sin autenticación.
-- Estrategia: REVOKE FROM PUBLIC (y de roles no necesarios), luego GRANT selectivo.
-- El REVOKE precede al CREATE OR REPLACE para garantizar que el estado
-- final de grants es el de la sección D, no el default.
-- =============================================================

-- H-5: Trigger-only functions — revocar de todos los roles de API
-- El engine de trigger llama estas funciones internamente.
-- El usuario que ejecuta el DML NO necesita EXECUTE sobre la función trigger.
-- Ref: PostgreSQL docs — "The user who defines the trigger must have EXECUTE
-- privilege, not the user who fires it."
REVOKE EXECUTE ON FUNCTION public.handle_new_user()
  FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_updated_at()
  FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.promote_to_owner_on_garage_insert()
  FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.check_booking_overlap()
  FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.log_price_change()
  FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.prevent_email_change()
  FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()
  FROM PUBLIC, anon, authenticated;

-- H-2: complete_past_bookings — revocar solo anon
-- authenticated se mantiene: booking.dal.ts:123 y profile.dal.ts:90 lo llaman.
-- Nota arquitectónica: idealmente esto debería ser un cron job (Edge Function
-- con pg_cron) en vez de llamarse ad-hoc desde el cliente. Queda pendiente.
REVOKE EXECUTE ON FUNCTION public.complete_past_bookings()
  FROM PUBLIC, anon;
-- authenticated y service_role se re-confirman en sección D.

-- increment/decrement_garage_spots — solo owners autenticados
REVOKE EXECUTE ON FUNCTION public.increment_garage_spots(uuid)
  FROM PUBLIC, anon;

REVOKE EXECUTE ON FUNCTION public.decrement_garage_spots(uuid)
  FROM PUBLIC, anon;

-- get_owner_average_rating — solo authenticated (llamada desde profile.dal.ts
-- en contexto siempre autenticado; si en el futuro se necesita para browsing
-- anon, re-grantar entonces)
REVOKE EXECUTE ON FUNCTION public.get_owner_average_rating(uuid)
  FROM PUBLIC, anon;

-- H-6: check_spot_availability — dead code confirmado, no llamada desde frontend
REVOKE EXECUTE ON FUNCTION public.check_spot_availability(uuid, timestamptz, timestamptz)
  FROM PUBLIC, anon, authenticated;

-- check_parking_spot_availability — revocar anon (solo booking flow, requiere auth)
REVOKE EXECUTE ON FUNCTION public.check_parking_spot_availability(uuid, timestamptz, timestamptz)
  FROM PUBLIC, anon;


-- =============================================================
-- SECCIÓN C: Añadir SET search_path = 'public' en todas las funciones
-- y corregir SECURITY de check_parking_spot_availability (H-3 + H-4).
-- CREATE OR REPLACE preserva ownership y grants existentes post-REVOKE.
-- =============================================================

-- C-1: complete_past_bookings
-- Usa tabla 'bookings' sin schema prefix → requiere search_path = 'public'
CREATE OR REPLACE FUNCTION public.complete_past_bookings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    UPDATE bookings
    SET status = 'active',
        updated_at = NOW()
    WHERE status = 'confirmed'
      AND start_time <= NOW()
      AND end_time > NOW();

    UPDATE bookings
    SET status = 'completed',
        updated_at = NOW()
    WHERE status IN ('confirmed', 'active')
      AND end_time < NOW();
END;
$$;

-- C-2: handle_new_user (trigger SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, avatar_url, is_active)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'Nuevo Usuario'),
    new.raw_user_meta_data->>'phone',
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || COALESCE(new.raw_user_meta_data->>'name', 'Nuevo Usuario')
    ),
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url);

  INSERT INTO public.user_roles (user_id, role_id)
  SELECT new.id, id FROM public.roles WHERE name = 'user'
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$;

-- C-3: handle_updated_at (trigger SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- C-4: promote_to_owner_on_garage_insert (trigger SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.promote_to_owner_on_garage_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    owner_role_id UUID;
BEGIN
    SELECT id INTO owner_role_id FROM public.roles WHERE name = 'owner' LIMIT 1;
    IF owner_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.owner_id, owner_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

-- C-5: increment_garage_spots (SECURITY DEFINER con ownership check)
CREATE OR REPLACE FUNCTION public.increment_garage_spots(garage_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.garages
    WHERE id = garage_id_param AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'No autorizado: no eres el propietario de este garaje';
  END IF;

  UPDATE public.garages
    SET total_spots = total_spots + 1
  WHERE id = garage_id_param;
END;
$$;

-- C-6: decrement_garage_spots (SECURITY DEFINER con ownership check)
CREATE OR REPLACE FUNCTION public.decrement_garage_spots(garage_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.garages
    WHERE id = garage_id_param AND owner_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'No autorizado: no eres el propietario de este garaje';
  END IF;

  UPDATE public.garages
    SET total_spots = GREATEST(0, total_spots - 1)
  WHERE id = garage_id_param;
END;
$$;

-- C-7: get_owner_average_rating (SECURITY DEFINER)
-- Usa 'reviews' y 'garages' sin schema prefix → necesita search_path = 'public'
CREATE OR REPLACE FUNCTION public.get_owner_average_rating(owner_uuid UUID)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    avg_rating NUMERIC;
BEGIN
    SELECT AVG(rating) INTO avg_rating
    FROM reviews r
    JOIN garages g ON r.garage_id = g.id
    WHERE g.owner_id = owner_uuid;

    RETURN ROUND(COALESCE(avg_rating, 0.0), 1);
END;
$$;

-- C-8: check_parking_spot_availability
-- CAMBIO CRÍTICO: SECURITY INVOKER → SECURITY DEFINER
-- Razón: La migración 20260429 revocó SELECT en bookings para anon.
-- Con SECURITY INVOKER, la función corre con los permisos del caller.
-- Si el caller es anon (o authenticated sin ver la reserva), el subquery
-- devuelve 0 → conflict_count = 0 → retorna TRUE (disponible) aunque
-- la plaza esté ocupada. BUG silencioso de lógica.
-- Con SECURITY DEFINER, corre como el propietario de la función y puede
-- leer bookings correctamente. El valor devuelto es solo BOOLEAN —
-- no se expone ningún dato de reservas al caller.
CREATE OR REPLACE FUNCTION public.check_parking_spot_availability(
  p_spot_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    conflict_count integer;
BEGIN
    SELECT count(*) INTO conflict_count
    FROM public.bookings
    WHERE parking_spot_id = p_spot_id
      AND status IN ('confirmed', 'active')
      AND (
          (p_start_time, p_end_time) OVERLAPS (start_time, end_time)
      );

    RETURN conflict_count = 0;
END;
$$;

-- C-9: SECURITY INVOKER trigger functions — search_path por defense in depth
-- Aunque SECURITY INVOKER es menos crítico, el Supabase Advisor las flagea.
-- Sin search_path, si el search_path del caller está manipulado, una función
-- INVOKER también podría resolver tablas en schemas incorrectos.

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    new.updated_at = now();
    RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_price_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    IF (old.current_price_per_hour IS DISTINCT FROM new.current_price_per_hour) THEN
        INSERT INTO public.price_history (parking_spot_id, price_per_hour, reason)
        VALUES (new.id, new.current_price_per_hour, 'manual_update');
    END IF;
    RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_booking_overlap()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.bookings
        WHERE parking_spot_id = NEW.parking_spot_id
          AND status IN ('confirmed', 'active')
          AND id != NEW.id
          AND (NEW.start_time < end_time)
          AND (NEW.end_time > start_time)
    ) THEN
        RAISE EXCEPTION 'Esta plaza ya ha sido reservada para el horario seleccionado (Solapamiento detectado en DB).';
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_email_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
    IF NEW.email IS DISTINCT FROM OLD.email THEN
        RAISE EXCEPTION 'El email no puede modificarse directamente.';
    END IF;
    RETURN NEW;
END;
$$;


-- =============================================================
-- SECCIÓN D: Re-confirmar grants explícitos tras OR REPLACE
-- CREATE OR REPLACE preserva grants existentes en PostgreSQL, pero
-- los REVOKE de la sección B pueden haber eliminado algunos antes
-- del OR REPLACE. Esta sección garantiza el estado final correcto.
-- =============================================================

-- Funciones de negocio (accesibles via RPC)
GRANT EXECUTE ON FUNCTION public.complete_past_bookings()
  TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.check_parking_spot_availability(uuid, timestamptz, timestamptz)
  TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.get_owner_average_rating(uuid)
  TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.increment_garage_spots(uuid)
  TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.decrement_garage_spots(uuid)
  TO authenticated, service_role;

-- check_spot_availability: dead code — solo service_role por si acaso
GRANT EXECUTE ON FUNCTION public.check_spot_availability(uuid, timestamptz, timestamptz)
  TO service_role;

-- Trigger functions: NO se re-grantan a anon ni authenticated.
-- postgres y service_role tienen acceso implícito como superusers.
-- El engine de triggers no necesita el grant del DML caller.
