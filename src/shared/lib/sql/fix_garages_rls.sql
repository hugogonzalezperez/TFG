-- =====================================================
-- FIX: PERMISOS DE BORRADO PARA GARAJES (RLS)
-- =====================================================
-- Si el garaje no se borra (status 204 pero el registro sigue ahí),
-- es muy probable que falte la política de DELETE en Supabase.
-- =====================================================

-- 1. Aseguramos que RLS está activado
ALTER TABLE public.garages ENABLE ROW LEVEL SECURITY;

-- 2. Eliminamos políticas de borrado antiguas si existen para evitar conflictos
DROP POLICY IF EXISTS "Users can delete their own garages" ON public.garages;

-- 3. Creamos la política de borrado
CREATE POLICY "Users can delete their own garages" 
ON public.garages 
FOR DELETE 
TO authenticated 
USING (auth.uid() = owner_id);

-- 4. Verificación (Opcional): También para las tablas dependientes por si acaso
ALTER TABLE public.parking_spots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can delete their own spots" ON public.parking_spots;
CREATE POLICY "Users can delete their own spots" 
ON public.parking_spots 
FOR DELETE 
TO authenticated 
USING (auth.uid() = owner_id);

ALTER TABLE public.garage_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owners can delete their garage images" ON public.garage_images;
CREATE POLICY "Owners can delete their garage images" 
ON public.garage_images 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.garages 
    WHERE garages.id = garage_images.garage_id 
    AND garages.owner_id = auth.uid()
  )
);
