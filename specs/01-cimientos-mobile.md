# SPEC 01 — Cimientos mobile

> **Estado:** Implemented · **Depende de:** SPEC 00 · **Fecha:** 2026-11-17
> **Objetivo:** dejar en tokens, clases y un componente compartido lo que el diseño mobile repite en todas las páginas (gutter, escala tipográfica, botón, campos y carrusel), para que las specs 02–10 solo lo apliquen.

## Por qué existe esta spec

El repo achica el layout de desktop en vez de seguir el diseño mobile. El gutter, la tipografía, el botón, los campos y el carrusel se repiten en todas las pantallas mobile. Si cada spec de página los resolviera por su cuenta, terminaríamos con 9 soluciones distintas (lección de Fiberlux: un solo motor de sliders). Además, actividades de la home ya tiene un carrusel hecho a mano que pega la primera tarjeta al borde.

**Tramos** (iguales a Medical Digital y ERES):

- **Móvil:** `< md` (menos de 768 px), con la referencia mobile.
- **Tablet:** `md`–`lg` (768–1023 px), con los bloques de desktop en 2 columnas.
- **Desktop:** `≥ lg` (1024 px o más), con la referencia desktop.

Los componentes que cambian de estructura (header y carruseles) pasan a desktop en `lg`.

## Scope

### Dentro

1. **Gutter de 16 px.** En `global.css`, `container-xl`, `container-lg` y `container-md` pasan de `px-5` a `px-4` por debajo de `md`. Desde `md` siguen en `px-6`.
2. **Escala tipográfica mobile.** En `tailwind.config.mjs` se baja el mínimo de los `clamp()` de `display-xl`, `display-lg`, `display-md`, `heading-xl` y `heading-lg` (44, 40, 38, 34 y 30 px a 390 px). La fórmula y el máximo no cambian. `heading-md`, `heading-sm`, `subtitle-*` y `body-*` no se tocan.
3. **Botón.** `.btn` mide 52 px por debajo de `md` y 56 desde `md`. Se agrega `.btn-block` (ancho completo por debajo de `md`), sin uso todavía.
4. **Campos de formulario.** `fieldClasses.input` (en `FormControls.tsx`) mide 52 px con radio 14 por debajo de `md`, y 56 px con radio 16 desde `md`.
5. **Carrusel.**
   - Se agrega la dependencia `embla-carousel-react`.
   - `src/hooks/useSlider.ts` se porta desde Medical Digital, sin autoplay.
   - `src/components/shared/Carousel.tsx` envuelve las tarjetas como `children`. Embla está activo por debajo de `lg`, con gutter de 16 px. Desde `lg` muestra la grilla que recibe por prop. No tiene flechas, puntos ni autoplay.
6. **Primer uso: actividades de la home.** `HomeActivities.tsx` usa `Carousel` y pasa de `client:tina` a `client:visible`. Así se cierra el bug de la primera tarjeta pegada al borde.
7. **`CLAUDE.md` del repo:** se documentan los tramos, el gutter, `.btn-block` y `Carousel`.

### Fuera de alcance (para otras specs)

- Llevar "Ver todas las actividades" abajo del carrusel y el resto de la home mobile (spec 04).
- Aplicar `.btn-block`, `Carousel` y los campos nuevos en otras páginas (specs 02–10).
- Los campos de 58 px de Conocimiento (spec 08).
- Header, drawer y buscador mobile (spec 02). Footer y banda CTA (spec 03).
- Bajar los 152 KB de JS de `/en/miembros` (tarea aparte, a medir con `npm run build`).
- Pendientes de la spec 00: accesibilidad del formulario, i18n de `FormControls`, consentimiento en Contacto.

## Modelo de datos

No hay datos nuevos de contenido ni cambios en el schema de Tina.

### Tokens (`tailwind.config.mjs`)

Solo cambia el primer valor del `clamp()`. La fórmula y el máximo quedan iguales. A 390 px la fórmula actual da menos que el mínimo nuevo, así que el mínimo solo actúa por debajo de unos 550 px: desde ahí tablet y desktop quedan idénticos a hoy.

| Token | Mínimo hoy | Mínimo nuevo | A 390 px | Igual a hoy desde |
|---|---|---|---:|---:|
| `display-xl` | `3rem` | `2.75rem` | 44 | 480 px |
| `display-lg` | `2.75rem` | `2.5rem` | 40 | 534 px |
| `display-md` | `2.5rem` | `2.375rem` | 38 | 550 px |
| `heading-xl` | `2.25rem` | `2.125rem` | 34 | 515 px |
| `heading-lg` | `2rem` | `1.875rem` | 30 | 467 px |

### Clases (`src/styles/global.css`)

| Clase | Hoy | Después |
|---|---|---|
| `container-xl/lg/md` | `px-5 md:px-6` | `px-4 md:px-6` |
| `.btn` | `h-14` | `h-[52px] md:h-14` |
| `.btn-block` | — | `w-full md:w-auto` |

### Campos (`fieldClasses.input` en `FormControls.tsx`)

`min-h-14 rounded-xl py-3.5` pasa a `min-h-[52px] rounded-[14px] py-3 md:min-h-14 md:rounded-xl md:py-3.5`. El padding baja en mobile porque con `py-3.5` el contenido ya mide 54 px y el `min-h` no lo achica.

### Carrusel

Medidas del diseño mobile: gap de 12 px y `scroll-padding` de 16 px. Las tarjetas miden 300 px en actividades, 260 en junta y comités y 280 en "Te podría interesar".

```ts
// src/hooks/useSlider.ts — portado de Medical Digital
interface UseSliderOptions {
  loop?: boolean;          // false en FESPAN
  align?: "start" | "center";
  active?: boolean;        // false desde lg
  container?: string;
}

// src/components/shared/Carousel.tsx
interface CarouselProps {
  children: ReactNode;     // cada hijo es una tarjeta
  label: string;           // aria-label, traducido con t()
  slideClassName: string;  // ancho mobile, p. ej. "w-[300px]"
  gridClassName: string;   // grilla desde lg, p. ej. "lg:grid-cols-3 lg:gap-6"
}
```

Comportamiento:

- **Por debajo de `lg`:** Embla activo. El viewport sangra el gutter (`-mx-4 px-4 md:-mx-6 md:px-6`), la fila usa `gap-3` y la primera tarjeta queda alineada con el texto.
- **Desde `lg`:** Embla apagado (`active: false` según `matchMedia("(min-width: 1024px)")`) y grilla con `gridClassName`.
- **Accesibilidad:** el contenedor lleva `role="region"`, `aria-roledescription="carousel"` y `aria-label`. Al recibir foco, una tarjeta fuera de la vista se desplaza con `scrollTo`.
- **Movimiento reducido:** con `prefers-reduced-motion`, el desplazamiento es inmediato (ya viene en el hook de Medical).

El texto de `aria-label` se agrega en `src/i18n/ui.ts` en ES, EN y PT: `home.activities.carousel`.

## Plan de implementación

Cada paso deja el sitio compilando y se puede commitear por separado.

1. **Línea base visual.** Con `npm run build:local` + `astro preview`, capturar las 9 páginas en 320, 360, 390, 768, 1024, 1280 y 1536 px. El script de capturas vive fuera del repo, igual que en la spec 00.
2. **Gutter.** En `global.css`, `container-xl/lg/md` pasan a `px-4 md:px-6`. Comparar contra la línea base: solo cambia por debajo de 768 px.
3. **Tipografía.** Bajar el mínimo de los 5 `clamp()` de la tabla. Comparar: desde 550 px las capturas son idénticas a la línea base.
4. **Botón.** `.btn` pasa a `h-[52px] md:h-14` y se agrega `.btn-block`. Comparar: solo cambia la altura de los botones por debajo de 768 px.
5. **Campos.** Cambiar `fieldClasses.input` en `FormControls.tsx`. Revisar Contacto en 390 y 1280 px, más el formulario de prueba local de la spec 00 (sin commitear).
6. **Motor.** `npm install embla-carousel-react` y portar `src/hooks/useSlider.ts` desde Medical Digital, sin cambios de lógica. Build OK; todavía nada lo usa.
7. **Componente.** Crear `src/components/shared/Carousel.tsx` según el modelo de datos, con el enfoque por teclado y la clave `home.activities.carousel` en `ui.ts` (ES, EN, PT).
8. **Primer uso.** En `HomeActivities.tsx`, reemplazar la fila `snap-x` por `Carousel` (`slideClassName="w-[300px]"`, `gridClassName="lg:grid-cols-3 lg:gap-6"`). En `src/pages/index.astro`, `HomeActivities` pasa de `client:tina` a `client:visible`. Probar el deslizamiento en touch (DevTools) y con teclado en 390 y 820 px, y la grilla en 1280.
9. **`CLAUDE.md` del repo.** En **Estilos**, documentar los tramos, el gutter, `.btn-block`, los mínimos tipográficos y cuándo usar `Carousel`.

## Criterios de aceptación

**Gutter y tipografía**

- [x] En 390 px, el texto de `container-xl` empieza a 16 px del borde; en 768 px, a 24 px.
- [x] En 390 px, los títulos con `display-xl`, `display-lg`, `display-md`, `heading-xl` y `heading-lg` miden 44, 40, 38, 34 y 30 px (`getComputedStyle`).
- [x] Las capturas en 768, 1024, 1280 y 1536 px son idénticas a la línea base en todas las páginas salvo la home.
- [ ] No hay scroll horizontal en ninguna de las 9 páginas en 320, 360, 390, 768, 1024, 1280 y 1536 px. Pendiente: Contacto se pasa 16 px en 320 px; viene de antes de esta spec (20 px en la línea base).

**Botón y campos**

- [x] En 390 px, `.btn` mide 52 px de alto; en 768 px, 56.
- [ ] Un botón con `.btn-block` ocupa todo el ancho del contenedor en 390 px y vuelve a su ancho natural en 768. Pendiente: Tailwind no emite `.btn-block` hasta que una página la use (specs 02–10).
- [x] En 390 px, los campos de Contacto miden 52 px con radio de 14; en 768 px, 56 con radio de 16.

**Carrusel**

- [x] `embla-carousel-react` es la única dependencia nueva en `package.json`.
- [x] En 390 y 820 px, la primera tarjeta de actividades empieza alineada con el título (16 y 24 px del borde).
- [x] En 390 px, las tarjetas miden 300 px con un gap de 12, y al deslizar cada tarjeta se detiene a 16 px del borde izquierdo, salvo la última, que termina a 16 px del borde derecho (igual que el scroll-snap de la referencia mobile).
- [x] En 1024 y 1280 px, actividades es una grilla de 3 columnas sin arrastre.
- [x] Con teclado, `Tab` recorre las tres tarjetas y cada una queda visible al recibir foco.
- [x] Con `prefers-reduced-motion: reduce`, el desplazamiento es inmediato.
- [x] El carrusel tiene `aria-roledescription="carousel"` y un `aria-label` en el idioma de la página (ES, EN, PT).
- [x] La sección de actividades sigue editable en `/admin` (`data-tina-field` del título, eyebrow y botón).

**Repo**

- [x] `npm run typecheck`, `npm run build:local` y `npm run check:standard` pasan sin errores.
- [x] El JS que agrega la home queda medido y anotado en el PR (antes y después, en KB gzip).
- [x] La sección **Estilos** del `CLAUDE.md` documenta los tramos, el gutter, `.btn-block` y `Carousel`.

## Decisiones

- **Sí: tres tramos** (móvil `< md`, tablet `md`–`lg`, desktop `≥ lg`), con el header y los carruseles cambiando en `lg`. Es el criterio de Medical Digital y ERES, y el estándar no fija otro.
- **No: dos tramos** (mobile hasta `lg`). Dejaría a 768 px un layout mobile estirado que no sigue a los otros proyectos del equipo.
- **Sí: Embla**, con el `useSlider` de Medical, por decisión del usuario. Es el motor que ya usa el equipo (Medical y Fiberlux) y deja la puerta abierta a flechas o arrastre si algún diseño los pide.
- **No: CSS nativo con scroll-snap.** No agregaba JS y el diseño mobile no usa flechas ni puntos, pero se descartó para no tener un motor distinto al del resto de los proyectos. **Costo aceptado:** las secciones con carrusel dejan de ser HTML estático (`client:tina` pasa a `client:visible`) y suman Embla, su JS y sus props serializadas.
- **Sí: un componente `Carousel` con `children`** en lugar de solo el hook, para que cada sección no repita viewport, contenedor y accesibilidad.
- **No: flechas, puntos ni autoplay.** El diseño mobile no los tiene y el estándar prohíbe el autoplay.
- **Sí: migrar actividades de la home en esta spec**, para probar el componente con contenido real y cerrar el bug del borde. La 04 hereda el resto de la home.
- **Sí: bajar solo el mínimo de los `clamp()`**, porque la fórmula actual ya queda por debajo del mínimo nuevo a 390 px. Por eso tablet y desktop no cambian, igual que en ERES y Medical (un token fluido, sin cambiar de clase por breakpoint).
- **No: tokens distintos por breakpoint** (`text-heading-sm lg:text-heading-xl`). Habría que tocar unos 45 títulos.
- **Sí: `.btn` a 52 px global y `.btn-block` opcional.** La altura es igual en todo el diseño mobile; el ancho completo, no.
- **No: ancho completo por defecto en `.btn`.** Rompería los botones en línea y los del header.
- **Sí: campos de 52 px y radio de 14 solo por debajo de `md`.** Desde `md` coinciden con el diseño desktop.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| La home suma JS por Embla y la hidratación de actividades | Medir antes y después y anotarlo en el PR. Si se dispara, revisar las props que se serializan. |
| Al tabular a una tarjeta fuera de la vista, el navegador mueve el `scrollLeft` del viewport y se desincroniza con la transformación de Embla | En `focusin`, llamar a `scrollTo` del índice y volver el `scrollLeft` a 0. Se prueba con teclado en el paso 8. |
| `data-reveal` sobre las tarjetas puede desacoplarse al hidratar | El script de reveal ya convive con `HomeVideo` (`client:visible`). Revisar en el paso 8 que las tarjetas aparezcan. |
| Saltos al hidratar: el SSR renderiza sin Embla | El layout (fila en mobile, grilla en `lg`) lo dan las clases, no el JS. Embla solo agrega el arrastre. |
| Medir con `build:local` infla el JS (React en modo desarrollo) | Comparar antes y después con el mismo comando. El valor absoluto lo confirma el build de Amplify. |

## Lo que **no** entra en esta spec

- La home mobile completa: el botón abajo, el hero, las cifras, el video y las noticias (spec 04).
- Aplicar `Carousel`, `.btn-block` y los campos en otras páginas (specs 02–10).
- El header, el drawer y el buscador (spec 02); el footer y la banda CTA (spec 03).
- Los campos de 58 px de Conocimiento (spec 08).
- Los 152 KB de JS de `/en/miembros`.
- Los pendientes de accesibilidad e i18n del formulario que dejó la spec 00.
