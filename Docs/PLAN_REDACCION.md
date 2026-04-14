# Plan de Redacción — TFG Parky
## Marketplace colaborativo de aparcamiento P2P

**Autor:** Hugo González Pérez  
**Tutores:** D. Francisco Javier Rodríguez González / D. Alejandro Pérez Nava  
**Universidad:** Universidad de La Laguna — Grado en Ingeniería Informática

---

## Estado general

| Fase | Capítulo | Estado | Prioridad |
|------|----------|--------|-----------|
| A | Cap. 1: Introducción (completar) | En curso | Crítica |
| B | Cap. 2: Tecnologías y Herramientas | Pendiente | Alta |
| C | Cap. 3: Metodología y Requisitos | Pendiente | Alta |
| D | Cap. 4: Diseño del Sistema | Pendiente | Crítica |
| E | Cap. 5: Implementación | Pendiente | Alta |
| F | Cap. 6: Pruebas y Validación | Pendiente | Media |
| G | Cap. 7: Conclusiones + Presupuesto | Pendiente | Media |
| H | Apéndices + Bibliografía | Pendiente | Baja |

---

## FASE A — Completar el Capítulo 1: Introducción

**Objetivo:** Dejar el capítulo introductorio cerrado al 100% antes de continuar.  
El tribunal lee este capítulo primero. Una introducción incompleta o genérica genera una primera impresión difícil de revertir.

### Ya escrito (no tocar salvo revisión)
- §1.1 Definición del problema — buen nivel, con datos reales
- §1.2 Justificación — tres ejes sólidos (ZBE, economía colaborativa, viabilidad tecnológica)
- Resumen en español e inglés — escrito, aunque incompleto (falta Capacitor, Stripe, precios dinámicos)

### Por escribir

#### §1.3 Estado del Arte / Análisis de la Competencia
- Categorizar el ecosistema actual de aplicaciones de aparcamiento:
  - Aplicaciones de zona regulada/azul: EasyPark, Telpark
  - Plataformas de reserva en aparcamientos comerciales: Parclick, ElParking, Parkimeter
  - Plataformas P2P (referentes internacionales): JustPark (UK), SpotHero (US)
- Tabla comparativa: Parky vs. los cinco principales competidores
  - Columnas: Reserva P2P entre particulares / Mapa interactivo / Pago integrado / App nativa / Acceso físico digital / Precios dinámicos / Mercado objetivo
- Cierre del apartado: vacío de mercado que ocupa Parky en Canarias

**Archivos de código relevantes:** ninguno (análisis de mercado, no código)  
**Herramientas de investigación:** búsqueda web de las apps mencionadas para datos actualizados

#### §1.4 Objetivos
- Objetivo general: una frase clara y sin ambigüedades
- Objetivos específicos: entre 5 y 7, formulados como resultados verificables
  - OE1: Implementar autenticación segura con RBAC y OAuth social
  - OE2: Desarrollar mapa interactivo con Leaflet y geocodificación
  - OE3: Implementar flujo de reservas con prevención de solapamientos en BD
  - OE4: Diseñar e implementar motor de precios dinámicos con reglas temporales
  - OE5: Integrar sistema de acceso físico digital (SmartAccess)
  - OE6: Desplegar la aplicación como app web (Vercel) y app Android nativa (Capacitor)
  - OE7: Diseñar el modelo de negocio con gestión de pagos P2P vía Stripe Connect

**Archivos de código relevantes:** `routes.tsx`, `database.types.ts` (para cruzar que cada objetivo tiene respaldo en código)

#### §1.5 Estructura de la memoria
- Un párrafo por cada capítulo (Caps. 2 al 7) explicando su contenido y relación con el anterior
- Función: orientar al lector y demostrar que la memoria tiene hilo conductor

**Archivos de código relevantes:** ninguno

#### Actualización del Resumen (ES + EN)
- Añadir: app Android nativa vía Capacitor
- Añadir: sistema de precios dinámicos
- Añadir: SmartAccess (acceso físico digital)
- Añadir: Stripe Connect como arquitectura de pagos P2P

---

## FASE B — Capítulo 2: Tecnologías y Herramientas Utilizadas

**Objetivo:** Demostrar dominio del stack elegido y justificar cada decisión técnica con criterio ingenieril, no solo listar herramientas.

### Estructura propuesta

#### §2.1 Lenguajes y entorno de desarrollo
- TypeScript con `strict: true`: por qué el tipado estático reduce errores en tiempo de ejecución
- Node.js / entorno Vite: HMR, build optimizado, ESM nativo
- ESLint: calidad de código automatizada (hook PostToolUse)

#### §2.2 Framework frontend: React 18 + Vite 6
- React 18: Concurrent Mode, Suspense, lazy loading de rutas
- Vite 6: bundler con esbuild, diferencias respecto a Create React App / Webpack
- TanStack Query v5: gestión de server state, caché, revalidación
- React Hook Form: validación sin renders innecesarios
- Tailwind CSS v4: utility-first, nueva arquitectura PostCSS sin config JS

#### §2.3 Componentes de interfaz: Radix UI + shadcn/ui
- Primitivos accesibles (WCAG 2.1): Dialog, Sheet, Tabs, Select, Avatar
- Design system basado en Class Variance Authority

#### §2.4 Backend as a Service: Supabase
- PostgreSQL como base de datos relacional
- Supabase Auth: gestión de sesiones JWT, OAuth social
- Supabase Storage: almacenamiento de imágenes de garajes
- Row Level Security: seguridad a nivel de base de datos (no de aplicación)
- Comparativa: Supabase vs Firebase vs AWS Amplify (tabla)

#### §2.5 Cartografía y geocodificación
- Leaflet 1.9 + React-Leaflet 4: licencia open source, ligero (40KB gzipped)
- OpenCage Geocoding API: conversión de dirección textual a coordenadas lat/lng

#### §2.6 Despliegue multiplataforma
- Vercel: SPA hosting con edge network, analytics, Speed Insights
- Capacitor 8: compilación de la web app en APK Android nativo (`com.parky.app`)
  - Plugins usados: Geolocation, Haptics, SplashScreen, StatusBar, Preferences

#### §2.7 Integración de pagos: Stripe Connect
- Diferencia entre Stripe Standard y Stripe Connect (Marketplace Accounting)
- Flujo P2P: arrendatario paga → Parky retiene comisión → propietario recibe neto
- Relevancia fiscal: Stripe gestiona el IGIC automáticamente en Canarias

#### §2.8 Justificación del stack (por qué Serverless/BaaS)
- Coste en fase early-stage: Supabase Free tier (500 MB, 50k req/mes)
- Sin gestión de servidores: el equipo de uno no puede hacer OPS + DEV
- Escalabilidad progresiva: de Free a Pro sin cambiar arquitectura
- Trade-off asumido: menor control sobre el motor de base de datos

**Archivos de código a leer:**
- `package.json` (versiones exactas)
- `capacitor.config.ts` (configuración de la app nativa)
- `src/shared/lib/supabase.ts` (inicialización del cliente)
- `vite.config.ts` (configuración del bundler)

---

## FASE C — Capítulo 3: Metodología y Análisis de Requisitos

**Objetivo:** Demostrar que el proyecto se planificó y no solo se "programó". Este capítulo diferencia un trabajo de ingeniería de un trabajo de programación.

### Estructura propuesta

#### §3.1 Metodología de desarrollo
- Enfoque iterativo e incremental adaptado a un equipo unipersonal
- Descripción de los sprints/iteraciones principales (qué se construyó en cada fase)
- Herramientas de gestión: Git como registro histórico de decisiones

#### §3.2 Requisitos funcionales (RF)
- Tabla formal: ID / Descripción / Prioridad (MoSCoW) / Módulo
- Mínimo 20 RFs identificados del código real
- Ejemplos: RF-01 El sistema permitirá registrarse con email o cuenta Google/Facebook

#### §3.3 Requisitos no funcionales (RNF)
- RNF-01 Rendimiento: tiempo de carga inicial < 3s (Vite code splitting)
- RNF-02 Seguridad: ninguna operación de lectura/escritura sin política RLS activa
- RNF-03 Disponibilidad: SLA Supabase Free ≥ 99%
- RNF-04 Usabilidad: diseño Mobile-First, compatible iOS/Android/Web

#### §3.4 Casos de uso
- Diagrama UML de casos de uso (actores: Usuario/Arrendatario, Propietario, Sistema)
- Descripción textual de los 5 casos de uso críticos:
  - CU-01: Registro y autenticación
  - CU-02: Búsqueda de plaza en mapa
  - CU-03: Proceso completo de reserva
  - CU-04: Gestión del acceso físico (SmartAccess)
  - CU-05: Gestión de garaje por el propietario

#### §3.5 Planificación temporal
- Diagrama de Gantt con las fases del proyecto
- Hito de análisis, diseño, implementación por módulos, pruebas, documentación

#### §3.6 Análisis del modelo de negocio
- Canvas de negocio (Business Model Canvas simplificado)
- Análisis de competencia (referencia al Estado del Arte del Cap. 1)
- Viabilidad económica: cuándo es rentable para el propietario alquilar
- Barrera legal: IGIC 5% en Canarias y cómo Stripe Connect la resuelve
- Fuentes de ingresos de Parky: comisión de plataforma (ej. 10% por transacción)

**Archivos de código a leer:**
- `src/core/router/routes.tsx` (rutas = acciones del sistema = base para casos de uso)
- `src/shared/types/database.types.ts` (entidades = base para RFs)
- `src/features/booking/types/booking.types.ts` (estados del sistema de reservas)

---

## FASE D — Capítulo 4: Diseño del Sistema

**Objetivo:** El capítulo técnico más importante. Documenta las decisiones de arquitectura con justificaciones reales, no solo diagramas decorativos.

### Estructura propuesta

#### §4.1 Arquitectura general
- Diagrama de capas: Browser/App → SPA React → Supabase (Auth + DB + Storage) → PostgreSQL
- Patrón feature-based: cómo se organizan los módulos en `src/features/`
- Separación de responsabilidades: DAL / Service / Hook / Component

#### §4.2 Diseño de la Base de Datos
- Diagrama Entidad-Relación completo (14 tablas)
- Descripción de cada tabla con su función en el dominio
- Decisiones de diseño: por qué `price_history` es una tabla separada, por qué `smart_access` y `access_log` son distintas

#### §4.3 Seguridad con Row Level Security
- Qué es RLS y por qué es superior a validar en el servidor de aplicación
- Análisis de cada política implementada (con código SQL real)
- Trigger `prevent_overlap_trigger`: seguridad atómica contra reservas duplicadas
- Trigger `tr_promote_to_owner`: automatización del RBAC al crear un garaje

#### §4.4 Sistema de autenticación y autorización
- Flujo de registro/login con email (diagrama de secuencia)
- Flujo OAuth con Google/Facebook (PKCE, callback /auth/callback)
- Modelo RBAC: roles user / owner / admin y cómo se resuelven en el cliente

#### §4.5 Sistema de reservas
- Máquina de estados de una reserva: pending → confirmed → active → completed / cancelled
- Prevención de solapamiento: doble capa (cliente + trigger DB)
- BookingTimeline: representación visual de slots ocupados

#### §4.6 Motor de precios dinámicos
- Modelo de datos `PricingRule`: day_of_week, start_time, end_time, multiplier
- Algoritmo de selección: filtrado + multiplicador máximo
- Fórmula: `precio_final = precio_base × horas × multiplicador`
- (Con listado del código real de `pricing.service.ts`)

#### §4.7 Diseño de la interfaz de usuario
- Principios de diseño aplicados: Mobile-First, Progressive Disclosure
- Sistema de componentes: Radix UI como base accesible
- Flujo principal de la app (wireframes o capturas anotadas)
- Dark/Light mode con next-themes

#### §4.8 SmartAccess: sistema de acceso físico
- Arquitectura del sistema: reserva confirmada → código de acceso → apertura física
- Tabla `smart_access` y tabla `access_log` (trazabilidad completa)
- SmartAccessModal: countdown circular SVG, estados opened/closed/expiring

#### §4.9 Integración de pagos con Stripe Connect
- Arquitectura Marketplace: cuenta Connect para cada propietario
- Flujo de dinero: pago del arrendatario → Parky retiene comisión → transferencia al propietario
- Gestión del IGIC: Stripe Tax en jurisdicción canaria

**Archivos de código a leer:**
- Todos los `.sql` en `src/shared/lib/sql/`
- `src/features/booking/services/pricing.service.ts`
- `src/features/booking/components/SmartAccessModal.tsx`
- `src/shared/types/database.types.ts`
- `src/features/auth/services/auth.service.ts`

---

## FASE E — Capítulo 5: Implementación

**Objetivo:** Mostrar el "cómo" con fragmentos de código reales y justificados. No es un volcado de código: es una narración técnica que explica decisiones de implementación.

### Estructura propuesta

#### §5.1 Estructura del proyecto
- Árbol de directorios comentado
- Por qué feature-based en lugar de layer-based (escalabilidad, cohesión)
- Alias `@/` para imports: evitar rutas relativas profundas

#### §5.2 Módulo de autenticación
- Registro con Supabase Auth + creación de perfil en tabla `users`
- Gestión del callback OAuth
- AuthContext: estado global del usuario con roles
- ProtectedRoute / PublicRoute

#### §5.3 Módulo de parking
- Integración de Leaflet: marcadores, popups, detección de click
- Geocodificación: cómo se convierte una dirección en coordenadas al publicar un garaje
- Filtros: FilterContext para estado compartido entre mapa y sidebar
- DAL: query con join garage → parking_spots → bookings para disponibilidad en tiempo real

#### §5.4 Módulo de reservas
- BookingProcess: stepper de 4 pasos con validación por paso
- Doble verificación de disponibilidad (cliente + trigger DB)
- useBookingFlow: hook que gestiona el estado del proceso completo
- SmartAccess: generación del código y apertura

#### §5.5 Módulo de perfil y dashboard del propietario
- UserProfile vs OwnerProfile: bifurcación basada en rol
- OwnerDashboardTab: estadísticas con Recharts
- AddSpotForm: geocodificación + LocationPicker en mapa
- GarageImageUploader: subida a Supabase Storage con preview

#### §5.6 Despliegue
- Vercel: configuración en `vercel.json` para SPA routing (rewrite a index.html)
- Capacitor: flujo `vite build → cap sync → cap open android`
- Variables de entorno: `.env.local` con VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

**Archivos de código a leer:**
- `src/features/auth/services/auth.service.ts`
- `src/features/auth/context/AuthContext.tsx`
- `src/features/parking/services/parking.service.ts` + `parking.dal.ts`
- `src/features/booking/hooks/useBookingFlow.ts`
- `src/features/parking/components/MapView.tsx`
- `src/features/profile/components/owner/OwnerDashboardTab.tsx`
- `vercel.json`

---

## FASE F — Capítulo 6: Pruebas y Validación

**Objetivo:** Diferenciarse de los TFGs típicos. La mayoría solo tiene pruebas unitarias triviales. Parky puede documentar pruebas de seguridad RLS que son genuinamente interesantes.

### Estructura propuesta

#### §6.1 Estrategia de pruebas
- Pirámide de pruebas adaptada al proyecto
- Qué se priorizó y por qué (flujos de negocio críticos + seguridad de datos)

#### §6.2 Pruebas funcionales
- Flujo completo: registro → búsqueda → reserva → SmartAccess → valoración
- Prueba del motor de precios dinámicos: casos con y sin reglas activas
- Prueba de cancelación de reserva y cambio de estado

#### §6.3 Pruebas de seguridad (RLS)
- Caso: usuario A no puede ver ni modificar reservas del usuario B
- Caso: el trigger de solapamiento bloquea dos reservas simultáneas en la misma plaza
- Caso: un usuario sin rol 'owner' no puede crear garajes (o sí puede pero el trigger le asigna el rol)

#### §6.4 Pruebas de usabilidad y rendimiento
- Lighthouse audit: Performance, Accessibility, Best Practices, SEO
- Lazy loading: impacto en el tiempo de carga inicial
- Prueba en dispositivo Android real: Capacitor + geolocalización

---

## FASE G — Capítulo 7: Conclusiones y Líneas Futuras + Presupuesto

**Objetivo:** Cierre reflexivo y honesto. No listar lo que se hizo (el tribunal ya lo leyó) sino evaluar críticamente qué salió bien, qué no, y qué se haría diferente.

### Estructura propuesta

#### §7.1 Conclusiones
- Grado de consecución de cada objetivo específico (referencia cruzada con §1.4)
- Reflexión sobre el stack: qué funcionó, qué limitaciones tiene Supabase Free tier
- Aprendizajes de la arquitectura Serverless en un proyecto real

#### §7.2 Líneas de trabajo futuro
- LF-01: Integración completa de Stripe Connect (actualmente diseñada, no implementada en cliente)
- LF-02: Precios dinámicos basados en demanda en tiempo real (tipo surge pricing)
- LF-03: Sistema de notificaciones push (Capacitor Push + Supabase Realtime)
- LF-04: Panel de administración para moderación de garajes
- LF-05: Expansión geográfica fuera del área metropolitana de Tenerife
- LF-06: Integración con sistemas IoT de apertura de garajes (sustituyendo el SmartAccess simulado)

#### §8.1 Presupuesto (Capítulo 8)
- Costes de hardware: portátil de desarrollo (amortización proporcional)
- Costes de software: todos los servicios utilizados son gratuitos o free tier
  - Supabase Free: 0€/mes
  - Vercel Hobby: 0€/mes
  - Stripe: 0€ (comisión por transacción, no coste fijo)
  - Capacitor: open source
  - Vite / React / Tailwind: open source
- Costes de personal: horas de ingeniería × tarifa hora junior/senior
- Coste total del proyecto con desglose real
- Análisis de viabilidad: cuándo el modelo de negocio se vuelve rentable

---

## FASE H — Apéndices y Bibliografía

**Objetivo:** Material de referencia técnica que soporta el cuerpo principal pero que interrumpiría el flujo de lectura si se incluyera en los capítulos.

### Apéndice A: Manual de despliegue
- Requisitos: Node.js 20+, cuenta Supabase, cuenta Vercel
- Variables de entorno necesarias
- Pasos para deploy en Vercel
- Pasos para compilar la APK Android con Capacitor

### Apéndice B: Esquema completo de la base de datos
- Listados SQL de creación de tablas
- Listados SQL de políticas RLS
- Listados SQL de triggers

### Bibliografía (`referencias.bib`)
Hay que sustituir TODOS los placeholders por referencias reales:
- INE / ISTAC: datos de parque móvil en Canarias
- Cabildo de Tenerife / Ayuntamiento de Santa Cruz: datos de ZBE
- Documentación oficial de Supabase, React, Capacitor, Stripe
- Artículos académicos sobre economía colaborativa y sharing economy
- RFC o papers sobre Row Level Security en PostgreSQL
- Estudios de mercado sobre plataformas P2P de movilidad

---

## Criterios transversales para toda la redacción

Estos principios aplican a todos los capítulos sin excepción:

1. **Cada decisión técnica necesita justificación**, no solo descripción. No es suficiente decir "se usó Supabase". Hay que explicar por qué Supabase y no Firebase, y qué se pierde con esa elección.

2. **El código real es el argumento**. Los listados de código en la memoria deben ser reales, extraídos del repositorio, no ejemplos inventados. Si hay que simplificarlos para la memoria, indicarlo explícitamente.

3. **Las figuras tienen que trabajar**. Cada figura, tabla o diagrama debe aportar información que el texto no transmite igual de bien. Si una figura solo repite lo que ya dice el párrafo, sobra.

4. **Sin lenguaje de relleno**. Frases como "cabe destacar que", "es importante mencionar", "en el marco de este contexto" no aportan nada. Directamente al grano.

5. **Las conclusiones son reflexión, no resumen**. El tribunal ya leyó el trabajo. Las conclusiones son el espacio para evaluar críticamente, admitir limitaciones y proponer mejoras con criterio.
