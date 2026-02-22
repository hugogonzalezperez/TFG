-- Habilitar RLS en las tablas si no lo estaban ya
ALTER TABLE public.garage_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_spot_images ENABLE ROW LEVEL SECURITY;

-- Políticas para garage_images
-- 1. Lectura pública (Cualquiera puede ver imágenes)
DROP POLICY IF EXISTS "Anyone can view garage images" ON public.garage_images;
CREATE POLICY "Anyone can view garage images" ON public.garage_images FOR SELECT USING (true);

-- 2. Inserción (Solo dueños del garaje pueden añadir imágenes)
DROP POLICY IF EXISTS "Owners can insert garage images" ON public.garage_images;
CREATE POLICY "Owners can insert garage images" ON public.garage_images FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.garages WHERE id = garage_id AND owner_id = auth.uid())
);

-- 3. Actualización (Solo dueños del garaje pueden actualizarlas)
DROP POLICY IF EXISTS "Owners can update garage images" ON public.garage_images;
CREATE POLICY "Owners can update garage images" ON public.garage_images FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.garages WHERE id = garage_id AND owner_id = auth.uid())
);

-- 4. Borrado (Ya existía, pero la re-creamos para asegurar consistencia)
DROP POLICY IF EXISTS "Owners can delete their garage images" ON public.garage_images;
CREATE POLICY "Owners can delete their garage images" ON public.garage_images FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.garages WHERE id = garage_id AND owner_id = auth.uid())
);


-- Políticas para parking_spot_images
-- 1. Lectura pública (Cualquiera puede ver imágenes de plazas)
DROP POLICY IF EXISTS "Anyone can view parking spot images" ON public.parking_spot_images;
CREATE POLICY "Anyone can view parking spot images" ON public.parking_spot_images FOR SELECT USING (true);

-- 2. Inserción (Solo dueños de la plaza pueden añadir imágenes)
DROP POLICY IF EXISTS "Owners can insert parking spot images" ON public.parking_spot_images;
CREATE POLICY "Owners can insert parking spot images" ON public.parking_spot_images FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.parking_spots WHERE id = parking_spot_id AND owner_id = auth.uid())
);

-- 3. Actualización (Solo dueños de la plaza pueden actualizarlas)
DROP POLICY IF EXISTS "Owners can update parking spot images" ON public.parking_spot_images;
CREATE POLICY "Owners can update parking spot images" ON public.parking_spot_images FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.parking_spots WHERE id = parking_spot_id AND owner_id = auth.uid())
);

-- 4. Borrado (Solo dueños de la plaza pueden borrarlas)
DROP POLICY IF EXISTS "Owners can delete parking spot images" ON public.parking_spot_images;
CREATE POLICY "Owners can delete parking spot images" ON public.parking_spot_images FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.parking_spots WHERE id = parking_spot_id AND owner_id = auth.uid())
);
