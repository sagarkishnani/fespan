import { DEFAULT_LOCALE, type Locale } from "./config";

const UI = {
  "es": {
    "nav.menu": "Menú",
    "nav.close": "Cerrar",
    "lang.switch": "Cambiar idioma",
    "form.send": "Enviar",
    "form.sending": "Enviando…",
    "form.required": "Este campo es obligatorio",
    "blog.readMore": "Leer más",
    "blog.back": "Volver al blog",
    "search.placeholder": "Buscar…",
    "search.empty": "Sin resultados",
  },
  "en": {
    "nav.menu": "Menu",
    "nav.close": "Close",
    "lang.switch": "Switch language",
    "form.send": "Send",
    "form.sending": "Sending…",
    "form.required": "This field is required",
    "blog.readMore": "Read more",
    "blog.back": "Back to blog",
    "search.placeholder": "Search…",
    "search.empty": "No results",
  },
} as const;

type UIKey = keyof (typeof UI)["es"];

export function t(key: UIKey, locale: Locale): string {
  const table = (UI as any)[locale] || {};
  return table[key] ?? (UI as any)[DEFAULT_LOCALE][key] ?? key;
}
