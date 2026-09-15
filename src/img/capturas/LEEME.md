# Capturas de la app — pendientes

Las aporta el **equipo de desarrollo**. Decisión del 14-09-2026: no se usan
mockups ni pantallas inventadas.

## Qué hace falta

| Archivo | Dónde va | Qué debe mostrar |
|---|---|---|
| `inicio.png` | Héroe | La pantalla de inicio, tal como la ve alguien que abre la app |
| `paso-1-onboarding.png` | Cómo funciona, paso 1 | Alguna pregunta del cuestionario inicial |
| `paso-2-plan-de-hoy.png` | Cómo funciona, paso 2 | El plan del día con sus dos o tres propuestas |
| `paso-3-esta-pasando-ahora.png` | Cómo funciona, paso 3 | La guía paso a paso del momento difícil |

## Especificaciones

- **Proporción 9:19,5** (pantalla de móvil), sin el marco del dispositivo:
  el marco lo pone la página.
- **Ancho mínimo 800 px** para que se vean nítidas en pantallas retina.
- **PNG** si tienen transparencia; si no, JPG de calidad alta pesa menos.
- **Sin datos reales de ninguna familia.** Nombres y contenidos de ejemplo.

## Cómo colocarlas

En `index.html`, buscar `marco__pantalla`. Cada marco lleva un comentario
`PENDIENTE` con la línea `<img>` ya escrita y comentada: se descomenta, se
borra el marcador de al lado y listo.
