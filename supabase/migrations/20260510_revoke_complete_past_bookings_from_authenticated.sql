-- ALTO-1: REVOKE complete_past_bookings de authenticated. Solo service_role.
REVOKE EXECUTE ON FUNCTION public.complete_past_bookings() FROM authenticated;
