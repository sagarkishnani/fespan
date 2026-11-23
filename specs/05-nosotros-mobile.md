# SPEC 05 — Nosotros mobile

> **Estado:** Implemented · **Depende de:** SPEC 01 · **Fecha:** 2026-11-21
> **Objetivo:** llevar la página Nosotros al diseño mobile (`< md`): hero apilado con la imagen debajo, intro sin imagen, valores apilados, junta y comités en carrusel, documentos y alianzas compactos; y en todos los tamaños, el texto de los valores en `content-muted` y `alt` editable en la imagen del hero.

## Alcance

### Dentro (todo por debajo de `md`, salvo los puntos 6, 7 y 8)

1. **Hero.**
   - Sin alto mínimo, con `pt-[112px]` (40 px bajo el header de 72 px) y `pb-8`.
   - Título y subtítulo apilados, subtítulo en `body-base` con `mt-4`.
   - Imagen de 260 px en el flujo, `mt-7` y `rounded-2xl`. La imagen absoluta de hoy se ve solo desde `md`.
   - Sin el botón "Conoce más" (`hidden md:inline-flex`).
2. **Intro.**
   - Sin imagen (`max-md:hidden`) y con `py-16`.
   - Párrafos en `body-md` con 14 px entre ellos.
   - Botón con `btn-block` y `mt-7`.
3. **Misión, visión y valores.**
   - Tarjetas apiladas con gap de 12 px, padding de 24 px, sin alto mínimo y con ícono de 64 px.
   - Sin el botón "Ver más" del encabezado ni el link "Conoce más" de cada tarjeta.
   - Sección con `py-16` y título con 28 px debajo.
4. **Junta directiva y comités.**
   - Pasan a `shared/Carousel.tsx`, con tarjetas de 260 × 340 px. Por la convención de la spec 01, el carrusel sigue activo en tablet (`md`–`lg`).
   - Desde `lg`, la grilla de 4 columnas y las tarjetas de 400 px quedan como hoy.
   - `AboutTeam` se hidrata con `client:visible`.
   - Recuadro del cargo con margen de 12 px, radio de 16 y padding de 14/16.
   - Junta con `pt-16`, y comités con `pt-14` y `pb-16`.
5. **Documentos y alianzas.**
   - Filas de documentos con `py-5` y "Descargar PDF" con 44 px de alto mínimo.
   - Título de Alianzas con `mt-14` y fichas de 160 × 80 px con radio de 16 y gap de 12 px.
   - Sección con `py-16`.
6. **Valores en desktop (todos los tamaños).** El texto de las tarjetas pasa de `text-accent` a `text-content-muted`.
7. **`alt` editable (todos los tamaños).** Campo `imageAlt` traducible (`text()`) en `about.hero`, cargado con "Frutas y vegetales" / "Fruits and vegetables" / "Frutas e vegetais". Vacío ⇒ `alt=""`.
8. **Desde `md`, la página queda como hoy,** salvo el carrusel en tablet, el color de los valores y el `alt`.

### Fuera de alcance (para otras specs)

- `.section` global: el `py-16` se aplica solo en las secciones de Nosotros.
- `Carousel` con breakpoint configurable (la decisión de la spec 01 no se toca).
- `alt` editable en la imagen de la intro, que en mobile no se ve.
- Cambiar textos de Tina o quitar del CMS los botones y links de valores (siguen en desktop).
- La banda CTA y el footer de la página (spec 03).
- Pasar a tokens el degradado del hero (el diseño usa 160°; se sigue usando `hero-about`).

## Modelo de datos

### Schema (`tina/collections/about.ts`)

Un campo nuevo, traducible con `text()` (que ya genera `_en` y `_pt`), en el `extra` de `heroObject` de Nosotros:

```ts
heroObject([
  { name: "image", label: "Imagen", type: "image" },
  ...text("imageAlt", "Texto alternativo de la imagen"),
  ...text("buttonLabel", "Texto del botón"),
]),
```

Las otras colecciones que usan `heroObject` no cambian. Después se regenera `tina/__generated__` y `tina/tina-lock.json`.

### Contenido (`src/content/about/index.json`)

| Campo | ES | EN | PT |
|---|---|---|---|
| `hero.imageAlt` | Frutas y vegetales | Fruits and vegetables | Frutas e vegetais |

Se lee con `tField(hero, "imageAlt", locale)` en las dos imágenes del hero (la absoluta y la del flujo). Vacío ⇒ `alt=""`.

### Textos de UI (`src/i18n/ui.ts`)

Dos claves para el `label` de los carruseles, en los 3 idiomas:

| Clave | ES | EN | PT |
|---|---|---|---|
| `about.board.carousel` | Junta directiva | Board of directors | Diretoria |
| `about.committees.carousel` | Comités | Committees | Comitês |

### Tokens

Ninguno nuevo. Los radios usan los de hoy (`rounded-xl` 16 px, `rounded-2xl` 24 px) y los colores son tokens existentes.

### Archivos que cambian

| Archivo | Cambio |
|---|---|
| `tina/collections/about.ts` | `imageAlt` en `hero`. |
| `src/content/about/index.json` | Los textos de `imageAlt` en 3 idiomas. |
| `src/i18n/ui.ts` | Las 2 claves de los carruseles. |
| `src/pages/nosotros.astro` | `AboutTeam` con `client:visible`. |
| `about/AboutHero.tsx` | Imagen en el flujo `< md`, padding, subtítulo, botón oculto y `alt`. |
| `about/AboutIntro.tsx` | Imagen oculta `< md`, padding, párrafos y `btn-block`. |
| `about/AboutValues.tsx` | Tarjetas compactas, botón y links ocultos `< md`, texto en `content-muted`. |
| `about/AboutTeam.tsx` | `Carousel` y tarjeta de 260 × 340. |
| `about/AboutTransparency.tsx` | Filas de documentos, link de 44 px y fichas de 160 × 80. |

Los wrappers de `/en/nosotros` y `/pt/nosotros` importan la página por defecto, así que la directiva nueva les llega sola. No hay archivos nuevos ni dependencias nuevas.

### Medidas (`< md` → desde `md`)

| Pieza | `< md` | Desde `md` |
|---|---|---|
| Alto del hero | sin mínimo | 560 / 620 (hoy) |
| Imagen del hero | 260 px en el flujo | absoluta al 52 % (hoy) |
| Padding de secciones | 64 px | el de hoy |
| Ícono de valores | 64 px | 84 (hoy) |
| Tarjeta de junta y comités | 260 × 340 (hasta `lg`) | grilla de 4 con 400 px desde `lg` |
| Ficha de alianza | 160 × 80 | 260 × 120 (hoy) |

## Plan de implementación

Cada paso deja el sitio compilando y se puede commitear por separado.

1. **Línea base visual.** Con `npm run build:local` y `astro preview`, capturar `/nosotros/` completa en 320, 390, 768, 1024, 1280 y 1536 px, en ES, EN y PT. El script va fuera del repo.
2. **`imageAlt` en el schema y el contenido.** Agregar el campo en `about.ts`, regenerar `tina/__generated__` y `tina-lock.json`, y cargar los textos en `index.json`. `AboutHero` usa `tField(hero, "imageAlt", locale)`. Verificar el `alt` en `/nosotros/`, `/en/nosotros/` y `/pt/nosotros/`.
3. **Hero.** Imagen de 260 px en el flujo con `md:hidden` y la absoluta con `max-md:hidden`. Sin alto mínimo `< md`, `pt-[112px] pb-8`, subtítulo en `body-base` con `mt-4` y botón con `hidden md:inline-flex`.
4. **Intro.** Imagen con `max-md:hidden`, `py-16`, párrafos en `body-md` con gap de 14 px y botón con `btn-block` y `mt-7`.
5. **Valores.** Tarjetas apiladas con gap de 12 px, `p-6` y sin alto mínimo, ícono de 64 px, botón del encabezado y links con `hidden md:…`, `py-16` y título con `mb-7`. Texto de las tarjetas en `text-content-muted` en todos los tamaños.
6. **Junta y comités.**
   - Agregar las claves `about.board.carousel` y `about.committees.carousel` a `ui.ts`.
   - Envolver las tarjetas en `Carousel` (`slideClassName="w-[260px]"`, `gridClassName="lg:grid-cols-4 lg:gap-5"`), con el `data-reveal` fuera de Embla, como en la home.
   - Tarjeta de 340 px hasta `lg` y 400 desde `lg`, con recuadro de cargo compacto.
   - Paddings de la sección y `client:visible` en `nosotros.astro`.
7. **Documentos y alianzas.** Filas con `py-5 md:py-7`, link con `min-h-11`, título de Alianzas con `mt-14 md:mt-24`, fichas de 160 × 80 con `rounded-xl` y gap de 12 px `< md`, y `py-16` en la sección.
8. **Verificación.** Comparar contra la línea base desde 768 px, medir en 390 px y correr `typecheck`, `build:local` y `check:standard`.

## Criterios de aceptación

**Hero**

- [x] En 390 px, el hero no tiene alto mínimo y la imagen de 260 px está debajo del subtítulo, sin el botón "Conoce más".
- [x] En 768 y 1280 px, el hero se ve como en la línea base (imagen a la derecha y botón visible).
- [x] La imagen del hero tiene `alt="Frutas y vegetales"` en `/nosotros/`, `alt="Fruits and vegetables"` en `/en/nosotros/` y `alt="Frutas e vegetais"` en `/pt/nosotros/`.
- [ ] Con `imageAlt` vacío en Tina, las imágenes del hero quedan con `alt=""`. Pendiente: verificado solo en código (`tField` devuelve `""`), falta probarlo desde Tina.
- [ ] `imageAlt` es editable en `/admin`, en el hero de Nosotros, con sus versiones EN y PT. Pendiente: probar con `npm run dev`; el schema y `tina-lock.json` ya tienen los campos.

**Intro y valores**

- [x] En 390 px, la intro no muestra imagen y el botón ocupa todo el ancho.
- [x] En 390 px, las tarjetas de valores están apiladas con 12 px entre ellas, el ícono mide 64 px y no se ven "Ver más" ni "Conoce más".
- [x] En 768 y 1280 px se ven "Ver más" y los links "Conoce más" de las tarjetas.
- [x] En 390 y 1280 px, el texto de las tarjetas de valores es `content-muted` (`#5C7377`).

**Junta, comités, documentos y alianzas**

- [x] En 390 y 768 px, junta y comités son carruseles que se arrastran, con tarjetas de 260 × 340 px.
- [x] En 1024 y 1280 px, junta y comités son una grilla de 4 columnas con tarjetas de 400 px de alto, sin arrastre.
- [x] Los carruseles tienen `aria-label` traducido en ES, EN y PT.
- [x] En 390 px, "Descargar PDF" mide al menos 44 px de alto. Medido con un link inyectado con las mismas clases: hoy los documentos no tienen archivo.
- [x] En 390 px, las fichas de alianzas miden 160 × 80 px.
- [x] En 390 px, las secciones de Nosotros tienen 64 px de padding vertical.

**Repo**

- [x] Desde 1024 px, las capturas son iguales a la línea base, salvo el color del texto de los valores.
- [x] En 768 px, las capturas son iguales a la línea base, salvo junta, comités y el color de los valores.
- [x] `npm run typecheck`, `npm run build:local` y `npm run check:standard` pasan sin errores.
- [x] No hay dependencias nuevas ni hex fuera de `tailwind.config.mjs`.
- [x] No hay scroll horizontal en `/nosotros/` en 320, 360, 390, 768, 1024, 1280 y 1536 px.

## Decisiones

- **Sí: `Carousel` para junta y comités, también en tablet.** La spec 01 fijó que todo carrusel usa `shared/Carousel.tsx` y que Embla está activo por debajo de `lg`. Extender el componente con un breakpoint configurable reabre esa decisión y es otra spec.
- **Sí: la tarjeta de 260 × 340 hasta `lg`.** En tablet es un carrusel, así que usa la medida mobile; desde `lg` vuelve la grilla con 400 px.
- **Sí: dos imágenes en el hero (una absoluta desde `md`, otra en el flujo `< md`).** Es lo más simple sin reescribir el layout de desktop. Las dos usan la misma URL, así que el navegador la descarga una sola vez.
- **Sí: `imageAlt` traducible solo en `about.hero`.** Sigue el patrón de la spec 04. La imagen de la intro no se ve en mobile y queda fuera.
- **Sí: el texto de los valores en `content-muted` en todos los tamaños.** El diseño desktop también lo pide, y el verde sobre `surface` no es el color de lectura del sitio.
- **Sí: ocultar con CSS "Ver más" y "Conoce más" en mobile.** Los botones y links siguen en Tina y en desktop; no se toca el schema.
- **Sí: documentos compactos y link de 44 px.** No estaba en el inventario, pero el diseño lo pide y los 44 px son el mínimo táctil.
- **Sí: `AboutTeam` con `client:visible`.** Embla necesita hidratar en producción; `client:tina` no carga React fuera del editor.
- **Sí: `pt-[112px]` en el hero mobile.** Deja 40 px bajo el header de 72 px de hoy. Cuando se mergee la spec 02 (header de 64 px) quedarán 48, y no hace falta coordinar las dos ramas.
- **No: `.section` global ni tocar `heroObject` para otras páginas.** Cambiaría todas las páginas.
- **No: pasar a tokens el degradado de 160° del diseño.** Se sigue usando `hero-about`; la diferencia de ángulo no se nota en 390 px.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Hidratar `AboutTeam` (dos islas con Embla) suma JS a `/nosotros/` y puede pasar el presupuesto de 150 KB de `check:standard`. | Medir el JS de `/nosotros/` en la línea base y después; si pasa el presupuesto, anotarlo en el PR y medirlo con `npm run build`, que es el que cuenta. |
| `Carousel` mete el `data-reveal` dentro de Embla y las tarjetas no aparecen. | Poner el `data-reveal` fuera de `Carousel`, como en la home (commit `6bf282f`). |
| Regenerar `tina/__generated__` cambia el `client.ts` horneado con la rama. | Se regenera con `build:local` (modo local) y se revisa el diff de `tina-lock.json`. |
| TinaCloud indexa por rama: al mergear, el schema nuevo tiene que estar indexado en `staging`. | Se anota en el PR para Sagar. |
| Con dos imágenes en el hero, `fetchPriority="high"` en la que está oculta no sirve en mobile. | `fetchPriority="high"` en las dos: misma URL, una sola descarga. |
| Ocultar los links de valores con CSS deja el texto en el HTML. | Es intencional: siguen indexables y aparecen desde `md`. |

## Lo que **no** entra en esta spec

- `.section` global.
- `Carousel` con breakpoint configurable.
- `alt` editable en la imagen de la intro.
- Cambios en los textos de Tina o en el schema de valores.
- La banda CTA y el footer.
- Pasar a tokens el degradado del hero.

Cada una de esas piezas, si llega, va en su propia spec.
