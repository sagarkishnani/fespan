import type { Locale } from "../i18n/config";

const SHORT_MONTHS: Record<Locale, string[]> = {
  es: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
};

export function formatShortDate(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${SHORT_MONTHS[locale][date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function paragraphs(text: string | null | undefined): string[] {
  return (text || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

export function normalizeForSearch(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function hostOf(url: string | null | undefined): string {
  return (url || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");
}
