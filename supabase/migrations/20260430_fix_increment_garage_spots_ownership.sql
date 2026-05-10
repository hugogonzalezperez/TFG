-- =============================================================
-- BRECHA CRIT-C (complemento): Añadir ownership check en increment_garage_spots
-- Pentest 2026-04-29/30 — Auditor: Claude Sonnet Red Team
-- La migración anterior (20260429) parcheó decrement pero no increment.
-- Un usuario autenticado no-owner podía inflar total_spots de garajes ajenos.
-- =============================================================

CREATE OR REPLACE FUNCTION public.increment_garage_spots(garage_id_param UUID)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
