-- =============================================================
-- MIGRATION: 20260501_fix_public_profiles_security_definer.sql
-- Issue: V-8 — public_profiles view con SECURITY DEFINER implícito
--
-- Problema:
--   La view public_profiles (SELECT id, name, avatar_url FROM users WHERE is_active = true)
--   es propiedad de postgres (superuser). En PostgreSQL, una view propiedad de superuser
--   corre con los permisos del owner → bypasea RLS de la tabla users.
--   Resultado: anon puede obtener id/name/avatar_url de todos los usuarios activos
--   aunque la RLS de users diga "Users can view own data" (auth.uid() = id).
--
--   Adicionalmente, anon tenía INSERT, UPDATE, DELETE, TRUNCATE sobre la view
--   (grants por defecto del schema public) — innecesarios y peligrosos.
--
-- Fix:
--   1. Recrear con WITH (security_invoker = on) — la view respeta la RLS del caller.
--      Con el RLS actual en users, anon ve nada; authenticated solo ve su propio perfil.
--      Si en el futuro se necesita mostrar perfiles de otros owners, añadir entonces
--      una RLS SELECT policy acotada en users.
--   2. Revocar INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER de anon
--      sobre la view — una view de solo lectura no necesita ninguno de estos.
--
-- Nota: La view es dead code en el frontend (solo aparece en database.types.ts como tipo).
--       El fix es conservador — no la elimina para no romper tipos generados.
-- =============================================================

-- Recrear con security_invoker (PostgreSQL 15+)
-- OR REPLACE preserva grants existentes; los de DML se revocan después.
CREATE OR REPLACE VIEW public.public_profiles
  WITH (security_invoker = on)
AS
  SELECT id, name, avatar_url
  FROM users
  WHERE is_active = true;

-- Revocar DML innecesario de anon — esta view es de solo lectura
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.public_profiles
  FROM anon;

-- Revocar DML innecesario de authenticated también (no hay razón para mutar via esta view)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.public_profiles
  FROM authenticated;
