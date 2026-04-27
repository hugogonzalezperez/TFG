# AUDITORÍA PARKY — 2026-04-27
> Plan de acción priorizado. Marcar cada tarea al completar.

---

## ESTADO GENERAL
- **Último análisis:** 2026-04-27
- **Versión auditada:** branch `main` (commit `7e02534`)
- **Auditor:** Claude Sonnet 4.6 (análisis integral de código + esquema DB)
- **Archivos analizados:** 110+ ficheros src/, 7 SQL scripts, database.types.ts (562 líneas)

---

## 🔴 CRÍTICOS — Hacer antes de la defensa

### C-1: QueryClient recreado en cada render
- [x] Mover `new QueryClient({...})` fuera del cuerpo de `App()` en [src/App.tsx:42](../src/App.tsx#L42)
- **Impacto si no se hace:** Toda la caché de TanStack Query se destruye en cada re-render. Comportamiento impredecible.
- **Fix:** 2 líneas. Mover antes del `export default function App()` o usar `useState`.

```tsx
// ANTES (roto) — dentro de App():
const queryClient = new QueryClient({...});

// DESPUÉS (correcto) — fuera del componente:
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1 } }
});
export default function App() { ... }
```

---

### C-2: Precio de reserva calculado en cliente — sin validación server-side
- [x] Edge Function `calculate-price` desplegada y activa (ACTIVE, verify_jwt: true)
- [x] `bookingDal.getServerCalculatedPrice()` llama a la función antes de insertar
- [x] `bookingDal.insertBooking()` usa precio del servidor — ignora totalPrice del cliente
- [ ] Opcional: trigger PL/pgSQL para doble validación (no crítico para TFG)
- **Impacto si no se hace:** Cualquier usuario con DevTools puede insertar `total_price: 0.01`. Reservas gratis.
- **Archivo:** [src/features/booking/services/pricing.service.ts](../src/features/booking/services/pricing.service.ts) + [booking.dal.ts:75](../src/features/booking/services/booking.dal.ts#L75)

---

### C-3: `changePassword` no verifica contraseña actual
- [x] Añadir re-autenticación antes de `updateUser` en [src/features/auth/services/auth.service.ts:295](../src/features/auth/services/auth.service.ts#L295)
- **Impacto si no se hace:** Session hijacking → cambio de contraseña sin conocer la original → account takeover.

```typescript
// Añadir ANTES de supabase.auth.updateUser:
const { error: reAuthError } = await supabase.auth.signInWithPassword({
  email: (await supabase.auth.getUser()).data.user!.email!,
  password: currentPassword
});
if (reAuthError) throw new Error('Contraseña actual incorrecta');
```

---

### C-4: Dos archivos `database.types.ts` divergentes
- [x] `src/types/database.types.ts` regenerado vía MCP — incluye 5 ENUMs, booking_access_logs, public_profiles view, elimina tablas fantasma
- [x] `src/shared/types/database.types.ts` verificado como código muerto (0 imports en todo src/) — sin acción necesaria
- [x] parking.dal.ts ya importaba desde `src/types/database.types.ts` correctamente
- **Impacto si no se hace:** Tipos fantasma. Errores en runtime enmascarados por `as any`.

---

### C-5: Capacitor CLI v7 + Core v8 — mismatch de versión mayor
- [ ] `npm install @capacitor/cli@^8.1.0 --save-dev`
- [ ] Verificar `npx cap sync` no produce errores tras el update
- **Impacto si no se hace:** Siguiente `cap sync` puede generar APK inestable. Runtime crashes en Android.

---

### C-6: `booking_access_logs` no está en database.types.ts
- [ ] Verificar que la tabla existe en Supabase Dashboard
- [ ] Ejecutar `supabase gen types` para incluirla (ver C-4)
- [ ] Si no existe, crear la tabla y su RLS antes de ejecutar SmartAccess
- **Impacto si no se hace:** Todos los logs de SmartAccess fallan silenciosamente (el DAL hace try/catch → console.error).

---

## 🟡 MEDIA PRIORIDAD — Antes de entregar

### M-1: Eliminar 44 `console.log/error/warn` de producción
- [ ] Añadir `if (import.meta.env.DEV)` a todos o crear wrapper `logger.ts`
- Buscar con: `grep -rn "console\." src/ --include="*.ts" --include="*.tsx"`

### M-2: Reemplazar 4 instancias de `select('*')` con columnas específicas
- [ ] [src/features/booking/services/booking.dal.ts:13](../src/features/booking/services/booking.dal.ts#L13) — pricing_rules
- [ ] [src/features/booking/services/booking.dal.ts:52](../src/features/booking/services/booking.dal.ts#L52) — bookings
- [ ] [src/features/auth/services/auth.service.ts:218](../src/features/auth/services/auth.service.ts#L218) — auth_providers ⚠️ contiene `password_hash`
- [ ] [src/features/auth/services/auth.service.ts:226](../src/features/auth/services/auth.service.ts#L226) — users

### M-3: Soft delete en reservas
- [ ] Añadir columna `deleted_at TIMESTAMPTZ` a `bookings`
- [ ] Cambiar `bookingDal.deleteBooking()` de `DELETE` a `UPDATE SET deleted_at = now()`
- [ ] Añadir filtro `WHERE deleted_at IS NULL` en todas las queries de bookings

### M-4: Añadir Error Boundary global
- [x] `src/shared/components/ErrorBoundary.tsx` creado
- [x] Wrappea `<Suspense><Outlet /></Suspense>` en AppContent

### M-5: Fijar versiones wildcard en package.json
- [ ] `"clsx": "^2.1.1"` (en vez de `"*"`)
- [ ] `"tailwind-merge": "^2.3.0"` (en vez de `"*"`)

### M-6: SmartAccess — validar que la reserva está activa antes de abrir
- [ ] En [src/features/booking/services/smartAccess.service.ts](../src/features/booking/services/smartAccess.service.ts): verificar `booking.status === 'active'` antes de insertar log
- [ ] Documentar en la memoria que es simulación (no hardware real)

### M-7: Retry loop con busy-wait en AuthContext
- [ ] Investigar por qué el trigger `auto_owner_trigger` es lento (ver BBDD_AUDITORIA.md)
- [ ] Considerar usar `supabase.auth.onAuthStateChange` con debounce en vez de polling

### M-8: React `^18` + `@types/react ^19` — type mismatch
- [ ] Actualizar a `"react": "^19.0.0"` + `"react-dom": "^19.0.0"` (o bajar @types/react a ^18)
- [ ] Verificar compatibilidad de Capacitor con React 19

---

## 🔵 BAJA PRIORIDAD — Polish

### B-1: Eliminar dependencias muertas
- [ ] `next-themes` — no se usa, eliminar con `npm uninstall next-themes`
- [ ] Verificar si `recharts` se usa (grep `recharts` en src/)
- [ ] `@types/bcryptjs` — bcrypt fue eliminado, eliminar el tipo huérfano

### B-2: Activar flags de TypeScript
- [ ] En [tsconfig.json](../tsconfig.json): cambiar `"noUnusedLocals": false` → `true`
- [ ] `"noUnusedParameters": false` → `true`
- [ ] Resolver los errores que aparezcan

### B-3: Tests mínimos
- [ ] Instalar Vitest: `npm install -D vitest`
- [ ] Test unitario para `pricingService.calculateEstimation()` (lógica pura)
- [ ] Test unitario para `bookingDal.checkAvailability()` (mock de Supabase)
- [ ] Objetivo: 10 tests básicos mínimo para la defensa

### B-4: CI/CD básico
- [ ] Crear `.github/workflows/ci.yml`
- [ ] Jobs: `lint` + `typecheck` + `vitest`

### B-5: Resolver TO_FIX.md
- [ ] Actualizar tabla 1.2 con precios actuales de parking en Canarias
- [ ] Verificar datos de vehículos en Canarias para punto 1.4.2
- [ ] Añadir enlaces a Telpark y otras apps en §1.3.1 y §1.3.2
- [ ] Revisar fechas de bibliografía
- [ ] Definir estrategia anti-fraude para SmartAccess (ver §9 del informe de auditoría)

### B-6: Migraciones SQL versionadas
- [ ] Crear directorio `supabase/migrations/`
- [ ] Mover los 7 scripts de `src/shared/lib/sql/` con timestamps:
  - `20241001000001_add_vehicle_info_to_bookings.sql`
  - `20241001000002_auto_owner_trigger.sql`
  - `20241001000003_fix_booking_overlap_final.sql`
  - `20241001000004_fix_garages_rls.sql`
  - `20241001000005_garage_counters.sql`
  - `20241001000006_price_history_policy.sql`
  - `20241001000007_user_visibility_policy.sql`

---

## 📚 DOCUMENTACIÓN (LaTeX) — Entrega crítica

### Estado de capítulos
| Capítulo | Estado | Acción necesaria |
|----------|--------|-----------------|
| Cap. 1 — Introducción | ✅ Completo | Solo fixes de TO_FIX.md |
| Cap. 2 — Tecnologías | ✅ Completo | Revisión final con /humanizer |
| Cap. 3 — Diseño | ⚠️ Placeholder | **Escribir completo** |
| Cap. 4 — Implementación | ⚠️ Lorem Ipsum | **Escribir completo** (reemplazar placeholder) |
| Cap. 5 — Implementación real | ❓ Verificar | Confirmar contenido |
| Cap. 6 — Pruebas | ⚠️ Placeholder | **Escribir completo** |
| Cap. 7 — Presupuesto | ⚠️ Placeholder | **Escribir completo** |
| Conclusiones | ⚠️ Placeholder | **Escribir completo** |

- [ ] Eliminar `\autoref{fig:otra}` roto en [Docs/04-capítulo4.tex](../Docs/04-capítulo4.tex)
- [ ] Compilar con `npm run docs:build` y verificar 0 errores tras cada capítulo

---

## 🔐 BASE DE DATOS — Ver BBDD_AUDITORIA.md para detalles

- [ ] Habilitar RLS en tablas sin cobertura confirmada (payments, refunds, reviews, smart_access, roles)
- [ ] Restringir `SELECT *` en `auth_providers` — nunca exponer `password_hash` al cliente
- [x] `increment/decrement_garage_spots` — REVOKE EXECUTE anon aplicado ✅
- [x] `booking_access_logs` existe en DB con RLS y 4 políticas ✅ (policy débil eliminada)
- [ ] Revisar política `USING (true)` en `users` — expone emails y teléfonos públicamente
- [x] `pricing_rules` 0 policies → 2 policies creadas (feature de precios dinámicos restaurada) ✅
- [x] `user_roles` INSERT WITH CHECK(true) → policy eliminada (escalada de privilegios cerrada) ✅
- [x] `complete_past_bookings` REVOKE EXECUTE anon aplicado ✅

---

## PROGRESO GLOBAL

```
Críticos completados:  4 / 6  (C-1, C-2, C-3, C-4)
Media completados:     1 / 8  (M-4)
Baja completados:      0 / 6
Documentación:        2 / 8 capítulos
```

---
*Actualizar este archivo tras cada sesión de trabajo. Fecha próxima revisión: 2026-05-01*
