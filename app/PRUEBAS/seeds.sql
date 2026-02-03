-- Semillas para la base de datos Parky
-- Copia y pega esto en el SQL Editor de tu Dashboard de Supabase

-- 1. Crear un usuario propietario (si no existe)
-- Nota: Para que funcione correctamente con Supabase Auth, lo ideal es registrarse 
-- a través de la interfaz de la aplicación, pero esto poblará la tabla 'users'.
-- Aquí insertamos directamente en la tabla 'users' para que los garajes tengan un dueño.

INSERT INTO public.users (id, email, name, phone, avatar_url, is_active)
VALUES 
  ('5ce4d83e-9007-43bf-8543-e99ea8e11c4c', 'propietario@parky.com', 'Hugo Propietario', '600111222', 'https://api.dicebear.com/7.x/avataaars/svg?seed=hugo', true)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, phone = EXCLUDED.phone;

-- 2. Insertar Garajes
INSERT INTO public.garages (id, owner_id, name, description, address, city, postal_code, lat, lng, total_spots, is_active)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '5ce4d83e-9007-43bf-8543-e99ea8e11c4c', 'Garaje Central Santa Cruz', 'Excelente ubicación cerca de la Plaza Weyler.', 'Calle Castillo, 45', 'Santa Cruz de Tenerife', '38003', 28.4674, -16.2541, 5, true),
  ('b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', '5ce4d83e-9007-43bf-8543-e99ea8e11c4c', 'Parking Marina Santa Cruz', 'Cerca de la zona portuaria y el Auditorio.', 'Avenida de Anaga, 12', 'Santa Cruz de Tenerife', '38001', 28.4715, -16.2482, 3, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar Plazas de Aparcamiento (Parking Spots)
INSERT INTO public.parking_spots (id, garage_id, owner_id, spot_number, base_price_per_hour, current_price_per_hour, description, is_active)
VALUES 
  (gen_random_uuid(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '5ce4d83e-9007-43bf-8543-e99ea8e11c4c', 'P1-01', 2.50, 2.50, 'Fácil acceso, nivel 1.', true),
  (gen_random_uuid(), 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '5ce4d83e-9007-43bf-8543-e99ea8e11c4c', 'P1-02', 3.00, 3.00, 'Plaza amplia para SUV.', true),
  (gen_random_uuid(), 'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', '5ce4d83e-9007-43bf-8543-e99ea8e11c4c', 'A-01', 2.00, 2.00, 'Plaza sombreada.', true)
ON CONFLICT DO NOTHING;

-- 4. Asignar rol de propietario al usuario Hugo
-- Primero necesitamos el ID del rol 'owner'
DO $$
DECLARE
    owner_role_id UUID;
BEGIN
    SELECT id INTO owner_role_id FROM public.roles WHERE name = 'owner'::auth_role_name;
    
    IF owner_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES ('5ce4d83e-9007-43bf-8543-e99ea8e11c4c', owner_role_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
