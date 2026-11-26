# SPEC 08 — Conocimiento mobile

> **Estado:** Implemented · **Depende de:** SPEC 01 · **Fecha:** 2026-11-25
> **Objetivo:** llevar Conocimiento al diseño mobile (hero, pestañas, filtros, filas y paginador), con "Descargar PDF" como botón con borde por debajo de `lg` y chevrons en el paginador en todos los anchos.

## Alcance

**Entra:**

1. **Hero (`PageHeroSoft`), por debajo de `md`.** Solo lo usa Conocimiento.
   - La sección empieza 48 px bajo el header (`pt-[112px]`) y cierra con `pb-10`.
   - El subtítulo va en `body-base font-light`, a 16 px del título (`mt-4`).
   - El círculo mide 300 px, en `-right-[120px] -top-[60px]`.
   - Desde `md`, como hoy.
2. **Sección del listado, por debajo de `md`:** `pt-6 pb-16`.
3. **Pestañas, por debajo de `md`.**
   - 2 columnas iguales, sin `overflow-x-auto`, de 52 px de alto y con el texto centrado en `body-md`.
   - El contador mide 24 px de alto, con `min-w-[26px]` y `caption-sm`.
   - Desde `md`, como hoy.
4. **Filtros, por debajo de `md`.**
   - Apilados a 16 px entre sí, a 24 px de las pestañas y con 24 px de padding inferior.
   - Las etiquetas van en `body-sm font-medium`, a 8 px del campo.
   - Los campos miden 52 px, con radio de 14, `body-md` y el ícono de búsqueda a 16 px del borde.
   - Desde `md`, los 58 px de hoy.
5. **Filas, por debajo de `md`.**
   - `py-6`, con 6 px entre líneas.
   - La categoría va en `caption-sm` (13 px) con su tracking de 0.06em.
   - Título en `subtitle-md`, metadatos en `body-sm` e idiomas en `caption-md`.
   - El rango ("1–10 de 14") va en `caption-md`, a 16 px de los filtros.
   - El estado vacío lleva `mt-6`, `px-4 py-8` y `body-md`.
6. **"Descargar PDF", por debajo de `lg`.**
   - Botón `.btn-outline-brand` (clase nueva en `global.css`): borde de 1.5 px y texto `brand-primary`, y en hover fondo `brand-primary` con texto blanco.
   - Va con el ícono de descarga, a 16 px de los metadatos.
   - Ocupa todo el ancho por debajo de `md` (`.btn-block`).
   - Desde `lg`, el enlace de hoy.
7. **Paginador.**
   - Chevrons (`FaChevronLeft`/`FaChevronRight`) en todos los anchos, en lugar de las flechas.
   - Por debajo de `md`, círculos de 44 px y `mt-8`. Desde `md`, los 48 px y el `mt-12` de hoy.

**No entra:**

- La semántica completa de pestañas (`aria-controls`, `tabpanel`, navegación con flechas, como en Medical).
- El `aria-label="Paginación"` fijo en español en EN y PT.
- Cambiar `PAGE_SIZE` o el contenido. Hoy hay 9 documentos y el paginador no se ve; para verificarlo se baja `PAGE_SIZE` solo en local, sin commit.
- Otros cambios de desktop, fuera de los chevrons.
- La banda CTA y el footer (spec 03).

## Modelo de datos

No hay datos nuevos: ni schema de Tina, ni contenido, ni claves de `ui.ts`.

- "Descargar PDF", "Anterior" y "Siguiente" salen de `common.downloadPdf`, `common.previous` y `common.next`, que ya existen.
- La única pieza nueva es una clase en `src/styles/global.css`, junto a `.btn-outline`:

```css
.btn-outline-brand { @apply btn border-[1.5px] border-brand-primary bg-transparent text-brand-primary hover:bg-brand-primary hover:text-white; }
```

`brand-primary` (`#0F7440`) sobre blanco supera el 4.5:1, así que no hace falta un token nuevo.

## Plan de implementación

1. **Línea base.**
   - Con `build:local` y `preview`, capturar `/conocimiento/` en 320, 390, 768, 1024, 1280 y 1536 px, y medir el JS de la página.
   - Repetir con `PAGE_SIZE = 4`, para que se vean el paginador y la segunda página.
   - Sin commit. El script de capturas va fuera del repo.
2. **Hero.** En `PageHeroSoft.tsx`, por debajo de `md`: `pt-[112px] pb-10`, subtítulo en `body-base font-light` con `mt-4` y círculo de 300 px. Desde `md`, las clases de hoy con prefijo.
3. **Pestañas y filtros.** En `KnowledgeBrowser.tsx`:
   - La sección pasa a `pt-6 pb-16`.
   - `KindTabs` pasa a `grid grid-cols-2` por debajo de `md` y a `flex` desde `md`. Las pestañas miden 52 px, con `body-md` y el contador de 24 px.
   - Los filtros se apilan con `gap-4 mt-6 pb-6`. Las etiquetas van en `body-sm` y los campos miden 52 px con radio de 14.
4. **Filas y estado vacío.** En `DocRow`:
   - `py-6` y 6 px entre líneas.
   - Categoría en `caption-sm`, metadatos en `body-sm` e idiomas en `caption-md`.
   - Rango en `caption-md` con `pt-4`, y estado vacío con `mt-6 px-4 py-8 body-md`.
   - Desde `md`, las medidas de hoy.
5. **Botón de descarga.**
   - `.btn-outline-brand` en `global.css`.
   - En `DocRow`, el enlace es `btn-outline-brand btn-block` con `mt-2.5` por debajo de `lg`, y desde `lg` el enlace de hoy.
   - Sin `file`, no hay botón.
6. **Paginador.** En `Pager`:
   - `FaChevronLeft`/`FaChevronRight` en lugar de `ArrowRightIcon`.
   - Círculos de 44 px y `mt-8` por debajo de `md`, y 48 px y `mt-12` desde `md`.
   - Si `ArrowRightIcon` queda sin uso en el repo, se elimina de `icons.tsx`.
7. **Verificación.**
   - Repetir las capturas y la medición del paso 1, con `PAGE_SIZE` normal y con 4.
   - `typecheck`, `build:local` y `check:standard`.
   - Revisar que no haya scroll horizontal y los textos en ES, EN y PT.

Cada paso de código deja el sitio funcionando y lleva su propio commit.

## Criterios de aceptación

### Hero

- [x] En 390 px, el título empieza 48 px bajo el header, el subtítulo mide 17 px (peso 300) y está a 16 px del título, y la sección cierra 40 px después.
- [x] En 390 px, el círculo mide 300 px.
- [x] Desde 768 px, el hero es igual a la línea base.

### Pestañas y filtros

- [x] En 320 y 390 px, las dos pestañas ocupan la mitad del ancho cada una, miden 52 px y no hay scroll lateral.
- [x] En 390 px, los campos van apilados a 16 px entre sí, miden 52 px y tienen radio de 14; el texto escrito mide 16 px.
- [x] Desde 768 px, las pestañas y los campos son iguales a la línea base.

### Filas

- [x] En 390 px, la categoría mide 13 px, el título 20 px, los metadatos 15 px y los idiomas 14 px.
- [x] En 390 px, "Descargar PDF" ocupa todo el ancho, mide 52 px y tiene borde y texto `brand-primary`; en hover, el fondo es `brand-primary` y el texto blanco.
- [x] En 768 px, "Descargar PDF" es un botón con borde de ancho automático.
- [x] Desde 1024 px, "Descargar PDF" es el enlace de hoy y las filas son iguales a la línea base.
- [x] Un documento sin `file` no muestra botón.

### Paginador (con `PAGE_SIZE = 4` en local)

- [x] Anterior y siguiente llevan chevrons en todos los anchos.
- [x] En 390 px, los círculos miden 44 px; desde 768 px, 48.
- [x] Al cambiar de página, la lista sube al inicio de la sección.

### General

- [x] ES, EN y PT muestran "Descargar PDF", las pestañas y las etiquetas traducidas.
- [x] Sin scroll horizontal en 320, 360, 390, 768, 1024, 1280 y 1536 px.
- [x] El JS de `/conocimiento/` no crece más de 1 KB gzip respecto de la línea base.
- [x] `typecheck`, `build:local` y `check:standard` pasan; sin hex nuevos en `src/`.
- [x] `PAGE_SIZE` sigue en 10 en el commit final.

## Decisiones tomadas y descartadas

- **Sí: `.btn-outline-brand` nueva, verde.** El diseño mobile pinta el botón con borde y texto de marca, y Medical Digital resuelve lo mismo con su `.btn-secondary`. `brand-primary` cumple 4.5:1 sobre blanco.
- **No: reutilizar `.btn-outline`.** Es oscuro (`border-content`) y no coincide con la referencia.
- **Sí: botón por debajo de `lg` y enlace desde `lg`.** La fila es de 1 columna hasta `lg`. En tablet, un enlace suelto bajo el texto sería el layout de desktop achicado. Ocupa todo el ancho solo por debajo de `md` (`.btn-block`).
- **Sí: chevrons en todos los anchos.** Las referencias se contradicen: chevrons en mobile y flechas en desktop. Un solo ícono es más coherente, y repite la decisión de "Volver" en la spec 07. Desktop se aparta de su referencia en ese detalle.
- **No: el paginador de Fiberlux.** Tiene SVG propio y hex sueltos; aquí se usa `react-icons/fa6`, como pide el `CLAUDE.md`.
- **Sí: 44 px en mobile y 48 desde `md`.** La referencia mobile usa 44, igual que Medical (`h-11`), y es el mínimo táctil. Desktop conserva los 48 de su referencia.
- **Sí: pestañas en 2 columnas iguales solo por debajo de `md`.** Hoy, con `overflow-x-auto`, pueden generar scroll lateral en 320 px. Desde `md`, el diseño desktop las alinea a la izquierda.
- **Sí: tokens en lugar de valores exactos.** El contador usa `caption-sm` (13 px; la referencia pide 12) y el botón usa `.btn` de 52 px (la referencia, 48), como en la spec 07.
- **Sí: el ajuste del hero va en `PageHeroSoft`.** Solo lo usa Conocimiento. Los 112 px coinciden con Nosotros.
- **No: semántica completa de pestañas ni `aria-label` traducido del paginador.** Son arreglos de accesibilidad que se dejaron fuera de esta spec.
- **Sí: verificar el paginador con `PAGE_SIZE = 4` solo en local.** Con 9 documentos, el paginador no aparece.

## Riesgos identificados

| Riesgo | Mitigación |
|---|---|
| iOS hace zoom al enfocar un campo con texto de menos de 16 px. | Los campos usan `body-md` (16 px) en mobile. Hay un criterio que lo verifica. |
| Con un PDF publicado en otra pestaña, el `download` no aplica en algunos navegadores y el PDF se abre en lugar de descargarse. | Es el comportamiento de hoy; la spec no lo cambia. |
| Una pestaña con un texto largo en EN o PT ("Investigaciones" / "Pesquisas") no entra en la mitad de 320 px. | Se verifica en 320 px en los 3 idiomas; si no entra, se baja el `gap` del contador. |
| Si se agregan documentos, el paginador puede mostrar muchos círculos y desbordar en 320 px. | Con 44 px y 8 de gap entran 5 números y las 2 flechas. Más páginas quedan para otra spec, igual que el tope de números. |

## Qué no entra en esta spec

- Semántica completa de pestañas (`aria-controls`, `tabpanel`, flechas del teclado).
- `aria-label` del paginador traducido a EN y PT.
- Cambios de `PAGE_SIZE` o del contenido.
- Cambios de desktop, fuera de los chevrons del paginador.
- Banda CTA y footer.

Cada uno de esos, si llega, va en su propia spec.
