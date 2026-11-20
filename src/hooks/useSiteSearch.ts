import { useEffect, useMemo, useState } from "react";
import type { Locale } from "../i18n/config";
import { t } from "../i18n/ui";
import { normalizeForSearch } from "../utils/format";

export interface SearchEntry {
  kind: "page" | "activity" | "knowledge" | "member" | "blog";
  locale: string;
  title: string;
  keywords: string;
  url: string;
}

export interface QuickLink {
  label: string;
  url: string;
}

export interface SearchResult {
  title: string;
  url: string;
  hint: string;
}

const MAX_RESULTS = 7;

function useSearchIndex(enabled: boolean) {
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  useEffect(() => {
    if (!enabled || entries) return;
    const base = import.meta.env.BASE_URL || "/";
    fetch(`${base}/search-index.json`.replace(/\/{2,}/g, "/"))
      .then((response) => response.json())
      .then(setEntries)
      .catch(() => setEntries([]));
  }, [enabled, entries]);
  return entries;
}

export default function useSiteSearch(query: string, open: boolean, locale: Locale, pages: QuickLink[]): SearchResult[] {
  const entries = useSearchIndex(open);
  return useMemo(() => {
    const needle = normalizeForSearch(query.trim());
    if (!needle) return pages.map((page) => ({ title: page.label, url: page.url, hint: "" }));
    return (entries || [])
      .filter((entry) => entry.locale === locale)
      .filter((entry) => normalizeForSearch(`${entry.title} ${entry.keywords}`).includes(needle))
      .slice(0, MAX_RESULTS)
      .map((entry) => ({ title: entry.title, url: entry.url, hint: t(`search.kind.${entry.kind}` as const, locale) }));
  }, [query, entries, locale, pages]);
}
