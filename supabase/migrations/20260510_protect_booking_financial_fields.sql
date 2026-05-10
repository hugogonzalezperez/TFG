-- CRIT-1: Trigger que hace inmutables los campos financieros de una reserva.
CREATE OR REPLACE FUNCTION public.prevent_financial_field_modification()
  RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.total_price IS DISTINCT FROM OLD.total_price THEN
    RAISE EXCEPTION 'Campo total_price es inmutable tras la creación de la reserva.';
  END IF;
  IF NEW.price_per_hour_at_booking IS DISTINCT FROM OLD.price_per_hour_at_booking THEN
    RAISE EXCEPTION 'Campo price_per_hour_at_booking es inmutable tras la creación.';
  END IF;
  IF NEW.dynamic_multiplier_applied IS DISTINCT FROM OLD.dynamic_multiplier_applied THEN
    RAISE EXCEPTION 'Campo dynamic_multiplier_applied es inmutable tras la creación.';
  END IF;
  IF NEW.total_hours IS DISTINCT FROM OLD.total_hours THEN
    RAISE EXCEPTION 'Campo total_hours es inmutable tras la creación.';
  END IF;
  IF NEW.renter_id IS DISTINCT FROM OLD.renter_id THEN
    RAISE EXCEPTION 'Campo renter_id es inmutable tras la creación.';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER protect_booking_financials
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_financial_field_modification();
