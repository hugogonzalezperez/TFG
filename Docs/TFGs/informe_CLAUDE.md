Confirmado. Asumo el rol de presidente de tribunal y, dado que la memoria completa ya está sobre la mesa, no necesito que la pegues de nuevo: la he leído íntegra y paso directamente al informe. Te aviso de entrada de la valoración honesta para que sepas dónde estás: esto es claramente un trabajo de notable alto / sobresaliente, con una madurez de ingeniería por encima de la media. Lo que te separa de la Matrícula no es añadir, sino *cerrar grietas* concretas, varias de ellas numéricas y de coherencia entre capítulos. Vamos por partes.

---

## 1. Aspectos destacados (lo que está excelente)

- **El razonamiento de concurrencia a nivel de base de datos es lo mejor del TFG.** Resolver el solapamiento con un trigger `prevent_booking_overlap` que adquiere `SELECT ... FOR UPDATE` sobre la fila de `parking_spots` para serializar bajo `READ COMMITTED`, y *además* justificar por qué descartas la restricción `EXCLUDE` con `tstzrange`/GiST (imposibilidad de meter el buffer de 15 min en la expresión y errores genéricos no interpretables), demuestra que entiendes el problema de fondo y no solo que "funciona". Esto es nivel profesional.
- **La filosofía arquitectónica es coherente y está bien defendida:** empujar las invariantes de corrección (aislamiento, integridad temporal, cálculo fiscal) a la capa más baja (RLS + triggers + Edge Functions) y dejar el cliente como presentación. Lo refuerzas en conclusiones sin caer en autobombo.
- **El estado del arte está actualizado y es específico**, no relleno: adquisición de SpotHero por Uber (feb 2026), ParkHub→JustPark, la ordenanza ZBE de Santa Cruz (13 abril 2026) con perímetro y calendario reales, y sobre todo la lectura del IGIC y la exención ZBE como *foso defensivo local*. Esa tesis (especificidad fiscal/regulatoria = barrera de entrada para peninsulares) es el argumento estratégico más fino del trabajo.
- **El análisis de sensibilidad (Tabla 4.6) es numéricamente impecable** y honesto: cuatro escenarios en régimen estacionario, declarando explícitamente que el payback resultante es el mínimo teórico y no el real desde lanzamiento. He recalculado los cuatro paybacks y cuadran al decimal. Que la variable más sensible sea la cartera de plazas y no la frecuencia está bien identificado.
- **La gestión de edge cases de SmartAccess** (coche atrapado, sin conectividad, móvil sin batería, replay de tokens con `nonce`, cancelación con conductor dentro) revela que has pensado el sistema como producto operativo, no como demo. La decisión de *no* permitir cancelar reservas en estado activo para no dejar un vehículo encerrado es exactamente el tipo de criterio que un tribunal premia.

---

## 2. Puntos críticos e inconsistencias (lo que está mal o flojo)

Aquí es donde te juegas la nota. Ordenados por gravedad.

**2.1. Doble contabilización de los gastos operativos en el ROI (crítico).**
La inversión de 287.000 € **ya incluye** seis meses de operativa (campaña 7.200 + cloud 1.200 + gestoría 1.200 + reserva 3.042 ≈ 12.642 €). Pero la Tabla 4.5 arranca el balance en −287.000 € **y además** resta 1.830 €/mes de gastos durante los meses 1–6 (≈ 10.980 €). Esos seis meses están contados dos veces: una embebida en el déficit inicial y otra como flujo mensual. O el balance debería partir de −274.358 € (inversión menos operativa prepagada) y dejar correr el opex mensual, o partir de −287.000 € y mostrar opex incremental cero en los meses 1–6. Como está, no es coherente. La buena noticia es que el error juega en tu contra (hace el payback *más tardío* que la realidad), así que es defendible como conservadurismo, pero un tribunal financiero lo va a señalar y tienes que tener la respuesta lista.

**2.2. La partida de "soporte técnico" (550 €/mes) no está financiada en la Tabla 4.3.**
En 4.5.1 desglosas el opex de captación como 700 (campaña) + 380 (cloud) + 200 (gestoría) + **550 (soporte)** = 1.830 €/mes. Pero en la Tabla 4.3 no existe ninguna línea de soporte; solo campaña, cloud (200, no 380) y gestoría. Ya admites que el salto de cloud de 200→380 lo cubre "la reserva de imprevistos", pero esa reserva son 3.042 € y el desfase de cloud (180×6=1.080) más el soporte no presupuestado (550×6=3.300) suman 4.380 €, que se comen la reserva y la rebasan. Hay un agujero de financiación real en los primeros seis meses.

**2.3. Discrepancia numérica en el hito de break-even.**
La Figura 4.5 anota "Punto de equilibrio Mes 19 · **+8.801 €**". La Tabla 4.5 y el texto de 4.5.2 dicen que el mes 19 cierra con **+14.951 €**. Dos cifras distintas para el mismo hito. Además, en la propia tabla el dato aparece como "+14,951" (coma) frente a "14.951,00 €" en el texto. Hay que reconciliarlo: si el tribunal abre por la figura y por el texto a la vez, queda como descuido grave en la página estrella del capítulo económico.

**2.4. El modelo del IGIC es legalmente frágil y es tu mayor talón de Aquiles conceptual.**
Tratas el IGIC del 7 % como algo que se aplica automáticamente sobre cada transacción. Pero en un modelo P2P entre particulares, el arrendador ocasional **probablemente no es sujeto pasivo de IGIC** (no ejerce actividad económica, no está dado de alta censal, no presenta modelo 420). La plataforma no puede repercutir ni liquidar IGIC en nombre de quien no es empresario/profesional. Esto abre dos preguntas que no resuelves: (a) ¿la plataforma actúa como mero intermediario —y entonces el dueño debe facturar— o revende el servicio en nombre propio, convirtiéndose ella en sujeto pasivo sobre el importe íntegro? (b) ¿quién emite la factura? De esto depende toda tu arquitectura fiscal y, paradójicamente, tu "foso defensivo". Es un crack que hay que tapar antes de la defensa.

**2.5. El modelo de casos de uso (Cap. 3) contradice la implementación (Cap. 5).**
En 5.2 narras un cambio de diseño: ya **no** hay selección manual de rol; todos entran como Arrendatario y ascienden a Arrendador al crear un garaje. Pero CU-01 se sigue llamando "**Autenticarse y seleccionar rol**" y el diagrama de la Figura 3.1 mantiene el caso de uso "Seleccionar rol". El UML refleja el diseño antiguo. Hay que actualizar diagrama y nombre del CU, o el tribunal te preguntará cuál de los dos es el sistema real.

**2.6. El esquema relacional del diagrama no concuerda con la prosa.**
Dos choques: (i) la Figura 3.2 muestra tablas `users`, `user_roles` y `roles` (un RBAC normalizado por tabla de unión), pero 3.7 dice que "la tabla **profiles** almacena... su rol". ¿El rol es una columna en `profiles` o vive en `user_roles`? Son modelos distintos. (ii) Las políticas RLS (Tabla 3.10) y las pruebas (5.8) hablan de `tenant_id = auth.uid()`, mientras que en el diagrama la tabla `bookings` tiene `rentor_id`. *rentor* vs *tenant*: nomenclatura incoherente entre diagrama, políticas y pruebas.

**2.7. La RLS de INSERT en `bookings` es lógicamente vacua.**
Tabla 3.10: "Solo usuarios con rol arrendatario pueden crear reservas". Pero RF-02 dice que **todos** los usuarios tienen el rol arrendatario activo de forma permanente. Si todos lo tienen, la condición nunca restringe nada. La política no aporta seguridad real; lo que de verdad protege es `tenant_id = auth.uid()`.

**2.8. El QR de SmartAccess (RF-15) no encaja con el modelo físico (5.6.1).**
RF-15 genera un QR único por reserva. Pero el flujo físico que describes es: el conductor pulsa "Abrir" en la app → el servidor valida el token → manda señal al relé/BLE. En un garaje residencial particular **no hay lector de QR**. ¿Quién escanea ese QR? Parece un requisito heredado que quedó huérfano respecto al actuador. Hay que explicar qué lee el QR o reconocer que es un mecanismo alternativo para parkings con barrera lectora.

**2.9. El coste del hardware de SmartAccess no está en ninguna economía.**
Dices 30–50 €/plaza (relé+ESP32) o 20–40 € (AP WiFi). Para ~990 plazas eso son decenas de miles de euros de hardware e instalación que no aparecen ni en la inversión de 287.000 ni en el coste unitario por transacción. ¿Lo paga el propietario (entonces es una barrera de adquisición brutal no modelada) o la plataforma (entonces falta en el CAPEX)? Para un estudio de viabilidad "comercial real", esta omisión es llamativa.

**2.10. Pagos: ¿autorización o captura? (vacío de diseño).**
CU-04 dice que el cargo se confirma y la reserva pasa a **pendiente**, y luego RF-07 exige confirmación manual del arrendador. Estás cobrando la tarjeta *antes* de que el dueño acepte, lo que obliga a reembolsar en cada rechazo (RF-09). El diseño correcto sería **autorizar (hold)** al reservar y **capturar** al confirmar el arrendador. No distingues autorización de captura en ningún punto.

**2.11. Tensión de valor en el lado de la oferta (no abordada).**
A 15 reservas/mes el propietario neto ronda ~99 €/mes (6,62 €×15). Pero en 1.4.4 dices que el alquiler mensual tradicional ya da 50–150 €/mes (concentrado en 60–100). ¿Por qué un dueño elegiría gestionar 15 conductores distintos, hardware de acceso y obligaciones de IGIC para ganar lo mismo que con un inquilino mensual estable y sin fricción? El modelo nunca confronta el ARPU del arrendador P2P con su coste de oportunidad real.

**2.12. Atribuciones de fuentes débiles.**
- El "35 % del tráfico busca aparcamiento" [1] y las "24 h/año" [4] provienen de un medio generalista y de un informe INRIX de **2022** presentado en contexto 2026. El origen académico del 30 % es Donald Shoup (*The High Cost of Free Parking*); citar la fuente primaria sube el rigor.
- La tasa de referido "0,5 nuevos propietarios/mes" se apoya en [3], que es un informe de *tamaño de mercado* (CAGR), no de coeficientes de viralidad. La cita no sostiene la hipótesis.

**2.13. Estilo y erratas (registro y números).**
- Coloquialismos en 1.1 que desentonan en una memoria: "algo desesperante", "agotan la paciencia", "Es bastante irónico el hecho de que", "muchísimo tiempo".
- Primera persona informal: "no voy a tener en cuenta su coste" (8.2), "lo que no esperaba era que" (Cap. 6).
- Gramática: "Si volviera a empezar, **hubiera** diseñado" → debe ser "**habría** diseñado". Erratas: "**tranción** de estados" (5.4), "actuen" → "actúen" (footnote 1.3.3).
- **Error en el abstract en inglés**: "employing Vite as the build tool, **which provides** a PostgreSQL database, social OAuth authentication, and file storage". La oración de relativo cuelga de *Vite*; debería atribuirse a **Supabase** (el español sí lo dice bien). El tribunal lee los abstracts con lupa.
- Formato numérico mixto: "1,130,00 €/mes" (4.5.1) y "157,038/287,000" (4.5.2) usan coma como separador de millares al estilo inglés, incoherente con la convención española del resto.

---

## 3. Propuestas de mejora concretas (cambios a realizar)

- **Reescribe el arranque de la Tabla 4.5** con una de las dos opciones: o el balance inicial es −274.358 € (inversión menos operativa prepagada) y el opex fluye mes a mes; o se mantiene −287.000 € y los meses 1–6 muestran flujo neto = solo ingresos (porque el opex ya está prepagado). Añade una frase metodológica explicando el criterio. Esto cierra 2.1 y 2.2 de golpe.
- **Añade una línea "Soporte y atención al usuario (6 meses) — 3.300 €"** a la Tabla 4.3 y reajusta la reserva de imprevistos para que el total siga sumando una cifra coherente. De paso, te quitas el aire de que 287.000 es un número redondo "encajado": di abiertamente que rediondeas la inversión recomendada al alza para dotar colchón.
- **Reconcilia la Figura 4.5 con la Tabla 4.5.** Decide el valor real del balance en el mes 19 y úsalo en ambos sitios. Corrige "+14,951" → "+14.951,00 €".
- **Dedica un párrafo al tratamiento del IGIC** en 5.5 o 4.1: define si Parky opera en *nombre propio* (sujeto pasivo sobre el importe íntegro, factura única al conductor) o como *intermediario* (factura del propietario, comisión de Parky como servicio independiente sujeto a su propio IGIC). Reconoce explícitamente el caso del arrendador particular no sujeto y cómo lo gestionas (p. ej., umbral de actividad, alta censal asistida desde Advanced Pro — que ya mencionas para la declaración trimestral). Convierte la debilidad en una decisión razonada.
- **Actualiza el diagrama de casos de uso y CU-01**: renombra a "Autenticarse y obtener rol" y sustituye "Seleccionar rol" por "Asignación automática de rol", para que UML e implementación cuenten lo mismo.
- **Unifica la nomenclatura del esquema**: elige `tenant_id` *o* `rentor_id` y propágalo a diagrama, Tabla 3.10 y 5.8. Aclara en 3.7 si el rol es columna en `profiles` o relación en `user_roles`/`roles`; si el diagrama muestra `user_roles`, la prosa debe describir ese RBAC normalizado.
- **Resuelve el QR**: o explicas que el QR es para parkings con lector (futuro/comercial) y el acceso residencial va por botón+relé/BLE, o lo replanteas como token interno. No lo dejes flotando.
- **Mete el hardware de acceso en el modelo económico** aunque sea como nota: coste por plaza, quién lo asume y su impacto en la curva de captación. Modélalo como CAC del lado oferta. Aumenta muchísimo la credibilidad del estudio.
- **Distingue authorize vs capture** en 5.5 y CU-04: "se realiza una *autorización* al reservar y la *captura* en la confirmación del arrendador". Es un cambio de una frase que tapa un agujero de diseño visible.
- **Añade un párrafo de coste de oportunidad del arrendador** en 4.5.1 comparando el ARPU P2P con el alquiler mensual, y argumenta el diferencial (flexibilidad, no comprometer la plaza, posibilidad de uso propio intercalado). Aunque la conclusión sea ajustada, demostrar que lo has pensado te blinda.

---

## 4. Batería de preguntas del tribunal (para preparar la defensa)

1. **Sobre concurrencia:** Su trigger usa `SELECT ... FOR UPDATE` bajo `READ COMMITTED`. Explique *por qué* esa combinación garantiza la ausencia de solapamientos sin necesidad de subir a `SERIALIZABLE`. ¿Qué snapshot ve exactamente la segunda transacción tras adquirir el bloqueo, y qué pasaría si quitáramos el `FOR UPDATE` dejando solo el `SELECT` de comprobación?

2. **Sobre el IGIC:** Un particular que alquila su plaza tres días al mes, ¿es sujeto pasivo del IGIC? Si no lo es, ¿con qué cobertura legal repercute su plataforma un 7 % y lo liquida? ¿Quién emite la factura al conductor y cómo encaja eso con que el dinero, según usted, no pasa por una cuenta central de Parky?

3. **Sobre el modelo financiero:** Su inversión de 287.000 € ya incluye seis meses de gastos operativos, pero la Tabla 4.5 vuelve a restar esos gastos mes a mes partiendo de un balance de −287.000 €. ¿No está contabilizando dos veces la operativa de los primeros seis meses? Y reconcílieme, por favor, el "+8.801 €" de la Figura 4.5 con los "+14.951 €" de la tabla para el mismo mes 19.

4. **Sobre el lado de la oferta:** Con 15 reservas/mes el propietario ingresa neto unos 99 €, prácticamente lo mismo que un alquiler mensual tradicional según sus propios datos del apartado 1.4.4, pero asumiendo gestión de accesos, hardware en su puerta y posibles obligaciones fiscales. ¿Cuál es exactamente el incentivo para que el dueño elija Parky frente a un inquilino fijo, y por qué no aparece esa comparación en su análisis?

5. **Sobre SmartAccess:** El RF-15 genera un código QR por reserva, pero el flujo físico que describe se acciona pulsando "Abrir" en la app contra un relé. En un garaje particular sin lector, ¿qué función cumple ese QR? Y su código de respaldo de 7 dígitos lo presenta como "factor offline", pero si en el garaje no hay conexión, ¿cómo valida el actuador ese código sin consultar al servidor sin convertirse en un riesgo de seguridad?

---

Si cierras los puntos 2.1–2.6 y 2.8–2.9 (que son los que un tribunal técnico-económico detecta sin esfuerzo) y llegas con las cinco respuestas de arriba preparadas, este trabajo se mueve con holgura al rango de sobresaliente alto / Matrícula. El fondo ya lo tienes; lo que falta es coser las costuras entre capítulos y blindar el flanco fiscal.

¿Quieres que te reescriba en LaTeX listo para pegar el párrafo del IGIC y el bloque corregido de la Tabla 4.3 + Tabla 4.5 con la metodología del balance ya saneada? Es lo que más nota te mueve y lo puedo dejar copy-paste.