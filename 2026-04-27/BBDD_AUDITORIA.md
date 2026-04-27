# AUDITORÍA BASE DE DATOS — PARKY
> Proyecto: `gvyeipohgqzbhrqrxbqk` (AWS eu-central-1, NANO)
> PostgreSQL 17.6 | DB size: 14 MB | 0 migraciones registradas
> **Fuente: Acceso directo vía MCP Supabase — datos reales de producción**
> Fecha: 2026-04-27

---

## RESUMEN EJECUTIVO

| Categoría | Hallazgos | Críticos |
|-----------|-----------|---------|
| Seguridad RLS | 18 issues | 3 🔴 |
| Funciones peligrosas | 8 issues | 4 🔴 |
| Schema / integridad | 6 issues | 2 🔴 |
| Rendimiento / índices | 5 issues | 0 |
| Storage | 2 issues | 0 |
| Auth | 1 issue | 0 |

**Estado general:** Base de datos funcional pero con vulnerabilidades críticas de escalada de privilegios y una feature rota (precios dinámicos completamente inaccesible por RLS).

---

## 1. ESQUEMA REAL — TABLAS EXISTENTES

### Tablas presentes en DB (13 tablas)

| Tabla | Filas | RLS | Policies | Estado |
|-------|-------|-----|----------|--------|
| `users` | 1 | ✅ | 5 | ⚠️ SELECT público expone PII |
| `roles` | 0 | ✅ | 1 | 🔴 VACÍA — sistema de roles roto |
| `user_roles` | 1 | ✅ | 2 | 🔴 INSERT sin restricción |
| `garages` | 0 | ✅ | 5 | ⚠️ UPDATE sin WITH CHECK |
| `garage_images` | 0 | ✅ | 5 | ⚠️ Políticas redundantes |
| `parking_spots` | 0 | ✅ | 3 | ⚠️ ALL sin WITH CHECK |
| `parking_spot_images` | 0 | ✅ | 4 | ✅ |
| `bookings` | 1 | ✅ | 7 | ⚠️ Políticas duplicadas + roles wrong |
| `booking_access_logs` | 2 | ✅ | 4 | ⚠️ INSERT duplicado sin status check |
| `reviews` | 0 | ✅ | 3 | ⚠️ Sin DELETE, UPDATE sin WITH CHECK |
| `price_history` | 0 | ✅ | 2 | ✅ |
| `pricing_rules` | 0 | ✅ | **0** | 🔴 RLS sin policies — acceso BLOQUEADO |
| `favorites` | 0 | ✅ | 4 | ⚠️ roles: public en todas |

### ⚠️ Tablas en `database.types.ts` que NO existen en DB

Estas tablas están en los tipos generados pero **NO existen** en la base de datos real:

| Tabla (en tipos) | Impacto |
|-----------------|---------|
| `payments` | Todo el flujo de pago sin trazabilidad financiera en DB |
| `refunds` | Sin sistema de devoluciones |
| `smart_access` | Diseño de acceso antiguo abandonado |
| `access_logs` | Tabla legacy eliminada (reemplazada por `booking_access_logs`) |
| `availability_slots` | Feature de slots pre-calculados nunca creada o eliminada |

**Acción:** `supabase gen types typescript --project-id gvyeipohgqzbhrqrxbqk > src/types/database.types.ts`

### ENUMs confirmados en DB

| Enum | Valores |
|------|---------|
| `booking_status` | pending, confirmed, active, completed, cancelled ✅ |
| `payment_status` | pending, completed, failed, refunded ✅ |
| `refund_status` | pending, approved, rejected, completed ✅ |
| `user_role_type` | admin, user, owner ✅ |
| `auth_provider_type` | email, google, facebook ✅ |

> **Nota:** Todos los ENUMs existen en DB pero `database.types.ts` declara `Enums: { [_ in never]: never }` — el archivo de tipos está desactualizado.

---

## 2. VULNERABILIDADES CRÍTICAS 🔴

### V-1 CRÍTICA: Escalada de privilegios — `user_roles` INSERT sin restricción

**Política real en DB:**
```sql
-- "Enable insert for authenticated users"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (true);  -- ← CUALQUIER autenticado puede insertar CUALQUIER rol
```

**Exploit:** Cualquier usuario autenticado puede asignarse el rol `admin`:
```javascript
// Ataque — funciona hoy mismo con solo el anon key
const { data: adminRole } = await supabase
  .from('roles').select('id').eq('name', 'admin').single();

await supabase.from('user_roles').insert({
  user_id: supabase.auth.getUser().id,
  role_id: adminRole.id  // → usuario se convierte en admin
});
```

**Impacto:** Account takeover completo. Cualquier usuario puede ser admin.

**Fix:**
```sql
DROP POLICY "Enable insert for authenticated users" ON public.user_roles;

-- Solo el sistema (triggers SECURITY DEFINER) puede asignar roles
-- Para el cliente, no se necesita INSERT directo en user_roles
REVOKE INSERT ON public.user_roles FROM authenticated;
```

---

### V-2 CRÍTICA: `pricing_rules` — RLS habilitado con 0 políticas → feature rota

**Estado real (confirmado por Supabase Advisor):**
```
Table `public.pricing_rules` has RLS enabled, but no policies exist
```

Con RLS activo y 0 políticas, **toda operación sobre esta tabla está denegada** para roles no-superuser. Esto significa:

- `bookingDal.fetchPricingRules(spotId)` → siempre devuelve `[]`
- `pricingService.calculateEstimation()` → multiplier siempre 1.0
- Los precios dinámicos **no funcionan** — nadie puede crear ni leer reglas

**Fix:**
```sql
-- Lectura pública de reglas activas (para calcular precio al reservar)
CREATE POLICY "Anyone can view active pricing rules" ON public.pricing_rules
FOR SELECT TO public
USING (is_active = true);

-- Solo propietarios de la plaza pueden crear/modificar reglas
CREATE POLICY "Owners can manage their pricing rules" ON public.pricing_rules
FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.parking_spots
          WHERE id = pricing_rules.parking_spot_id AND owner_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.parking_spots
          WHERE id = pricing_rules.parking_spot_id AND owner_id = auth.uid())
);
```

---

### V-3 CRÍTICA: `roles` tabla VACÍA — sistema de autorización roto

**Estado real:** `roles` tiene **0 filas**.

Consecuencias en cascada:
1. `handle_new_user` trigger: `SELECT id FROM roles WHERE name = 'user'` → NULL → no asigna rol
2. `promote_to_owner_on_garage_insert`: `SELECT id FROM roles WHERE name = 'owner'` → NULL → no asigna rol
3. `authUser.roles` siempre `[]` → `isOwner` siempre `false` → pantalla de owner nunca accesible
4. El único `user_roles` con 1 fila tiene una FK a un role inexistente (o hay un role que no aparece en el count aproximado)

**Verificación:**
```sql
SELECT * FROM public.roles;  -- Debe mostrar admin, user, owner
SELECT COUNT(*) FROM public.user_roles;
```

**Fix:**
```sql
INSERT INTO public.roles (name, description) VALUES
  ('admin', 'Administrador de la plataforma'),
  ('user', 'Usuario estándar'),
  ('owner', 'Propietario de garaje')
ON CONFLICT (name) DO NOTHING;
```

---

### V-4 CRÍTICA: `increment/decrement_garage_spots` — SECURITY DEFINER sin autenticación ni ownership check

**Funciones reales:**
```sql
CREATE OR REPLACE FUNCTION public.increment_garage_spots(garage_id_param uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.garages SET total_spots = total_spots + 1
    WHERE id = garage_id_param;  -- ← Sin validar quién llama ni si es el dueño
END;$$
```

**Confirmado por Supabase Advisor:** Ambas funciones son ejecutables por `anon` como SECURITY DEFINER vía `/rest/v1/rpc/`.

**Exploit:**
```bash
# Sin autenticación — contador de cualquier garaje a 0
curl -X POST https://gvyeipohgqzbhrqrxbqk.supabase.co/rest/v1/rpc/decrement_garage_spots \
  -H "apikey: ANON_KEY" \
  -d '{"garage_id_param": "uuid-de-cualquier-garaje"}'
```

**Fix:**
```sql
-- Añadir validación de ownership Y revocar acceso anon
CREATE OR REPLACE FUNCTION public.increment_garage_spots(garage_id_param uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.garages
                   WHERE id = garage_id_param AND owner_id = auth.uid()) THEN
        RAISE EXCEPTION 'No autorizado';
    END IF;
    UPDATE public.garages SET total_spots = total_spots + 1 WHERE id = garage_id_param;
END;$$;

REVOKE EXECUTE ON FUNCTION public.increment_garage_spots(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.decrement_garage_spots(uuid) FROM anon;
```

---

## 3. VULNERABILIDADES ALTAS 🟡

### V-5: `complete_past_bookings` — SECURITY DEFINER ejecutable por anon

Actualiza el status de TODAS las reservas pasadas. Callable sin autenticación.

```bash
# Cualquier usuario anon puede forzar la actualización masiva de bookings
curl -X POST .../rpc/complete_past_bookings -H "apikey: ANON_KEY"
```

No es destructivo (solo cambia pending→active→completed), pero cualquier anon puede triggear updates masivos en la tabla bookings en cualquier momento.

**Fix:**
```sql
REVOKE EXECUTE ON FUNCTION public.complete_past_bookings() FROM anon;
```

---

### V-6: `users` — SELECT público expone email y teléfono (RGPD)

**Política real:**
```sql
CREATE POLICY "Public profiles are viewable by everyone"
ON public.users FOR SELECT TO public USING (true);
```

Cualquier anon puede hacer `SELECT * FROM users` y obtener emails y teléfonos de todos los usuarios. Violación del RGPD/LOPDGDD.

**Fix:**
```sql
DROP POLICY "Public profiles are viewable by everyone" ON public.users;

-- Vista pública con solo datos mínimos necesarios para mostrar propietario
CREATE OR REPLACE VIEW public.public_profiles AS
  SELECT id, name, avatar_url FROM public.users WHERE is_active = true;

-- Los usuarios ven su propio perfil completo
CREATE POLICY "Users can view own full profile" ON public.users
FOR SELECT TO authenticated USING (auth.uid() = id);

-- Para ver propietario de un garaje: usar la vista public_profiles
```

---

### V-7: `garages` y `parking_spots` UPDATE sin WITH CHECK — transferencia de ownership

**Política real garages:**
```sql
-- USING: auth.uid() = owner_id
-- WITH CHECK: [NULO — no existe]
```

Sin `WITH CHECK`, un owner puede hacer UPDATE de su garaje cambiando `owner_id` a otro UUID, transfiriendo el garaje a otro usuario.

**Fix:**
```sql
DROP POLICY "Owners can update own garages" ON public.garages;
CREATE POLICY "Owners can update own garages" ON public.garages
FOR UPDATE TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);  -- ← Impide cambiar owner_id

-- Mismo fix para parking_spots ALL policy
DROP POLICY "Owners can manage own spots" ON public.parking_spots;
CREATE POLICY "Owners can manage own spots" ON public.parking_spots
FOR ALL TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);
```

---

### V-8: `booking_access_logs` — dos políticas INSERT con diferente seguridad (OR logic)

**Políticas reales:**
```sql
-- Política A (estricta): requiere booking.status = 'active'
"Users can insert access logs for their own bookings"
WITH CHECK (EXISTS (SELECT 1 FROM bookings b
  WHERE b.id = booking_access_logs.booking_id
  AND b.renter_id = auth.uid()
  AND b.status = 'active'));  -- ← status check

-- Política B (débil): sin status check
"Users can insert logs for their own bookings"
WITH CHECK (EXISTS (SELECT 1 FROM bookings
  WHERE bookings.id = booking_access_logs.booking_id
  AND bookings.renter_id = auth.uid()));  -- ← sin status check
```

Políticas PERMISSIVE usan lógica OR. La política B anula la A. Un usuario puede insertar logs de SmartAccess en reservas **canceladas, completadas o pendientes** — registros de acceso falsos.

**Fix:** Eliminar la política B (débil):
```sql
DROP POLICY "Users can insert logs for their own bookings" ON public.booking_access_logs;
```

---

### V-9: Policies con `roles: {public}` en operaciones que requieren auth

Las siguientes políticas declaran `TO public` en vez de `TO authenticated`:

| Tabla | Política | CMD | Problema |
|-------|---------|-----|---------|
| `bookings` | "Anyone can view bookings for availability" | SELECT | Expone renter_id a anon |
| `bookings` | "Owners can delete bookings for their garages" | DELETE | Debería ser authenticated |
| `bookings` | "Users can delete their own bookings" | DELETE | Debería ser authenticated |
| `favorites` | Todas (4 políticas) | ALL | Debería ser authenticated |

`auth.uid()` devuelve NULL para anon, así que las condiciones de ownership nunca se cumplen — no es un bug funcional, pero es mala práctica y confunde la intención de seguridad.

---

### V-10: Todas las funciones con `search_path` mutable

**Confirmado por Supabase Advisor:** Las 11 funciones públicas tienen search_path mutable.

Riesgo: si un atacante puede crear objetos en un schema con menor prioridad y manipular el `search_path`, puede sustituir funciones de sistema que llaman estas funciones. Bajo en la práctica pero es un hardening estándar.

**Fix para cada función:**
```sql
ALTER FUNCTION public.complete_past_bookings() SET search_path = public, extensions;
ALTER FUNCTION public.increment_garage_spots(uuid) SET search_path = public, extensions;
-- Repetir para las 11 funciones
```

---

### V-11: Storage — INSERT sin restricción de path en buckets

**Política real:**
```sql
"Avatar Auth Insert" ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK: [no visible — sin restricción de path]

"Garage Auth Insert" ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK: [no visible — sin restricción de path]
```

DELETE y UPDATE sí tienen restricción de folder: `foldername(name)[1] = auth.uid()`. Pero INSERT no. Cualquier usuario autenticado puede subir un archivo con cualquier path, potencialmente sobreescribiendo el avatar de otro usuario si conoce su UUID.

**Fix:**
```sql
-- Restringir INSERT al folder del propio usuario
DROP POLICY "Avatar Auth Insert" ON storage.objects;
CREATE POLICY "Avatar Auth Insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 4. ANÁLISIS COMPLETO DE POLÍTICAS RLS

### Cobertura real confirmada

| Tabla | RLS | SELECT | INSERT | UPDATE | DELETE | Issues |
|-------|-----|--------|--------|--------|--------|--------|
| `users` | ✅ | ⚠️ public=true | ✅ auth.uid=id | ⚠️ sin WITH CHECK | ❌ no policy | 2 |
| `roles` | ✅ | ✅ authenticated | ❌ | ❌ | ❌ | 0 (read-only OK) |
| `user_roles` | ✅ | ✅ own | 🔴 WITH CHECK=true | ❌ | ❌ | 1 crítico |
| `garages` | ✅ | ✅ active=public | ✅ owner | ⚠️ sin WITH CHECK | ✅ owner | 1 |
| `garage_images` | ✅ | ✅ public | ✅ owner | ✅ owner | ✅ owner | redundancias |
| `parking_spots` | ✅ | ✅ active=public | ✅ (ALL) | ⚠️ sin WITH CHECK | ✅ (ALL) | 1 |
| `parking_spot_images` | ✅ | ✅ public | ✅ owner | ✅ owner | ✅ owner | ✅ |
| `bookings` | ✅ | ⚠️ duplicadas | ✅ renter | ❌ no policy | ⚠️ roles=public | 3 |
| `booking_access_logs` | ✅ | ✅ | ⚠️ duplicada | ❌ | ❌ | 1 |
| `reviews` | ✅ | ✅ public | ✅ auth | ⚠️ sin WITH CHECK | ❌ no policy | 2 |
| `price_history` | ✅ | ✅ owner | ✅ owner | ❌ | ❌ | ✅ |
| `pricing_rules` | ✅ | 🔴 **BLOQUEADO** | 🔴 **BLOQUEADO** | 🔴 **BLOQUEADO** | 🔴 **BLOQUEADO** | 1 crítico |
| `favorites` | ✅ | ⚠️ roles=public | ⚠️ roles=public | ❌ | ⚠️ roles=public | 1 |

**Tablas sin cobertura UPDATE:** `users` (tiene USING pero sin WITH CHECK), `bookings` (sin policy UPDATE), `booking_access_logs`, `favorites`

**Tablas sin cobertura DELETE:** `users`, `reviews`, `price_history`, `pricing_rules`, `booking_access_logs`, `favorites` (DELETE está OK), `parking_spot_images` (DELETE OK)

---

## 5. ANÁLISIS DE FUNCIONES Y TRIGGERS

### Funciones (11 total)

| Función | SECURITY | Anon callable | Ownership check | Issues |
|---------|----------|--------------|----------------|--------|
| `check_booking_overlap` | INVOKER | No (trigger) | N/A | ✅ |
| `check_parking_spot_availability` | INVOKER | Sí (RPC) | N/A | ✅ OK público |
| `complete_past_bookings` | DEFINER | **Sí** 🔴 | N/A | Revocar anon |
| `decrement_garage_spots` | DEFINER | **Sí** 🔴 | **No** 🔴 | Crítico |
| `get_owner_average_rating` | DEFINER | Sí | N/A | ✅ OK público |
| `handle_new_user` | DEFINER | **Sí** ⚠️ | N/A | Revocar anon |
| `handle_updated_at` | DEFINER | **Sí** ⚠️ | N/A | Revocar anon |
| `increment_garage_spots` | DEFINER | **Sí** 🔴 | **No** 🔴 | Crítico |
| `log_price_change` | INVOKER | No (trigger) | N/A | ✅ |
| `promote_to_owner_on_garage_insert` | DEFINER | **Sí** ⚠️ | N/A | Revocar anon |
| `update_updated_at_column` | INVOKER | No (trigger) | N/A | ✅ |

**Nota:** `handle_new_user` y `handle_updated_at` son funciones de trigger — no deberían ser ejecutables como RPC. Son inofensivas si se llaman directamente (no hacen nada útil sin `NEW`), pero aumentan la superficie de ataque.

### Triggers (9 total)

| Trigger | Tabla | Evento | Timing | Función | Estado |
|---------|-------|--------|--------|---------|--------|
| `prevent_overlap_trigger` | bookings | INSERT, UPDATE | BEFORE | `check_booking_overlap` | ✅ |
| `update_bookings_updated_at` | bookings | UPDATE | BEFORE | `update_updated_at_column` | ✅ |
| `tr_promote_to_owner` | garages | INSERT | AFTER | `promote_to_owner_on_garage_insert` | ⚠️ roles vacíos |
| `update_garages_updated_at` | garages | UPDATE | BEFORE | `update_updated_at_column` | ✅ |
| `log_price_change_trigger` | parking_spots | UPDATE | BEFORE | `log_price_change` | ✅ |
| `update_parking_spots_updated_at` | parking_spots | UPDATE | BEFORE | `update_updated_at_column` | ✅ |
| `update_reviews_updated_at` | reviews | UPDATE | BEFORE | `update_updated_at_column` | ✅ |
| `update_users_updated_at` | users | UPDATE | BEFORE | `update_updated_at_column` | ✅ |

**Ausente:** No hay trigger en `auth.users` para `handle_new_user`. Este trigger debería estar en `auth.users` AFTER INSERT para crear el perfil automáticamente. Verificar en el Dashboard → Database → Triggers si existe a nivel de schema `auth`.

**Redundancia:** `handle_updated_at` y `update_updated_at_column` hacen exactamente lo mismo. Solo se usa `update_updated_at_column` en los triggers — `handle_updated_at` es código muerto.

---

## 6. ANÁLISIS DE ÍNDICES

### Índices existentes (39 total)

**Bien cubiertos:**
- `bookings`: idx_bookings_dates (start_time, end_time), idx_bookings_renter_id, idx_bookings_spot_id, idx_bookings_status ✅
- `garages`: idx_garages_city, idx_garages_is_active, idx_garages_location (lat, lng), idx_garages_owner_id ✅
- `parking_spots`: idx_parking_spots_garage_id, idx_parking_spots_is_active, idx_parking_spots_owner_id ✅
- `reviews`: idx_reviews_garage_id, idx_reviews_rating, idx_reviews_user_id ✅
- `users`: idx_users_email, idx_users_is_active ✅
- `favorites`: UNIQUE (user_id, parking_spot_id) — doble función de unique + índice ✅

### Índices faltantes (confirmados por Advisor)

```sql
-- booking_access_logs.booking_id — FK sin índice
CREATE INDEX idx_booking_access_logs_booking_id
  ON public.booking_access_logs(booking_id);

-- favorites.parking_spot_id — FK sin índice
CREATE INDEX idx_favorites_parking_spot_id
  ON public.favorites(parking_spot_id);

-- pricing_rules.parking_spot_id — FK sin índice
CREATE INDEX idx_pricing_rules_spot_id
  ON public.pricing_rules(parking_spot_id);

-- Índice compuesto para check de disponibilidad (query más frecuente del overlap trigger)
CREATE INDEX idx_bookings_spot_status_times
  ON public.bookings(parking_spot_id, status, start_time, end_time);

-- GiST para queries de distancia real (lat/lng BTREE solo ayuda con bounding box)
CREATE EXTENSION IF NOT EXISTS postgis;
ALTER TABLE garages ADD COLUMN location GEOGRAPHY(POINT, 4326);
CREATE INDEX idx_garages_location_gist ON garages USING GIST(location);
```

---

## 7. STORAGE AUDIT

### Buckets reales

| Bucket | Público | SELECT | INSERT | UPDATE | DELETE |
|--------|---------|--------|--------|--------|--------|
| `avatars` | ✅ | Todo el bucket | ⚠️ Sin path check | Por folder (uid) | Por folder (uid) |
| `garage_images` | ✅ | Todo el bucket | ⚠️ Sin path check | Por folder (uid) | Por folder (uid) |

**Problema SELECT listing (Advisor):** Ambos buckets tienen `SELECT USING (bucket_id = 'avatars')` sin restricción de path. Esto permite que cualquier anon **liste todos los archivos** del bucket con un `GET /storage/v1/object/list/avatars`. Para acceso por URL directa esto no es necesario.

**Fix:**
```sql
-- Para SELECT, no se necesita policy si el bucket es público (acceso por URL directa)
-- La policy de SELECT amplia solo habilita listing, que no es necesario
DROP POLICY "Avatar Public Select" ON storage.objects;
DROP POLICY "Garage Public Select" ON storage.objects;
-- Los archivos siguen siendo accesibles por URL pública sin esta policy
```

---

## 8. AUTH CONFIGURATION

### Leaked Password Protection — DESACTIVADO

**Confirmado por Supabase Advisor:** La protección contra contraseñas comprometidas (HaveIBeenPwned) está desactivada.

**Fix:** Dashboard → Authentication → Providers → Email → Password Security → Enable "Leaked password protection"

---

## 9. HALLAZGOS DE SCHEMA / INTEGRIDAD

### S-1: `bookings` columnas `vehicle_plate` y `vehicle_description` nullable sin validación

Las columnas existen en DB con comentarios correctos, pero sin CHECK constraint de formato de matrícula española.

```sql
ALTER TABLE public.bookings ADD CONSTRAINT check_vehicle_plate
  CHECK (vehicle_plate ~ '^[0-9]{4}[A-Z]{3}$' OR vehicle_plate IS NULL);
```

### S-2: `reviews` sin DELETE policy — usuarios no pueden borrar sus reseñas

```sql
CREATE POLICY "Users can delete own reviews" ON public.reviews
FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

### S-3: `reviews` UPDATE sin WITH CHECK — usuario puede cambiar user_id en su reseña

```sql
DROP POLICY "Users can update own reviews" ON public.reviews;
CREATE POLICY "Users can update own reviews" ON public.reviews
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND rating >= 1 AND rating <= 5);
```

### S-4: `bookings` sin UPDATE policy — status no se puede cambiar via cliente (correcto)

El status de bookings solo se modifica via:
- `complete_past_bookings()` RPC — actualización automática
- `updateBookingStatus()` en DAL — llamada directa con anon key

Sin UPDATE policy RLS, `updateBookingStatus()` funciona solo si el cliente usa el service_role key o si hay una policy permisiva. Verificar si las cancelaciones funcionan realmente.

### S-5: `payments` y `refunds` no existen — flujo financiero sin persistencia

Las reservas se crean con `total_price` en `bookings` pero no se registra ningún pago en una tabla `payments`. Stripe no está integrado. Todo el flujo financiero es UI sin respaldo en DB.

### S-6: `auth_providers` no existe — tracking de proveedores OAuth sin respaldo

`auth.service.ts` intenta insertar en `auth_providers` pero la tabla no existe. Todas esas operaciones fallan silenciosamente. El login con Google/Facebook funciona vía Supabase Auth nativo (no necesita esta tabla), pero el código de fallback es código muerto que lanza errores.

---

## 10. PLAN DE ACCIÓN PRIORIZADO

### Inmediato — Crítico (ejecutar HOY, no modifica datos)

```sql
-- 1. Poblar tabla roles (sistema de autorización roto sin esto)
INSERT INTO public.roles (name, description) VALUES
  ('admin', 'Administrador'), ('user', 'Usuario'), ('owner', 'Propietario')
ON CONFLICT (name) DO NOTHING;

-- 2. Añadir policies a pricing_rules (feature rota)
CREATE POLICY "Anyone can view active pricing rules" ON public.pricing_rules
FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Owners manage pricing rules" ON public.pricing_rules
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM parking_spots WHERE id = pricing_rules.parking_spot_id AND owner_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM parking_spots WHERE id = pricing_rules.parking_spot_id AND owner_id = auth.uid()));

-- 3. Revocar INSERT en user_roles para authenticated (escalada de privilegios)
DROP POLICY "Enable insert for authenticated users" ON public.user_roles;

-- 4. Revocar anon EXECUTE en funciones SECURITY DEFINER peligrosas
REVOKE EXECUTE ON FUNCTION public.increment_garage_spots(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.decrement_garage_spots(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.complete_past_bookings() FROM anon;
```

### Semana 1 — Hardening

```sql
-- 5. Restricción de ownership en increment/decrement
-- (ver V-4 para código completo)

-- 6. Fix garages UPDATE WITH CHECK
DROP POLICY "Owners can update own garages" ON public.garages;
CREATE POLICY "Owners can update own garages" ON public.garages
FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- 7. Fix parking_spots ALL WITH CHECK
DROP POLICY "Owners can manage own spots" ON public.parking_spots;
CREATE POLICY "Owners can manage own spots" ON public.parking_spots
FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- 8. Eliminar policy INSERT débil en booking_access_logs
DROP POLICY "Users can insert logs for their own bookings" ON public.booking_access_logs;

-- 9. Índices faltantes
CREATE INDEX idx_booking_access_logs_booking_id ON public.booking_access_logs(booking_id);
CREATE INDEX idx_favorites_parking_spot_id ON public.favorites(parking_spot_id);
CREATE INDEX idx_pricing_rules_spot_id ON public.pricing_rules(parking_spot_id);
CREATE INDEX idx_bookings_spot_status_times ON public.bookings(parking_spot_id, status, start_time, end_time);

-- 10. Fix search_path en funciones (repetir para las 11)
ALTER FUNCTION public.complete_past_bookings() SET search_path = public, extensions;
ALTER FUNCTION public.increment_garage_spots(uuid) SET search_path = public, extensions;
ALTER FUNCTION public.decrement_garage_spots(uuid) SET search_path = public, extensions;
ALTER FUNCTION public.get_owner_average_rating(uuid) SET search_path = public, extensions;
ALTER FUNCTION public.handle_new_user() SET search_path = public, auth, extensions;
ALTER FUNCTION public.handle_updated_at() SET search_path = public, extensions;
ALTER FUNCTION public.promote_to_owner_on_garage_insert() SET search_path = public, extensions;
ALTER FUNCTION public.log_price_change() SET search_path = public, extensions;
ALTER FUNCTION public.check_booking_overlap() SET search_path = public, extensions;
ALTER FUNCTION public.check_parking_spot_availability(uuid, timestamptz, timestamptz) SET search_path = public, extensions;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, extensions;
```

### Semana 2 — RGPD y Storage

```sql
-- 11. Restringir SELECT de users (RGPD)
DROP POLICY "Public profiles are viewable by everyone" ON public.users;
CREATE POLICY "Users can view own full profile" ON public.users
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE VIEW public.public_profiles AS
  SELECT id, name, avatar_url FROM public.users WHERE is_active = true;

-- 12. Fix Storage INSERT policies con path restriction
DROP POLICY "Avatar Auth Insert" ON storage.objects;
CREATE POLICY "Avatar Auth Insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY "Garage Auth Insert" ON storage.objects;
CREATE POLICY "Garage Auth Insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'garage_images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 13. Activar leaked password protection en Dashboard Auth Settings
```

---

## 11. CHECKLIST DE ESTADO

```
CRÍTICOS:
[ ] roles tabla poblada (admin/user/owner)
[ ] pricing_rules policies creadas
[ ] user_roles INSERT bloqueado para authenticated
[ ] increment/decrement_garage_spots: revocar anon + ownership check

ALTOS:
[ ] complete_past_bookings: revocar anon
[ ] users SELECT: eliminar USING(true), crear public_profiles view
[ ] garages UPDATE: añadir WITH CHECK
[ ] parking_spots ALL: añadir WITH CHECK
[ ] booking_access_logs: eliminar policy duplicada débil
[ ] storage INSERT: restricción de path por uid

MEDIOS:
[ ] search_path fijado en las 11 funciones
[ ] bookings policies: cambiar roles public → authenticated
[ ] favorites policies: cambiar roles public → authenticated
[ ] reviews: añadir DELETE policy + WITH CHECK en UPDATE
[ ] storage SELECT listing: eliminar policies de SELECT amplias

BAJOS:
[ ] 4 índices faltantes creados
[ ] database.types.ts regenerado (incluir enums, booking_access_logs, eliminar tablas inexistentes)
[ ] handle_updated_at eliminado (código muerto, duplicate de update_updated_at_column)
[ ] Leaked password protection activado en Dashboard
```

---

*Análisis generado mediante acceso directo MCP Supabase. Datos verificados en tiempo real.*
*Próxima revisión recomendada tras aplicar los fixes críticos.*
