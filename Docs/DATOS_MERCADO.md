# Datos de mercado — Parky TFG
## Fuentes verificadas para tablas y gráficos del Capítulo 1

> Cada entrada indica el valor, la fuente exacta, el uso recomendado (tabla/gráfico)
> y el nivel de confianza en el dato. Los marcados con ⚠️ deben verificarse antes
> de incluirlos en la versión final.

---

## BLOQUE A — Mercado español de aparcamiento

### A1. Parque de vehículos en España
| Dato | Valor | Fuente | Uso |
|------|-------|--------|-----|
| Vehículos matriculados (2022) | 35,8 millones | DGT, Anuario Estadístico 2022 | TABLA 1.1 |
| Vehículos por 1.000 hab. (2022) | 657 | DGT, Anuario Estadístico 2022 | TABLA 1.1 |
| Incremento anual del parque (2021→2022) | +1,4% | DGT, Anuario Estadístico 2022 | GRÁFICO 1.1 |

**Fuente primaria:** https://www.dgt.es/es/seguridad-vial/estadisticas-e-indicadores/publicaciones/anuario-estadistico-general/  
**Clave BibTeX:** `dgt2022`

---

### A2. Tiempo perdido buscando aparcamiento
| Dato | Valor | Fuente | Uso |
|------|-------|--------|-----|
| Horas/año media conductor español | ~24 h | INRIX 2022 Global Traffic Scorecard | GRÁFICO 1.2 |
| Coste económico estimado/conductor/año (ciudades densas) | >1.200 € | INRIX 2022 | TABLA 1.1 |
| Porcentaje del tráfico urbano buscando parking (hora punta) | ~30% | INRIX 2022 / estudios urbanos | texto §1.1 |

> ⚠️ El dato del 30% ya aparece en §1.1 del texto. Verificar que la cita de INRIX lo
> respalda o añadir cita específica (algunos estudios lo atribuyen a Donald Shoup,
> "The High Cost of Free Parking", 2011, que es la fuente canónica de ese estadístico).

**Fuente primaria:** https://inrix.com/scorecard/  
**Clave BibTeX:** `inrix2022`

---

### A3. Precios de aparcamiento regulado en España (2023-2024)
| Ciudad | Zona | Tarifa (€/hora) | Fuente |
|--------|------|-----------------|--------|
| Santa Cruz de Tenerife | Zona azul | 0,60–1,20 | Ayto. Santa Cruz ⚠️ |
| Madrid | Zona A (SER) | 2,55 | EMT/Ayto. Madrid |
| Madrid | Zona B (SER) | 1,75 | EMT/Ayto. Madrid |
| Barcelona | Zona 1 (àrea verda) | 2,75 | BSM/Ajto. Barcelona |
| Barcelona | Zona 2 | 1,40 | BSM/Ajto. Barcelona |

> ⚠️ Para Santa Cruz de Tenerife: verificar tarifa exacta en el BOC o en la web del
> Ayuntamiento. URL sugerida: https://www.santacruzdetenerife.es/web/gobierno/areas-municipales/trafico

**Uso recomendado:** TABLA 1.1 — comparativa de tarifas por ciudad  
**Formato sugerido:** tabla con columnas Ciudad / Tipo / €/hora / €/mes (si aplica)

---

### A4. Aparcamiento privado (parking comercial de rotación)
| Dato | Valor | Fuente |
|------|-------|--------|
| Tarifa media/día — capitales peninsulares | 15–35 €/día | Parclick, tarifas públicas 2024 ⚠️ |
| Plaza mensual — Madrid centro | 150–220 €/mes | Idealista/Fotocasa 2024 ⚠️ |
| Plaza mensual — Barcelona centro | 120–200 €/mes | Idealista/Fotocasa 2024 ⚠️ |
| Plaza mensual — Tenerife (área metro) | 50–120 €/mes | Estimación basada en anuncios locales ⚠️ |

> ⚠️ Los datos de precios de plazas mensuales se pueden verificar directamente en
> Idealista (https://www.idealista.com/alquiler-garajes/) filtrando por ciudad.
> Son datos públicos y actualizables.

**Uso recomendado:** TABLA 1.2 — comparativa económica para el arrendatario

---

## BLOQUE B — Mercado en Canarias / Tenerife

### B1. Parque de vehículos en Tenerife
| Dato | Valor | Fuente | Uso |
|------|-------|--------|-----|
| Vehículos matriculados Tenerife (2023) | >420.000 | ISTAC 2023 | GRÁFICO 1.1 |
| Vehículos por 1.000 hab. (área metro) | ~700 | ISTAC 2023 (estimado) | texto §1.4 |
| Variación interanual del parque (Canarias) | +2,1% aprox. | ISTAC 2022-2023 ⚠️ | GRÁFICO 1.1 |

**Fuente primaria:** https://www.gobiernodecanarias.org/istac/estadisticas/sectorproductivo/transporte/vehiculos/  
**Clave BibTeX:** `istac2023`

**Serie temporal sugerida para GRÁFICO 1.1 (2018–2023):**
> Buscar en ISTAC → Estadísticas → Transporte → Parque de Vehículos → Serie anual por isla

---

### B2. ZBE — Marco legal
| Dato | Valor | Fuente |
|------|-------|--------|
| Norma habilitante | Ley 7/2021, art. 14 | BOE núm. 121, 21/05/2021 |
| Umbral de obligatoriedad | Municipios >50.000 hab. | Ley 7/2021 |
| Fecha límite de implantación | 1 enero 2023 | Ley 7/2021 |
| Santa Cruz de Tenerife (población) | ~210.000 hab. | INE, Padrón 2023 |
| San Cristóbal de La Laguna (población) | ~160.000 hab. | INE, Padrón 2023 |

**URL oficial BOE:** https://www.boe.es/eli/es/l/2021/05/20/7  
**Clave BibTeX:** `ley72021`

> Nota académica: la Ley 7/2021 es la norma estatal. Puede que el Cabildo o el
> Ayuntamiento hayan publicado normativa de desarrollo específica para Tenerife.
> Consultar BOC (Boletín Oficial de Canarias) para referencias adicionales.

---

### B3. Estudiantes ULL (demanda de aparcamiento)
| Dato | Valor | Fuente |
|------|-------|--------|
| Estudiantes matriculados ULL (curso 2022-23) | ~22.000 | ULL, Memoria Estadística ⚠️ |
| Personal docente e investigador (PDI) | ~2.200 | ULL, Memoria Estadística ⚠️ |

**URL sugerida:** https://www.ull.es/la-universidad/transparencia/indicadores/  
> Útil para cuantificar la demanda diaria en La Laguna.

---

## BLOQUE C — Modelo P2P y economía colaborativa

### C1. Rentabilidad para propietarios (referencia JustPark UK)
| Dato | Valor | Fuente | Uso |
|------|-------|--------|-----|
| Ingresos medios propietario/año (UK) | £1.600–£3.000 | JustPark.com/about | TABLA 1.2 |
| Estimación equivalente en Canarias | 1.000–2.500 €/año | Estimación propia | TABLA 1.2 |
| Tarifa mensual media plaza Tenerife (P2P) | 80–100 €/mes | Estimación de mercado ⚠️ | TABLA 1.2 |

**Clave BibTeX:** `justpark2023`

---

### C2. Mercado global de economía colaborativa
| Dato | Valor | Fuente | Uso |
|------|-------|--------|-----|
| CAGR proyectada 2023–2030 | 14,22% | Grand View Research / PwC ⚠️ | texto §1.2 |
| Tamaño mercado global sharing economy (2022) | ~335.000 M$ | Statista 2023 ⚠️ | texto §1.2 |

> ⚠️ El dato de 14,22% ya aparece en §1.2. La fuente original debería citarse.
> Candidatos: Grand View Research "Sharing Economy Market Size Report 2022",
> o el informe PwC "The Sharing Economy" (2015, pero muy citado).
> Añadir la cita exacta en referencias.bib.

---

## PLANTILLAS para figuras sugeridas

### TABLA 1.1 — Comparativa de tarifas de aparcamiento por tipo y ciudad
Columnas: Ciudad | Zona regulada (€/h) | Parking comercial (€/día) | Garaje privado mensual (€/mes)
Filas: Madrid / Barcelona / Sevilla / Santa Cruz de Tenerife

### GRÁFICO 1.1 — Evolución del parque de vehículos en Tenerife 2018–2023
Tipo: gráfico de barras o línea temporal
Eje X: año (2018, 2019, 2020, 2021, 2022, 2023)
Eje Y: número de vehículos matriculados
Fuente: ISTAC, serie anual

### TABLA 1.2 — Comparativa económica: plaza ociosa vs. plaza en Parky
Columnas: Concepto | Sin Parky | Con Parky
Filas: Ingresos anuales / Coste de gestión / Neto propietario / Ahorro conductor vs. parking comercial

### GRÁFICO 1.2 — Horas perdidas buscando aparcamiento (ciudades europeas)
Tipo: gráfico de barras horizontal ordenado de mayor a menor
Ciudades: Madrid, Barcelona, Londres, París, Berlín, Roma, Amsterdam
Fuente: INRIX 2022 Global Traffic Scorecard

---

## Notas para la versión final

1. Los datos marcados con ⚠️ deben verificarse antes de la entrega. En la mayoría
   de casos la URL de la fuente está indicada.

2. Para las tablas de precios de aparcamiento, se recomienda usar datos de una
   fecha fija (p. ej. enero 2024) y citarlo explícitamente para evitar que los
   datos queden desactualizados.

3. El informe INRIX se actualiza anualmente. Si hay edición 2023 disponible en
   el momento de entrega, usar esa versión.

4. Para el gráfico de evolución vehicular de Tenerife, los datos exactos están
   en ISTAC → Operación: Estadística del Padrón de Vehículos.
