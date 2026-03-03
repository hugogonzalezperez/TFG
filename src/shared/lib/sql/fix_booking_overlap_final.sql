-- =====================================================
-- FIX FINAL: PREVENCIÓN DE SOLAPAMIENTO Y VISIBILIDAD RLS
-- =====================================================

-- 1. TRIGGER PARA PREVENIR RESERVAS DUPLICADAS (SEGURIDAD ATÓMICA)
CREATE OR REPLACE FUNCTION check_booking_overlap() 
RETURNS TRIGGER AS $$
BEGIN
    -- Comprobar si existe alguna reserva confirmada/activa que solape
    -- Lógica: (A.inicio < B.fin) AND (A.fin > B.inicio)
    IF EXISTS (
        SELECT 1 FROM public.bookings
        WHERE parking_spot_id = NEW.parking_spot_id
        AND status IN ('confirmed', 'active')
        AND id != NEW.id -- Ignorar la propia reserva en caso de update
        AND (NEW.start_time < end_time) 
        AND (NEW.end_time > start_time)
    ) THEN
        RAISE EXCEPTION 'Esta plaza ya ha sido reservada para el horario seleccionado (Solapamiento detectado en DB).';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_overlap_trigger ON public.bookings;
CREATE TRIGGER prevent_overlap_trigger
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION check_booking_overlap();

-- 2. RLS: PERMITIR QUE TODOS VEAN LOS INTERVALOS DE RESERVAS (PARA EL FILTRO DEL MAPA)
-- Eliminamos políticas restrictivas antiguas si existen
DROP POLICY IF EXISTS "Public bookings visibility" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can view booking availability" ON public.bookings;

-- Política que permite a cualquiera ver CUÁNDO está ocupada una plaza
CREATE POLICY "Anyone can view bookings for availability"
ON public.bookings FOR SELECT
TO public
USING (status IN ('confirmed', 'active'));

-- 3. RLS: PERMITIR A LOS USUARIOS VER SUS PROPIAS RESERVAS COMPLETAS
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = renter_id);

-- 4. RLS: ASEGURAR QUE LOS DUEÑOS SIGAN VIENDO LAS RESERVAS DE SUS GARAJES
DROP POLICY IF EXISTS "Owners can view bookings for their garages" ON public.bookings;
CREATE POLICY "Owners can view bookings for their garages"
ON public.bookings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.parking_spots ps
        JOIN public.garages g ON ps.garage_id = g.id
        WHERE ps.id = bookings.parking_spot_id
        AND g.owner_id = auth.uid()
    )
);
