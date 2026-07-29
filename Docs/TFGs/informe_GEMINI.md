Entendido perfectamente. Como Catedrático de Universidad y Presidente del Tribunal de Evaluación de Trabajos de Fin de Grado (TFG), asumo el rol con el máximo nivel de exigencia técnica, metodológica y comercial. He accedido y analizado minuciosamente el documento completo de la memoria adjunta (*"Parky - Marketplace colaborativo de aparcamiento Peer-to-Peer"*, autor: Hugo González Pérez, Universidad de La Laguna). Por tanto, no es necesario que pegue fragmentos adicionales.

A continuación, emito mi dictamen formal de revisión estructurado estrictamente bajo los criterios solicitados.

---

### Informe de Revisión y Evaluación de Trabajo de Fin de Grado

**Título:** Parky - Marketplace colaborativo de aparcamiento Peer-to-Peer

**Autor:** Hugo González Pérez

**Titulación:** Grado en Ingeniería Informática (Universidad de La Laguna)

---

#### 1. Aspectos Destacados (Lo que está excelente)

* **Sólida Arquitectura de Persistencia y Seguridad en BD**: Es excelente la decisión de delegar las reglas críticas de aislamiento y consistencia en el motor relacional de PostgreSQL. El uso de políticas *Row Level Security* (RLS) en Supabase garantiza de forma nativa que un error en el código de la aplicación cliente jamás comprometa los datos de otro usuario.
* **Tratamiento Avanzado de Concurrencia**: La implementación del trigger `prevent_booking_overlap` utilizando un bloqueo explícito de fila (`SELECT ... FOR UPDATE`) demuestra una madurez de ingeniería informática superior a la media, solucionando problemas reales de condiciones de carrera (*race conditions*) bajo el nivel de aislamiento *Read Committed* por defecto de PostgreSQL. Asimismo, la adición del buffer de 15 minutos entre reservas consecutivas es un acierto de lógica de negocio del mundo real.
* **Adaptación a la Especificidad Fiscal de Canarias**: El diseño arquitectónico que contempla de forma nativa la gestión del Impuesto General Indirecto Canario (IGIC) al 7 % calculado estrictamente en el lado del servidor constituye un excelente factor de diferenciación técnica y una ventaja defensiva de mercado adecuadamente planteada.
* **Enfoque Multiplataforma Eficiente**: La elección de Capacitor para compilar el cliente Android a partir de una única base de código estricta en TypeScript y React 18 maximiza la eficiencia del desarrollo, cumpliendo con las restricciones de portabilidad planteadas en los requisitos.

---

#### 2. Puntos Críticos e Inconsistencias (Lo que está mal o flojo)

* **Deficiencias Estilísticas y Falta de Rigor Académico en la Redacción**: En el Capítulo 1 se detectan múltiples expresiones impropias de una memoria de ingeniería. Frases subjetivas o excesivamente coloquiales como *"sea algo desesperante"*, *"agotan la paciencia"*, *"Es bastante irónico el hecho de que"* o *"cuando estás frustrado por aparcar"* penalizan gravemente la calidad académica del texto y deben ser reformuladas bajo un tono impersonal, técnico y objetivo.
* **Incoherencia Macroeconómica en el Plan Financiero (OpEx vs. CapEx)**: Existe una contradicción matemática y de negocio alarmante en el modelo económico. Se detalla una inversión inicial (CapEx) de 287.000,00 € que absorbe el coste de subcontratación de un equipo de 10 perfiles técnicos durante más de 7.000 horas de desarrollo. Sin embargo, en la Tabla 4.5 de la proyección financiera se asumen unos gastos operativos mensuales (OpEx) estabilizados de tan solo 1.130,00 €. Esta cifra es completamente irreal: un marketplace que pretende dar soporte y visibilidad a 990 plazas activas y miles de conductores no puede sufragar la infraestructura en la nube (Supabase Enterprise, Vercel, excesos de cuota de la API de OpenCage), el marketing de captación (CAC), el procesamiento internacional de pagos y el soporte técnico 24/7 con apenas 1.130 € al mes.
* **Omisión Crítica de Hardware y Costes en el Módulo SmartAccess**: La memoria propone un acceso automatizado digital a los garajes (SmartAccess). No obstante, al tratarse de un modelo P2P entre particulares, para accionar las puertas o barreras electromecánicas comunitarias se requiere la adquisición e instalación de hardware físico (como relés inteligentes IoT o actuadores Bluetooth). En el desglose de recursos materiales (Tabla 4.2) solo se presupuesta el hardware de desarrollo (smartphones y ordenadores del equipo). El documento omite por completo el coste de hardware para los garajes, el proceso físico de instalación y quién lo financia.
* **Inviabilidad Legal No Analizada (Propiedad Horizontal)**: El proyecto ignora la barrera regulatoria del mercado español y canario. Modificar el sistema de apertura de una puerta de garaje en una comunidad de propietarios para su explotación comercial masiva por parte de un particular requiere la aprobación formal de la Junta de Propietarios conforme a la Ley de Propiedad Horizontal. El TFG asume falsamente que el arrendador tiene plena libertad de permitir el acceso digital continuo de extraños a zonas comunes.
* **Simulación del Core del Negocio**: En la sección 3.3 se admite que los requisitos de cobro transaccional real (RF-08 y RF-16) fueron simulados a nivel de datos pero no ejecutados contra el entorno de producción de Stripe Connect. Dejar la pasarela de pago puramente conceptual debilita el peso técnico de la implementación de un *marketplace*.

---

#### 3. Propuestas de Mejora Concretas (Cambios a realizar)

* **Corrección Inmediata del Estilo de Redacción**: Reemplazar las expresiones coloquiales del Capítulo 1 por terminología científico-técnica. *Ejemplo de corrección*: Cambiar *"encontrar aparcamiento [...] sea algo desesperante"* por *"el déficit de estacionamiento genera ineficiencias severas en los flujos de movilidad urbana, incrementando los tiempos de tránsito"*.
* **Sincronización Coherente del Modelo Financiero**: Ajustar la Tabla 4.5 incrementando de forma realista el OpEx mensual. Se debe incluir una partida para el Coste de Adquisición de Clientes (CAC), el soporte técnico ante incidencias físicas de acceso, y costes proporcionales de las APIs empleadas (la capa gratuita de OpenCage o Leaflet no soportaría el volumen de peticiones estimado de 15 reservas mensuales por plaza sobre 990 plazas). Esto desplazará el punto de equilibrio (break-even), aportando un escenario financiero verdaderamente riguroso.
* **Definición Técnica de SmartAccess Offline**: Ampliar la sección 5.6 detallando la arquitectura criptográfica de los tokens de tiempo limitado offline. Si la validación ocurre sin conectividad permanente, debe explicarse si se utiliza un algoritmo tipo TOTP (Time-Based One-Time Password) sincronizado por reloj entre la app móvil y el hardware del garaje, o criptografía asimétrica. Debe añadirse al presupuesto un coste estimado por unidad de hardware receptor.
* **Incorporación de un Plan de Contingencia Legal**: Añadir en el Capítulo 4 un subapartado de Gestión de Riesgos Jurídicos que aborde las limitaciones de la Ley de Propiedad Horizontal, proponiendo soluciones estratégicas como enfocar el despliegue inicial exclusivamente en viviendas unifamiliares, garajes privados independientes o convenios con administradores de fincas.
* **Robustecimiento de la Sección de Pruebas**: En la sección 5.8, sustituir la mención a las pruebas concurrentes manuales ejecutadas desde "dos sesiones de navegador independientes" por la inclusión de métricas u hojas de resultados derivadas de un script de pruebas de carga automatizado (usando herramientas como k6 o Apache JMeter) que certifique cómo responde el trigger `prevent_booking_overlap` ante ráfagas simultáneas de 50 o 100 peticiones.

---

#### 4. Batería de Preguntas del Tribunal (Para preparar la defensa)

Durante el acto de defensa, este Tribunal planteará cuestiones de alta fricción para verificar el dominio del alumno sobre la arquitectura y el modelo. Sugiero preparar minuciosamente las siguientes cuestiones:

1. *«Usted ha detallado la implementación de un trigger en PL/pgSQL (`prevent_booking_overlap`) para evitar solapamientos temporales mediante la instrucción `SELECT ... FOR UPDATE`. Si la plataforma escala y múltiples usuarios ejecutan peticiones concurrentes sobre diferentes plazas pertenecientes a un mismo gran garaje urbano en hora punta, ¿qué impacto tiene este bloqueo estricto a nivel de fila en la latencia del pool de conexiones de Supabase y cómo mitigaría el riesgo de un interbloqueo o deadlock?»*
2. *«En la memoria se afirma que el sistema SmartAccess permite validar tokens de acceso temporales "sin una conexión persistente a la red". Si el dispositivo físico receptor de la barrera del garaje está ubicado en un sótano sin cobertura a internet, explique detalladamente el protocolo criptográfico y la sincronización temporal que impiden que un usuario utilice un token antiguo modificado o cómo se procesaría en tiempo real la revocación inmediata de una reserva cancelada de emergencia.»*
3. *«Su estudio económico contempla un presupuesto de personal de desarrollo inicial de 237.190,00 € para 10 perfiles técnicos subcontratados. Sin embargo, establece los costes operativos (OpEx) de mantenimiento del negocio en tan solo 1.130,00 € al mes. Teniendo en cuenta que el core de su negocio depende del correcto funcionamiento del acceso físico de los coches en tiempo real, ¿cómo justifica un OpEx tan exiguo para cubrir el servicio de atención a incidencias críticas 24/7, el marketing digital de captación y los costes de escalabilidad de infraestructura en la nube?»*
4. *«Desde el punto de vista regulatorio en el entorno real, ¿bajo qué amparo legal asegura que un propietario particular puede alterar la electrónica de la puerta de un garaje comunitario (zona común) para dar acceso mediante SmartAccess a conductores ajenos a la comunidad, esquivando las restricciones habituales de la Ley de Propiedad Horizontal?»*
5. *«Dado que el procesamiento de pagos reales mediante la API de Stripe Connect se omitió en la fase de prototipo (RF-08 y RF-16), ¿cuál es el impacto a nivel arquitectónico y de base de datos de gestionar de forma asíncrona mediante webhooks las disputas bancarias, las devoluciones por cancelaciones tardías o los fallos de dispersión de fondos hacia cuentas bancarias Custom/Express de los arrendadores canarios?»*

---

**Conclusión del Presidente:** El TFG presenta una base técnica y de persistencia robusta, demostrando que el alumno comprende la ingeniería de software a nivel de backend y bases de datos. No obstante, el documento se debilita notablemente al saltar al plano de la viabilidad económica y el despliegue en entornos reales, mostrando lagunas severas de opacidad financiera y regulatoria. Con las correcciones de estilo y la reformulación y sincronización del OpEx mensual junto con la aclaración técnica del módulo offline, este proyecto tiene el potencial técnico necesario para aspirar a las calificaciones más altas de la convocatoria.