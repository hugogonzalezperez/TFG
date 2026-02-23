-- =====================================================
-- SINGLE SESSION MANAGEMENT
-- =====================================================

-- 1. Añadir columna para rastrear la sesión activa
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS current_session_id TEXT;

-- 2. Asegurar que los usuarios pueden actualizar su propio session_id
-- (Normalmente ya pueden actualizar su perfil, pero lo aseguramos)
DROP POLICY IF EXISTS "Users can update their own session ID" ON public.users;
CREATE POLICY "Users can update their own session ID" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. HABILITAR REALTIME PARA ESTA TABLA
-- Esto es fundamental para que el frontend reciba las actualizaciones
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
-- Nos aseguramos de que se envíen todos los campos en el evento de actualización
ALTER TABLE public.users REPLICA IDENTITY FULL;
