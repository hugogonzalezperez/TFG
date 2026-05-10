-- =============================================================
-- CRIT-E FIX: Eliminar PII Leak en bookings para anon
-- Pentest 2026-04-29 — Auditor: Claude Sonnet Red Team
-- ACTUALIZADO 2026-04-30: check_parking_spot_availability ya existe en DB
-- con firma (p_spot_id UUID, p_start_time TIMESTAMPTZ, p_end_time TIMESTAMPTZ)
-- No se crea duplicado — solo se parchea el RLS.
-- =============================================================

-- 1. Eliminar la política permisiva que exponía PII a usuarios anónimos
DROP POLICY IF EXISTS "Anyone can view bookings for availability" ON public.bookings;

-- 2. Revocar SELECT directo en la tabla bookings para anon
--    Las políticas owner/renter existentes para 'authenticated' siguen funcionando.
REVOKE SELECT ON public.bookings FROM anon;

-- 3. La función check_parking_spot_availability(p_spot_id, p_start_time, p_end_time)
--    ya existe con SECURITY DEFINER. Solo asegurar GRANTs.
GRANT EXECUTE ON FUNCTION public.check_parking_spot_availability(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO anon;
GRANT EXECUTE ON FUNCTION public.check_parking_spot_availability(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
