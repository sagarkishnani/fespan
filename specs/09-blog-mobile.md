# SPEC 09 — Blog mobile (listado)

> **Estado:** Approved · **Depende de:** SPEC 01 · **Fecha:** 2026-11-26
> **Objetivo:** llevar el listado del blog (`/blog`) al diseño mobile, con los chips en una fila deslizable, el destacado con "Leer más" a todo el ancho y los posts como filas horizontales por debajo de `md`.

## Alcance

**Entra:**

1. **Cabecera, por debajo de `md`.**
   - La sección empieza 40 px bajo el header (`pt-[104px]`, como Actividades) en lugar de `page-top`. Desde `md`, `pt-[136px]` y `lg:pt-[180px]`, como hoy.
   - El buscador queda a 24 px del título (`mt-6`) y ocupa todo el ancho.
2. **Chips, por debajo de `md`.**
   - Una sola fila con `overflow-x-auto`, sin snap y con la barra oculta, a 14 px del buscador.
   - Sangra hasta el borde (`-mx-4 px-4`) y los chips no se encogen (`shrink-0`).
   - Desde `md`, el wrap de hoy.
3. **Destacado, por debajo de `md`.**
   - Radio de 24 (`rounded-2xl`) y texto a 20 px de los bordes (`inset-x-5 bottom-5`).
   - "Leer más" a todo el ancho, con el texto centrado.
   - Desde `md`, como hoy.
4. **Post lateral, por debajo de `md`.** Se oculta y aparece como la primera fila de la lista. Desde `md`, como hoy.
5. **Filas, por debajo de `md`** (variante `categorized` de `PostCard`).
   - Miniatura de 120×120 con radio de 16 y fondo `surface-media`, a 14 px del texto.
   - Texto con 8 px entre líneas: categoría y fecha en `caption-sm`, título en `body-base font-medium` y "Leer más" en `body-sm font-medium`.
   - Sin fondo ni `card-lift`, con borde inferior `line`, `pb-4` y 16 px entre filas.
   - Desde `md`, las tarjetas de hoy: 2 columnas en tablet y 3 en desktop.
6. **Lista y estado vacío, por debajo de `md`.**
   - La lista empieza 24 px bajo los chips.
   - El estado vacío lleva `px-4 py-8` y `body-md`, como Conocimiento.
   - La sección cierra con `pb-16`.

**No entra:**

- El artículo (`/blog/<slug>`): va en la spec 10.
- Cambios en `PostCard` `compact` (home y "Te podría interesar").
- Ocultar el destacado en mobile, como Medical.
- Usar `Carousel` para los chips.
- Paginación, extracto en las filas, tiempo de lectura o textos nuevos en `ui.ts` o el CMS.
- Otros cambios de tablet o desktop.

## Modelo de datos

No hay datos nuevos: ni schema de Tina, ni contenido, ni claves de `ui.ts`.

- "Leer más" sale de `common.readMore`, y "Todos" de `common.all`.
- La variante `categorized` de `PostCard` solo la usa `BlogBrowser`; cambiarla no toca la home ni "Te podría interesar".
- Para ocultar la barra de los chips se usa `[scrollbar-width:none]` con `[&::-webkit-scrollbar]:hidden`, como en Medical. No hace falta una clase nueva en `global.css`.

## Plan de implementación

1. **Línea base.**
   - Con `build:local` y `preview`, capturar `/blog/`, `/en/blog/` y `/pt/blog/` en 320, 390, 768, 1024, 1280 y 1536 px, y medir el JS de la página.
   - Capturar también la home (`/`) y un artículo (`/blog/nuevas-guias-alimentarias-para-america-latina/`) en los mismos anchos.
   - Sin commit. El script de capturas va fuera del repo.
2. **Cabecera y chips.**
   - En `src/pages/blog/index.astro`, la sección pasa a `pt-[104px] pb-16 md:pt-[136px] md:pb-20 lg:pt-[180px] lg:pb-[120px]`, sin `page-top`. Los wrappers de `en` y `pt` no se tocan.
   - En `BlogBrowser.tsx`: buscador a `mt-6` y ancho completo por debajo de `md`.
   - Chips en una fila deslizable con `-mx-4 px-4`, `shrink-0` y barra oculta, a 14 px del buscador y con la lista a 24 px. Desde `md`, como hoy.
3. **Destacado y post lateral.**
   - `FeaturedPost` lleva `rounded-2xl` e `inset-x-5 bottom-5` por debajo de `md`, y "Leer más" a todo el ancho y centrado.
   - `SidePost` pasa a `hidden md:flex`. Por debajo de `md`, el post lateral entra primero en la lista, con `md:hidden` para no repetirse desde `md`.
4. **Filas.**
   - En `PostCard`, variante `categorized`, por debajo de `md`: fila con miniatura de 120×120, radio de 16 y fondo `surface-media`, gap de 14 y texto con 8 px entre líneas.
   - Tipografía: categoría y fecha en `caption-sm`, título en `body-base font-medium` y "Leer más" en `body-sm font-medium`.
   - Sin fondo ni `card-lift`, con borde inferior y `pb-4`.
   - La lista, con `gap-4` por debajo de `md`, y el estado vacío con `px-4 py-8 body-md`.
   - Desde `md`, las clases de hoy con prefijo.
5. **Verificación.**
   - Repetir las capturas y la medición del paso 1.
   - Filtrar por categoría y buscar sin resultados en 390 px.
   - `typecheck`, `build:local` y `check:standard`.
   - Revisar que no haya scroll horizontal (salvo dentro de la fila de chips) y los textos en ES, EN y PT.

Cada paso de código deja el sitio funcionando y lleva su propio commit.

## Criterios de aceptación

### Cabecera y chips

- [ ] En 390 px, el título empieza 40 px bajo el header y el buscador está 24 px debajo, a todo el ancho, con 52 px de alto.
- [ ] En 320 y 390 px, los chips van en una sola fila que se desliza de lado, empieza alineada con el contenido y llega hasta el borde de la pantalla, sin barra visible.
- [ ] En 390 px, los chips están a 14 px del buscador y la lista empieza 24 px debajo.
- [ ] Desde 768 px, la cabecera y los chips son iguales a la línea base.

### Destacado

- [ ] En 390 px, el destacado mide 420 px de alto, con radio de 24 y el texto a 20 px de los bordes.
- [ ] En 390 px, "Leer más" ocupa todo el ancho del texto y mide 48 px.
- [ ] Desde 768 px, el destacado y el post lateral son iguales a la línea base.

### Filas

- [ ] En 390 px, el post lateral no aparece como tarjeta y es la primera fila.
- [ ] En 390 px, cada fila tiene una miniatura de 120×120 con radio de 16 y el texto a 14 px.
- [ ] En 390 px, la categoría mide 13 px, el título 17 px (peso 500) y "Leer más" 15 px (peso 500), con 8 px entre líneas.
- [ ] En 390 px, las filas no tienen fondo, llevan un borde inferior y quedan a 16 px entre sí.
- [ ] Desde 768 px, la lista es igual a la línea base (2 columnas en tablet y 3 en desktop) y ningún post se repite.
- [ ] Al filtrar por categoría en 390 px, los resultados salen como filas; si no hay resultados, el estado vacío lleva `px-4 py-8` y `body-md`.

### General

- [ ] ES, EN y PT muestran los chips, "Leer más" y el buscador traducidos.
- [ ] Sin scroll horizontal de la página en 320, 360, 390, 768, 1024, 1280 y 1536 px.
- [ ] El JS de `/blog/` no crece más de 1 KB gzip respecto de la línea base.
- [ ] La home y el artículo (`/blog/<slug>`) son iguales a la línea base en todos los anchos.
- [ ] `typecheck`, `build:local` y `check:standard` pasan; sin hex nuevos en `src/`.

## Decisiones tomadas y descartadas

- **Sí: filas solo por debajo de `md`.** Medical y Fiberlux cambian de layout en `md`. En tablet, filas de 120 px dejarían mucho espacio vacío. Desde `md`, las tarjetas de hoy.
- **Sí: chips con `overflow-x-auto` y sin `Carousel`.** Es el patrón de Medical. La regla de "nunca un `snap-x` hecho a mano" es para filas de tarjetas; para 3 o 4 chips, Embla sería JS de más.
- **Sí: destacado en mobile.** La referencia de FESPAN lo mantiene; Medical lo oculta. Manda la referencia del proyecto.
- **Sí: el post lateral pasa a ser la primera fila.** Así lo muestra la referencia; desde `md` vuelve a su lugar.
- **Sí: filas en la variante `categorized` de `PostCard`, con clases responsive.** Solo la usa el blog, y un solo elemento evita duplicar el DOM. Un componente `PostRow` aparte obligaría a renderizar dos versiones de cada post.
- **Sí: tokens en lugar de valores exactos.** La categoría usa `caption-sm` (13 px; la referencia pide 12) y el destacado conserva `heading-lg` (30 px; la referencia pide 28), como en las specs 07 y 08.
- **Sí: `text-brand-primary` en las filas,** como en las tarjetas de hoy y en la referencia. Supera el 4.5:1 sobre blanco.
- **No: ocultar el destacado en mobile, como Medical.** Se aparta de la referencia.
- **No: tocar el artículo en esta spec.** Sus cambios son grandes (cabecera, autor, compartir, relacionados en carrusel) y van en la spec 10.

## Riesgos identificados

| Riesgo | Mitigación |
|---|---|
| Con `-mx-4` la fila de chips puede generar scroll horizontal de la página. | El `overflow-x-auto` lo contiene dentro de la fila; hay un criterio que lo verifica en 320 px. |
| Un título largo en EN o PT ocupa 4 o más líneas al lado de la miniatura de 120 px. | La fila crece en alto; se verifica en 320 px en los 3 idiomas. Recortar con `line-clamp` queda fuera. |
| Por debajo de `md`, el post lateral y la lista comparten el mismo post: si se filtra o se busca, podría repetirse u ocultarse. | Al filtrar no hay destacado ni lateral (como hoy) y la lista sale de `posts`; el `md:hidden` solo aplica sin filtro. Hay un criterio que lo verifica. |
| Sin imagen, la miniatura queda vacía. | Usa `surface-media` de fondo, como las tarjetas. |
