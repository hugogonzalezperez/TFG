Ahora mismo no se ven reflejadas las valoraciones en el perfil del usuario. Tampoco se pueden poner nuevas valoraciones.

No se puede poner reseñas o valoraciones a los parkings o garajes reservados.

La foto de perfil en el user profile no se muestra.

no se muestran los datos del propietario ni su rating en el parking detail (Solo pasa desde un usuario que no es el mismo dueño del parking)

No se pasa bien la hora de la reserva en el parking detail al booking process.
No se puede borrar las reservas que tiene el usuario, y al dueño del garage que donde se ha reservado no se le muestra la reserva.

No se puede editar la informacion desde el owner profile de los garajes o parking slots.


Las reservas se pueden crear para dias anteriores.
Las reservas se tiene que poner si están mal reservadas por fechas en la pagina del parking.
Tengo que buscar como hacer para que salte error si hay solapamiento de fechas en un mismo parking, o directamente que si el garaje esta reservado en un dia no se pueda reservar.

Puedes revisar lo que hiciste previamente? No me está funcionando el panel de edicion desde owner Profile. No le puedo cambiar el nombre a la plaza de parking ni subir fotos. Y cuando intento Cambiar o subir foto del garaje, me obliga a cambiarle tambien el nombre pero no funciona correctamente.

Precio al crear garaje no puede ser negativo

Edicion de precio de garaje

Hacer media de la review de todos los parkings del owner y mostrarlo en el perfil del owner.(A poder ser ponerlo como policy en la bd para que no esté preguntandolo todo el rato desde el front)

PENDIENTE:

El como llegar de google maps

Queda completar las reservas en el perfil del dueño del parking




Arquitectura y Plan de Mejora - Parky (TFG)
Este documento detalla el análisis técnico del estado actual del proyecto y propone un plan de acción para profesionalizar la base de código, asegurar la escalabilidad y corregir errores críticos detectados.

Análisis General
Stack Tecnológico
Frontend: React 18, Vite, TypeScript.
Estilos: Tailwind CSS 4, shadcn/ui.
Estado/Datos: React Query (Server State), Hooks personalizados, Context API (Auth/Filters).
Backend: Supabase (PostgreSQL, RLS, RPCs).
Fortalezas
Estructura basada en funcionalidades (features/).
Excelente adopción de React Query para la gestión de datos asíncronos.
Uso correcto de TypeScript en la mayoría de la aplicación.
Interfaz moderna y bien organizada (shadcn/ui).
Áreas de Mejora (Senior Debt)
Servicios "God Object": Servicios como 

parking.service.ts
 mezclan acceso a datos con lógica de negocio y transformación.
Lógica de Disponibilidad: Se ha detectado un posible bug crítico en la consulta de solapamiento de fechas.
Persistencia de Imágenes: La actualización de imágenes mediante borrado y re-inserción es arriesgada y poco eficiente.
Acoplamiento Directo: El frontend depende demasiado de la estructura interna de Supabase en los servicios.
Plan de Acción Recomendado
1. Refactorización de Lógica de Negocio (Prioridad Alta)
Justificación: El siguiente paso DEBE ser refactorizar la lógica crítica del frontend y la base de datos antes de añadir más funcionalidades. Si se sigue construyendo sobre 

parking.service.ts
 tal cual está, la mantenibilidad caerá exponencialmente.

Cambios Propuestos
Separación de Servicios: Dividir los servicios en:
Data Access Layer: Consultas puras de Supabase.
Domain/Logic Layer: Transformación de datos y cálculos (ej. ratings).
Fix Disponibilidad: Corregir la consulta de 

checkAvailability
 en 

booking.service.ts
.
typescript
// Cambiar .or() por .and() o filtros individuales para cumplimiento estricto de solapamiento
.filter('start_time', 'lt', safeEnd)
.filter('end_time', 'gt', safeStart)
2. Optimización de Base de Datos (Prioridad Media)
Justificación: Mejorar la integridad y el rendimiento desde el lado del servidor.

Cambios Propuestos
Triggers y Funciones: Mover la lógica de "Actualizar total de plazas" o "Borrado en cascada" totalmente a Triggers en PostgreSQL para asegurar integridad independientemente del cliente.
Transactions: Implementar el guardado de imágenes dentro de una transacción de base de datos (vía RPC) para evitar inconsistencias.
3. Profesionalización del Código (Prioridad Media)
Justificación: Eliminar patrones "junior" y preparar para escalabilidad técnica.

Cambios Propuestos
Normalización de Tipos: Evitar el uso de any en los mapeos de servicios.
Centralización de Constantes: Extraer URLs de fallback y mensajes de error a un archivo de configuración.
Plan de Implementación a Corto Plazo
Semana 1: Core Refactor

Refactorizar 

parking.service.ts
 y 

booking.service.ts
.
Corregir el bug de disponibilidad.
Implementar capas de transformación de datos (DTOs).
Semana 2: DB & Safety

Revisar RLS y Triggers.
Asegurar que el borrado de garajes limpie correctamente las imágenes.
Semana 3: UX & Performance

Implementar Skeleton Loaders en las tabs de perfil para mejorar el LCP.
Optimizar las consultas de React Query (uso de select para filtrar datos innecesarios).
Verificación
Pruebas Automatizadas
Ejecutar npm run lint para asegurar consistencia.
(Opcional) Implementar tests unitarios para la lógica de pricingService.
Verificación Manual
Validar flujo de reserva con fechas solapadas para confirmar el fix de disponibilidad.
Verificar que al borrar un garaje, no quedan registros huérfanos en garage_images.



Poner la fecha cuando se actualice el date picker de entrada actualizar al mismo dia el de salida.
Poner los mismos date picker en el home que los de detalles del parking.