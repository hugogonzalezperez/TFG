# Memoria de trabajo fin de grado

Esta plantilla de memoria de trabajo fin de grado se basa en la clase `scrbook` del paquete [KOMA-Script](https://ctan.org/pkg/koma-script). Este paquete ofrece más flexibilidad en el diseño de documentos y opciones de personalización que las clases estándar de LaTeX.

## Versiones

La plantilla se puede utilizar fácilmente en Overleaf utilizando la versión publicada en la galería:

https://www.overleaf.com/latex/templates/ull-esit-gii-memoria-de-trabajo-de-fin-de-grado/djcchzsbgvvh

También se puede descargar la última versión de la plantilla directamente desde GitHub:

https://github.com/Universidad-de-La-Laguna/esit-gii-plantilla-tfg-scrbook

Así como una versión para escribir en Markdown utilizando [Quarto](https://quarto.org/):

https://github.com/Universidad-de-La-Laguna/esit-gii-plantilla-tfg-quarto

## LaTeX

La plantilla está preparada para ser usada con pdfLaTeX como compilador por defecto y Biber para la gestión de las referencias bibliográficas. Es posible que también funcione con XeLaTeX y LuaLaTeX, que son conocidos por ofrecer más flexibilidad en cuanto al uso de fuentes, pero pdfLaTeX es bastante más rápido. Por eso **se recomienda configurar el editor de LaTeX para que use pdfLaTeX** o, en su defecto, XeLaTeX.

## Opciones

La plantilla recomienda ciertas opciones del documento, pero también incluye algunas opciones alternativas. Estas alternativas están comentadas para poder activarlas fácilmente.

### Sangría

Por lo general, es recomendable señalar dónde comienzan y terminan los párrafos para facilitar la lectura del documento. Esto se puede hacer utilizando espaciado adicional entre los párrafos o añadiendo un espacio a la izquierda de la primera palabra de cada párrafo, lo que recibe el nombre de sangría. Incorporar ambas estrategias es redundante, por lo que las guías de estilo hacen mucho hincapié en que solo se debe utilizar una de ellas.

Esta plantilla utiliza solamente el espaciado adicional entre párrafos y se recomienda dejarlo así. Sin embargo, se puede activar también la sangría, descomentando la línea 38 de `memtfg.txt`.

### Cita APA

El formato de cita configurado por defecto es numérico, lo que significa que las citas en el texto se numeran en orden de aparición y que este orden es utilizado también para generar la bibliografía.

Sin embargo, se puede activar fácilmente el sistema de cita APA comentando las líneas 68-69 y descomentando las líneas 71-72 de `memtfg.txt`. En el sistema APA, las citas en el texto se hacen mediante autor-año y la bibliografía se ordena por autor, año y título. Este sistema facilita identificar a los autores durante la lectura y localizar sus trabajos en la bibliografía, puesto que aparecen juntos. Por tanto, es un sistema interesante en documentos extensos, con un gran número de citas.

## Fuentes

Las fuentes usadas y que deben estar instaladas son:

 * [lmodern](https://ctan.org/pkg/lm) — Latin Modern
 * [sourcecodepro](https://ctan.org/pkg/sourcecodepro) — Source Code Pro

## Paquetes incluidos

Entre otros, la plantilla incluye los siguientes paquetes que pueden ser útiles en la elaboración de la memoria.

### Código

 * [algpseudocodex](https://ctan.org/pkg/algpseudocodex) — Proporciona entornos avanzados para describir algoritmos. Permite escribir pseudocódigo con numeración y resaltado.

 * [listings](https://ctan.org/pkg/listings) — Proporciona un entorno para incluir código fuente con resaltado de sintaxis.

### Figuras

 * [graphicx](https://ctan.org/pkg/graphicx) — Permite redimensionar, rotar y recortar imágenes fácilmente.

 * [pdflscape](https://ctan.org/pkg/pdflscape) — Permite crear páginas en modo apaisado en documentos PDF. Es útil para tablas o figuras anchas que necesitan más espacio horizontal.

 * [rotating](https://ctan.org/pkg/rotating) — Permite rotar objetos como tablas y figuras. Es útil para mostrar contenido en orientación vertical u horizontal.

### Tablas

 * [array](https://ctan.org/pkg/array) — Permite la definición de nuevos tipos de columnas y estilos de alineación en tablas. Mejora la personalización y el formato de tablas en LaTeX.

 * [booktabs](https://ctan.org/pkg/booktabs) — Facilita la creación de tablas de alta calidad. Proporciona comandos para líneas horizontales de diferentes grosores y espacios adecuados entre filas.
 
 * [longtable](https://ctan.org/pkg/longtable) — Proporciona un entorno para crear tablas que pueden abarcar múltiples páginas. Ideal para tablas extensas que no caben en una sola página.

 * [multirow](https://ctan.org/pkg/multirow) Permite crear celdas en tablas que abarcan múltiples filas. Útil para crear tablas más complejas.

 * [tabularx](https://ctan.org/pkg/tabularx) — Extiende el entorno tabular con soporte para ancho de columna automático. Permite crear tablas que se ajustan al ancho total de la página.

### Estilos

 * [caption](https://ctan.org/pkg/caption) — Proporciona opciones avanzadas para personalizar las leyendas de figuras y tablas. Permite cambiar el estilo, formato y posición de las leyendas.

 * [enumitem](https://ctan.org/pkg/enumitem) — Extiende las listas enumeradas y no enumeradas con opciones adicionales. Permite personalizar la numeración, el formato y el espaciado de las listas.

 * [subcaption](https://ctan.org/pkg/subcaption) — Proporciona soporte para subtítulos en subfiguras y subtablas. Facilita la creación de figuras y tablas compuestas con leyendas individuales.

### Otros

 * [csquotes](https://ctan.org/pkg/csquotes) — Proporciona comandos avanzados para citar y formatear citas en múltiples lenguajes y estilos.

 * [siunitx](https://ctan.org/pkg/siunitx) — Proporciona símbolos utilizados en el Sistema Internacional de Medida, como grados, minutos, segundos, ohmios, kilo, micro, julios y newtons, entre muchos otros.
