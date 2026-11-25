# SPEC 07 — Actividades y detalle mobile

> **Estado:** Approved · **Depende de:** SPEC 01 · **Fecha:** 2026-11-24
> **Objetivo:** llevar el listado de Actividades y el detalle de cada actividad al diseño mobile, con una barra fija "Inscribirme" en el detalle por debajo de `lg`.

## Alcance

**Entra:**

1. **Listado (`/actividades`), por debajo de `md`.**
   - Hero: la sección empieza 40 px bajo el header (`pt-[104px]`) y cierra con `pb-14`. El subtítulo va en `body-md`, a 16 px del título y a 40 px del h2 "Próximos congresos", que queda a 20 px de las tarjetas.
   - Congresos: tarjetas a 16 px entre sí, con `p-3 pb-5` y radio de 24; imagen de 200 px con radio de 18; fecha en `caption-md` a 12 px de las esquinas; lugar en `caption-md`; resumen en `body-sm`; "Más información" a ancho completo (`.btn-block`).
   - Formación: sección con `pt-14 pb-16`, título a 24 px del h3 y h3 a 20 px de las tarjetas. Tarjetas a 28 px entre sí, imagen de 200 px con radio de 20 y botón a ancho completo.
   - Desde `md`, como hoy: 2 columnas en tablet y 3 en desktop.
2. **Detalle (`/actividades/<slug>`), por debajo de `md`.** Sección con `pt-[84px]` (20 px bajo el header) y `pb-10`. Badge a 12 px de "Volver", con `px-3.5 py-2` y `caption-md`. Título a 18 px. Fecha y lugar apilados, a 10 px entre sí, en `body-md`. Resumen en `body-md`. Imagen de 240 px a 28 px del texto. Facts en 1 columna, a 10 px entre sí, con borde de radio 18, `px-5 py-[18px]`, etiqueta en `overline` y valor en `body-base` con `font-medium`.
3. **Detalle por debajo de `lg`.** Los botones del hero se ocultan. "Enviar un resumen" (si hay `abstractUrl`) va después de los facts, como `.btn-outline` a ancho completo, a 14 px de ellos. Si no hay facts pero sí `abstractUrl`, la sección inferior se muestra igual, solo con el botón.
4. **Barra fija del detalle**, por debajo de `lg` y solo si hay `registerUrl`.
   - `fixed` abajo, fuera de todo `data-reveal`.
   - Fondo `surface` al 96 % con desenfoque y borde superior `line`.
   - `px-4 pt-3`, y abajo `max(16px, safe-area)`.
   - Fecha en `caption-sm` y `content-muted`; título en `body-sm` con `font-medium`, truncado a una línea; "Inscribirme" como `.btn-primary`.
   - El `body` reserva su alto con `:has([data-mobile-bottom-bar])`, como Medical Digital.
   - Queda debajo del header, el drawer, el overlay de búsqueda y el banner de cookies.
   - Sin JS.
5. **"Volver a Actividades"** con `FaChevronLeft` en todos los anchos, en lugar de "←". En mobile, alto mínimo de 44 px y `body-md`.
6. **Facts en tablet y desktop:** 2 columnas desde `md` (hoy desde `sm`) y 4 desde `lg`. El valor va en `subtitle-xs` desde `md`, que reemplaza el `text-[20px]`.

**No entra:**

- El carrusel de actividades de la home (spec 01).
- Cambiar `.page-top` para todas las páginas: el ajuste de 104 px queda local, como en Miembros.
- Barra que aparezca con el scroll (como ERES), animación de entrada o barra en desktop.
- Cambiar los destinos de `registerUrl` y `abstractUrl`, o textos nuevos en el CMS o en `ui.ts`.
- Otros cambios de desktop, fuera del chevron y el tamaño del valor de los facts.

## Modelo de datos

No hay datos nuevos: ni schema de Tina, ni contenido, ni claves de `ui.ts`.

- La barra usa `dateLabel`, `title` y `registerUrl` de `activity`, que ya existen.
- "Inscribirme" y "Enviar un resumen" salen de `activity.register` y `activity.abstract`.
- El alto de la barra se reserva con una regla nueva en `src/styles/global.css`:

```css
@media (max-width: 1023.98px) {
  body:has([data-mobile-bottom-bar]) {
    padding-bottom: calc(68px + max(16px, env(safe-area-inset-bottom)));
  }
}
```

Los 68 px (botón de 52 + 12 de padding superior + 4 de margen) se ajustan a lo que mida la barra al implementarla.

## Plan de implementación

1. **Línea base.** `build:local` y `preview`. Capturas de `/actividades/`, `/actividades/congreso-panamericano-2027/` y `/actividades/ii-curso-de-aditivos/` (sin `abstractUrl`) en 320, 390, 768, 1024, 1280 y 1536 px, y peso del JS de esas páginas. Sin commit.
2. **Listado.** En `ActivitiesListing.tsx`: el hero con `pt-[104px] md:pt-[136px] lg:pt-[180px]` en lugar de `page-top` y `pb-14`; subtítulo en `body-md`; distancias mobile (16 y 40 px en el hero, 20 bajo el h2, 16 entre congresos, 28 entre formaciones); Formación con `pt-14 pb-16`. Desde `md`, como hoy.
3. **Tarjeta.** En `ActivityCard.tsx`, las medidas mobile: con marco, `p-3 pb-5` y radio de 24; imagen de 200 px (radio 18 con marco y 20 sin él); fecha en `caption-md` a 12 px de las esquinas; lugar en `caption-md`; resumen en `body-sm`; botón con `.btn-block`.
4. **Hero del detalle.** En `ActivityDetail.tsx`: `pt-[84px] pb-10` en mobile; "Volver" con `FaChevronLeft`, alto mínimo de 44 px y `body-md`; badge, título, fecha y lugar apilados, y resumen con las medidas mobile; imagen de 240 px a 28 px del texto; botones del hero con `hidden lg:flex`.
5. **Facts y "Enviar un resumen".** Grilla en 1 columna, 2 desde `md` y 4 desde `lg`. Tarjetas con radio de 18, `px-5 py-[18px]` y gap de 10 en mobile. Etiqueta en `overline` (`eyebrow` desde `md`). Valor en `body-base font-medium` y `subtitle-xs` desde `md`, sin `text-[20px]`. "Enviar un resumen" con `lg:hidden` al final. La sección se muestra si hay facts o `abstractUrl`.
6. **Barra fija.** En `ActivityDetail.tsx`, fuera de todo `data-reveal`, con `data-mobile-bottom-bar`, `lg:hidden` y `z-50` (debajo del header `z-[59]`/`z-[60]`, del drawer, del overlay y de las cookies). Solo si hay `registerUrl`. La regla `body:has(...)` en `global.css`, con los 68 px ajustados a lo que mida la barra.
7. **Documentación.** Describir en el `CLAUDE.md` la barra fija (`data-mobile-bottom-bar`, su `z-50` y el `padding-bottom` del `body`), para que la reutilicen las próximas specs.
8. **Verificación.** Repetir las capturas y mediciones del paso 1; `typecheck`, `build:local` y `check:standard`. Revisar que no haya scroll horizontal, el drawer y la búsqueda abiertos sobre la barra, el banner de cookies y ES, EN y PT.

Cada paso de código deja el sitio funcionando y lleva su propio commit.

## Criterios de aceptación

### Listado (`/actividades`)

- [ ] En 390 px, la sección empieza 40 px bajo el header; el subtítulo está a 16 px del título y a 40 px del h2; la primera tarjeta, a 20 px del h2.
- [ ] En 390 px, las tarjetas de congresos van en 1 columna, a 16 px entre sí, con `p-3 pb-5`, radio de 24 e imagen de 200 px con radio de 18.
- [ ] En 390 px, las tarjetas de formación van a 28 px entre sí, con imagen de 200 px y radio de 20.
- [ ] En 390 px, "Más información" ocupa todo el ancho de la tarjeta y mide 52 px.
- [ ] En 768 px hay 2 columnas; desde 1024 px, 3.
- [ ] Desde 768 px, el listado es igual a la línea base.

### Detalle (`/actividades/<slug>`)

- [ ] En 390 px, "Volver a Actividades" lleva el chevron y mide al menos 44 px; la sección empieza 20 px bajo el header; fecha y lugar van apilados; la imagen mide 240 px y queda después del resumen.
- [ ] En 390 px, los facts van en 1 columna, a 10 px entre sí; la etiqueta mide 13 px y el valor 17 px.
- [ ] En 768 px hay 2 columnas de facts; desde 1024 px, 4. Desde 768 px, el valor mide 19 px.
- [ ] Por debajo de 1024 px, el hero no muestra botones.
- [ ] En el congreso panamericano, "Enviar un resumen" aparece después de los facts a ancho completo. En el curso de aditivos (sin `abstractUrl`) no aparece.
- [ ] Desde 1024 px, el hero muestra "Inscribirme" y "Enviar un resumen", y la página es igual a la línea base salvo el chevron y el valor de los facts.
- [ ] "Volver a Actividades" lleva el chevron también desde 1024 px.

### Barra fija

- [ ] En 390 y 768 px, la barra queda fija abajo al hacer scroll y muestra la fecha, el título truncado a una línea y "Inscribirme" de 52 px, que lleva a la `registerUrl` localizada.
- [ ] Desde 1024 px no hay barra.
- [ ] Una actividad sin `registerUrl` no tiene barra y el `body` no reserva espacio.
- [ ] Al final de la página, el footer se ve completo por encima de la barra.
- [ ] El drawer, la búsqueda y el banner de cookies quedan por encima de la barra.
- [ ] En 320 px, la barra no desborda.

### General

- [ ] ES, EN y PT muestran "Inscribirme", "Enviar un resumen" y "Volver" traducidos.
- [ ] Sin scroll horizontal en 320, 360, 390, 768, 1024, 1280 y 1536 px.
- [ ] El JS de `/actividades/` y del detalle no crece más de 1 KB gzip respecto de la línea base.
- [ ] `typecheck`, `build:local` y `check:standard` pasan; sin hex nuevos en `src/`.
- [ ] El `CLAUDE.md` describe la barra fija.

## Decisiones tomadas y descartadas

- **Sí: barra siempre visible por debajo de `lg`, solo con CSS, como Medical Digital.** El detalle es `client:tina` y no carga JS en producción. El hero es de una columna hasta 1024 px, así que la tablet se comporta como mobile.
- **No: barra que aparece al pasar el bloque de botones, como ERES.** Necesita `IntersectionObserver`, portal y animación, y la referencia FESPAN la muestra fija desde el inicio.
- **Sí: donde está la barra, "Inscribirme" solo en ella y "Enviar un resumen" al final.** Así lo hacen la referencia mobile y la ficha de Medical Digital. Evita el mismo botón dos veces en pantalla.
- **Sí: tokens en lugar de los valores exactos del diseño** (título 38 vs 34 px, tarjeta 24 vs 22, botón 52 vs 48). El `CLAUDE.md` pide un solo token por título y `.btn` de 52 px en mobile; la lección de Fiberlux es no usar `text-[NNpx]` sueltos.
- **Sí: `subtitle-xs` (19 px) para el valor de los facts desde `md`, sin token nuevo de 20.** Es 1 px menos que la referencia desktop y elimina un `text-[20px]`.
- **Sí: 2 columnas en tablet (facts y listado), por la regla de tramos de FESPAN.** ERES usa 1 columna hasta `lg`, pero en FESPAN la tablet ya muestra 2 columnas en todas las páginas.
- **Sí: chevron en todos los anchos, con `FaChevronLeft`.** Es el set del `CLAUDE.md` (`react-icons/fa6`) y el que usa Fiberlux. Lo puede reutilizar "Volver al blog" (spec 09). Desktop pasa de "←" a chevron, aunque la referencia desktop no tenga ícono.
- **No: cambiar `.page-top` para todas las páginas.** Afectaría Conocimiento, Blog y Contacto, que tienen sus specs. El 104 px queda local, como en Miembros.
- **Sí: reservar el alto con `body:has([data-mobile-bottom-bar])`.** Es el patrón de Medical Digital, sin JS. El espacio de 88 px de la referencia cumple la misma función.

## Riesgos identificados

| Riesgo | Mitigación |
|---|---|
| La barra deja de estar fija si queda dentro de un elemento con `transform` (`data-reveal`), como pasó en ERES. | La barra es hermana de las secciones, fuera de todo `data-reveal`. Se verifica haciendo scroll en 390 px. |
| La barra tapa el final del footer, o el alto reservado no coincide con el real. | Se mide la barra en 390 y 768 px y se ajustan los 68 px. Hay un criterio que lo verifica. |
| Safari en iOS: la barra del navegador o el indicador de inicio la tapan. | `max(16px, env(safe-area-inset-bottom))` en el padding inferior. Se prueba en un dispositivo real antes del merge. |
| Un título largo empuja el botón fuera de la barra en 320 px. | Título con `min-w-0` y `truncate`; botón con `shrink-0`. Hay un criterio en 320 px. |
| El banner de cookies o el drawer quedan debajo de la barra. | `z-50`, por debajo del header (59/60), el drawer (79/80), la búsqueda (90) y las cookies (100). |
