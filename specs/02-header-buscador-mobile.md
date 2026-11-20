# SPEC 02 — Header y buscador mobile

> **Estado:** Implemented · **Depende de:** SPEC 01 · **Fecha:** 2026-11-19
> **Objetivo:** llevar el header del tramo con hamburguesa (`< xl`) al diseño mobile: drawer lateral, header de 64 px que se oculta al bajar y buscador a pantalla completa por debajo de `md`.

## Por qué existe esta spec

El header aparece en todas las páginas. Hoy, por debajo de `xl`, el menú es un panel que cae bajo el header, con un botón gris y el idioma en pastillas. El diseño mobile pide otra cosa: un drawer desde la derecha con scrim, contacto y redes al pie, un header que se oculta al bajar y un buscador a pantalla completa con "Cancelar".

El menú de escritorio aparece recién en `xl` (1280 px) porque entre 1024 y 1279 px no entran los 6 enlaces, el buscador, el idioma y el CTA. Por eso el drawer cubre todo el tramo `< xl`, y el `CLAUDE.md` del repo se corrige: el header cambia en `xl`, no en `lg`.

Se tomaron como referencia los headers de Medical Digital, ERES y Fiberlux:

| Patrón | Medical | ERES | Fiberlux | En esta spec |
|---|---|---|---|---|
| Cambio a hamburguesa | `lg` | `lg` | `lg` | `xl`, porque el menú de FESPAN no entra en 1024 px |
| Ocultar al bajar | No | Sí: desde 120 px, ignora menos de 6 px | Sí, solo en mobile, desde 100 px | Sí, como el diseño: desde 80 px, ignora menos de 6 px |
| Leer `scrollY` al montar | Sí | — | Sí (lección de su spec 25) | Sí |
| No se oculta con un panel abierto | — | Sí | Sí | Sí |
| Drawer y overlay como hermanos del `<header>` | Sí | Sí | — | Sí |
| Bloqueo de scroll | `scrollLock.ts` sobre `html` | Igual | `body.overflow` | Portar `scrollLock.ts`, con Lenis |
| `Esc` devuelve el foco al botón | Sí | Sí, más foco atrapado | — | Sí, más foco atrapado en el drawer y el overlay |
| Cerrar al pasar a desktop | — | Sí | Sí | Sí, al llegar a `xl` |
| Redes de `footer.social` | — | Sí | — | Sí |
| `prefers-reduced-motion` | — | No se oculta | — | El header no se oculta y el drawer abre sin deslizar |

## Alcance

### Dentro

1. **Header de 64 px por debajo de `md`.** Logo de 34 px, botón de búsqueda gris de 44 px y botón de menú verde (`bg-brand-primary`, ícono blanco) de 44 px. Desde `md`, el alto y el logo quedan como hoy (72 px y luego 88 desde `lg`). `.page-top` se ajusta por debajo de `md` para que el contenido no quede tapado ni con un hueco.
2. **Ocultar al bajar (`< xl`).** El header se oculta al bajar con `scrollY ≥ 80` y reaparece al subir; ignora movimientos de menos de 6 px. Con `scrollY > 8` cambia el borde por sombra. Lee `scrollY` al montar. No se oculta con el drawer o el buscador abiertos, ni con `prefers-reduced-motion`. Desde `xl` el header es fijo como hoy.
3. **Drawer (`< xl`).** Hermano del `<header>`. Entra desde la derecha con scrim y ocupa todo el ancho hasta 420 px. Lleva:
   - una cabecera de 64 px con el logo y el botón cerrar;
   - items de 60 px con borde inferior y punto verde en el activo;
   - "Idioma" con un control segmentado ES/EN/PT;
   - al pie, "Contáctanos" (`btn-primary btn-block`), teléfono, correo y redes de `footer.*`.
4. **Comportamiento del drawer.** Se cierra con `Esc`, con el botón cerrar, al tocar el scrim y al llegar a `xl`. El foco queda atrapado dentro y vuelve al botón de menú al cerrar. Usa `role="dialog"` y `aria-modal`. Bloquea el scroll con `utils/scrollLock.ts`, portado de Medical.
5. **Buscador a pantalla completa (`< md`).** Overlay hermano del `<header>`, con el input de 46 px con ícono, "Cancelar", la etiqueta "Buscar en el sitio" y resultados de 56 px con borde inferior. Mismo índice, filtro y máximo de 7 resultados que hoy. Desde `md` se mantiene el dropdown de 340 px.
6. **Textos nuevos en `ui.ts`** (ES, EN, PT): "Cancelar", "Idioma" y "Síguenos en".
7. **`CLAUDE.md` del repo:** corregir que el header cambia en `xl`, no en `lg`, y documentar `scrollLock`.

### Fuera de alcance (para otras specs)

- El menú de escritorio (`≥ xl`) y su dropdown de idioma: sin cambios.
- Pasar el header a `sticky` (ver Decisiones).
- "Ingresar" en el buscador: sigue oculto mientras `loginUrl` esté vacío (pendiente de Sagar).
- Agregar resultados de Conocimiento por área o de Miembros al índice, como hace la referencia: el índice actual ya incluye actividades, documentos, miembros y blog.
- Footer, banda CTA y acordeón (spec 03).
- Animación escalonada de los items del drawer.

## Modelo de datos

No hay datos de contenido nuevos ni cambios en el schema de Tina. El drawer lee lo que ya existe en `global`: `nav.links`, `nav.cta`, `nav.logo`, `footer.phone`, `footer.email` y `footer.social`.

### Archivos nuevos

```ts
// src/utils/scrollLock.ts — portado de Medical, con Lenis
export function lockScroll(): void;    // html.style.overflow = "hidden" + window.lenis?.stop()
export function unlockScroll(): void;  // idempotente: siempre libera

// src/hooks/useHeaderVisibility.ts
interface HeaderVisibility {
  hidden: boolean;    // translateY(-100%)
  scrolled: boolean;  // scrollY > 8 → sombra en vez de borde
}
function useHeaderVisibility(paused: boolean): HeaderVisibility;
// paused = drawer o buscador abiertos. Lee scrollY al montar.
// Solo oculta por debajo de xl y sin prefers-reduced-motion.

// src/hooks/useFocusTrap.ts
function useFocusTrap(ref: RefObject<HTMLElement>, active: boolean): void;
// Tab y Shift+Tab ciclan dentro de ref mientras active.

// src/components/shared/MobileDrawer.tsx
interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  nav: any;          // global.nav (useTina)
  footer: any;       // global.footer: phone, email, social
  locale: Locale;
  currentPath: string;
  activeSection: string;
}

// src/components/shared/SearchOverlay.tsx  (< md)
interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  pages: QuickLink[];
}
```

### Archivos que cambian

| Archivo | Cambio |
|---|---|
| `HeaderReact.tsx` | Devuelve un fragmento: `<header>`, scrim, `MobileDrawer` y `SearchOverlay` como hermanos. Agrega el estado `hidden`/`scrolled`. Borra el panel mobile actual. |
| `SiteSearch.tsx` | Extrae a `useSiteSearch(query, open, locale, pages)` el índice y el filtro, que comparten el dropdown (`≥ md`) y el overlay (`< md`). El botón abre uno u otro según `matchMedia("(min-width: 768px)")`. |
| `LangSwitcher.tsx` | `MobileLangSwitcher` pasa a ser un control segmentado: fondo `surface-sunken`, botones de 36×44 px y el activo en blanco con sombra. |
| `SocialLinks.tsx` | Nueva prop opcional `size: "md" \| "lg"` (40 o 44 px). El drawer usa `lg`. |
| `global.css` | `.page-top` pasa a `pt-[128px] md:pt-[136px] lg:pt-[180px]`: baja los 8 px que pierde el header. |
| `ui.ts` | Claves `search.cancel`, `nav.language` y `nav.follow` en ES, EN y PT. |

### Medidas

| Pieza | `< md` | `md`–`xl` | `≥ xl` |
|---|---|---|---|
| Alto del header | 64 px | 72 (88 desde `lg`) | 88 |
| Logo | 34 px | 48 (64 desde `lg`) | 64 |
| Botón de menú | 44 px, verde | 46 px, verde | No se muestra |
| Ocultar al bajar | Sí | Sí | No |
| Buscador | Overlay | Dropdown | Dropdown |
| Ancho del drawer | 100 % | 420 px a la derecha | No se muestra |

Las transiciones del diseño son: header en 350 ms `cubic-bezier(.2,.8,.2,1)`, drawer en 500 ms `cubic-bezier(.32,.72,0,1)`, scrim en 400 ms y overlay en 250 ms de fundido. El scrim usa `bg-content/40`. Es una excepción a la regla de `white/NN` porque el scrim siempre va sobre la página; se documenta.

## Plan de implementación

Cada paso deja el sitio compilando y se puede commitear por separado.

1. **Línea base visual.** Con `npm run build:local` y `astro preview`, capturar la home, Nosotros, el blog y una página legal en 320, 390, 768, 1024, 1280 y 1536 px, con el menú cerrado y abierto. El script de capturas va fuera del repo, igual que en las specs 00 y 01.
2. **`scrollLock`.** Crear `src/utils/scrollLock.ts` y reemplazar el `document.body.style.overflow` de `HeaderReact.tsx` por `lockScroll` y `unlockScroll`, y exponer la instancia de Lenis en `window.lenis` desde `BaseLayout`. El menú actual sigue funcionando igual.
3. **Header de 64 px y botón verde.** Alto `h-16 md:h-[72px] lg:h-[88px]`, logo `h-[34px] md:h-12 lg:h-16`, botón de menú en `bg-brand-primary` con ícono blanco y `.page-top` a `pt-[128px] md:pt-[136px]`. Comparar contra la línea base: desde `md` solo cambia el color del botón.
4. **Fragmento y hermanos.** `HeaderReact` devuelve un fragmento y el panel mobile actual sale del `<header>` como hermano, todavía con el diseño viejo. Verificar que se sigue abriendo y cerrando.
5. **`useHeaderVisibility`.** Crear el hook y aplicar `translate-y` y la sombra al `<header>`. Probar en 390 y 820 px que se oculta al bajar y reaparece al subir, y que en 1280 px no se mueve. Revisar que `#nosotros` (`scroll-mt-[88px]`) no quede tapado.
6. **`useFocusTrap`.** Crear el hook, todavía sin uso.
7. **`MobileDrawer` (estructura).** Crear el drawer con el scrim, la cabecera, los items y el punto activo, y reemplazar el panel viejo. Se cierra con `Esc`, con el botón cerrar, al tocar el scrim, al navegar y al llegar a `xl`. Agrega el foco atrapado y devuelve el foco al botón de menú.
8. **Pie del drawer.** "Idioma" con `MobileLangSwitcher` segmentado, "Contáctanos" `btn-primary btn-block`, teléfono, correo y `SocialLinks size="lg"`. Agrega las claves `nav.language` y `nav.follow` en `ui.ts`.
9. **`useSiteSearch`.** Extraer el índice y el filtro de `SiteSearch.tsx` sin cambiar el comportamiento. El dropdown se ve igual en 1280 px.
10. **`SearchOverlay`.** Crear el overlay `< md` con el input, "Cancelar" (`search.cancel`), la etiqueta y los resultados. El botón de búsqueda abre el overlay por debajo de `md` y el dropdown desde `md`. `Ctrl+K` sigue funcionando. Agrega el foco atrapado y el bloqueo de scroll.
11. **Movimiento reducido.** Con `prefers-reduced-motion`, el header no se oculta y el drawer, el scrim y el overlay aparecen sin transición.
12. **`CLAUDE.md` del repo.** Corregir que el header cambia en `xl` y documentar `scrollLock`, `useFocusTrap` y la excepción del scrim.

## Criterios de aceptación

**Header**

- [ ] En 390 px, el header mide 64 px, el logo 34 px y los botones de búsqueda y menú 44×44. El de menú es verde con ícono blanco.
- [ ] En 768 px, el header mide 72 px; en 1024 y 1280, 88 px. Desde 1280 px se ve el menú de escritorio sin cambios respecto a la línea base.
- [ ] En 390 y 820 px, al bajar más de 80 px el header se oculta, y al subir reaparece. Un movimiento de menos de 6 px no lo cambia.
- [ ] Con `scrollY > 8`, el header tiene sombra y no tiene borde. Si se recarga la página a mitad de scroll, la sombra aparece sin necesidad de hacer scroll.
- [ ] En 1280 px, el header no se oculta al bajar.
- [ ] Con el drawer o el buscador abiertos, el header no se oculta.
- [ ] Con `prefers-reduced-motion: reduce`, el header no se oculta al bajar.
- [ ] En 390 px, el contenido de `/blog`, `/actividades` y una página legal no queda tapado por el header y mantiene el mismo espacio que en la línea base.

**Drawer**

- [ ] En 390 px, el drawer ocupa todo el ancho; en 820 px mide 420 px, está pegado a la derecha y tiene el scrim detrás.
- [ ] Los items miden 60 px de alto y el de la página actual lleva el punto verde y `aria-current="page"`.
- [ ] El control de idioma muestra ES, EN y PT, marca el actual y lleva a la misma página en el otro idioma.
- [ ] "Contáctanos" ocupa todo el ancho del drawer en 390 px y lleva a `/contacto` en el idioma actual.
- [ ] El teléfono abre `tel:`, el correo abre `mailto:` y las redes salen de `footer.social` en botones de 44 px.
- [ ] El drawer se cierra con `Esc`, con el botón cerrar, al tocar el scrim y al ensanchar la ventana a 1280 px.
- [ ] Con el drawer abierto, `Tab` y `Shift+Tab` no salen del drawer. Al cerrarlo, el foco vuelve al botón de menú.
- [ ] El drawer tiene `role="dialog"`, `aria-modal="true"` y `aria-label`.
- [ ] Con el drawer abierto, la página de fondo no hace scroll (probado con touch en DevTools). Al cerrarlo, el scroll vuelve.

**Buscador**

- [ ] En 390 px, el botón de búsqueda abre un overlay a pantalla completa con el foco en el input.
- [ ] En 820 y 1280 px, el botón abre el dropdown de 340 px, igual que en la línea base.
- [ ] Con el input vacío se listan las páginas del menú. Al escribir "congreso" aparecen actividades con su etiqueta, como máximo 7.
- [ ] Una búsqueda sin coincidencias muestra "No encontramos resultados para tu búsqueda." en el idioma de la página.
- [ ] "Cancelar" y `Esc` cierran el overlay y vacían la búsqueda.
- [ ] `Ctrl+K` abre el buscador en los dos tamaños.
- [ ] "Cancelar", "Idioma" y "Síguenos en" se ven traducidos en `/en/` y `/pt/`.

**Repo**

- [ ] `npm run typecheck`, `npm run build:local` y `npm run check:standard` pasan sin errores.
- [ ] No hay dependencias nuevas en `package.json`.
- [ ] No hay hex en los archivos nuevos ni en los que cambian.
- [ ] El logo, los items del menú y el CTA siguen editables en `/admin` (`data-tina-field`).
- [ ] No hay scroll horizontal en 320, 360, 390, 768, 1024, 1280 y 1536 px, ni con el drawer o el buscador abiertos.
- [ ] El `CLAUDE.md` dice que el header cambia en `xl` y documenta `scrollLock`, `useFocusTrap` y la excepción del scrim.

## Decisiones

- **Sí: el drawer en todo el tramo `< xl`.** El menú de escritorio necesita 1280 px para que entren 6 enlaces, buscador, idioma y CTA. Se corrige el `CLAUDE.md`, que decía `lg`.
- **No: subir el menú de escritorio a `lg`.** Obligaría a rediseñar el desktop, que ya coincide con la referencia.
- **Sí: ocultar al bajar solo por debajo de `xl`.** El diseño desktop no lo hace. Medical, ERES y Fiberlux lo limitan igual o no lo usan.
- **Sí: umbrales del diseño (80 px y 6 px).** ERES usa 120 px y Fiberlux 100 px, pero la referencia de FESPAN fija 80.
- **Sí: overlay solo por debajo de `md`.** Desde `md`, el dropdown de 340 px entra bien y coincide con la referencia desktop.
- **Sí: teléfono, correo y redes de `footer.*`.** Hay una sola fuente en Tina, igual que en ERES.
- **No: campos propios del drawer en el schema.** Serían dos listas que mantener.
- **Sí: drawer de 420 px desde `md`.** En tablet, un panel a todo el ancho estira los items de 60 px sin necesidad. ERES usa un valor parecido (`min(88vw, 420px)`).
- **Sí: el drawer y el overlay como hermanos del `<header>`.** El `transform` que oculta el header volvería relativos a sus hijos `fixed` (riesgo documentado en ERES).
- **Sí: mantener `fixed` y `.page-top`.** Pasar a `sticky` como Medical y ERES cambiaría el espaciado de las 9 páginas y no lo pide el diseño.
- **Sí: `scrollLock.ts` sobre `html`, portado de Medical.** Es idempotente y evita el error de Fiberlux, donde el scroll quedó bloqueado. FESPAN usa Lenis con `smoothWheel`, que desplaza la página aunque `html` tenga `overflow: hidden`; por eso `BaseLayout` expone la instancia en `window.lenis` y `scrollLock` la detiene y la reanuda.
- **Sí: `useFocusTrap` propio, sin dependencia.** Son unas 25 líneas y el presupuesto no justifica sumar `focus-trap-react`.
- **Sí: idiomas en el orden de `LOCALES` (ES, EN, PT).** Coincide con el selector de escritorio. La referencia mobile usa ES, PT, EN, pero dos órdenes distintos confunden.
- **Sí: el scrim con `bg-content/40`.** Siempre va sobre la página, igual que el scrim del hero. Se documenta como excepción.
- **Sí: un hook `useSiteSearch` compartido.** El dropdown y el overlay filtran igual, y así no se duplica la lógica.
- **No: sumar áreas de Conocimiento al índice, como la referencia.** El índice ya tiene documentos, actividades, miembros y blog; cambiarlo va en otra spec.
- **No: animación escalonada de los items.** La referencia mobile no la tiene. ERES sí.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| El header oculto tapa anclas al reaparecer (`#nosotros`, conocimiento). | Ya tienen `scroll-mt-[88px]` y `scroll-mt-[100px]`, que alcanzan para 64 y 72 px. Se revisa en el paso 5. |
| `client:load` en el header suma JS al agregar el drawer y el overlay. | El drawer reemplaza al panel actual y el overlay reutiliza la lógica de búsqueda. Se mide el JS de la home antes y después y se anota en el PR. |
| El scroll queda bloqueado si se navega con el drawer abierto. | `unlockScroll` en el cleanup del efecto y al cerrar. Probar en touch real (lección de Fiberlux). |
| `matchMedia` no existe en SSR, lo que causa saltos al hidratar. | El layout por tramo lo dan las clases. `matchMedia` solo decide qué panel abrir al tocar, y eso ocurre después de hidratar. |
| Safari iOS ignora `overflow: hidden` en `html` con touch. | Se prueba en un iPhone real o en BrowserStack. Si falla, se suma `overscroll-contain` al drawer y al overlay. |

## Lo que **no** entra en esta spec

- El menú de escritorio y su dropdown de idioma.
- Pasar el header a `sticky`.
- "Ingresar" en el buscador.
- Cambios en el índice de búsqueda.
- Footer, banda CTA y acordeón (spec 03).
- Animación escalonada de los items del drawer.

Cada una de esas piezas, si llega, va en su propia spec.
