# Usar pdflatex
$pdf_mode = 1;

# Flags de compilación
$pdflatex = 'pdflatex -synctex=1 -interaction=nonstopmode -file-line-error %O %S';

# Usar biber como backend bibliográfico (requerido por biblatex)
$bibtex_use = 2;
$biber = 'biber %O %S';

# Directorio de salida (mismo que el fuente)
$out_dir = '.';
