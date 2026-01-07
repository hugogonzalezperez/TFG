# Guía de Prueba de Navegación - Parky

Sigue estos pasos para verificar que toda la navegación funciona correctamente.

## ✅ Checklist de Pruebas

### 1. **Login → Home**
- [ ] Inicia con `npm run dev`
- [ ] Ve a http://localhost:3000
- [ ] Deberías ver la pantalla de Login
- [ ] Ingresa cualquier email/contraseña
- [ ] Haz clic en "Iniciar Sesión"
- [ ] ✓ Deberías ver la pantalla Home
SI

### 2. **Home → Map**
- [ ] En la pantalla Home, completa los campos de búsqueda (fecha, hora, ubicación)
- [ ] Haz clic en "Buscar Plazas"
- [ ] ✓ Deberías ver el mapa con la lista de parkings
SI
### 3. **Map → Detail**
- [ ] En la pantalla Map, haz clic en cualquier parking de la lista
- [ ] ✓ Deberías ver los detalles del parking seleccionado
si
### 4. **Detail → Booking**
- [ ] En la pantalla de detalles, haz clic en "Reservar esta plaza"
- [ ] ✓ Deberías ver el formulario de reserva
Si
### 5. **Booking → Profile**
- [ ] En Booking, haz clic en "Confirmar reserva"
- [ ] ✓ Deberías ver el perfil del usuario con la reserva
Si
### 6. **Profile → Home**
- [ ] Haz clic en el botón de retroceso o el logo
- [ ] ✓ Deberías volver a Home
SI
### 7. **Navegación Secundaria**
- [ ] Desde Home o Map, haz clic en "Mi Perfil" (si existe)
- [ ] ✓ Deberías ver UserProfile
Si
### 8. **Verificar Console**
- [ ] Abre la consola del navegador (F12)
- [ ] ✓ No deberías ver errores rojos
- [ ] ✓ Puedes ignorar warnings amarillos de dependencias externas
Si
---

## 🐛 Si algo falla

**Error típico:** "Component not found" → Verifica que los imports en App.tsx sean correctos.

**Error de tipos:** TypeScript se queja → Ejecuta `npm run build` para ver el error completo.

**Página en blanco:** Abre F12 y busca errores en la consola.

---

## 📋 Páginas Disponibles

| Nombre | Path | Descripción |
|--------|------|------------|
| Login | / | Pantalla inicial |
| SignUp | / | Registro (acceso desde Login) |
| Home | /home | Búsqueda de parkings |
| Map | /map | Vista de mapa y listado |
| ParkingDetail | /detail | Detalles del parking |
| BookingProcess | /booking | Reserva paso a paso |
| UserProfile | /profile | Perfil del usuario |
| OwnerProfile | /owner-profile | Perfil del propietario |

---

## ✨ Notas

- Los datos de parkings son **mock** (ficticios), están en `MapView.tsx`
- Las credenciales de login no se validan (aceptan cualquier input)
- Las reservas se guardan en **memoria** (se pierden al recargar la página)

Para más cambios, edita los archivos en `src/pages/` y `src/components/features/`.
