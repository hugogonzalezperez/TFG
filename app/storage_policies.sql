-- 1. Crear buckets ssi no existen (Públicos)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('garage_images', 'garage_images', true)
on conflict (id) do nothing;

-- 2. Habilitar RLS en la tabla objects (por si acaso no está)
alter table storage.objects enable row level security;

-- =========================================================
-- POLÍTIICAS PARA 'avatars'
-- =========================================================

-- Permitir ver avatares a TODO EL MUNDO (Público)
create policy "Avatar Public Select"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Permitir subir avatar a usuarios AUTENTICADOS (Cualquiera logueado)
create policy "Avatar Auth Insert"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Permitir actualizar/borrar SOLO SU PROPIO avatar
-- Asume que la ruta del archivo es: avatars/{user_id}/{filename}
create policy "Avatar Owner Update"
  on storage.objects for update
  using ( bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text );

create policy "Avatar Owner Delete"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text );


-- =========================================================
-- POLITICAS PARA 'garage_images'
-- =========================================================

-- Permitir ver fotos de garajes a TODO EL MUNDO
create policy "Garage Public Select"
  on storage.objects for select
  using ( bucket_id = 'garage_images' );

-- Permitir subir fotos a usuarios AUTENTICADOS
create policy "Garage Auth Insert"
  on storage.objects for insert
  with check ( bucket_id = 'garage_images' and auth.role() = 'authenticated' );

-- Permitir actualizar/borrar SOLO SUS PROPIAS fotos
-- Asume ruta: garage_images/{user_id}/{garage_id}/{filename}
create policy "Garage Owner Update"
  on storage.objects for update
  using ( bucket_id = 'garage_images' and (storage.foldername(name))[1] = auth.uid()::text );

create policy "Garage Owner Delete"
  on storage.objects for delete
  using ( bucket_id = 'garage_images' and (storage.foldername(name))[1] = auth.uid()::text );
