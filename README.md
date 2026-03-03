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

### Problemática
- **Escasez de aparcamiento:** Dificultad extrema para encontrar plazas en cascos históricos y zonas comerciales.
- **Plazas privadas vacías:** Muchos garajes privados permanecen vacíos durante gran parte del día sin generar beneficio.
- **Inseguridad y falta de previsión:** Los conductores a menudo desconocen si habrá sitio disponible en su destino.

### Alcance
Parky resuelve esto mediante una plataforma bilateral:
- **Para el Conductor (Renter):** Búsqueda en mapa, filtros por precio/tipo, reserva inmediata y gestión de accesos.
- **Para el Propietario (Owner):** Alta de garajes y plazas, gestión de disponibilidad, monitorización de ingresos y control de reseñas.

## 3. Tecnologías Utilizadas
La elección del stack tecnológico se basa en la necesidad de rapidez de desarrollo (Time-to-Market), escalabilidad y robustez:

- **Frontend:**
  - **React 18 & Vite:** Para una interfaz de usuario reactiva y una experiencia de desarrollo ultra rápida.
  - **TypeScript:** Garantiza la integridad de los datos y facilita el mantenimiento a largo plazo mediante tipado estático.
  - **Tailwind CSS:** Sistema de diseño basado en utilidades para una estética moderna y responsive.
  - **Radix UI:** Primitivas de componentes accesibles para asegurar que la aplicación sea usable por todos.
  - **React Query:** Gestión eficiente del estado asíncrono y caché de datos de la API.

- **Backend (BaaS):**
  - **Supabase:** Plataforma Backend-as-a-Service que proporciona autenticación, base de datos PostgreSQL en tiempo real y almacenamiento de archivos.

- **Mapas y Localización:**
  - **Leaflet & React Leaflet:** Visualización de mapas interactivos.
  - **OpenCage API:** Geocodificación para convertir direcciones en coordenadas.

## 4. Arquitectura General
El sistema sigue una arquitectura de **Single Page Application (SPA)** conectada a un **Backend as a Service (Supabase)**.

- **Frontend:** Organizado bajo una arquitectura basada en **Features**, donde cada módulo funcional (auth, parking, booking, profile) encapsula sus propios componentes, lógica (services), tipos y hooks.
- **Backend:** Supabase gestiona la persistencia de datos y la autenticación. La lógica de negocio crítica reside en funciones de base de datos (PL/pgSQL) y disparadores (Triggers) para asegurar la integridad de los datos independientemente del cliente.
- **Seguridad:** Implementación de **Row Level Security (RLS)** en PostgreSQL, asegurando que cada usuario solo pueda acceder o modificar sus propios datos o aquellos que le correspondan por su rol.

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

## 6. Componentes Principales e Interacción
- **MapView:** Componente central que integra el mapa interactivo con el listado de parkings. Filtra dinámicamente según la posición del mapa y los parámetros del usuario.
- **ParkingDetail:** Vista detallada que consume datos de geolocalización, imágenes del garaje y valoraciones de otros usuarios.
- **BookingProcess:** Un flujo paso a paso que gestiona la selección de fechas, validación de disponibilidad y confirmación del pago.
- **OwnerDashboard:** (Dentro de Profile) Interfaz para que los propietarios gestionen sus activos, vean estadísticas de uso y controlen los accesos.

## 7. Gestión del Estado y Comunicación
- **React Context:** Se utiliza para estados globales persistentes como la **Autenticación (AuthContext)** y los **Filtros de Búsqueda (FilterProvider)**.
- **React Query:** Maneja la sincronización de datos con Supabase. Permite invalidar cachés automáticamente cuando se realiza una reserva o se actualiza un perfil, manteniendo la UI siempre fresca.
- **React Router (v7):** Gestiona la navegación declarativa y la protección de rutas mediante componentes de orden superior (ProtectedRoute).

## 8. Diseño de la Base de Datos
El modelo de datos es relacional (PostgreSQL) y consta de las siguientes entidades principales:

- **users:** Perfiles de usuario extendidos de Supabase Auth.
- **garages:** Entidad principal de los activos de un propietario (dirección, coordenadas, metadatos).
- **parking_spots:** Plazas individuales dentro de un garaje, con precios y tipos específicos.
- **bookings:** Registro de transacciones entre usuarios y plazas, incluyendo horarios y estados (pendiente, activo, completado).
- **reviews:** Sistema de valoraciones vinculado a reservas finalizadas para garantizar la veracidad.
- **booking_access_logs:** Registro de seguridad de entradas y salidas de los vehículos.

### Lógica Automática (SQL)
Se han implementado funciones PL/pgSQL para tareas críticas:
- `complete_past_bookings()`: Automatiza la limpieza y actualización de estados de reservas.
- `promote_to_owner_on_garage_insert()`: Trigger que asigna automáticamente el rol de propietario al crear un garaje.
- `handle_new_user()`: Sincronización automática entre Supabase Auth y la tabla de perfiles públicos.

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
   La aplicación estará disponible en `http://localhost:5173` o `http://localhost:3000`.

## 10. Decisiones de Diseño y Futuras Mejoras
### Decisiones Clave
- **Mobile-First:** El diseño prioriza el uso en dispositivos móviles, ya que es el escenario más común al buscar parking.
- **BaaS (Supabase):** Se eligió para reducir el overhead de gestión de servidores y centrar el esfuerzo en la lógica de negocio y experiencia del usuario.

### Limitaciones Conocidas
- La pasarela de pago (Stripe) está integrada estructuralmente en la DB pero requiere configuración de webhooks para producción.
- El sistema de navegación GPS es externo (enlaza a Google Maps/Waze).

### Mejoras Futuras
- **Integración con Hardware:** Sensores IoT para detección de presencia física en las plazas.
- **IA de Precios Dinámicos:** Algoritmo que ajuste el `current_price_per_hour` basándose en la demanda local y eventos.
- **App Nativa:** Migración a React Native compartiendo la lógica de los servicios actuales.

---

## 11. Créditos
**Desarrollado como Trabajo de Fin de Grado.**
Autor: **Hugo González Pérez**
Año: 2026