-- =============================================================
-- CRIT-C FIX: Añadir ownership check en decrement_garage_spots
-- Pentest 2026-04-29 — Auditor: Claude Sonnet Red Team
-- =============================================================

CREATE OR REPLACE FUNCTION public.decrement_garage_spots(garage_id_param UUID)
RETURNS void AS $$
BEGIN
  -- Verificar que el usuario autenticado es el propietario del garaje
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
