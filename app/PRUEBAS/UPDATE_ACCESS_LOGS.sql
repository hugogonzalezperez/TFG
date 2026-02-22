-- Añadir columna de acción a los logs de acceso
ALTER TABLE public.access_logs 
ADD COLUMN IF NOT EXISTS action text NOT NULL DEFAULT 'open' 
CHECK (action IN ('open', 'close'));

-- Comentario para documentar el cambio
COMMENT ON COLUMN public.access_logs.action IS 'Tipo de acción realizada: open (abrir) o close (cerrar)';
