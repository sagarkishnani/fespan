# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Comandos

```bash
npm run dev        # TinaCMS + Astro (siempre juntos: /admin necesita el server de Tina)
npm run build      # tinacms build → astro build
npm run preview     # previsualiza el build de producción
```

No hay test runner configurado.

## Entorno

Copia `.env.example` a `.env`. Deja `TINA_CLIENT_ID`/`TINA_TOKEN` vacíos para
trabajar en **modo local** (Tina lee y escribe los archivos de `src/content/`
sin cuenta en la nube).

**`TINA_BRANCH` importa más de lo que parece.** TinaCloud indexa el contenido
**por rama**, y el valor se hornea dentro de `tina/__generated__/client.ts` al
correr `tinacms build`: *no* se lee en runtime. Compilar un árbol contra el
índice de otra rama falla si los schemas difieren.

## Flujo de trabajo

### Ramas

`main` es producción y `staging` la línea de desarrollo. Las ramas de trabajo
**siempre salen de `staging` actualizado** y se PR-ean contra `staging`:

```
tipo/descripcion-corta
```

| Tipo | Cuándo |
|------|--------|
| `feat/` | Nueva funcionalidad |
| `fix/` | Corrección de error |
| `chore/` | Mantenimiento, dependencias, configuración, limpieza |

Ejemplos: `feat/formulario-contacto`, `fix/total-checkout-igv`,
`chore/actualizar-dependencias`. Minúsculas, palabras separadas por guiones, sin
tildes ni espacios.

### Commits

Conventional Commits, descripción **en presente y en español**:

```
tipo(alcance opcional): descripción en presente
```

```
feat: agrega formulario de contacto
fix(checkout): corrige cálculo del total con IGV
chore: actualiza dependencias
```

### Código sin comentarios

El código tiene que explicarse solo: nombres claros de variables, funciones y
componentes, y funciones pequeñas con una sola responsabilidad. **No agregues
comentarios** salvo que sea estrictamente necesario, es decir, cuando expliquen
un *por qué* que el código no puede expresar (un workaround de un bug externo,
una restricción de una API, una decisión no obvia). Nunca comentes *qué* hace
el código, no dejes código comentado y no agregues comentarios de sección o
decorativos. Si algo parece necesitar un comentario, primero renombra o extrae.

## Arquitectura

**Astro 5 SSG + React 19 (islas) + TinaCMS 2 (CMS sobre git)**

El sitio se compila estático (sin adaptador SSR). Todo lo dinámico en runtime es
una isla de React hidratada.
La excepción son los formularios, que hablan con el backend PHP (ver **Formularios**).

### Patrón de componente doble

Cada sección alimentada por el CMS son dos archivos:

- `Componente.astro` — resuelve la consulta a TinaCMS **en build time** con
  `client` de `tina/__generated__/client` y pasa `{ query, variables, data }`.
- `ComponenteReact.tsx` — recibe esas props y renderiza; envuelve el contenido en
  `useTina()`, que es lo que habilita la edición visual en el panel.

Las secciones estáticas usan `client:tina` (en producción no cargan React);
solo hidratan en el navegador el header, el video de la home, los carruseles, los listados con
filtros (blog, conocimiento, miembros), el formulario y el botón de compartir.
Las animaciones de entrada son `data-reveal` + un script vanilla en
`BaseLayout` (y `data-count` para los contadores).

Directivas de hidratación: `client:load` arriba del fold, `client:visible`
debajo. `client:tina` (integración propia en `astro-tina-directive/`) hidrata
**solo dentro del editor de Tina**: en producción no carga React.

Las secciones de una misma página comparten una sola consulta: la página la
resuelve y se la pasa a cada isla (ver `src/pages/index.astro`).

### Contenido y colecciones

El contenido vive en `src/content/` como JSON (páginas estructuradas).
Los artículos del blog son MDX en `src/content/blog/`.
El schema de `tina/config.ts` es la única fuente de verdad sobre la forma del
contenido; cada colección vive en su propio archivo en `tina/collections/`.
Los tipos, las queries y el cliente se generan en `tina/__generated__/`
(**no editar a mano**).

Colecciones:

- `global` — navegación, banda CTA, footer, SEO por defecto, código inyectado.
- Páginas (documento único): `home`, `about` (Nosotros), `activitiesPage`,
  `knowledgePage`, `membersPage`, `contactPage`, `blogPage`.
- `activity` — congresos y formaciones (`/actividades/<slug>`).
- `knowledgeDoc` — guías e investigaciones (`/conocimiento`).
- `society` — sociedades miembro; `countryCode` decide la silueta del mapa
  (`src/data/america-map.json` + `src/data/countryPins.ts`).
- `post` — artículos del blog en MDX (`src/content/blog/`), con plantillas
  `Callout`, `Figure` y `Quote` en el cuerpo.
- `legal` — páginas legales en MDX (`/legal/<slug>`).
- `formConfig` — por formulario: `formType`, `label`, `enabled`, `recipients[]`.
- `dynamicForms` — definición completa de cada formulario (un JSON por formulario).
- `maintenance` — modo mantenimiento del sitio.
- `cookieConsent` — textos del banner de cookies.

### Formularios (definidos en el CMS)

Los formularios no están hardcodeados:

- Cada uno es un JSON de `dynamicForms` con `fields[]` ordenados (`text`, `email`,
  `select`, `radio`, `checkbox`, `file`, `currency`, `date_triplet`,
  `section_header`, `note`…), con `validation`, `width` y visibilidad
  condicional por campo (`conditionalField`).
- `dynamic-form/DynamicForm.astro` carga un formulario por `formSlug` y lo
  renderiza con `DynamicFormReact.tsx`, que arma la UI con las primitivas de
  `shared/FormControls.tsx`.
- El envío pasa por `src/utils/submitForm.ts` → `POST` a **`send-email.php`**
  (JSON normalmente; `multipart/form-data` si hay adjuntos). Incluye honeypot
  (`website`) y token de Turnstile.
- `src/pages/form-config.json.ts` emite `/form-config.json` en build time: el
  mapa de destinatarios que lee el backend PHP.

**Secretos**: viven solo en `public/site-config.php` (git-ignored, plantilla en
`public/config.example.php`). `send-email.php` hace `require` de ese archivo.

**Captcha (Cloudflare Turnstile)**: el widget usa la site key **pública** de
`PUBLIC_TURNSTILE_SITE_KEY`; `send-email.php` verifica el token contra
`siteverify` con `turnstile_secret` y **falla cerrado** (token inválido o
`siteverify` inalcanzable ⇒ no se envía correo), solo mientras el secreto esté
configurado.

### Modo mantenimiento

`BaseLayout.astro` consulta la colección `maintenance` en build time; con
`enabled: true` reemplaza todo el cuerpo de la página por una pantalla de aviso.

### Estilos

Tailwind CSS 3 con tokens propios en `tailwind.config.mjs`. Las clases
reutilizables (`btn-primary`, `btn-secondary`, `card`, `section`, `container-xl`,
`container-lg`) están en `src/styles/global.css`, que **BaseLayout importa** —
un CSS que nadie importa no se bundlea y no llega al sitio.

Iconos: `react-icons` (Font Awesome 6, `react-icons/fa6`).

**Tramos**: móvil `< md` (menos de 768 px, referencia mobile), tablet
`md`–`lg` (768–1023 px, bloques de desktop en 2 columnas) y desktop `≥ lg`
(1024 px o más, referencia desktop). Los carruseles pasan a desktop en `lg`.
El header pasa a desktop en `xl` (1280 px): entre 1024 y 1279 px no entran los
seis enlaces, el buscador, el idioma y el CTA.

**Header**: 64 px por debajo de `md`, 72 en `md` y 88 desde `lg`. Por debajo
de `xl` se oculta al bajar (`hooks/useHeaderVisibility.ts`) y el menú es
`shared/MobileDrawer.tsx`; por debajo de `md` la búsqueda abre
`shared/SearchOverlay.tsx`, y desde `md`, el dropdown de `SiteSearch`. Ambos
filtran con `hooks/useSiteSearch.ts`. El drawer y el overlay son hermanos del
`<header>`, nunca hijos: el `transform` que lo oculta volvería relativos a sus
hijos `fixed`.

**Paneles modales** (drawer, overlay y lo que venga): bloquean el scroll con
`lockScroll`/`unlockScroll` de `utils/scrollLock.ts`, que fija `overflow` en
`html` y detiene Lenis (`BaseLayout` expone la instancia en `window.lenis`;
sin eso la rueda sigue moviendo la página). `unlockScroll` es idempotente:
llámalo en el cleanup del efecto. El foco se atrapa con
`hooks/useFocusTrap.ts` y vuelve al botón que abrió el panel al cerrarlo.

**Gutter**: `container-xl/lg/md` usan `px-4 md:px-6` (16 px en móvil, 24 desde
`md`). Lo que sangra hasta el borde usa el mismo valor en negativo
(`-mx-4 md:-mx-6`).

**Títulos**: `display-xl`, `display-lg`, `display-md`, `heading-xl` y
`heading-lg` son `clamp()` cuyo mínimo (44, 40, 38, 34 y 30 px) solo actúa por
debajo de ~550 px. Un título usa un solo token: no cambies de clase por
breakpoint.

**Botones**: `.btn` mide 52 px en móvil y 56 desde `md`. `.btn-block` lo lleva
a ancho completo solo en móvil; úsalo donde el diseño mobile pida el botón a
todo el ancho, no por defecto. Tailwind solo emite la clase cuando algún
archivo la usa.

**Carrusel**: toda fila deslizable usa `shared/Carousel.tsx` (Embla vía
`hooks/useSlider.ts`), nunca un `snap-x` hecho a mano. Recibe las tarjetas como
`children`, el ancho móvil en `slideClassName` (p. ej. `w-[300px]`), la grilla
desde `lg` en `gridClassName` y un `label` traducido con `t()`. Embla está
activo por debajo de `lg`; desde `lg` es grilla sin arrastre. Sin flechas,
puntos ni autoplay. La isla que lo use se hidrata con `client:visible`, no
`client:tina`.

**Tema: light.** Los componentes NO escriben colores: piden tokens
semánticos, y por eso el tema se puede cambiar sin tocar una sola clase.

**Los hex viven solo en `tailwind.config.mjs`.** Ningún archivo de `src/` escribe
un hex (ni en clases arbitrarias `bg-[#…]`, ni en `style`, ni en atributos SVG
como `fill`/`stroke`): usa un token existente, agrega uno al config o, si el tono
solo existe dentro de un degradado, decláralo como `backgroundImage` con nombre.
En SVG usa clases (`fill-brand-primary`, `stroke-white`) o `currentColor`.

| Token | Para qué | Valor |
|---|---|---|
| `surface` | Fondo de la página | `#FFFFFF` |
| `surface-raised` | Tarjetas, footer, hover de filas | `#F5F8F7` |
| `surface-sunken` | Botones de ícono, chips, adjuntos | `#F1F4F3` |
| `surface-mint` / `surface-mint-strong` | Fondo verde suave / su hover | `#E6F5EC` / `#D5F0E0` |
| `surface-warm` | Fondo del hero de Contacto (empata con la foto) | `#F6F6F4` |
| `surface-media` | Contenedor de imagen o mapa mientras carga | `#DFE5E3` |
| `content` | Texto principal | `#0E2327` |
| `content-soft` | Texto secundario fuerte, labels | `#2F4A4E` |
| `content-muted` | Texto secundario, placeholders | `#5C7377` |
| `content-faint` | Decorativo (crédito del footer, `.meta-dot`); no apto para texto de lectura | `#7E8F92` |
| `line` / `line-strong` | Bordes | `#E3E9E8` / `#D6DFDD` |
| `accent` | Marca legible sobre el fondo | `#0F5C37` |
| `semantics-error` | Errores de validación | `#EB0E0E` |

`semantics-success`, `semantics-alert` y `semantics-error` tienen además
variantes `-dark` y `-lightest`.

Los tonos de texto cumplen 4.5:1 sobre su fondo (salvo `content-faint`, que es
decorativo). Si cambias uno, vuelve a medir.

**Nunca escribas `text-white/65` ni `bg-white/5`**: asumen fondo oscuro y rompen
el tema. Las únicas excepciones legítimas son los bloques con fondo oscuro fijo
(el scrim del hero sobre una foto, el degradado de marca del CTA) y el texto
sobre `bg-brand-primary`. El scrim de los paneles modales usa `bg-content/40`:
siempre va sobre la página, así que también es una excepción.

Para "texto en color de marca" usa `text-accent`, **no** `text-brand-primary-light`:
sobre fondo claro ese tono es ilegible.

**Rampa de marca**: `brand-primary-darkest` (`#0E2327`), `brand-primary-dark`
(`#0F5C37`), `brand-primary` (`#0F7440`), `brand-primary-light` (`#2DBE6C`,
hover `brand-primary-light-hover` `#25A85E`), `brand-primary-pale` (`#9FD9B8`,
países sin sociedad en el mapa), `brand-primary-lightest` (`#E6F5EC`).

**Degradados** (`backgroundImage`): `hero-soft`, `hero-about`, `hero-about-scrim`,
`hero-activity`, `hero-contact-scrim` y `select-chevron` (flecha de los `select`).

**Tipografías**: Outfit (títulos), Outfit (cuerpo),
Space Mono (acentos técnicos). La escala está como utilidades de Tailwind
(`display-xl` → `caption-sm`). `body-base` (17px), `subtitle-xs` (19px) y
`caption-md` (14px) solo fijan el tamaño: heredan interlineado y peso. No uses
`text-[Npx]` para un tamaño que ya tiene token.

**Controles**: `h-control-sm` (46px, botones de ícono y `.btn-sm`) y
`h-control-lg` (60px, `.btn-lg`).

**Formularios**: un solo estilo. Las clases de campo (`fieldClasses` en
`shared/FormControls.tsx`) son la referencia para cualquier campo nuevo.

### Internacionalización (ES / EN / PT)

`es` es el idioma por defecto y vive en la raíz;
`en` vive bajo `/en/` y `pt` bajo `/pt/`. Cada campo cae al idioma
por defecto cuando no hay traducción.

- **Astro i18n** (`astro.config.mjs`): `prefixDefaultLocale: false` y **sin
  `fallback`** — en salida estática el fallback genera redirects, no páginas.
- **Las páginas `/en` y `/pt` son reales**: wrappers en
  `src/pages/en/**` y `src/pages/pt/**` que importan la página del idioma por defecto
  y renderizan `<Page />`; las rutas dinámicas re-exportan `getStaticPaths`.
  **Al agregar una ruta nueva, agrega también su wrapper.**
- **Detección de idioma**: `BaseLayout` calcula el locale
  (`Astro.currentLocale` → `getLocale(Astro.url)`) y lo pasa como prop a las
  islas; los componentes no leen `currentLocale` por su cuenta.
- **Helpers** (`src/utils/i18n.ts`): `getLocale`, `localizedPath`,
  `localizeHref`, `tField`, `richField`. Todos conscientes de `BASE_URL`.
- **Convención `_en` / `_pt`**: cada campo traducible del CMS tiene hermanos
  opcionales `<campo>_en` y `<campo>_pt`. En el schema se declaran con
  `localized()` / `translations()` de `tina/collections/localized.ts`, que
  los genera a partir de `TRANSLATED_LOCALES`. Vacío ⇒ idioma por defecto.
  Se leen con `tField(obj, 'campo', locale)`; los rich-text con
  `richField(...)` (un `tField` devolvería un objeto, y Tina entrega un
  rich-text vacío pero *truthy* cuando la traducción no existe).
- **Textos de UI que no están en el CMS**: `src/i18n/ui.ts` → `t(key, locale)`;
  áreas, categorías y países con `translateTerm(valor, locale)`.
- **Agregar un idioma**: súmalo a `LOCALES` en `src/i18n/config.ts` y a
  `astro.config.mjs`, crea sus wrappers en `src/pages/<código>/` y su tabla en
  `ui.ts` y en `FORM_UI` de `DynamicFormReact.tsx`.

### Panel del CMS

Disponible en `/admin` con `npm run dev`. Las imágenes se suben a `public/`.
