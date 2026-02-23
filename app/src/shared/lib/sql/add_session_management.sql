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
