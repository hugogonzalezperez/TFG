# Refactorización del Perfil de Usuario (UserProfile)

Para el perfil del usuario, mi objetivo fue limpiar la interfaz y conectar la aplicación con información real de la base de datos, eliminando los datos de prueba que teníamos antes.

### ¿Qué he cambiado?
He seguido la misma estrategia de "piezas de Lego" que usé en la vista de detalles. He dividido el perfil en cuatro componentes independientes:
1.  **ProfileSidebar**: El menú lateral donde sale tu foto y las opciones (Mis reservas, Ajustes, etc.).
2.  **BookingHistory**: La lista de todas tus reservas, divididas entre las que están por venir y las que ya terminaste.
3.  **ProfileAccountSettings**: El formulario para editar tu nombre, teléfono y cambiar al modo oscuro.
4.  **FavoritesList**: Donde guardamos esos parkings que te gustan.

### Datos Reales y Estadísticas
Lo más importante aquí fue la conexión con la base de datos:
*   **Estadísticas Reales**: He creado una lógica que cuenta cuántas reservas has hecho realmente. Ya no es un número inventado; la aplicación consulta tu historial en Supabase y te da el número exacto.
*   **Gestión de Carga**: Mientras los datos vienen de internet, he añadido un indicador de carga animado para que el usuario sepa que algo está pasando y no piense que la web se ha colgado.
*   **Actualización de Perfil**: Ahora, cuando editas tu nombre o tu teléfono, los cambios se guardan de verdad en tu cuenta mediante el servicio de autenticación que tenemos configurado.

### Por qué esto es mejor
Al tenerlo todo separado, el código es "limpio". Si en el futuro quieres añadir una sección de "Métodos de Pago", solo tienes que crear un nuevo componente pequeño e insertarlo, sin tener que tocar las 600 líneas de código que tenía el archivo original.
