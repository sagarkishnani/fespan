import type { AstroGlobal } from "astro";
import { isLocale, type Locale } from "../i18n/config";
import { getLocale, tField } from "../utils/i18n";

export function pageLocale(astro: AstroGlobal): Locale {
  return isLocale(astro.currentLocale) ? astro.currentLocale : getLocale(astro.url);
}

export function seoOf(seo: any, locale: Locale) {
  return {
    title: tField(seo, "title", locale) || undefined,
    description: tField(seo, "description", locale) || undefined,
  };
}
