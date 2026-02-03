-- =========================================================
-- SCRIPT DE CORRECCIÓN DE POLÍTICAS (Ejecutar en SQL Editor)
-- =========================================================

-- 1. Borrar políticas anteriores para evitar duplicados/errores
drop policy if exists "Avatar Public Select" on storage.objects;
drop policy if exists "Avatar Auth Insert" on storage.objects;
drop policy if exists "Avatar Owner Update" on storage.objects;
drop policy if exists "Avatar Owner Delete" on storage.objects;

drop policy if exists "Garage Public Select" on storage.objects;
drop policy if exists "Garage Auth Insert" on storage.objects;
drop policy if exists "Garage Owner Update" on storage.objects;
drop policy if exists "Garage Owner Delete" on storage.objects;

-- 2. Asegurarse de que los buckets existen y son públicos
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('garage_images', 'garage_images', true)
on conflict (id) do nothing;

-- =========================================================
-- POLÍTIICAS PARA 'avatars'
-- =========================================================

-- A) VER: Todo el mundo (anon + authenticated)
create policy "Avatar Public Select"
  on storage.objects for select
  to public
  using ( bucket_id = 'avatars' );

-- B) SUBIR: Solo usuarios logueados
create policy "Avatar Auth Insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'avatars' );

-- C) MODIFICAR/BORRAR: Solo el dueño (que debe estar logueado)
create policy "Avatar Owner Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text );

create policy "Avatar Owner Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text );


-- =========================================================
-- POLITICAS PARA 'garage_images'
-- =========================================================

-- A) VER: Todo el mundo
create policy "Garage Public Select"
  on storage.objects for select
  to public
  using ( bucket_id = 'garage_images' );

-- B) SUBIR: Solo usuarios logueados
create policy "Garage Auth Insert"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'garage_images' );

-- C) MODIFICAR/BORRAR: Solo el dueño
create policy "Garage Owner Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'garage_images' and (storage.foldername(name))[1] = auth.uid()::text );

create policy "Garage Owner Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'garage_images' and (storage.foldername(name))[1] = auth.uid()::text );
