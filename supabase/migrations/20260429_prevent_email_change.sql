-- =============================================================
-- CRIT-D FIX: Impedir modificación directa del email en tabla users
-- Pentest 2026-04-29 — Auditor: Claude Sonnet Red Team
-- =============================================================

CREATE OR REPLACE FUNCTION public.prevent_email_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'El email no puede modificarse directamente. Usa el proceso de cambio de email de Supabase Auth.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear (o reemplazar) el trigger
DROP TRIGGER IF EXISTS no_direct_email_change ON public.users;
CREATE TRIGGER no_direct_email_change
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_email_change();
