# Tipografía autoalojada · Nítia

**Lora + Manrope.** Manrope sustituyó a Inter el 16-09-2026.
La página no pide nada a servidores de terceros.

## Qué hay en esta carpeta

| Archivo | Uso en la página |
|---|---|
| `lora-latin-400-normal.woff2` | Serif de cuerpo: «El momento» y el bloque salvia |
| `lora-latin-500-normal.woff2` | **Titulares.** El corte de Lora más usado |
| `lora-latin-600-normal.woff2` | Destacados dentro de titulares |
| `lora-latin-400-italic.woff2` | **Todas las cursivas de la página** (ver más abajo) |
| `manrope-latin-300-normal.woff2` | **Cuerpo de texto.** El corte más usado de toda la página |
| `manrope-latin-400-normal.woff2` | Reserva del peso normal (token `--peso-normal`) |
| `manrope-latin-500-normal.woff2` | Botones, menú, etiquetas |
| `manrope-latin-600-normal.woff2` | Negritas y títulos de columna del pie |

**143 KB** los ocho. En una visita el navegador descarga solo los cortes que la
página usa: siete.

## MANROPE NO TIENE CURSIVA

No es que falte el archivo: **la familia no incluye itálica**, ni en Google
Fonts ni en el proyecto original. Comprobado.

Por eso `02-base.css` manda todos los `<em>`, `<i>` y `<cite>` a la **itálica de
Lora**, que sí es real y ya pertenece a la marca. La alternativa era dejar que
el navegador inclinase la redonda por su cuenta, lo que produce una falsa
cursiva de trazos deformados que se nota a simple vista.

Si algún día hace falta una cursiva de palo seco —por ejemplo para un pie de
foto largo— hay que cambiar de familia, no buscar el archivo.

## De dónde salieron y con qué licencia

Del repositorio de **Fontsource**, que empaqueta los originales de Google Fonts
sin pasar por sus servidores:
`https://raw.githubusercontent.com/fontsource/font-files/main/fonts/google/<familia>/files/`

Las dos familias están bajo **SIL Open Font License 1.1**: uso comercial y
alojamiento propio permitidos, también para el Cliente.

## Por qué no se cargan desde Google

1. **RGPD.** Un `<link>` a `fonts.googleapis.com` hace que el navegador de cada
   visitante se conecte a un servidor de Google y le entregue su IP, antes de
   que nadie haya aceptado nada. En un producto de salud infantil dirigido a
   familias en España es un riesgo que no compensa.
2. **Velocidad.** Una conexión externa menos.
3. **Control.** Si Google cambia el archivo o deja de servirlo, la página se
   entera. Autoalojadas, no.

## Cómo se precargan

Dos `<link rel="preload">` por página, y solo dos: los cortes que aparecen en el
primer pantallazo, **medidos sobre la página renderizada** —
`manrope-latin-300-normal` y `lora-latin-500-normal`. Precargar un corte que
nadie usa son bytes tirados y un aviso en la consola.

## Si algún día hay que añadir un peso

1. Descargar el `.woff2` del repositorio de Fontsource, mismo patrón de nombre.
2. Dejarlo en esta carpeta.
3. Añadir su `@font-face` en `fuentes.css` copiando el bloque de al lado.
4. No tocar el `unicode-range`: cubre el castellano entero, tildes, eñe y los
   signos de apertura.
