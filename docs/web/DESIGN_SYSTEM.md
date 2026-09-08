# Sistema de diseño — WithNothin Web

Fuente: brandboard del proyecto (mascota dibujada a mano, paleta
monocromática, tipografía manuscrita + sans limpia). Este documento
traduce ese brandboard a decisiones técnicas concretas.

## Paleta

Estrictamente monocromática, igual que el brandboard — no se introducen
colores de marca adicionales.

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#000000` | Texto, bordes, iconos |
| `--color-paper` | `#e6e6e6` | Fondo por defecto de toda la app |
| `--color-surface` | `#ffffff` | Tarjetas/inputs sobre el fondo `paper` |
| `--color-muted` | `#6b6b6b` | Texto secundario (tinte de `ink`, no un color nuevo) |
| `--color-error` | `#b3261e` | Único color fuera de la paleta de marca — uso mínimo, solo mensajes de error |

## Tipografía

| Token | Fuente | Rol |
|---|---|---|
| `--font-display` | Bristol | Titulares (`h1`-`h3`), wordmark |
| `--font-body` | Josefin Sans | Cuerpo de texto, UI, formularios |

**Bristol** es el archivo de fuente real provisto por el equipo de diseño
(`apps/web/src/assets/fonts/Bristol.otf`), cargado vía `next/font/local`
en `apps/web/src/app/layout.tsx`. Anteriormente se usaba **Patrick Hand**
(Google Fonts) como sustituto temporal mientras no se contaba con el
archivo con licencia web — esa decisión ya quedó resuelta.

Josefin Sans es una coincidencia exacta con el brandboard, cargada vía
`next/font/google`.

**Pendiente:** confirmar los términos de licencia de `Bristol.otf` para
uso web (embedding) antes de un despliegue a producción — `next/font/local`
la auto-hospeda y optimiza, pero eso no reemplaza la verificación de
licencia con quien la proveyó.

## Componentes base (`components/ui/`)

Solo UI genérica, sin conocimiento de dominio (ver arquitectura, sección 4).

- **`Button`**: variantes `primary` (ink sólido) y `secondary` (solo
  contorno). No hay variante "ghost/texto" — el brandboard es binario
  blanco/negro, el sistema de botones también.
- **`Input`**: label + campo + mensaje de error opcional.
- **`Logo`**: wordmark "WithNothin" en `--font-display`, con tagline opcional.
- **`ScribbleAccent`**: SVG decorativo — marcas sueltas (x, punto, trazo)
  en un círculo flojo, inspirado en el motivo que rodea a la mascota
  en el brandboard, sin reproducir la ilustración de la mascota en sí.
  Uso previsto: pantallas de auth, estados vacíos, loaders.
- **`MultiSelect`**: chips seleccionables genéricos (usado por
  `TechnologyPicker` y, a futuro, por un `TagPicker` análogo).

## Principios

- **Plano, sin sombras ni gradientes.** Todo el contraste viene de
  bordes sólidos de 2px en `--color-ink`.
- **La personalidad vive en los titulares y el acento de garabatos**,
  no en cada componente — el resto de la interfaz se mantiene
  disciplinado (Josefin Sans, ink-on-paper).
- **Contenido angosto y alineado a la izquierda** (`--content-max-width: 640px`),
  no centrado tipo landing corporativa — se siente más cercano a un
  feed/blog personal que a una página de marketing.
- **El foco de teclado nunca se remueve** (`:focus-visible` global en
  `globals.css`) y se respeta `prefers-reduced-motion`.

## Dónde viven los tokens

`apps/web/src/app/globals.css` — variables CSS (`:root`) + estilos base
de elementos HTML (`h1`-`h3`, `p`, `a`, `label`, foco de teclado).
Los componentes de `components/ui/` consumen estas variables vía CSS
Modules; no se hardcodean colores/fuentes fuera de `globals.css`.
