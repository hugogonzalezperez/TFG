# Arquitectura del Proyecto Parky 🏗️

Este proyecto sigue una arquitectura modular basada en **Features** (Funcionalidades) y **Pages** (Páginas), diseñada para ser escalable, mantenible y fácil de probar.

## Estructura de Directorios

```
src/
├── core/           # Configuración base del proyecto
│   └── config/     # Variables de entorno constantes
├── features/       # Módulos de negocio (Auth, Parking, Booking...)
│   ├── auth/       # Feature: Autenticación
│   ├── booking/    # Feature: Proceso de Reserva
│   ├── parking/    # Feature: Mapa y Gestión de Parking
│   └── profile/    # Feature: Perfiles de Usuario/Dueño
├── pages/          # Vistas de la aplicación (Rutas)
│   ├── auth/       # Páginas de Login/Registro
│   ├── home/       # Página de Inicio
│   ├── parking/    # Páginas de Mapa y Detalle
│   ├── booking/    # Página de Reserva
│   └── profile/    # Páginas de Perfil
├── shared/         # Código compartido entre features
│   ├── components/ # Componentes reutilizables (Loaders, etc.)
│   ├── lib/        # Librerías externas (Supabase, Utils UI)
│   └── types/      # Tipos globales (Database)
├── ui/             # Biblioteca de componentes UI base (Botones, Inputs...)
└── App.tsx         # Punto de entrada y Router principal
```

## Reglas de Arquitectura

1.  **Features**: Contienen toda la lógica de negocio.
    *   Cada feature tiene un `index.ts` (Public API). SOLO se debe importar desde ahí.
    *   Estructura interna: `components/`, `context/`, `services/`, `types/`, `utils/`.

2.  **Pages**: Son wrappers o vistas que componen features.
    *   No contienen lógica de negocio compleja.
    *   Actúan como las "pantallas" que ve el usuario.

3.  **Shared**: Utilidades y componentes genéricos que no pertenecen a un feature específico.
    *   `UI`: Componentes "tontos" de diseño (Design System).

4.  **Imports**:
    *   ✅ `import { AuthProvider } from '@/features/auth'`
    *   ❌ `import { AuthProvider } from '@/features/auth/context/AuthContext'` (Evitar imports profundos en features ajenas)

## Flujo de Datos

*   **App.tsx**: Maneja el estado global de navegación (`currentPage`).
*   **Contexts**: Manejan el estado global de negocio (`AuthContext`, `FilterContext`).
*   **Pages**: Reciben `onNavigate` y orquestan la navegación.