# SPEC 04 — Home mobile

> **Estado:** Implemented · **Depende de:** SPEC 01 · **Fecha:** 2026-11-21
> **Objetivo:** llevar la home al diseño mobile (`< md`): hero de 620 px con degradado vertical y botones apilados, cifras en 2 columnas, botones de sección abajo a todo el ancho, video y transparencia compactos, y `alt` editable en las imágenes del hero y de Sobre nosotros.

## Alcance

### Dentro (todo por debajo de `md`, salvo el punto 7)

1. **Hero.**
   - Alto mínimo de 620 px y un solo degradado vertical, la imagen con `object-position: 62% center` y `pb` de 32 px.
   - Subtítulo en `body-base` con `mt-4`.
   - Botones apilados con gap de 10 px, los dos con `btn-block`.
2. **Sobre nosotros.**
   - Solo el primer párrafo del cuerpo, en `body-md`.
   - Cifras en 2 columnas con borde arriba y abajo (`py-6`), el número en 48 px y la etiqueta en `body-sm`.
   - El botón con `btn-block` y la imagen 32 px debajo.
3. **Actividades.**
   - El botón de Tina sale del encabezado y va abajo del carrusel con `btn-secondary btn-block`.
   - La tarjeta lleva imagen de 200 px y padding de 20 px.
4. **Video.**
   - Degradado vertical, padding de 28/24 px y botón `btn-light btn-block`.
5. **Noticias y transparencia.**
   - El link "Ver todas las publicaciones" sale del encabezado y va abajo como `btn-secondary btn-block`, y las tarjetas van con gap de 16 px.
   - Transparencia: padding de 32/24 px, el botón de 52 px con `btn-block` y `mt-12`.
6. **Espaciado.** Las secciones de la home usan `py-16` (64 px) en lugar de los 80 de `.section`.
7. **`alt` editable (todos los tamaños).**
   - Campo `imageAlt` traducible (`text()`) en `hero` y `about`.
   - Se carga con "Congreso FESPAN" y "Alimentos saludables" en ES, EN y PT. Vacío ⇒ `alt=""`.
8. **Desde `md`, la home queda como hoy,** salvo el `alt`.

### Fuera de alcance (para otras specs)

- `.section` global y `PostCard`: las tarjetas de Noticias quedan como hoy (spec 09).
- Cambiar los textos de Tina (p. ej., "Ver más" → "Ver todas las actividades").
- Pasar los degradados existentes del hero desktop y del video a tokens.
- El título del video en 30 px: usa `heading-xl` (34 px a 390), porque un título lleva un solo token.
- El header, el footer y la banda CTA (specs 02 y 03).

## Modelo de datos

### Schema (`tina/collections/home.ts`)

Dos campos nuevos, traducibles con `text()` (que ya genera `_en` y `_pt`):

```ts
heroObject([
  { name: "image", label: "Imagen de fondo", type: "image" },
  ...text("imageAlt", "Texto alternativo de la imagen"),
  linkObject("primaryButton", "Botón principal"),
  linkObject("secondaryButton", "Botón secundario"),
]),
// about.fields, después de image:
...text("imageAlt", "Texto alternativo de la imagen"),
```

Solo cambia `home.ts`. `heroObject` es compartido, pero el campo va en el `extra` de la home: las otras 5 colecciones que lo usan no cambian. Después se regenera `tina/__generated__`.

### Contenido (`src/content/home/index.json`)

| Campo | ES | EN | PT |
|---|---|---|---|
| `hero.imageAlt` | Congreso FESPAN | FESPAN congress | Congresso FESPAN |
| `about.imageAlt` | Alimentos saludables | Healthy food | Alimentos saudáveis |

Se leen con `tField(hero, "imageAlt", locale)`. Vacío ⇒ `alt=""` (imagen decorativa).

### Tokens (`tailwind.config.mjs`, `backgroundImage`)

```js
'hero-home-mobile':   'linear-gradient(0deg, rgba(10,30,27,.92) 0%, rgba(10,30,27,.6) 45%, rgba(10,30,27,.1) 75%)',
'video-scrim-mobile': 'linear-gradient(0deg, rgba(14,35,39,.9) 0%, rgba(14,35,39,.45) 60%, rgba(14,35,39,.2) 100%)',
```

### Archivos que cambian

| Archivo | Cambio |
|---|---|
| `tina/collections/home.ts` | `imageAlt` en `hero` y `about`. |
| `src/content/home/index.json` | Los textos de `imageAlt` en 3 idiomas. |
| `tailwind.config.mjs` | Los 2 degradados con nombre. |
| `home/HomeHero.tsx` | Alto, degradado, padding, subtítulo, botones `btn-block` y `alt`. |
| `home/HomeAbout.tsx` | Primer párrafo solo en mobile, cifras 2×2, botón `btn-block`, gap con la imagen y `alt`. |
| `home/HomeActivities.tsx` | Botón abajo `< md` y tarjeta de 200/20 px. |
| `home/HomeVideo.tsx` | Degradado, padding y `btn-block`. |
| `home/HomeNews.tsx` | Link abajo como botón `< md`, gap y transparencia compacta. |

No hay archivos nuevos ni dependencias nuevas.

### Medidas (`< md` → desde `md`)

| Pieza | `< md` | Desde `md` |
|---|---|---|
| Padding de sección | 64 px | 80 (`.section`, hoy) |
| Alto del hero | mín. 620 px | 640 / 760 (hoy) |
| Número de las cifras | 48 px | `clamp` de hoy |
| Imagen de la tarjeta de actividades | 200 px | 220 / 260 (hoy) |
| Botón de transparencia | 52 px (`.btn`) | 60 (`btn-lg`, hoy) |

## Plan de implementación

Cada paso deja el sitio compilando y se puede commitear por separado.

1. **Línea base visual.** Con `npm run build:local` y `astro preview`, capturar la home completa en 320, 390, 768, 1024, 1280 y 1536 px, en ES, EN y PT. El script va fuera del repo.
2. **`imageAlt` en el schema y el contenido.** Agregar los campos en `home.ts`, regenerar `tina/__generated__` y cargar los textos en `index.json`. `HomeHero` y `HomeAbout` usan `tField(..., "imageAlt", locale)`. Verificar el `alt` en `/`, `/en/` y `/pt/`.
3. **Degradados.** Agregar `hero-home-mobile` y `video-scrim-mobile` a `tailwind.config.mjs`, todavía sin uso.
4. **Hero.** Alto, degradado (`max-md:`), `object-position`, padding, subtítulo y botones apilados con `btn-block`.
5. **Sobre nosotros.** Primer párrafo solo en mobile (`max-md:hidden` en los demás), cifras 2×2 con bordes, botón `btn-block`, gap de 32 px con la imagen y `py-16`.
6. **Actividades.** Botón del encabezado `hidden md:inline-flex` y botón abajo `btn-secondary btn-block md:hidden`. Tarjeta de 200/20 px y `py-16`.
7. **Video.** Degradado vertical en mobile, padding de 28/24 px, botón `btn-block` y `pt-16`.
8. **Noticias y transparencia.** Link del encabezado oculto `< md` y botón abajo `md:hidden`, gap de 16 px, transparencia compacta con botón de 52 px `btn-block` y `py-16`.

## Criterios de aceptación

**Hero**

- [x] En 390 px, el hero mide 620 px de alto como mínimo, con el degradado de abajo hacia arriba.
- [x] En 390 px, "Conoce más" y "Ver eventos" están apilados, a todo el ancho, con 10 px entre ellos.
- [x] La imagen del hero tiene `alt="Congreso FESPAN"` en `/`, `alt="FESPAN congress"` en `/en/` y `alt="Congresso FESPAN"` en `/pt/`.

**Sobre nosotros**

- [x] En 390 px se ve un solo párrafo; en 768 y 1280 se ven los dos.
- [x] En 390 px, las cifras están en 2 columnas, con borde arriba y abajo, y el número mide 48 px.
- [x] En 390 px, el botón ocupa todo el ancho y la imagen está 32 px debajo.
- [x] La imagen tiene `alt` traducido en los 3 idiomas ("Alimentos saludables", "Healthy food", "Alimentos saudáveis").
- [ ] Con `imageAlt` vacío en Tina, las imágenes quedan con `alt=""`. Pendiente: verificado solo en código (`tField` devuelve `""`), falta probarlo desde Tina.

**Actividades, video, noticias y transparencia**

- [x] En 390 px, el botón de actividades está debajo del carrusel, a todo el ancho, y no se ve en el encabezado. En 768 px está en el encabezado, como hoy.
- [x] En 390 px, la imagen de la tarjeta de actividades mide 200 px.
- [x] En 390 px, el video tiene el degradado vertical y el botón "Ver video" a todo el ancho, y abre el modal.
- [x] En 390 px, "Ver todas las publicaciones" es un botón a todo el ancho debajo de las tarjetas. En 768 px es el link del encabezado, como hoy.
- [x] En 390 px, el botón de transparencia mide 52 px y ocupa todo el ancho.
- [x] En 390 px, las secciones de la home tienen 64 px de padding vertical.

**Repo**

- [x] Desde 768 px, las capturas de la home son iguales a la línea base, salvo el `alt`.
- [x] `npm run typecheck`, `npm run build:local` y `npm run check:standard` pasan sin errores.
- [x] No hay dependencias nuevas ni hex fuera de `tailwind.config.mjs`.
- [ ] `imageAlt` es editable en `/admin`, en el hero y en Sobre nosotros, con sus versiones EN y PT. Pendiente: probar con `npm run dev`; el schema y `tina-lock.json` ya tienen los campos.
- [x] No hay scroll horizontal en la home en 320, 360, 390, 768, 1024, 1280 y 1536 px.

## Decisiones

- **Sí: solo el primer párrafo de Sobre nosotros en mobile.** Es lo que pide el diseño mobile. El segundo sigue en tablet y desktop, y no hace falta tocar el schema.
- **Sí: el mismo botón de Tina para actividades, movido abajo en mobile.** Hay una sola fuente. Si quieren "Ver todas las actividades", lo cambian en Tina y se ve igual en los dos tamaños, como ya pasa con "Ver todas las publicaciones".
- **No: una clave fija en `ui.ts` ni un campo `mobileLabel`.** La clave no se puede editar desde Tina, y el campo suma traducciones por una diferencia de texto.
- **Sí: `imageAlt` traducible en `hero` y `about`.** Sigue el patrón de `logoAlt` y `coverAlt`. Vacío ⇒ imagen decorativa.
- **Sí: el campo en el `extra` de `heroObject` de la home.** Las otras 5 colecciones que usan `heroObject` no cambian.
- **Sí: los degradados nuevos como `backgroundImage` con nombre.** Es la regla del `CLAUDE.md`. Los degradados existentes del hero desktop y del video quedan como están.
- **Sí: medidas finas solo en la home.** `py-16` por sección y la tarjeta de actividades de 200/20 px. `.section` y `PostCard` no se tocan, porque cambiarían todas las páginas y el blog (spec 09).
- **Sí: el título del video sigue en `heading-xl`.** Un título usa un solo token; cambiar a `heading-lg` también achicaría el desktop (60 → 56 px).
- **Sí: el botón de transparencia en `.btn` (52 px) y `md:h-control-lg`.** `btn-lg` fija 60 px en todos los tamaños.
- **No: cambiar los textos de Tina.** Es contenido, no código.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Regenerar `tina/__generated__` cambia el `client.ts` horneado con la rama. | Se regenera con `build:local` (modo local), igual que en las specs anteriores, y se revisa el diff de `__generated__`. |
| TinaCloud indexa por rama: al mergear, el schema nuevo tiene que estar indexado en `staging`. | Se anota en el PR para Sagar. |
| Dos botones (encabezado y abajo) duplican el link para lectores de pantalla. | Cada uno se oculta con `hidden` o `md:hidden` según el tamaño, así que nunca están los dos visibles. |
| Ocultar el segundo párrafo con CSS deja el texto en el HTML. | Es intencional: el contenido sigue indexable y aparece desde `md`. |

## Lo que **no** entra en esta spec

- `.section` global y `PostCard` (spec 09).
- Cambios en los textos de Tina.
- Pasar a tokens los degradados existentes.
- El título del video en 30 px.
- El header, el footer y la banda CTA.

Cada una de esas piezas, si llega, va en su propia spec.
