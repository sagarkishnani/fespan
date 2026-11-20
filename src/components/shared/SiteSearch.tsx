import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import { normalizeForSearch } from "../../utils/format";
import { SearchIcon } from "./icons";
import Dropdown from "./Dropdown";

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

interface Props {
  locale: Locale;
  open: boolean;
  onToggle: () => void;
  pages: QuickLink[];
  footerLinks: QuickLink[];
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

export default function SiteSearch({ locale, open, onToggle, pages, footerLinks }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const entries = useSearchIndex(open);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onToggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onToggle]);

  const results = useMemo(() => {
    const needle = normalizeForSearch(query.trim());
    if (!needle) return pages.map((page) => ({ title: page.label, url: page.url, hint: "" }));
    return (entries || [])
      .filter((entry) => entry.locale === locale)
      .filter((entry) => normalizeForSearch(`${entry.title} ${entry.keywords}`).includes(needle))
      .slice(0, MAX_RESULTS)
      .map((entry) => ({ title: entry.title, url: entry.url, hint: t(`search.kind.${entry.kind}` as const, locale) }));
  }, [query, entries, locale, pages]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-label={t("search.open", locale)}
        aria-expanded={open}
        className={`flex h-11 w-11 items-center justify-center rounded-full text-content transition-colors hover:bg-surface-mint md:h-control-sm md:w-control-sm ${
          open ? "bg-surface-mint" : "bg-surface-sunken"
        }`}
      >
        <SearchIcon />
      </button>
      {open && (
        <Dropdown className="right-[-8px] top-[58px] w-[min(340px,calc(100vw-32px))] rounded-[20px] px-3.5 pb-3 pt-[18px]">
          <label htmlFor="site-search" className="px-1 pb-2.5 text-body-sm font-medium text-content">
            {t("search.title", locale)}
          </label>
          <input
            id="site-search"
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder", locale)}
            className="h-12 w-full rounded-lg border-2 border-brand-primary-light px-3.5 text-body-md text-content outline-none"
          />
          <div className="mt-2.5 flex flex-col border-t border-line pt-1.5">
            {results.map((result) => (
              <a key={result.url + result.title} href={result.url} className="flex flex-col gap-0.5 rounded-lg px-3.5 py-[11px] text-body-md text-content hover:bg-surface-raised">
                <span>{result.title}</span>
                {result.hint && <span className="text-caption-sm text-content-muted">{result.hint}</span>}
              </a>
            ))}
            {results.length === 0 && (
              <span className="px-3.5 py-3 text-body-sm text-content-muted">{t("search.empty", locale)}</span>
            )}
          </div>
          {footerLinks.length > 0 && (
            <div className="mt-1.5 flex flex-col border-t border-line pt-1.5">
              {footerLinks.map((link) => (
                <a key={link.url} href={link.url} className="rounded-lg px-3.5 py-[11px] text-body-md text-content hover:bg-surface-raised">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </Dropdown>
      )}
    </div>
  );
}
