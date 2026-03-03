-- Permitir inserciones en price_history form the trigger when owners update their spots
CREATE POLICY "Owners can insert in price_history via triggers" 
ON public.price_history 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.parking_spots
    WHERE id = parking_spot_id AND owner_id = auth.uid()
  )
);

-- (Opcional) Si quieres que los propios dueños también puedan leer el histórico
CREATE POLICY "Owners can view their spot price history" 
ON public.price_history 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.parking_spots
    WHERE id = parking_spot_id AND owner_id = auth.uid()
  )
);
