# 🅿️ Parky - Marketplace de Gestión de Aparcamientos (TFG)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

## 1. Introducción y Objetivo del Proyecto
Este proyecto representa el Trabajo de Fin de Grado (TFG) de **Parky**, una solución integral para la gestión y reserva de plazas de aparcamiento en entornos urbanos (enfocado inicialmente en Tenerife).

El objetivo principal es democratizar el acceso a plazas de parking privadas, permitiendo que propietarios de garajes puedan rentabilizar sus espacios infrautilizados mientras que los conductores encuentran opciones de aparcamiento seguras, económicas y reservables en tiempo real.

## 2. Alcance del Sistema y Problemática

### 😫 Problemática
- **Escasez de aparcamiento:** Dificultad extrema para encontrar plazas en cascos históricos y zonas comerciales.
- **Plazas privadas vacías:** Muchos garajes privados permanecen vacíos durante gran parte del día sin generar beneficio.
- **Inseguridad y falta de previsión:** Los conductores a menudo desconocen si habrá sitio disponible en su destino.

### 🎯 Alcance
Parky resuelve esto mediante una plataforma bilateral:
- **Para el Conductor (Renter):** Búsqueda en mapa, filtros por precio/tipo, reserva inmediata y gestión de accesos.
- **Para el Propietario (Owner):** Alta de garajes y plazas, gestión de disponibilidad, monitorización de ingresos y control de reseñas.

## 3. Tecnologías Utilizadas
La elección del stack tecnológico se basa en la necesidad de rapidez de desarrollo (Time-to-Market), escalabilidad y robustez:

- **Frontend:** `React 18`, `Vite`, `TypeScript`, `Tailwind CSS`, `Radix UI`, `React Query`.
- **Backend (BaaS):** `Supabase` (Auth, Database, Storage).
- **Mapas:** `Leaflet` & `React Leaflet`.
- **Geocodificación:** `OpenCage API`.

## 4. Arquitectura General
El sistema sigue una arquitectura de **Single Page Application (SPA)** conectada a un **Backend as a Service (Supabase)**.

- **Frontend:** Arquitectura basada en **Features**, donde cada módulo funcional encapsula sus propios componentes, lógica (services), tipos y hooks.
- **Backend:** Lógica de negocio crítica reside en funciones de base de datos (PL/pgSQL) y disparadores (Triggers).
- **Seguridad:** Implementación de **Row Level Security (RLS)** en PostgreSQL.

## 5. Estructura del Proyecto
```text
.
├── src/
│   ├── core/                # Configuración base (enrutador, temas)
│   ├── features/            # Módulos funcionales principales
│   │   ├── auth/            # Gestión de identidad y sesiones
│   │   ├── booking/         # Flujo de reservas y accesos
│   │   ├── parking/         # Gestión de garajes, plazas y mapas
│   │   └── profile/         # Perfiles de usuario y propietario
│   ├── shared/              # Componentes y utilidades compartidas
│   ├── pages/               # Vistas de alto nivel (v7 routes)
│   ├── styles/              # CSS global y variables de tema
│   └── types/               # Definiciones de tipos globales
├── Docs/                    # Documentación del proyecto
├── PRUEBAS/                 # Scripts SQL y utilidades de seeding
├── public/                  # Activos estáticos
└── index.html               # Punto de entrada principal
```

## 6. Componentes Principales
- **MapView:** Mapa interactivo integrado con filtrado dinámico.
- **ParkingDetail:** Vista detallada con imágenes, precios y valoraciones.
- **BookingProcess:** Flujo de reserva optimizado paso a paso.
- **OwnerDashboard:** Panel de control para propietarios de plazas.

## 7. Gestión del Estado
- **Autenticación**: `AuthContext` para persistencia de sesión.
- **Filtros**: `FilterProvider` para sincronizar el mapa y las búsquedas.
- **Sincronización**: `React Query` para comunicación eficiente con la base de datos.

## 8. Diseño de la Base de Datos
Modelo relacional en PostgreSQL con entidades para: `users`, `garages`, `parking_spots`, `bookings`, `reviews` y `access_logs`.

---

## 9. Configuración e Instalación
### Requisitos
- Node.js 18+
- Cuenta en Supabase

### Pasos
1. **Instalar dependencias:**
   ```bash
   npm install
   ```
2. **Configurar variables de entorno:**
   Crea un archivo `.env.local` con:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   ```
3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

## 10. Créditos
**Desarrollado como Trabajo de Fin de Grado.**
Autor: **Hugo González Pérez**
Año: 2026