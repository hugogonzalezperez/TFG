-- MED-1: Eliminar {public} USING(true) en imágenes. Añadir policies para authenticated.
DROP POLICY IF EXISTS "Anyone can view garage images" ON public.garage_images;
DROP POLICY IF EXISTS "Anyone can view parking spot images" ON public.parking_spot_images;

DROP POLICY IF EXISTS "Authenticated can view active garage images" ON public.garage_images;
CREATE POLICY "Authenticated can view active garage images"
  ON public.garage_images FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.garages WHERE garages.id = garage_images.garage_id AND garages.is_active = true));

DROP POLICY IF EXISTS "Authenticated can view active spot images" ON public.parking_spot_images;
CREATE POLICY "Authenticated can view active spot images"
  ON public.parking_spot_images FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.parking_spots ps JOIN public.garages g ON ps.garage_id = g.id WHERE ps.id = parking_spot_images.parking_spot_id AND g.is_active = true));
