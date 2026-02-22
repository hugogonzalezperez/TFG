-- =====================================================
-- SCRIPT DE ACTUALIZACIÓN: DEUDA TÉCNICA Y SEGURIDAD (FASE 2)
-- Instrucciones: Ejecutar este script en el SQL Editor de Supabase
-- =====================================================

-- -----------------------------------------------------
-- 1. ACTUALIZACIÓN DE CLAVES FORÁNEAS (ON DELETE CASCADE)
-- Esto asegura que al borrar un garaje o plaza, no queden registros huérfanos.
-- -----------------------------------------------------

-- Imágenes del Garaje
ALTER TABLE public.garage_images 
DROP CONSTRAINT IF EXISTS garage_images_garage_id_fkey,
ADD CONSTRAINT garage_images_garage_id_fkey 
  FOREIGN KEY (garage_id) REFERENCES public.garages(id) 
  ON DELETE CASCADE;

-- Plazas de Parking
ALTER TABLE public.parking_spots 
DROP CONSTRAINT IF EXISTS parking_spots_garage_id_fkey,
ADD CONSTRAINT parking_spots_garage_id_fkey 
  FOREIGN KEY (garage_id) REFERENCES public.garages(id) 
  ON DELETE CASCADE;

-- Imágenes de las Plazas
ALTER TABLE public.parking_spot_images 
DROP CONSTRAINT IF EXISTS parking_spot_images_parking_spot_id_fkey,
ADD CONSTRAINT parking_spot_images_parking_spot_id_fkey 
  FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spots(id) 
  ON DELETE CASCADE;

-- Historial de Precios
ALTER TABLE public.price_history 
DROP CONSTRAINT IF EXISTS price_history_parking_spot_id_fkey,
ADD CONSTRAINT price_history_parking_spot_id_fkey 
  FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spots(id) 
  ON DELETE CASCADE;

-- Reglas de Precio
ALTER TABLE public.pricing_rules 
DROP CONSTRAINT IF EXISTS pricing_rules_parking_spot_id_fkey,
ADD CONSTRAINT pricing_rules_parking_spot_id_fkey 
  FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spots(id) 
  ON DELETE CASCADE;

-- Slots de Disponibilidad
ALTER TABLE public.availability_slots 
DROP CONSTRAINT IF EXISTS availability_slots_parking_spot_id_fkey,
ADD CONSTRAINT availability_slots_parking_spot_id_fkey 
  FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spots(id) 
  ON DELETE CASCADE;

-- -----------------------------------------------------
-- NOTA SOBRE RESERVAS Y PAGOS:
-- Mantenemos DELETE RESTRICT (comportamiento por defecto) en reservas 
-- ligadas a pagos reales para no perder historial financiero.
-- -----------------------------------------------------


-- -----------------------------------------------------
-- 2. REFINAMIENTO DE POLÍTICAS DE SEGURIDAD (RLS)
-- Aseguramos que los dueños puedan borrar sus propias entidades.
-- -----------------------------------------------------

-- Habilitar RLS explícitamente por si acaso
ALTER TABLE public.garages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garage_images ENABLE ROW LEVEL SECURITY;

-- Garajes: Los propietarios pueden borrar sus propios garajes
DROP POLICY IF EXISTS "Users can delete their own garages" ON public.garages;
CREATE POLICY "Users can delete their own garages" 
ON public.garages FOR DELETE TO authenticated 
USING (auth.uid() = owner_id);

-- Plazas: Los propietarios pueden borrar sus propias plazas
DROP POLICY IF EXISTS "Users can delete their own spots" ON public.parking_spots;
CREATE POLICY "Users can delete their own spots" 
ON public.parking_spots FOR DELETE TO authenticated 
USING (auth.uid() = owner_id);

-- Imágenes: Los propietarios pueden borrar las imágenes de SUS garajes
DROP POLICY IF EXISTS "Owners can delete their garage images" ON public.garage_images;
CREATE POLICY "Owners can delete their garage images" 
ON public.garage_images FOR DELETE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.garages 
    WHERE garages.id = garage_images.garage_id 
    AND garages.owner_id = auth.uid()
  )
);

-- Reservas: Los dueños pueden ver (y gestionar si fuera necesario) reservas de SUS garajes
DROP POLICY IF EXISTS "Owners can view bookings for their garages" ON public.bookings;
CREATE POLICY "Owners can view bookings for their garages"
ON public.bookings FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.parking_spots ps
        JOIN public.garages g ON ps.garage_id = g.id
        WHERE ps.id = bookings.parking_spot_id
        AND g.owner_id = auth.uid()
    )
);

-- Visibilidad de Usuarios (Necesario para ver perfiles de dueños)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.users;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.users FOR SELECT USING (true);
