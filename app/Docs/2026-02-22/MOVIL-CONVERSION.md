# Guía Master de Migración Móvil y Despliegue: Parky

Como tu mentor técnico, he estructurado esta guía para que no solo resuelvas tu TFG, sino que dejes el proyecto con la calidad de un producto de producción real.

---

## 1. Auditoría Inicial: Estado de Parky

### ¿Qué corregir ahora mismo?
Al revisar tu proyecto (`Tailwind`, `Radix UI`, `Vite`), he detectado estos puntos clave:
- **Zonas de riesgo**: El mapa (`Leaflet`) suele romperse en móvil si no se gestiona bien el gesto de "scroll" vs "pan". Los formularios en modales suelen quedar ocultos por el teclado virtual.
- **Error típico**: Pensar que "responsive" es solo cambiar `flex-row` por `flex-col`. En móvil, el usuario usa el pulgar, no el puntero. Los botones deben tener al menos **44px** de altura (zona de toque).
- **Navegación**: En PC usas menús horizontales; en móvil necesitas un `Sheet` (Drawer) o una barra inferior (Tab Bar).

---

## Proposed Changes

### [Fase 1: Layout y Home Page Responsive]

#### [NEW] [Header.tsx](file:///root/TFG/app/src/shared/components/layout/Header.tsx)
- Crear un componente de Header unificado que maneje:
    - Logo centrado en móvil.
    - Menú lateral (Sheet) para navegación móvil.
    - Menú horizontal para desktop.
    - Estado de autenticación integrado.

#### [NEW] [MainLayout.tsx](file:///root/TFG/app/src/shared/components/layout/MainLayout.tsx)
- Crear un wrapper que incluya el `Header` y el `Outlet` de React Router para evitar duplicidad de navegación.

#### [MODIFY] [routes.tsx](file:///root/TFG/app/src/core/router/routes.tsx)
- Envolver las rutas principales con el `MainLayout`.

#### [MODIFY] [HomePage.tsx](file:///root/TFG/app/src/pages/home/HomePage.tsx)
- Eliminar el Header duplicado.
- Rediseñar el `Hero Section` para móviles:
    - Reducir tamaños de fuente (`text-3xl` vs `text-5xl`).
    - Adaptar la `Search Card` para que sea una columna vertical en pantallas pequeñas.
    - Optimizar el z-index de los "blobs" decorativos.

### [Fase 2: Mapa y Detalles]
- Adaptación de la vista de mapa (toggle lista/mapa avanzado).
- Rediseño de la galería de imágenes en `ParkingDetail`.
- Optimización de formularios de reserva.

## Verification Plan

### Automated Tests
- No se requieren tests automatizados en esta fase, pero se recomienda verificar con `npm run lint`.

### Manual Verification
- Usar las DevTools de Chrome con emulación de:
    - iPhone SE (pantalla pequeña).
    - iPad (tablet).
    - Desktop 1440px.
- Verificar que el menú hamburguesa funciona y cierra correctamente al navegar.

| Fase | Tarea Crítica | Justificación Senior |
| :--- | :--- | :--- |
| **Fase 1: Layout Base** | Implementar `Mobile-First` en `globals.css` y contenedores. | Evita sobreescribir estilos PC con `media queries` infinitas. |
| **Fase 2: Componentes** | Adaptar `Buttons`, `Inputs` y `Modals` (usar `Vaul` para drawers). | Mejora el UX táctil drásticamente. |
| **Fase 3: Navegación** | Crear un `MobileNav` (Tab Bar inferior o Hamburger). | Los patrones de navegación cambian totalmente entre dispositivos. |

---

## 3. Despliegue Gratuito y Sencillo

Para un proyecto Vite + React, la mejor opción es **Vercel** o **Netlify**.

### Pasos para Vercel (Recomendado):
1.  **Sube tu código a GitHub** (si no lo has hecho ya).
2.  Crea una cuenta en [Vercel](https://vercel.com/) vinculada a GitHub.
3.  Dale a **"Add New Project"** y selecciona tu repositorio.
4.  **Configura las variables de entorno**: Copia las de tu [.env.local](file:///root/TFG/app/.env.local) (Supabase URL, Anon Key) a la sección *Environment Variables* de Vercel.
5.  **Deploy**: Vercel detectará que es Vite y lo desplegará en 1 minuto. Te dará una URL tipo `parky.vercel.app`.

---

## 4. Estrategia Móvil para tu TFG: ¿Es difícil?

Aquí es donde entra la decisión estratégica. Tienes tres caminos:

### A. Opción "Fácil" (PWA):
**Dificultad: 1/10**.
- Es básicamente tu web responsive con un archivo `manifest.json` y un `Service Worker`.
- **Pros**: Instalable, funciona offline (básico), muy rápido de hacer.
- **Contra**: No está en la App Store/Play Store (aunque se puede "envolver").

### B. Opción "Intermedia" (Capacitor):
**Dificultad: 4/10**.
- Usas tu web actual, la "envuelves" con Capacitor (de Ionic) y genera un proyecto Xcode/Android Studio.
- **Pros**: Tienes una App real instalable en el móvil usando tu código web actual al 100%.

### C. Opción "Senior" (React Native con Expo):
**Dificultad: 7/10**.
- **Reutilizas**: Servicios de Supabase, Lógica de validación, Hooks de estado.
- **Rehaces**: Todo lo visual (`<div>` pasa a `<View>`, `<span>` a `<Text>`).
- **Análisis para TFG**: Si te piden específicamente "App Móvil", hacerla en React Native puntúa más, pero el esfuerzo es 3 veces mayor. **Mi consejo**: Si vas justo de tiempo, usa Capacitor o PWA. Si quieres lucirte y aprender lo que pide el mercado, **React Native + Expo**.

---

## 5. Profundizando en PWA (Progressive Web App)

### Cómo implementarlo hoy:
Usa el plugin `vite-plugin-pwa`. Es el estándar actual.
```bash
npm add -D vite-plugin-pwa
```
**Qué ganas**: Icono en la pantalla de inicio, pantalla de carga (splash screen) y que no se vea la barra de direcciones del navegador. Para un TFG, esto suele "colar" como aplicación móvil si la UI está muy pulida.

---

## 6. Comparativa Final

| Característica | Web Responsive | PWA | React Native (Expo) |
| :--- | :--- | :--- | :--- |
| **Desarrollo** | Mismo código | Mismo código + Config | Código nuevo (UI) |
| **Instalable** | No | Sí (Navegador) | Sí (App Store) |
| **Rendimiento** | Depende del browser | Alto | Nativo (Máximo) |
| **Acceso Hardware** | Limitado | Medio | Total |

---

## 7. Mi recomendación para TI

1.  **Semana 1**: Haz que la web sea **100% responsiva** (especialmente el flujo de reserva y perfil).
2.  **Semana 1 (Final)**: Despliega en **Vercel** para que tu tutor pueda entrar desde su móvil.
3.  **Semana 2**: Añade `vite-plugin-pwa`. Ya tienes "App Móvil" funcional.
4.  **Si te sobra tiempo**: Investiga **React Native con Expo**. Puedes compartir la carpeta `src/services` y `src/hooks` entre ambos proyectos usando un **Monorepo** (con Turborepo o simplemente carpetas hermanas).

**¿Te gustaría que empezáramos adaptando algún componente específico (como el Header o el mapa) a móvil ahora mismo?**


El proyecto usa una arquitectura Features-based, lo cual es un punto muy positivo para la memoria del TFG. Está preparado para ser escalable y fácil de mantener.

TIP

Mi recomendación: Si quieres "sorprender" al tribunal, el siguiente paso debería ser la Navegación Móvil (Bottom Bar) y el Refactor de las tarjetas del Historial de Reservas del usuario.