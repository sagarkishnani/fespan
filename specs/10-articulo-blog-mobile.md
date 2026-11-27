# SPEC 10 — Artículo del blog mobile

> **Estado:** Approved · **Depende de:** SPEC 01, SPEC 09 · **Fecha:** 2026-11-27
> **Objetivo:** llevar el artículo del blog (`/blog/<slug>`) al diseño mobile, con "Volver al blog" en lugar del breadcrumb, cabecera alineada a la izquierda con el autor bajo el extracto, cuerpo compacto, compartir a todo el ancho y "Te podría interesar" como carrusel.

## Alcance

**Entra:**

1. **Arriba, por debajo de `md`.**
   - La página empieza 12 px bajo el header (`pt-[76px]`). Desde `md`, `pt-[120px]` y `lg:pt-[150px]`, como hoy.
   - El breadcrumb se cambia por un enlace "Volver al blog" (`blog.back`) con un chevron a la izquierda, con `link-arrow min-h-11 text-body-md font-medium`, igual que "Volver" en el detalle de actividad. Desde `md`, el breadcrumb de hoy.
2. **Cabecera, por debajo de `md`.**
   - Alineada a la izquierda (`items-start text-left`) y sin el `mt-14` del breadcrumb.
   - Categoría y fecha a 16 px del enlace (`mt-4`), título a 12 px (`mt-3`) y extracto a 14 px (`mt-3.5`).
   - El autor va bajo el extracto, a 20 px (`mt-5`): foto de 44 px, nombre en `body-sm font-medium` y cargo en `caption-md text-content-muted`. Si el post no tiene autor, no aparece.
   - Desde `md`, centrada como hoy y sin el autor.
3. **Portada, por debajo de `md`.** A 28 px de lo de arriba (`mt-7`), 260 px de alto y radio de 24 (`rounded-2xl`). Desde `md`, como hoy.
4. **Cuerpo, por debajo de `md`.**
   - El artículo empieza 32 px bajo la portada (`pt-8`).
   - Párrafos en `body-base` (17 px). El primero mantiene `body-xl` y el borde inferior, con `pb-6`.
   - `Figure`: 220 px de alto y radio de 24.
   - `Callout`: `p-6`, radio de 24 y texto en `body-md`.
   - `Quote`: sangría de 20 px (`pl-5`).
   - Desde `md`, como hoy.
5. **Pie del artículo, por debajo de `md`.**
   - El autor no se repite: solo queda la fila de compartir, con borde superior y `pt-5`.
   - "Copiar link" ocupa el ancho que sobra (`flex-1`) y los botones de X y LinkedIn quedan a la derecha. Todos de 46 px (`h-control-sm`).
   - Desde `md`, autor y compartir en una fila, como hoy.
6. **"Te podría interesar".**
   - Pasa a `shared/Carousel.tsx` dentro de una isla nueva, `blog/RelatedPosts.tsx`, con `client:visible`.
   - Por debajo de `lg`, tarjetas `compact` de 280 px; desde `lg`, grilla de 3 columnas con `gap-6`, como hoy.
   - Por debajo de `md`: sección con `pt-14 pb-16` y título a 20 px de las tarjetas (`mb-5`). Desde `md`, los espacios de hoy.

**No entra:**

- Cambios en `PostCard` `compact`: la imagen sigue en 220 px (la referencia pide 180) y la tarjeta mantiene el ícono de calendario y "Lee el artículo". También la usa la home.
- Compartir con la hoja nativa del sistema (`navigator.share`), como ERES.
- Barra de progreso de lectura, tiempo de lectura, Anterior / Siguiente o comentarios.
- Cambios en el schema de Tina, en el contenido o en `ui.ts`.
- Contacto mobile: va en la spec 11.
- Otros cambios de tablet o desktop, salvo el carrusel de relacionados entre `md` y `lg`.

## Modelo de datos

No hay datos nuevos: ni schema de Tina, ni contenido, ni claves de `ui.ts`.

- "Volver al blog" sale de `blog.back`, que existe y hoy no se usa.
- El `label` del carrusel reutiliza `blog.related`, el mismo texto del título de la sección.
- `RelatedPosts.tsx` recibe las tarjetas ya armadas por `toPostCard` (`PostCardData[]`), el título, el texto del botón y el `label`. No consulta a Tina.

## Plan de implementación

1. **Línea base.**
   - Con `build:local` y `preview`, capturar `/blog/nuevas-guias-alimentarias-para-america-latina/` (el único post con `Callout`, `Figure` y `Quote`) y otro post sin plantillas, en ES, EN y PT, en 320, 390, 768, 1024, 1280 y 1536 px. Medir el JS de la página.
   - Sin commit. El script de capturas va fuera del repo.
2. **Arriba y cabecera.**
   - En `PostArticle.tsx`: `pt-[76px] md:pt-[120px] lg:pt-[150px]`; el enlace "Volver al blog" con `md:hidden` y el breadcrumb con `hidden md:flex`.
   - Cabecera alineada a la izquierda por debajo de `md`, con los espacios del alcance.
   - Bloque del autor bajo el extracto con `md:hidden`; el chevron, con `FaChevronLeft` de `react-icons/fa6`, igual que "Volver" en el detalle de actividad (spec 07).
3. **Portada y cuerpo.**
   - Portada: `mt-7 h-[260px] rounded-2xl` por debajo de `md`.
   - En el `prose` del artículo: `pt-8`, párrafos en `body-base` y el primero con `pb-6`, por debajo de `md`.
   - En `PostBody.tsx`: las medidas de `Figure`, `Callout` y `Quote` por debajo de `md`.
4. **Pie y compartir.**
   - En `PostArticle.tsx`, el autor del pie lleva `hidden md:flex`.
   - En `ShareBar.tsx`: fila a todo el ancho y "Copiar link" con `flex-1` por debajo de `md`; desde `md`, como hoy.
5. **Relacionados.**
   - Crear `src/components/blog/RelatedPosts.tsx` con `Carousel` (`slideClassName="w-[280px]"`, `gridClassName="lg:grid-cols-3 lg:gap-6"`) y `PostCard` `compact`.
   - En `src/pages/blog/[slug].astro`, cambiar la grilla por `<RelatedPosts … client:visible />`. El `data-reveal` va en un wrapper fuera de Embla, como en `HomeActivities`. Los wrappers de `en` y `pt` no se tocan.
6. **Verificación.**
   - Repetir las capturas y la medición del paso 1.
   - Deslizar el carrusel en 390 y 820 px y recorrerlo con `Tab`.
   - `typecheck`, `build:local` y `check:standard`.
   - Revisar que no haya scroll horizontal y los textos en ES, EN y PT.

Cada paso de código deja el sitio funcionando y lleva su propio commit.

## Criterios de aceptación

### Arriba y cabecera

- [ ] En 390 px, "Volver al blog" está 12 px bajo el header, mide al menos 44 px de alto, tiene un chevron a la izquierda y lleva a `/blog` en el idioma actual.
- [ ] En 390 px no hay breadcrumb; desde 768 px, el breadcrumb es igual a la línea base y "Volver al blog" no aparece.
- [ ] En 390 px, la categoría, la fecha, el título y el extracto están alineados a la izquierda, a 16, 12 y 14 px entre sí.
- [ ] En 390 px, el autor está 20 px bajo el extracto, con foto de 44 px, nombre y cargo.
- [ ] Un post sin autor no deja un espacio vacío bajo el extracto.
- [ ] En 390 px, la portada está 28 px bajo el autor, mide 260 px de alto y tiene radio de 24.

### Cuerpo

- [ ] En 390 px, el artículo empieza 32 px bajo la portada y los párrafos miden 17 px.
- [ ] En 390 px, el primer párrafo tiene el borde inferior y 24 px de espacio antes del borde.
- [ ] En 390 px, `Figure` mide 220 px de alto con radio de 24, `Callout` tiene 24 px de padding con radio de 24 y `Quote` tiene una sangría de 20 px.

### Pie y relacionados

- [ ] En 390 px, el autor no se repite al pie; "Copiar link" ocupa el ancho que dejan los botones de X y LinkedIn, y los tres miden 46 px.
- [ ] "Copiar link" sigue copiando la URL y muestra "¡Copiado!".
- [ ] En 390 px, "Te podría interesar" está 56 px bajo el pie, el título a 20 px de las tarjetas y las tarjetas miden 280 px.
- [ ] En 390 y 820 px, el carrusel se desliza, arranca alineado con el contenido y la última tarjeta termina a 16 px (24 en 820) del borde derecho.
- [ ] Con `Tab`, el foco recorre las tarjetas del carrusel y cada una queda visible al enfocarla.
- [ ] Desde 1024 px, los relacionados son una grilla de 3 columnas, igual que en la línea base.

### General

- [ ] Desde 768 px, la cabecera, la portada, el cuerpo y el pie son iguales a la línea base.
- [ ] "Volver al blog", "Copiar link" y "Te podría interesar" se ven traducidos en `/en/` y `/pt/`.
- [ ] Sin scroll horizontal de la página en 320, 360, 390, 768, 1024, 1280 y 1536 px.
- [ ] El JS del artículo crece solo por Embla y la isla nueva, y la home y `/blog/` no cambian de peso.
- [ ] El título, el extracto, la portada, el autor y el cuerpo siguen editables en `/admin` (`data-tina-field`).
- [ ] `typecheck`, `build:local` y `check:standard` pasan; sin hex nuevos en `src/` y sin dependencias nuevas.

## Decisiones tomadas y descartadas

- **Sí: "Volver al blog" solo por debajo de `md`.** La referencia desktop mantiene el breadcrumb. Medical también lo acorta en mobile en lugar de quitarlo en todos los tamaños.
- **Sí: el autor dos veces en el DOM (cabecera con `md:hidden` y pie con `hidden md:flex`).** Están en contenedores distintos y con `order` no se puede mover de uno a otro. Son 3 líneas; el que no se ve queda en `display: none` y no llega al lector de pantalla.
- **Sí: tokens en lugar de valores exactos.** El título conserva `display-md` (38 px; la referencia pide 34), porque un título usa un solo token. El extracto, `body-xl` (18; pide 17); el título de "Te podría interesar", `heading-lg` (30; pide 28); los botones, `h-control-sm` (46; pide 48), y los radios de 20 pasan a 24 (`rounded-2xl`), igual que en las specs 07, 08 y 09.
- **Sí: carrusel también entre `md` y `lg`.** Es la regla del `Carousel` (Embla por debajo de `lg`) y evita la tercera tarjeta sola que hoy deja la grilla de 2 columnas en tablet. Medical usa una grilla de 2; aquí manda la convención de la spec 01.
- **Sí: `data-reveal` en el wrapper del carrusel y no en cada tarjeta.** Lección de Fiberlux (spec 69): nada de `data-reveal` dentro de Embla. En desktop, las 3 tarjetas aparecen juntas en lugar de una por una.
- **Sí: reutilizar `blog.related` como `label` del carrusel.** El título visible ya describe la región; una clave nueva diría lo mismo.
- **No: tocar `PostCard` `compact`.** La usa la home; la imagen de 180 px y la tarjeta sin CTA de la referencia quedan para otra spec, si hacen falta.
- **No: hoja nativa de compartir (`navigator.share`), como ERES.** La referencia de FESPAN pide copiar, X y LinkedIn.
- **No: ocultar las etiquetas en mobile.** La referencia las muestra sin "Etiquetas"; el rótulo se mantiene porque es una diferencia menor y no justifica otro tramo de clases.

## Riesgos identificados

| Riesgo | Mitigación |
|---|---|
| Las clases de `prose` por breakpoint (`max-md:prose-p:…`) no se generan o pierden contra las de `prose-lg`. | Se mide el tamaño real de los párrafos en 390 y 768 px; si no aplica, se usa el selector arbitrario que ya usa el primer párrafo. |
| `RelatedPosts` como isla suma JS a una página que hoy solo hidrata `ShareBar`. | Embla ya se carga en la home y en Nosotros (mismo chunk) y la isla es `client:visible`; hay un criterio sobre el peso. |
| El autor duplicado queda desincronizado si alguien edita solo uno de los dos bloques. | Los dos leen el mismo `post.author` y tienen el mismo `data-tina-field`. |
| Con un solo post relacionado, el carrusel queda con una tarjeta suelta. | `Carousel` funciona con una sola tarjeta; hoy hay 6 posts, así que siempre hay 3 relacionados. |
