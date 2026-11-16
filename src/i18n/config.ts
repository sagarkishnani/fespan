export const LOCALES = ["es", "en", "pt"] as const;

export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";
export const TRANSLATED_LOCALES = LOCALES.filter((code) => code !== DEFAULT_LOCALE);

export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  pt: "Português",
  en: "English",
};

export const LOCALE_TAGS: Record<Locale, string> = {
  es: "es-PE",
  en: "en-US",
  pt: "pt-BR",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
