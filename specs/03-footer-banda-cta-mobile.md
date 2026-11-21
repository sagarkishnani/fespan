# SPEC 03 — Footer y banda CTA mobile

> **Estado:** Approved · **Depende de:** SPEC 02 · **Fecha:** 2026-11-20
> **Objetivo:** llevar el footer y la banda CTA al diseño mobile: acordeón de un grupo abierto, logo de 40 px, contacto y redes de 44 px, y banda con el isotipo a la derecha y el botón a todo el ancho.

## Alcance

### Dentro

1. **Footer `< md`.**
   - Padding de 48 px arriba y 32 abajo. Logo de 40 px.
   - Los 3 grupos de `footer.columns` van en acordeón, con borde superior e inferior `line`.
   - Cada título es un `<button>` de 56 px en `body-base` `text-accent`, con un chevron que rota 180°.
   - Los links van en `body-md` `text-content-muted` y miden como mínimo 44 px.
2. **Acordeón (patrón de ERES, spec 04).**
   - Al cargar, todos los grupos están cerrados, y abrir uno cierra el anterior (`openColumn`).
   - El título lleva `aria-expanded` y `aria-controls`.
   - El estado cerrado sale de CSS (`max-md:`), así que no hay parpadeo antes de hidratar.
   - El `<button>` es `md:hidden` y el título de desktop es un `<span>` `hidden md:block`.
   - El contenido se anima de `grid-template-rows: 0fr` a `1fr`, y sin transición con `prefers-reduced-motion`.
   - La isla pasa de `client:tina` a `client:visible`.
3. **"Estamos para ayudarte" `< md`.**
   - Va apilado con gap de 12 px.
   - El teléfono y el correo miden como mínimo 44 px, en `body-md`.
4. **Redes `< md`.**
   - "Síguenos en:" más `SocialLinks` de 44 px, con gap de 12 px.
5. **Barra legal `< md`.**
   - El copyright y "Desarrollado por" van apilados en `caption-sm`, igual que hoy.
6. **Banda CTA `< md`.**
   - `py` de 56 px.
   - Isotipo arriba a la derecha (`-right-[60px] -top-10`, 280 px, opacidad 0.08).
   - Título `heading-lg` (30 px a 390), sin cambio de clase.
   - Botón `btn-light btn-block`.
7. **Desde `md`, el footer y la banda quedan como hoy.**
   - Grilla de 2 columnas en tablet y de 5 desde `lg`, todas abiertas.
   - El isotipo se mantiene a la izquierda con 560 px.

### Fuera de alcance (para otras specs)

- **LinkedIn y otras redes.** Es contenido de `footer.social` en Tina, no código.
- **Cambios en el schema de `global`** o en los links de las columnas.
- **El banner de cookies mobile.**
- **El crédito a TWNSTUDIOS como logo SVG**, como en ERES.

## Modelo de datos

No hay datos de contenido nuevos ni cambios en el schema de Tina. El footer sigue leyendo `global.nav.logo`, `global.footer.columns`, `helpTitle`, `helpText`, `phone`, `email`, `social` y `legal`. La banda sigue leyendo `global.ctaBand`.

### Estado del acordeón

```ts
// FooterReact.tsx
const [openColumn, setOpenColumn] = useState<number | null>(null);
// null = todos cerrados. Tocar el abierto lo cierra; tocar otro lo reemplaza.
// id del panel: `footer-col-${i}` (aria-controls).
```

### Archivos que cambian

| Archivo | Cambio |
|---|---|
| `shared/FooterReact.tsx` | Agrega el estado `openColumn`. Cada columna lleva un `<button>` `md:hidden` con `ChevronDownIcon` y un `<span>` `hidden md:block` como título. Los links van en un panel `grid` con `max-md:grid-rows-[0fr]` cerrado y `grid-rows-[1fr]` abierto. Además se ajustan el padding, el logo, el contacto, las redes (`size="responsive"`) y la barra legal. |
| `shared/Footer.astro` | `client:tina` pasa a `client:visible`. |
| `shared/SocialLinks.tsx` | `SIZE_CLASSES` suma el tamaño `responsive` (`h-11 w-11 md:h-10 md:w-10`), que usa el footer. El drawer sigue con `lg`. |
| `shared/CtaBandReact.tsx` | El isotipo y el padding cambian por debajo de `md`, y el botón suma `btn-block`. |
| `CLAUDE.md` | Suma el footer a la lista de islas que hidratan y documenta el patrón del acordeón. |

No hay archivos nuevos ni dependencias nuevas. El chevron es `ChevronDownIcon` de `shared/icons`, que ya existe.

### Medidas

| Pieza | `< md` | `md`–`lg` | `≥ lg` |
|---|---|---|---|
| Padding del footer | 48 / 32 px | 80 / 40 (hoy) | 80 / 40 (hoy) |
| Logo | 40 px | 104 (hoy) | 104 (hoy) |
| Columnas | Acordeón | 2 columnas abiertas | 5 columnas abiertas |
| Título de columna | `<button>` de 56 px | `<span>` | `<span>` |
| Links | `body-md`, mín. 44 px | `body-sm` (hoy) | `body-sm` (hoy) |
| Redes | 44 px | 40 (hoy) | 40 (hoy) |
| Padding de la banda | 56 px | 80 (hoy) | 120 (hoy) |
| Isotipo de la banda | Derecha, 280 px, 0.08 | Izquierda, 560 px, 0.07 | Igual |
| Botón de la banda | Ancho completo | Auto | Auto |

La transición del acordeón dura 250 ms, igual que el diseño (`fsFade .25s` y el chevron en `.25s`). Con `prefers-reduced-motion` no hay transición.

## Plan de implementación

Cada paso deja el sitio compilando y se puede commitear por separado.

1. **Línea base visual.** Con `npm run build:local` y `astro preview`, capturar el footer y la banda CTA de la home, Contacto y una página legal en 320, 390, 768, 1024, 1280 y 1536 px. El script va fuera del repo, igual que en las specs anteriores.
2. **Hidratar el footer.** En `Footer.astro`, `client:tina` pasa a `client:visible`. Verificar que el footer se ve igual que en la línea base y que en `/admin` sigue siendo editable.
3. **Acordeón: estructura.** En `FooterReact.tsx`, agregar `openColumn`, el `<button>` `md:hidden` con `aria-expanded`/`aria-controls` y el `<span>` `hidden md:block`. Los links van en el panel `grid` cerrado por `max-md:grid-rows-[0fr]`. Probar en 390 px que abre y cierra con un solo grupo abierto, y en 768 y 1280 que todo sigue abierto como en la línea base.
4. **Acordeón: animación.** Transición de 250 ms de `grid-template-rows` y rotación de 180° del chevron, con `motion-reduce:transition-none`.
5. **Resto del footer `< md`.** Padding 48/32, logo de 40 px, links en `body-md` de 44 px, el bloque de contacto apilado con gap de 12 px, las redes en `size="responsive"` y la barra legal. Desde `md`, comparar con la línea base: sin cambios.
6. **Banda CTA `< md`.** `py` de 56 px, isotipo a la derecha con 280 px y opacidad 0.08, y el botón con `btn-block`. Desde `md`, comparar con la línea base: sin cambios.
7. **`CLAUDE.md` del repo.** Sumar el footer a las islas que hidratan y documentar el patrón del acordeón (cierre en `max-md:`, `<button>` y `<span>` por breakpoint, un grupo abierto).

## Criterios de aceptación

**Footer**

- [ ] En 390 px, el footer tiene 48 px de padding arriba y 32 abajo, y el logo mide 40 px de alto.
- [ ] En 390 px, al cargar, los 3 grupos están cerrados y no se ven sus links, ni siquiera antes de hidratar (probado con JS desactivado).
- [ ] Cada título mide 56 px y es un `<button>` con `aria-expanded` y `aria-controls`, que apunta a su panel.
- [ ] Tocar un grupo lo abre y gira el chevron 180°. Tocar otro cierra el primero. Tocar el abierto lo cierra.
- [ ] Los links abiertos miden como mínimo 44 px y llevan a su página en el idioma actual.
- [ ] Con `prefers-reduced-motion: reduce`, el acordeón abre y cierra sin transición.
- [ ] En 768 y 1280 px no hay `<button>` visible y todas las columnas se ven abiertas, igual que en la línea base.
- [ ] El teléfono abre `tel:`, el correo abre `mailto:` y los dos miden como mínimo 44 px en 390 px.
- [ ] En 390 px las redes miden 44 px; desde 768 px, 40 px, como en la línea base.
- [ ] Los títulos, los links, "Estamos para ayudarte" y el copyright se ven traducidos en `/en/` y `/pt/`.

**Banda CTA**

- [ ] En 390 px, la banda tiene 56 px de padding vertical, el isotipo arriba a la derecha con 280 px y el botón ocupa todo el ancho.
- [ ] Desde 768 px, la banda se ve igual que en la línea base.
- [ ] "Conversemos" lleva a `/contacto` en el idioma actual.

**Repo**

- [ ] `npm run typecheck`, `npm run build:local` y `npm run check:standard` pasan sin errores.
- [ ] No hay dependencias nuevas en `package.json`.
- [ ] No hay hex en los archivos que cambian.
- [ ] Los títulos de las columnas, los links, el bloque de ayuda, el copyright y la banda siguen editables en `/admin` (`data-tina-field`).
- [ ] No hay scroll horizontal en 320, 360, 390, 768, 1024, 1280 y 1536 px, con los grupos abiertos o cerrados.
- [ ] El `CLAUDE.md` lista el footer entre las islas que hidratan y documenta el patrón del acordeón.

## Decisiones

- **Sí: el patrón de acordeón de ERES (spec 04).** Es el único proyecto del equipo que ya lo resolvió. Medical Digital no tiene acordeón: en mobile muestra 2 columnas abiertas.
- **Sí: el estado cerrado en CSS (`max-md:grid-rows-[0fr]`).** Evita que los grupos aparezcan abiertos y se cierren al hidratar.
- **Sí: `<button>` `md:hidden` y `<span>` `hidden md:block` por separado.** Así, desde `md`, no queda un `aria-expanded` falso sobre columnas que siempre están abiertas.
- **No: `<details>`/`<summary>`.** Desde `md` habría que forzar los grupos abiertos, y no hay CSS fiable para eso en todos los navegadores. Tampoco deja un solo grupo abierto sin JS.
- **No: un script vanilla en `BaseLayout`.** Sumaría un patrón aparte para una sola pieza, cuando el repo ya resuelve lo interactivo con islas.
- **Sí: la isla del footer con `client:visible`.** El acordeón lo necesita. React ya está cargado por el header (`client:load`), así que solo suma el chunk del footer. Se mide el JS de la home antes y después y se anota en el PR.
- **Sí: un solo grupo abierto y todos cerrados al cargar.** Así lo hace el diseño (`footOpen: null`), igual que ERES.
- **Sí: chevron que rota 180° en 250 ms.** Es el del diseño de FESPAN. ERES usa un `+` que rota 45°, pero eso es identidad de ERES.
- **Sí: el acordeón y los cambios de tamaño solo por debajo de `md`.** El tablet usa los bloques de desktop en 2 columnas (spec 01), y desktop ya coincide con la referencia.
- **Sí: el tamaño `responsive` en `SocialLinks`.** Pasar `lg` en el footer agrandaría las redes también en desktop, y la referencia desktop usa 40 px.
- **Sí: links en `body-md` (16 px) por debajo de `md`.** Es lo que pide el diseño mobile, y el token ya existe.
- **No: agregar LinkedIn.** El diseño mobile solo muestra Facebook e Instagram, que es lo que hay en `footer.social`. Sumar redes es contenido que se carga en Tina.
- **No: cambiar el schema o los links de las columnas.** El contenido actual ya coincide con los grupos del diseño.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Pasar a `client:visible` rompe la edición visual del footer en `/admin`. | En el editor, `client:visible` también hidrata con `useTina`. Se verifica en el paso 2, antes de tocar el layout. |
| `grid-template-rows` con `0fr` deja los links enfocables con el grupo cerrado. | El panel cerrado lleva `overflow-hidden` y el contenido `invisible` en `max-md:` mientras está cerrado. Así, `Tab` no entra en un grupo cerrado. |
| El isotipo a la derecha genera scroll horizontal en 320 px. | La banda ya tiene `overflow-hidden`. Se revisa en 320 px en el paso 6. |
| La isla suma JS en todas las páginas. | Solo carga el chunk del footer, porque React ya está en la página. Se mide en la home y se anota en el PR. |

## Lo que **no** entra en esta spec

- LinkedIn y otras redes (contenido en Tina).
- Cambios en el schema de `global` o en los links de las columnas.
- El banner de cookies mobile.
- El crédito a TWNSTUDIOS como logo SVG.
- Cambios en el footer y la banda desde `md`.

Cada una de esas piezas, si llega, va en su propia spec.
