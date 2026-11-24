# SPEC 06 — Miembros mobile y mapa

> **Estado:** Approved · **Depende de:** SPEC 01 · **Fecha:** 2026-11-23
> **Objetivo:** llevar Miembros al diseño mobile (mapa, tarjeta de la sociedad y lista, hasta `lg`) y hacer que el mapa funcione con toques cuando no hay mouse; en desktop, mantener el tooltip dentro del mapa y dejar de recortarlo.

## Alcance

### Dentro

1. **Orden hasta `lg`.** Título, subtítulo, buscador, filtro de país, mapa, tarjeta de la sociedad y lista. Desde `lg` quedan las dos columnas de hoy: texto y lista a la izquierda, mapa a la derecha.
2. **Medidas mobile (`< md`).**
   - Sección con `pt-[104px]` (40 px bajo el header de 64) y `pb-16`.
   - Subtítulo en `body-md`, con `mt-3.5` y `mb-6`.
   - Panel del mapa con `p-4` y `rounded-2xl`; el mapa ocupa todo el ancho del panel.
   - Lista con `mt-5` y `gap-2`; filas de 64 px de alto mínimo, con `px-4 py-3.5` y `rounded-xl`, y nombre en `body-base`.
3. **Modo táctil (sin `can-hover`, en cualquier ancho).**
   - Tocar una fila selecciona esa sociedad, y tocar un país selecciona la primera sociedad de ese país. Tocar la sociedad ya seleccionada no hace nada.
   - Selección: el país en `fill-brand-primary` con el pin animado, y la fila en `bg-surface-mint` con `font-medium`.
   - Debajo del mapa (`mt-3`) aparece la tarjeta de la sociedad, en `bg-accent`, `rounded-[20px]`, `p-5` y texto blanco:
     - país en `overline` y `text-brand-primary-pale`;
     - nombre en `subtitle-xs`;
     - ciudad en `body-sm` y `text-white/85`;
     - "Visitar sitio web" como `.btn` blanco a todo el ancho, solo si la sociedad tiene `url`.
   - Las filas no muestran el dominio y llevan un indicador de 12 px: blanco con borde `brand-primary`, y `brand-primary-light` si la fila está seleccionada.
   - Las filas son `<button>` con `aria-pressed`, y la tarjeta se anuncia con `aria-live="polite"`. No hay tooltip.
4. **Modo mouse (`can-hover`), en cualquier ancho: como hoy.** Hover o foco muestra el tooltip, el clic abre la web y las filas son links con el dominio.
5. **Subtítulo para táctil.** Campo traducible `touchSubtitle` en el hero de `membersPage`.
   - Se carga con "Toca un país o una sociedad para ver su ubicación.", "Tap a country or society to see its location." y "Toque em um país ou sociedade para ver sua localização.".
   - Sin `can-hover` se ve `touchSubtitle`; con `can-hover`, `subtitle`.
   - Si `touchSubtitle` está vacío, se usa `subtitle`.
6. **Variante `can-hover`.** Se agrega a `tailwind.config.mjs` (`@media (hover: hover) and (pointer: fine)`, la misma que Medical Digital). En JS se consulta la misma media query con `matchMedia`.
7. **Desktop (`≥ lg`).**
   - El tooltip queda siempre dentro del recuadro del mapa (`left` con `clamp()` en CSS).
   - El panel deja el `py-10`, para que el mapa de 799 px entre completo en los 860 px.

### Fuera de alcance (para otras specs)

- Igualar el padding superior de Nosotros (`pt-[112px]`) con el de esta página.
- Pines para países que hoy no tienen sociedad (`countryPins.ts` tiene 4).
- Elegir entre varias sociedades de un mismo país desde el mapa.
- `alt` editable del mapa, que sigue siendo `members.mapAlt` en `ui.ts`.
- Cambios en los campos de búsqueda y filtro (los resolvió la spec 01).
- La banda CTA y el footer de la página (spec 03).

## Modelo de datos

### Schema (`tina/collections/membersPage.ts`)

Un campo nuevo, traducible con `longText()` (igual que `subtitle`), en el `extra` de `heroObject`:

```ts
fields: [
  heroObject([...longText("touchSubtitle", "Subtítulo en pantallas táctiles")]),
  seoObject(),
],
```

Después se regeneran `tina/__generated__` y `tina/tina-lock.json`.

### Contenido (`src/content/members-page/index.json`)

```json
"touchSubtitle": "Toca un país o una sociedad para ver su ubicación.",
"touchSubtitle_en": "Tap a country or society to see its location.",
"touchSubtitle_pt": "Toque em um país ou sociedade para ver sua localização."
```

### Textos de UI (`src/i18n/ui.ts`)

```ts
"members.visitSite": "Visitar sitio web",   // EN "Visit website", PT "Visitar site"
```

### Estado de `MembersDirectory`

```ts
const [hovered, setHovered] = useState<string | null>(null);   // modo mouse, como hoy (countryCode)
const [selectedId, setSelectedId] = useState<string | null>(null); // modo táctil: SocietyModel.id
const canHover = useCanHover(); // matchMedia("(hover: hover) and (pointer: fine)"), true antes de hidratar
```

- En modo táctil, el país resaltado y el pin salen de la sociedad seleccionada.
- Si un filtro saca de la lista a la sociedad seleccionada, la selección se limpia.
- `useCanHover` vive en `src/hooks/useCanHover.ts` y escucha el evento `change` de la media query.

No hay datos nuevos en `society`. Antes de hidratar, la página se renderiza en modo mouse (links que abren la web, como hoy); en un dispositivo táctil pasa a modo táctil al hidratar. Los subtítulos se eligen con CSS (`can-hover:`), así que no saltan.

## Plan de implementación

1. **Línea base visual.** Con `npm run build:local` y `astro preview`, capturar `/miembros/` completa en 320, 390, 768, 1024, 1280 y 1536 px, con mouse y con touch, en ES. El script va fuera del repo.
2. **Schema, contenido y textos.**
   - `touchSubtitle` en `membersPage.ts` y en `index.json`, en los 3 idiomas.
   - Clave `members.visitSite` en `ui.ts`.
   - Regenerar Tina con `build:local`.
   - Todavía no se ve en ningún lado.
3. **Variante `can-hover` y hook `useCanHover`.**
   - La variante va en `tailwind.config.mjs`.
   - `useCanHover` va en `src/hooks/useCanHover.ts`.
   - Todavía nadie la usa.
4. **Subtítulos.** En `MembersHero`, los dos subtítulos con `can-hover:hidden` / `hidden can-hover:block`. En mobile, `body-md` con `mt-3.5` y `mb-6`.
5. **Orden y medidas.**
   - `MembersDirectory` pasa a una grilla con áreas: hasta `lg`, título y filtros, después mapa y lista; desde `lg`, las dos columnas de hoy.
   - Medidas mobile del panel y la lista.
   - `pt-[104px]` y `pb-16` en `miembros.astro`.
   - Desde `lg`, el panel sin `py-10`.
6. **Modo táctil.**
   - Selección por `id`.
   - Filas como `<button aria-pressed>` con el indicador.
   - Tarjeta verde debajo del mapa, con `aria-live`.
   - Tocar un país selecciona su primera sociedad, y el filtro limpia la selección.
   - Sin tooltip.
   - En modo mouse, nada cambia.
7. **Tooltip dentro del mapa.** `left` con `clamp()` en `MapTooltip`, para que los 300 px del tooltip no salgan del recuadro.
8. **Verificación.**
   - Comparar con la línea base en los 6 anchos, con mouse y con touch.
   - Medidas en 390 y textos en ES/EN/PT.
   - `typecheck`, `build:local` y `check:standard`.
   - Sin scroll horizontal en 320, 360, 390, 768, 1024, 1280 y 1536 px.

## Criterios de aceptación

### Mobile y tablet

- [ ] En 390 y 768 px, el orden es título, subtítulo, buscador, filtro, mapa y lista; en 1024 px, la lista está a la izquierda y el mapa a la derecha.
- [ ] En 390 px, la sección empieza 40 px bajo el header y el panel del mapa tiene 16 px de padding y radio de 24.
- [ ] En 390 px, las filas miden al menos 64 px de alto, con 8 px entre ellas.

### Modo táctil (sin mouse, `(hover: none)`)

- [ ] Se ve "Toca un país o una sociedad…" en ES, EN y PT, y no se ve "Pasa el cursor…".
- [ ] Tocar una fila la pone en `surface-mint`, pinta su país en `brand-primary`, muestra el pin y la tarjeta verde debajo del mapa, y no abre ninguna pestaña.
- [ ] Tocar un país selecciona su sociedad y muestra la misma tarjeta.
- [ ] "Visitar sitio web" abre la web de la sociedad en una pestaña nueva y no aparece si la sociedad no tiene `url`.
- [ ] Las filas no muestran el dominio, tienen el indicador de 12 px y `aria-pressed` refleja la selección.
- [ ] Si el filtro saca de la lista a la sociedad seleccionada, la tarjeta desaparece.
- [ ] No aparece el tooltip.

### Modo mouse

- [ ] Se ve "Pasa el cursor…" y no "Toca un país…".
- [ ] Hover o foco en una fila o un país muestra el tooltip, y el clic abre la web, como hoy.
- [ ] Las filas son links, muestran el dominio y no tienen indicador.
- [ ] En 1024, 1280 y 1536 px, el tooltip de cada uno de los 4 países queda dentro del recuadro del mapa.
- [ ] Desde 1024 px, el mapa se ve completo (799 px, sin recorte arriba ni abajo).
- [ ] Desde 1024 px, las capturas son iguales a la línea base, salvo el mapa sin recorte.

### General

- [ ] `touchSubtitle` es editable en `/admin`, en el hero de Miembros, con sus versiones EN y PT.
- [ ] Con `touchSubtitle` vacío, en táctil se ve `subtitle`.
- [ ] `npm run typecheck`, `npm run build:local` y `npm run check:standard` pasan sin errores.
- [ ] El JS de `/miembros/` no crece más de 1 KB gzip respecto de la línea base.
- [ ] No hay dependencias nuevas ni hex fuera de `tailwind.config.mjs`.
- [ ] No hay scroll horizontal en `/miembros/` en 320, 360, 390, 768, 1024, 1280 y 1536 px.

## Decisiones

- **Sí: modo táctil por puntero (`hover: hover` y `pointer: fine`), no por ancho.** Es la variante `can-hover` de Medical Digital. ERES también limita al mouse lo que solo funciona con mouse. Con el corte por ancho, una tablet táctil seguiría sin tooltip y sin tarjeta.
- **Sí: `touchSubtitle` como campo aparte.** El diseño tiene un texto para mouse y otro para toques. Se elige con CSS para que no salte al hidratar. No hay precedente en Medical ni en ERES.
- **Sí: mapa antes de la lista hasta `lg`.** Es el orden del diseño mobile. En tablet también va en una columna (como en Medical y ERES), y la tarjeta tiene que quedar junto al mapa.
- **Sí: el indicador y la tarjeta, solo en modo táctil.** El diseño desktop no los tiene, y con mouse el tooltip y el dominio ya cumplen esa función.
- **Sí: ajustes de desktop en esta spec.** Son los mismos dos archivos. El recorte del mapa existe hoy (799 px en 780 útiles).
- **Sí: tocar la sociedad seleccionada no la deselecciona.** Así lo hace el diseño.
- **Sí: el presupuesto de JS se mide contra la línea base.** `/en/miembros` ya pesa 152 KB en `staging`, por encima de los 150 del estándar.
- **No: abrir la web al primer toque, como hoy.** En táctil no hay manera de ver la ubicación antes de salir del sitio.
- **No: decidir el modo con `ontouchstart` o `maxTouchPoints`.** Una laptop con pantalla táctil y mouse quedaría en modo táctil.
- **No: `clamp` del tooltip en JS, como el diseño.** Con CSS no hace falta medir, y el rango del diseño (110 px) no alcanza para un tooltip de 300 px.

## Riesgos

- **Hidratación en táctil.** Antes de hidratar, las filas son links: un toque muy rápido abre la web. Es lo que pasa hoy, y `MembersDirectory` ya hidrata con `client:load`.
- **Navegadores que mienten sobre el puntero.** Algunos Android con mouse o lápiz reportan `hover: none`. En ese caso funcionan con toques, que también sirve.
- **Varias sociedades en un país.** El mapa solo marca la primera. Hoy hay una por país; si Sagar agrega otra, se ve en la lista, pero el mapa no la elige.
- **Captura táctil en Playwright.** `hasTouch` no cambia `hover`/`pointer`. Las capturas táctiles necesitan emular `(hover: none)` con `page.emulateMedia` o con CDP.
