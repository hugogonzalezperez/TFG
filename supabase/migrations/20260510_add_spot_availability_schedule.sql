-- ============================================================
-- Migration: add_spot_availability_schedule
-- Adds recurring availability schedule to parking_spots.
-- JSONB keyed 0-6 (JS getDay() compatible, 0=Sunday).
-- NULL = no restrictions (24/7, backward compatible).
-- ============================================================

-- 1. Columna JSONB con check estructural básico
ALTER TABLE public.parking_spots
  ADD COLUMN availability_schedule JSONB DEFAULT NULL
  CONSTRAINT chk_availability_schedule_structure CHECK (
    availability_schedule IS NULL OR (
      jsonb_typeof(availability_schedule) = 'object'
      AND (availability_schedule->>'0') IS NOT NULL
      AND (availability_schedule->>'1') IS NOT NULL
      AND (availability_schedule->>'2') IS NOT NULL
      AND (availability_schedule->>'3') IS NOT NULL
      AND (availability_schedule->>'4') IS NOT NULL
      AND (availability_schedule->>'5') IS NOT NULL
      AND (availability_schedule->>'6') IS NOT NULL
    )
  );

-- 2. check_spot_availability: conflictos + schedule multi-día aware
--    Handles: single-day, cross-midnight, multi-day, DST, disabled days,
--             missing config, invalid windows, exact-midnight end.
CREATE OR REPLACE FUNCTION public.check_spot_availability(
  p_spot  uuid,
  p_start timestamp with time zone,
  p_end   timestamp with time zone
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_schedule     JSONB;
  v_local_start  TIMESTAMP WITHOUT TIME ZONE;
  v_local_end    TIMESTAMP WITHOUT TIME ZONE;
  v_current_date DATE;
  v_end_date     DATE;
  v_dow          TEXT;
  v_day_cfg      JSONB;
  v_open_time    TIME;
  v_close_time   TIME;
  v_window_start TIMESTAMP WITHOUT TIME ZONE;
  v_window_end   TIMESTAMP WITHOUT TIME ZONE;
  v_day_start    TIMESTAMP WITHOUT TIME ZONE;
  v_day_end      TIMESTAMP WITHOUT TIME ZONE;
BEGIN
  -- Guard: rango inválido
  IF p_start >= p_end THEN
    RETURN FALSE;
  END IF;

  -- 1. Verificar solapamiento con reservas existentes
  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE parking_spot_id = p_spot
      AND status IN ('confirmed', 'active')
      AND start_time < p_end
      AND end_time   > p_start
  ) THEN
    RETURN FALSE;
  END IF;

  -- 2. Obtener schedule del spot
  SELECT availability_schedule INTO v_schedule
  FROM public.parking_spots
  WHERE id = p_spot;

  -- 3. NULL = sin restricciones (disponible 24/7)
  IF v_schedule IS NULL THEN
    RETURN TRUE;
  END IF;

  -- 4. Convertir a hora local española (gestiona DST automáticamente)
  v_local_start := p_start AT TIME ZONE 'Europe/Madrid';
  v_local_end   := p_end   AT TIME ZONE 'Europe/Madrid';

  -- 5. Rango de días naturales que cubre la reserva
  v_current_date := v_local_start::DATE;
  v_end_date     := v_local_end::DATE;

  -- Si termina exactamente a medianoche no contar ese día natural
  IF v_local_end = v_end_date::TIMESTAMP WITHOUT TIME ZONE THEN
    v_end_date := v_end_date - 1;
  END IF;

  -- 6. Validar CADA día natural del rango
  WHILE v_current_date <= v_end_date LOOP

    -- extract(dow): 0=domingo..6=sábado, igual que JS Date.getDay()
    v_dow     := extract(dow FROM v_current_date)::INT::TEXT;
    v_day_cfg := v_schedule -> v_dow;

    -- Día sin config en el JSON → bloqueado
    IF v_day_cfg IS NULL THEN
      RETURN FALSE;
    END IF;

    -- Día deshabilitado → bloqueado (aunque tenga horas puestas)
    IF NOT coalesce((v_day_cfg->>'enabled')::boolean, false) THEN
      RETURN FALSE;
    END IF;

    v_open_time  := (v_day_cfg->>'open')::TIME;
    v_close_time := (v_day_cfg->>'close')::TIME;

    -- Ventana inválida o vacía → bloqueado
    IF v_open_time IS NULL OR v_close_time IS NULL OR v_open_time >= v_close_time THEN
      RETURN FALSE;
    END IF;

    -- Ventana permitida para este día natural (hora local)
    v_window_start := v_current_date::TIMESTAMP WITHOUT TIME ZONE + v_open_time;
    v_window_end   := v_current_date::TIMESTAMP WITHOUT TIME ZONE + v_close_time;

    -- Porción de la reserva que cae en este día natural
    v_day_start := GREATEST(v_local_start, v_current_date::TIMESTAMP WITHOUT TIME ZONE);
    v_day_end   := LEAST(v_local_end,   (v_current_date + 1)::TIMESTAMP WITHOUT TIME ZONE);

    -- La porción debe estar COMPLETAMENTE dentro de la ventana permitida
    IF v_day_start < v_window_start OR v_day_end > v_window_end THEN
      RETURN FALSE;
    END IF;

    v_current_date := v_current_date + 1;
  END LOOP;

  RETURN TRUE;
END;
$$;

-- 3. check_parking_spot_availability sincronizado (delega en la función principal)
CREATE OR REPLACE FUNCTION public.check_parking_spot_availability(
  p_spot_id    uuid,
  p_start_time timestamp with time zone,
  p_end_time   timestamp with time zone
)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.check_spot_availability(p_spot_id, p_start_time, p_end_time);
$$;

-- 4. RPC owner: actualizar schedule con validación completa server-side
CREATE OR REPLACE FUNCTION public.update_spot_schedule(
  p_spot_id  uuid,
  p_schedule JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_dow   INT;
  v_day   JSONB;
  v_open  TIME;
  v_close TIME;
BEGIN
  -- Validar los 7 días: presencia + coherencia de ventanas
  FOR v_dow IN 0..6 LOOP
    v_day := p_schedule -> v_dow::TEXT;

    IF v_day IS NULL THEN
      RAISE EXCEPTION 'Falta configuración para el día %', v_dow;
    END IF;

    IF coalesce((v_day->>'enabled')::boolean, false) THEN
      BEGIN
        v_open  := (v_day->>'open')::TIME;
        v_close := (v_day->>'close')::TIME;
      EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Formato de hora inválido en día %', v_dow;
      END;

      IF v_open IS NULL OR v_close IS NULL THEN
        RAISE EXCEPTION 'Faltan horas de apertura/cierre en día %', v_dow;
      END IF;

      IF v_open >= v_close THEN
        RAISE EXCEPTION 'La hora de apertura debe ser anterior al cierre en día %', v_dow;
      END IF;
    END IF;
  END LOOP;

  -- UPDATE con verificación de propiedad (SECURITY DEFINER, ownership enforced aquí)
  UPDATE public.parking_spots
  SET    availability_schedule = p_schedule,
         updated_at = now()
  WHERE  id       = p_spot_id
    AND  owner_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plaza no encontrada o no tienes permiso para editarla';
  END IF;
END;
$$;

REVOKE ALL  ON FUNCTION public.update_spot_schedule(uuid, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_spot_schedule(uuid, jsonb) TO authenticated;
