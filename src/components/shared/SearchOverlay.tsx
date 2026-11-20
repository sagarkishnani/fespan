import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import useFocusTrap from "../../hooks/useFocusTrap";
import useSiteSearch, { type QuickLink } from "../../hooks/useSiteSearch";
import { SearchIcon } from "./icons";

interface Props {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  pages: QuickLink[];
}

const DROPDOWN_QUERY = "(min-width: 768px)";

export default function SearchOverlay({ open, onClose, locale, pages }: Props) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useSiteSearch(query, open, locale, pages);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const dropdownWidth = window.matchMedia(DROPDOWN_QUERY);
    const onChange = () => dropdownWidth.matches && onClose();
    dropdownWidth.addEventListener("change", onChange);
    return () => dropdownWidth.removeEventListener("change", onChange);
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      id="search-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t("search.title", locale)}
      className={`fixed inset-0 z-[90] flex flex-col overscroll-contain bg-surface duration-[250ms] md:hidden ${
        open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]"
      }`}
    >
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <div className="relative flex-1">
          <SearchIcon width={18} height={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            id="site-search-overlay"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search.placeholder", locale)}
            className="h-[46px] w-full rounded-xl border-2 border-brand-primary-light pl-10 pr-3 text-body-md text-content outline-none placeholder:text-content-muted [&::-webkit-search-cancel-button]:appearance-none"
          />
        </div>
        <button type="button" onClick={onClose} className="h-11 px-1 text-body-md font-medium text-brand-primary">
          {t("search.cancel", locale)}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        <label htmlFor="site-search-overlay" className="block pb-2 pt-4 text-caption-sm font-medium uppercase tracking-[0.1em] text-content-muted">
          {t("search.title", locale)}
        </label>
        {results.map((result) => (
          <a
            key={result.url + result.title}
            href={result.url}
            onClick={onClose}
            className="flex min-h-14 flex-col justify-center gap-0.5 border-b border-line py-2 text-body-base text-content"
          >
            <span>{result.title}</span>
            {result.hint && <span className="text-caption-md text-content-muted">{result.hint}</span>}
          </a>
        ))}
        {results.length === 0 && <span className="block py-6 text-body-md text-content-muted">{t("search.empty", locale)}</span>}
      </div>
    </div>
  );
}
