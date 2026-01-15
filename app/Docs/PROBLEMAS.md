Enrutamiento Manual y No Escalable:

Problema: El archivo App.tsx utiliza un switch y un estado (useState) para gestionar la navegación. Este es el mayor punto débil de la estructura actual.
Impacto:
No hay URLs únicas: Un usuario no puede copiar la URL de la página de un parking específico para compartirla. Todas las vistas existen bajo la misma URL raíz.
No hay historial de navegación: El botón "atrás/adelante" del navegador no funciona como se espera.
Mantenimiento complejo: Añadir nuevas páginas o rutas anidadas (ej: /profile/settings) se vuelve muy engorroso y propenso a errores.

Lógica de Negocio Mezclada con la UI:

Problema: Los datos de prueba (parkingSpots) están definidos directamente dentro del componente MapView.tsx. En un futuro, la lógica para obtener datos de Supabase (llamadas fetch, useEffect) probablemente viviría también ahí.
Impacto: Los componentes se vuelven difíciles de testear y reutilizar. La lógica de datos está fuertemente acoplada a su representación visual.
Gestión de Estado Limitada:

Problema: El estado se pasa principalmente a través de props (ej: onNavigate). Aunque usas Context para la autenticación (lo cual es correcto), otras partes de la aplicación podrían sufrir de "prop drilling" (pasar props a través de muchos niveles de componentes).
Impacto: El flujo de datos se vuelve difícil de seguir y refactorizar.
Organización de Archivos por Tipo, no por Funcionalidad:

Problema: Tienes carpetas como context, types, etc., en la raíz de src. Cuando tengas 5 contextos diferentes y 20 archivos de tipos, estas carpetas se volverán caóticas.
Impacto: Encontrar todos los archivos relacionados con una funcionalidad (ej: todo lo que tiene que ver con "reservas") requiere navegar por múltiples carpetas, ralentizando el desarrollo.



/root/TFG/app/src/
├── api/
│   ├── authApi.ts
│   ├── parkingsApi.ts
│   └── bookingApi.ts
├── assets/
│   ├── images/
│   └── icons/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ... (tus componentes UI reutilizables)
│   └── layout/
│       ├── MainLayout.tsx
│       ├── Header.tsx
│       └── Footer.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── types.ts
│   ├── parkings/
│   │   ├── components/
│   │   │   ├── MapView.tsx
│   │   │   ├── ParkingList.tsx
│   │   │   ├── ParkingCard.tsx
│   │   │   └── ParkingFilters.tsx
│   │   ├── hooks/
│   │   │   ├── useParkings.ts
│   │   │   └── useParkingDetail.ts
│   │   └── types.ts
│   └── booking/
│       ├── components/
│       │   ├── BookingForm.tsx
│       │   └── BookingSummary.tsx
│       ├── hooks/
│       │   └── useBooking.ts
│       └── types.ts
├── hooks/
│   └── useLocalStorage.ts
├── lib/
│   └── supabase.ts
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── ParkingsPage.tsx
│   ├── ParkingDetailPage.tsx
│   ├── BookingPage.tsx
│   ├── ProfilePage.tsx
│   └── NotFoundPage.tsx
├── providers/
│   └── AppProviders.tsx
├── routes/
│   ├── index.tsx
│   └── ProtectedRoute.tsx
├── store/
│   └── (vacío por ahora, para Zustand/Redux en el futuro)
├── styles/
│   └── globals.css
├── types/
│   └── database.types.ts
└── utils/
    └── formatters.ts



/root/TFG/app/src/
├── api/                  # (Fase 3) Funciones de fetch (authApi.ts, parkingsApi.ts)
├── components/
│   ├── ui/               # Componentes UI puros y reutilizables (Button, Card, Input)
│   └── layout/           # Componentes de maquetación (Header, Footer, MainLayout)
├── features/             # (Fase 2) El corazón de la app, por funcionalidad
│   ├── auth/
│   │   ├── components/   # Formularios de Login/Signup
│   │   ├── hooks/        # useAuth
│   │   └── types.ts
│   ├── parkings/
│   │   ├── components/   # MapView, ParkingList, ParkingCard
│   │   ├── hooks/        # useParkings, useParkingDetail
│   │   └── types.ts
│   └── booking/
│       └── ...
├── hooks/                # Hooks globales y reutilizables (ej: useLocalStorage)
├── lib/                  # Clientes de librerías de terceros (ej: supabase.ts)
├── pages/                # (Fase 1) Componentes "página" que componen features
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   └── ParkingDetailPage.tsx
├── providers/            # (Fase 4) Proveedores de contexto globales (AppProviders.tsx)
├── routes/               # (Fase 1) Configuración de React Router (index.tsx, ProtectedRoute.tsx)
├── store/                # (Opcional) Para state managers más avanzados (Zustand/Redux)
├── styles/               # Estilos globales
├── types/                # Tipos globales (ej: de la base de datos)
└── utils/                # Funciones de utilidad puras (ej: formatters)
