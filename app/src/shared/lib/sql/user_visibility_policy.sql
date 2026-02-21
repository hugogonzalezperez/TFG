-- =====================================================
-- FIX: VISIBILIDAD DE USUARIOS Y RESERVAS
-- =====================================================

-- 1. Permitir que cualquiera pueda ver los datos básicos de los usuarios (necesario para ver al owner)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.users FOR SELECT
USING (true); -- Permitimos ver todos los perfiles, pero solo los campos seleccionados en la app

-- 2. Asegurar que los dueños de garajes puedan ver las reservas de sus garajes
DROP POLICY IF EXISTS "Owners can view bookings for their garages" ON public.bookings;
CREATE POLICY "Owners can view bookings for their garages"
ON public.bookings FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.parking_spots ps
        JOIN public.garages g ON ps.garage_id = g.id
        WHERE ps.id = bookings.parking_spot_id
        AND g.owner_id = auth.uid()
    )
);

-- 3. Permitir a los usuarios borrar sus propias reservas (siempre que no estén activas/completadas si se aplicara lógica de negocio, pero por RLS permitimos delete)
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
CREATE POLICY "Users can delete their own bookings"
ON public.bookings FOR DELETE
USING (renter_id = auth.uid());

-- 4. Permitir a los dueños borrar reservas de sus garajes
DROP POLICY IF EXISTS "Owners can delete bookings for their garages" ON public.bookings;
CREATE POLICY "Owners can delete bookings for their garages"
ON public.bookings FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.parking_spots ps
        JOIN public.garages g ON ps.garage_id = g.id
        WHERE ps.id = bookings.parking_spot_id
        AND g.owner_id = auth.uid()
    )
);
