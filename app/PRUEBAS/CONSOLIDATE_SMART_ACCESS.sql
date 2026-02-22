-- 1. Eliminar tablas antiguas (Orden de dependencia)
DROP TABLE IF EXISTS public.access_logs;
DROP TABLE IF EXISTS public.smart_access;

-- 2. Crear tabla unificada de logs de acceso
-- Esta tabla registra cada interacción (abrir/cerrar) directamente vinculada a la reserva.
CREATE TABLE public.booking_access_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    action text NOT NULL CHECK (action IN ('open', 'close')),
    success boolean NOT NULL DEFAULT true,
    user_agent text,
    ip_address inet,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Habilitar RLS
ALTER TABLE public.booking_access_logs ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Seguridad
-- Propietarios de garajes pueden ver los logs de sus plazas
CREATE POLICY "Owners can view access logs of their spots" ON public.booking_access_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            JOIN public.parking_spots ps ON b.parking_spot_id = ps.id
            JOIN public.garages g ON ps.garage_id = g.id
            WHERE b.id = booking_access_logs.booking_id AND g.owner_id = auth.uid()
        )
    );

-- Usuarios pueden insertar logs para sus propias reservas activas
CREATE POLICY "Users can insert access logs for their own bookings" ON public.booking_access_logs
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.id = booking_id AND b.renter_id = auth.uid() AND b.status = 'active'
        )
    );

COMMENT ON TABLE public.booking_access_logs IS 'Registro unificado de aperturas y cierres de plazas de parking.';
