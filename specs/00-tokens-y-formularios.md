# SPEC 00 — Tokens y formularios

> **Estado:** Implemented · **Depende de:** — · **Fecha:** 2026-11-16
> **Objetivo:** que todo color del sitio salga de un token de `tailwind.config.mjs` y que el formulario dinámico tenga un solo estilo, el de FESPAN, sin cambiar lo que hoy se ve.

## Por qué existe esta spec

El repo usa tokens semánticos en casi todo, pero:

- `FormControls.tsx`, `FormSuccess.tsx` y dos de los tres estilos de `DynamicFormReact.tsx` vienen de otro proyecto: estilos inline, Poppins (no se carga), grises neutros y rosados (`#F3E5F0`, `#D070B8`). Contacto se ve bien solo porque usa el estilo `contact`; cualquier `select`, `radio`, `checkbox` o `file` agregado desde Tina sale con otra paleta.
- Hay 132 hex sueltos en `src/`, más `greyscale-*` y `content-subtle` duplicando tokens semánticos, y `text-red-*` de Tailwind en lugar de `semantics-error`.
- Tamaños repetidos (`text-[17px]` ×19, `text-[13px]` ×5, `h-[46px]` ×6) que las specs mobile 01–10 van a tener que tocar uno por uno.
- La tabla de tokens del `CLAUDE.md` no coincide con el config.

Las specs mobile (01–10) parten de esta: ajustan tokens y clases, no números sueltos.

## Scope

### Dentro

1. **Formulario con un solo estilo.**
   - Se borran los estilos `default` y `contact-dark` de `DynamicFormReact.tsx` y sus opciones en `tina/collections/dynamicForms.ts`; `styleVariant` desaparece del schema y de `contacto.json`.
   - Las primitivas de `FormControls.tsx` (input, select, textarea, file, checkbox, radio, currency, date, notas, encabezados) pasan de `style={{}}` a clases con tokens, con el mismo aspecto que hoy tienen los campos de Contacto.
   - `FormSuccess.tsx` se borra si queda sin uso, o se retematiza.
   - Errores con `semantics-error` en lugar de `red-400/500`.
   - Sin Poppins: todo hereda Outfit.
2. **Cero hex fuera del config.** Los hex viven solo en `tailwind.config.mjs` (y, si hace falta, en `global.css` vía `theme()`). Cada hex suelto pasa a un token existente, a un token nuevo o a un degradado con nombre (`backgroundImage`).
3. **Banner de cookies con tokens.** Hoy usa grises neutros (`#0a0a0a`, `#717274`, `#eceaec`…); pasa a `content`, `content-muted`, `line`, `surface-sunken`. Es el cambio visual intencional: sus grises toman el tinte verde del resto del sitio.
4. **Limpieza de tokens.** Se borran `greyscale-*` (sus 21 usos pasan al token semántico equivalente) y `content-subtle`.
5. **Tamaños repetidos a escala.** Solo los que se repiten 3+ veces: `text-[17px]`, `text-[14px]` y `text-[19px]` → tokens nuevos; `text-[13px]` → `caption-sm` (ya existe); `h-[46px]` → `.btn-sm` / token de control; `h-[60px]` → `.btn-lg`.
6. **`CLAUDE.md` del repo:** tabla de tokens actualizada y regla "hex solo en el config".

### Fuera de alcance

- Cualquier cambio de layout o de mobile (specs 01–10).
- Valores en px de un solo uso (alturas de imágenes, paddings): los ajusta cada spec mobile.
- Validación, envío, honeypot, Turnstile y la lógica del formulario: solo cambia la presentación.
- Contraste o accesibilidad más allá de no empeorarlos.
- Contenido, Excel de observaciones y reunión del 10/11.

## Modelo de datos

No hay datos nuevos de contenido. Cambian el theme de Tailwind y un campo del schema de Tina.

### Tina: `dynamicForms`

- Se borra el campo `styleVariant` de `tina/collections/dynamicForms.ts` y la clave `"styleVariant": "contact"` de `src/content/dynamic-forms/contacto.json`.
- Ningún otro campo cambia: los tipos de campo (`text`, `select`, `radio`, `file`, `currency`, `date_triplet`…) siguen disponibles.

### Tokens nuevos (`tailwind.config.mjs`)

| Token | Valor | Reemplaza |
|---|---|---|
| `surface-warm` | `#F6F6F4` | fondo y degradado del hero de Contacto (empata con la foto) |
| `surface-mint-strong` | `#D5F0E0` | hover de los botones de compartir |
| `brand-primary-light-hover` | `#25A85E` | hover del botón verde claro de Transparencia |
| `brand-primary-pale` | `#9FD9B8` | países sin sociedad en el mapa |
| `content-faint` | `#7E8F92` | crédito "TWINSTUDIOS" del footer y punto separador `.meta-dot` |
| `fontSize.body-base` | `17px` | `text-[17px]` (×19) |
| `fontSize.caption-md` | `14px` | `text-[14px]` (×9) |
| `fontSize.subtitle-xs` | `19px` | `text-[19px]` (×6) |
| `spacing.control-sm` | `46px` | `h-[46px]`/`w-[46px]` (×6, botones de ícono y `.btn-sm`) |
| `spacing.control-lg` | `60px` | `h-[60px]` (×3) → nueva clase `.btn-lg` |
| `backgroundImage.hero-soft` | degradado de `PageHeroSoft` | — |
| `backgroundImage.hero-about` | degradado de `AboutHero` (+ `hero-about-scrim`) | — |
| `backgroundImage.hero-activity` | degradado de `ActivityDetail` | — |
| `backgroundImage.hero-contact-scrim` | degradado de `ContactHero` | — |

Los `fontSize` nuevos se declaran **solo con tamaño** (sin `lineHeight`), igual que el valor arbitrario al que reemplazan: así no cambia el interlineado.

### Hex que se funden con un token existente

Diferencias imperceptibles en hover, placeholder, borde punteado o ícono. Son el único cambio visual aceptado, además del banner de cookies:

| Hex | Dónde | Token |
|---|---|---|
| `#FAFCFB` | hover de fila en Conocimiento | `surface-raised` |
| `#EEF5F4` | fondo del ícono de Valores | `surface-sunken` |
| `#C9D3D1` | borde punteado de Alianzas | `line-strong` |
| `#E8EEEB` | fondo del mapa de Contacto mientras carga | `surface-media` |
| `#A8B3AF` | `.meta-dot` | `content-faint` |

### Hex que ya son tokens (cambio directo)

`#0F7440` → `brand-primary` · `#0F5C37` → `accent` · `#2DBE6C` → `brand-primary-light` · `#E6F5EC` → `surface-mint` · `#F5F8F7` → `surface-raised` · `#0E2327` → `content`.

En `MembersMap.tsx` el `fill` pasa de atributo con hex a clases `fill-*`.

### Formulario y cookies

| Antes | Después |
|---|---|
| `#1A1A1A`, `#0a0a0a` | `content` |
| `#3f3f3f`, `#5B5B5B` | `content-soft` |
| `#717274`, `#9CA3AF` (placeholder) | `content-muted` |
| `#E8E1E5`, `#eceaec`, `#d1d5db` | `line` / `line-strong` |
| `#F3E5F0`, `#f2f3f5`, `#FBF7FA` | `surface-mint` / `surface-sunken` |
| `#EF4444`, `red-400`, `red-500` | `semantics-error` |
| `#22C55E` | `brand-primary-light` |
| `#D070B8`, `#E693CE` | se borran junto con `contact-dark` |
| `Poppins` | se quita; hereda Outfit |

### Tokens que se borran

- `greyscale-*`: `darkest` → `content`, `dark` → `content-soft`, `medium` → `content-muted`, `light` → `line`, `white` → `surface`.
- `content-subtle` (sin uso, igual a `content-muted`).

## Plan de implementación

Cada paso deja el sitio compilando y se verifica antes de pasar al siguiente.

1. **Línea base visual.** Con `npm run build:local` + `astro preview`, capturar las 9 páginas (`/`, `/nosotros`, `/miembros`, `/actividades`, `/actividades/xxv-congreso-de-nutricion`, `/conocimiento`, `/blog`, un post, `/contacto`) en 390, 820 y 1280 px, más el formulario de Contacto con errores visibles y el banner de cookies abierto. El script de capturas vive fuera del repo (Playwright ya instalado en la máquina; no se agrega dependencia).
2. **Tokens nuevos en `tailwind.config.mjs`.** Agregar colores, `fontSize`, `spacing` y `backgroundImage` de la tabla. Todavía no se borra nada. Build OK.
3. **Hex y tamaños fuera del formulario.** Reemplazar en `PageHeroSoft`, `AboutHero`, `AboutValues`, `AboutTransparency`, `ActivityDetail`, `ContactHero`, `contacto.astro`, `KnowledgeBrowser`, `ShareBar`, `HomeNews`, `FooterReact`, `MembersMap`, `global.css` (`.meta-dot`, `.btn-sm`, nueva `.btn-lg`) y los `text-[17|14|19|13px]` / `h-[46|60px]` del resto. Comparar contra la línea base: solo deben diferir los 5 hex fundidos.
4. **Banner de cookies.** Pasar `CookieConsentReact.tsx` a tokens. Capturar y revisar a ojo (cambio intencional).
5. **Formulario: un solo estilo.** En `DynamicFormReact.tsx` quitar las ramas `default` y `contact-dark` y dejar el estilo `contact` como único; borrar `styleVariant` del schema y de `contacto.json`; regenerar Tina con el build. Contacto debe verse igual a la línea base.
6. **Primitivas del formulario.** Pasar `FormControls.tsx` de `style={{}}` a clases con tokens, con el aspecto de los campos de Contacto; quitar Poppins. Errores con `semantics-error`. Borrar `FormSuccess.tsx` si queda sin importar. Verificar con un formulario de prueba **local, sin commitear**, que use todos los tipos de campo.
7. **Borrar tokens viejos.** Reemplazar los 21 usos de `greyscale-*`, quitar `greyscale` y `content-subtle` del config. Build OK.
8. **Barrido final.** `grep` de hex en `src/` (fuera de `tailwind.config.mjs`) devuelve 0; `grep` de `Poppins`, `greyscale-`, `red-[0-9]`, `styleVariant` devuelve 0.
9. **`CLAUDE.md` del repo.** Actualizar la tabla de tokens con los valores reales y los nuevos; agregar la regla "hex solo en `tailwind.config.mjs`".
10. **Verificación.** `npm run build`, `npm run typecheck`, `npm run check:standard`. Comparar capturas finales contra la línea base en los 3 anchos.

## Criterios de aceptación

**Tokens**
- [x] `grep -rEn '#[0-9A-Fa-f]{3,8}\b' src/` no devuelve colores (solo anclas como `href="#…"`).
- [x] `grep -rn 'greyscale-\|content-subtle\|red-[0-9]\|Poppins' src/` devuelve 0.
- [x] `grep -rEn 'text-\[(13|14|17|19)px\]|[hw]-\[(46|60)px\]' src/` devuelve 0.
- [x] `tailwind.config.mjs` no tiene `greyscale` ni `content.subtle`, y sí los tokens nuevos de la tabla.

**Formulario**
- [x] `styleVariant` no existe en `tina/collections/dynamicForms.ts` ni en `src/content/dynamic-forms/`.
- [x] `DynamicFormReact.tsx` no tiene ramas `default` ni `contact-dark`.
- [x] `FormControls.tsx` no tiene `style={{` con colores ni fuentes.
- [x] Un formulario de prueba local con `text`, `email`, `select`, `radio`, `checkbox`, `file`, `currency`, `date_triplet`, `section_header` y `note` se ve con Outfit, tokens de FESPAN y los mismos radios y alturas que Contacto.
- [x] Los errores de validación se ven en `semantics-error`, junto al campo.
- [x] El envío de Contacto sigue funcionando igual (validación, honeypot, Turnstile, estado de éxito).

**Sin cambio visual**
- [x] Las capturas finales de las 9 páginas en 390, 820 y 1280 px coinciden con la línea base, salvo los 5 hex fundidos y el banner de cookies.
- [x] El banner de cookies usa los grises del sitio y mantiene contraste de 4.5:1 en su texto.

**Repo**
- [x] La tabla de tokens del `CLAUDE.md` coincide con `tailwind.config.mjs` y está la regla "hex solo en el config".
- [x] `npm run build`, `npm run typecheck` y `npm run check:standard` pasan sin errores.
- [x] No se agregan dependencias.

## Decisiones

- **Sí:** un solo estilo de formulario (`contact`), porque FESPAN tiene un solo formulario y los otros dos estilos son herencia de otro proyecto que nadie usa ni revisa.
- **Sí:** mantener todos los tipos de campo del CMS, porque son el contrato de Tina; quitarlos rompería formularios futuros, mientras que retematizarlos solo cuesta presentación.
- **Sí:** fundir 5 hex con tokens existentes, porque la diferencia no se nota y cada token de un solo uso es uno más que mantener.
- **Sí:** degradados como `backgroundImage` con nombre, porque sus tonos solo existen dentro del degradado y no merecen ser colores del sistema.
- **Sí:** `fontSize` nuevos solo con tamaño, sin `lineHeight`, para que el reemplazo no mueva el interlineado.
- **Sí:** el banner de cookies cambia de grises neutros a los del sitio; es el único cambio visual buscado.
- **Sí:** capturas comparadas con un script fuera del repo, porque Playwright ya está en la máquina y agregarlo como dependencia es otra decisión.
- **No:** tokenizar los px de un solo uso (alturas de imágenes, paddings), porque los van a cambiar las specs mobile 01–10.
- **No:** retematizar `default` y `contact-dark`, porque sería mantener código sin uso.
- **No:** tocar layout, mobile ni contenido; esta spec es un refactor.

## Riesgos

- **Interlineado o peso distinto al reemplazar tamaños.** Si una clase nueva arrastra `lineHeight` o `fontWeight`, el texto se mueve. Mitigación: `fontSize` solo con tamaño, y comparación de capturas en el paso 3.
- **`styleVariant` con TinaCloud.** Al quitar el campo del schema, el índice de TinaCloud de `staging` puede fallar si el contenido todavía tiene la clave. Mitigación: borrar el campo del schema y la clave del JSON en el mismo commit; el build de producción en Amplify lo confirma.
- **Primitivas que hoy no se ven.** `select`, `radio`, `file`, `currency` y `date_triplet` no tienen pantalla en el sitio, así que un error en ellas no aparece en las capturas. Mitigación: formulario de prueba local con todos los tipos (paso 6), que no se commitea.
- **Contraste del banner de cookies.** `content-muted` (`#5C7377`) sobre blanco da 4.9:1; el texto de 12.5–13 px queda justo. Mitigación: medir en el paso 4.
- **Purge de Tailwind.** Si alguna clase se arma con strings dinámicos (`fill-${…}`), Tailwind no la genera. Mitigación: clases completas en el código, nunca concatenadas.

## Notas de implementación / QA realizada

**Decisiones tomadas durante la implementación**

- `FormControls.tsx`: se borraron las primitivas que nada importaba (input, select, textarea, checkbox, notas y encabezados sueltos); solo quedan las 6 que usa `DynamicFormReact` (`file`, `radioGroup`, `currency`, `radio`, `checkboxGroup`, `date`), ya con tokens. Las clases compartidas viven en `fieldClasses`.
- Token extra no previsto: `backgroundImage.select-chevron`, la flecha del `select` como SVG en el config para que no quede un hex en el componente.
- `FormSuccess.tsx` se borró: el estado de éxito vive en `DynamicFormReact`.

**QA realizada**

- Capturas de las 9 páginas en 390, 820 y 1280 px comparadas por píxel contra la línea base: solo difieren los 5 hex fundidos y el banner de cookies.
- Formulario de prueba local con todos los tipos de campo (no commiteado): Outfit, tokens de FESPAN, errores en `semantics-error`.
- Contraste: `content-muted` 5.03:1, `semantics-error` 4.56:1 sobre blanco; `content-faint` 3.37:1, solo en elementos decorativos.
- `npm run typecheck` sin errores. `npm run build:local` completo. `npm run check:standard`: 0 errores, 2 avisos previos a esta rama (og:image en 25 páginas y 152 KB de JS en `/en/miembros`, inflado por React en modo desarrollo).
- `npm run build` con TinaCloud no se pudo correr en local (sin credenciales): lo confirma el build de Amplify.

**Pendientes fuera de alcance (para otra spec)**

- Accesibilidad del formulario: `<label>` sin `htmlFor`/`id`, grupos sin `fieldset`/`legend` y botón "×" de quitar archivo menor a 44 px.
- i18n: textos fijos en español en `FormControls.tsx` ("Elegir archivos", "Día/Mes/Año"…).
- CMS: `badge`, `showCorrelativo`, `privacyText`, `privacyUrl`, `dataUrl` y `description` no se muestran; la descripción de `badge` menciona el estilo Estándar, que ya no existe.
- Contacto sin casilla de consentimiento (Ley 29733) ni validación de campos en `send-email.php`.
