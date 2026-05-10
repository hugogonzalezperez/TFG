-- ============================================================
-- NIVEL 1 — HIGH-4: Máquina de estados para booking.status
-- Previene transiciones inválidas (reactivar reservas canceladas, etc.)
-- ============================================================

CREATE OR REPLACE FUNCTION public.validate_booking_status_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = 'public'
AS $$
BEGIN
  -- Transiciones válidas
  IF (OLD.status = 'pending'    AND NEW.status IN ('confirmed', 'cancelled')) OR
     (OLD.status = 'confirmed'  AND NEW.status IN ('active', 'cancelled'))    OR
     (OLD.status = 'active'     AND NEW.status IN ('completed', 'cancelled'))
  THEN
    RETURN NEW;
  END IF;

  -- Estados terminales — ninguna transición permitida
  IF OLD.status IN ('completed', 'cancelled') THEN
    RAISE EXCEPTION 'Estado terminal: la reserva ya está en estado ''%'' y no puede cambiar.', OLD.status;
  END IF;

  RAISE EXCEPTION 'Transición de estado inválida: ''%'' → ''%''. Flujo permitido: pending→confirmed→active→completed, cualquiera→cancelled.',
    OLD.status, NEW.status;
END;
$$;

CREATE TRIGGER enforce_booking_status_machine
  BEFORE UPDATE OF status ON public.bookings
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.validate_booking_status_transition();
