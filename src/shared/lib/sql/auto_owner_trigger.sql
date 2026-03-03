-- =====================================================
-- TRIGGER: PROMOCIÓN AUTOMÁTICA A PROPIETARIO (OWNER)
-- =====================================================
-- Este script crea una función y un trigger que asigna
-- automáticamente el rol de 'owner' a cualquier usuario
-- que registre un garaje en la plataforma.
-- =====================================================

-- 1. Función de promoción
CREATE OR REPLACE FUNCTION public.promote_to_owner_on_garage_insert()
RETURNS TRIGGER AS $$
DECLARE
    owner_role_id UUID;
BEGIN
    -- Obtenemos el ID del rol 'owner' de la tabla de roles
    SELECT id INTO owner_role_id FROM public.roles WHERE name = 'owner' LIMIT 1;

    -- Si el rol existe, lo asignamos al usuario en user_roles
    IF owner_role_id IS NOT NULL THEN
        -- Usamos INSERT ... ON CONFLICT para evitar errores si ya tenía el rol
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.owner_id, owner_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        -- Opcional: Log o notificación de sistema aquí si fuera necesario
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Asociación del trigger a la tabla 'garages'
-- Se ejecuta después de cada inserción exitosa de un garaje
DROP TRIGGER IF EXISTS tr_promote_to_owner ON public.garages;
CREATE TRIGGER tr_promote_to_owner
AFTER INSERT ON public.garages
FOR EACH ROW
EXECUTE FUNCTION public.promote_to_owner_on_garage_insert();

COMMENT ON FUNCTION public.promote_to_owner_on_garage_insert() IS 'Asigna automáticamente el rol de owner cuando un usuario crea su primer garaje.';
