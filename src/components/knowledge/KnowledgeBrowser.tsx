import { useMemo, useRef, useState } from "react";
import type { Locale } from "../../i18n/config";
import { t, translateTerm } from "../../i18n/ui";
import { normalizeForSearch } from "../../utils/format";
import { ArrowRightIcon, ChevronDownIcon, DownloadIcon, SearchIcon } from "../shared/icons";

export interface KnowledgeDocModel {
  id: string;
  kind: "guia" | "investigacion";
  area: string;
  title: string;
  published: string;
  revision: string;
  authors: string;
  conflicts: string;
  languages: string;
  file: string;
}

interface Props {
  docs: KnowledgeDocModel[];
  areas: string[];
  locale: Locale;
}

const PAGE_SIZE = 10;
const ALL = "__all__";
const KINDS = ["guia", "investigacion"] as const;

function KindTabs({ docs, kind, locale, onChange }: { docs: KnowledgeDocModel[]; kind: string; locale: Locale; onChange: (kind: (typeof KINDS)[number]) => void }) {
  return (
    <div role="tablist" className="grid grid-cols-2 border-b border-line md:flex md:gap-2 md:overflow-x-auto">
      {KINDS.map((id) => {
        const active = kind === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`-mb-px flex h-[52px] items-center justify-center gap-2 whitespace-nowrap border-b-[3px] px-2 text-body-md transition-colors md:h-auto md:justify-start md:gap-2.5 md:px-[22px] md:py-4 md:text-subtitle-xs hover:text-content ${
              active ? "border-brand-primary-light font-medium text-content" : "border-transparent text-content-muted"
            }`}
          >
            {t(`knowledge.tab.${id}`, locale)}
            <span className={`flex h-6 min-w-[26px] items-center md:h-[26px] md:min-w-[28px] justify-center rounded-full px-2 text-caption-sm ${active ? "bg-surface-mint text-brand-primary" : "bg-surface-sunken text-content-muted"}`}>
              {docs.filter((doc) => doc.kind === id).length}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DocRow({ doc, locale }: { doc: KnowledgeDocModel; locale: Locale }) {
  const category = `${translateTerm(doc.kind === "guia" ? "Guía" : "Investigación", locale)} · ${translateTerm(doc.area, locale)}`;
  return (
    <div className="grid gap-1.5 border-b border-line py-6 transition-colors md:gap-4 md:py-9 hover:bg-surface-raised lg:grid-cols-[300px_minmax(0,1fr)_auto] lg:items-center lg:gap-12">
      <span className="text-caption-sm font-medium uppercase leading-normal tracking-[0.06em] text-accent md:text-body-sm md:font-medium md:leading-normal">{category}</span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-subtitle-md [text-wrap:pretty] md:mb-1">{doc.title}</h3>
        <span className="text-body-sm text-content-muted md:text-body-md">
          {t("knowledge.published", locale)} {doc.published} · {t("knowledge.revision", locale)} {doc.revision}
        </span>
        <span className="text-body-sm text-content-muted md:text-body-md">{t("knowledge.authors", locale)} {doc.authors}</span>
        <span className="text-body-sm text-content-muted md:text-body-md">{t("knowledge.conflicts", locale)} {doc.conflicts}</span>
        {doc.languages && <span className="text-caption-md text-content-muted md:text-body-sm">{doc.languages}</span>}
      </div>
      {doc.file ? (
        <a href={doc.file} download className="flex items-center gap-2.5 whitespace-nowrap text-body-lg font-medium text-brand-primary hover:text-brand-primary-dark">
          <DownloadIcon />
          {t("common.downloadPdf", locale)}
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}

function Pager({ page, count, locale, onChange }: { page: number; count: number; locale: Locale; onChange: (page: number) => void }) {
  const circle = "flex h-12 w-12 items-center justify-center rounded-full border text-body-md font-medium transition-colors";
  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginación">
      <button type="button" disabled={page === 0} onClick={() => onChange(page - 1)} aria-label={t("common.previous", locale)} className={`${circle} border-line bg-surface hover:border-brand-primary disabled:opacity-35`}>
        <ArrowRightIcon className="rotate-180" />
      </button>
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(index)}
          aria-current={index === page ? "page" : undefined}
          className={`${circle} ${index === page ? "border-brand-primary bg-brand-primary text-white" : "border-line bg-surface text-content"}`}
        >
          {index + 1}
        </button>
      ))}
      <button type="button" disabled={page === count - 1} onClick={() => onChange(page + 1)} aria-label={t("common.next", locale)} className={`${circle} border-line bg-surface hover:border-brand-primary disabled:opacity-35`}>
        <ArrowRightIcon />
      </button>
    </nav>
  );
}

export default function KnowledgeBrowser({ docs, areas, locale }: Props) {
  const [kind, setKind] = useState<(typeof KINDS)[number]>("guia");
  const [area, setArea] = useState(ALL);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const needle = normalizeForSearch(query.trim());
    return docs
      .filter((doc) => doc.kind === kind)
      .filter((doc) => area === ALL || doc.area === area)
      .filter((doc) => !needle || normalizeForSearch(`${doc.title} ${doc.area} ${translateTerm(doc.area, locale)} ${doc.authors}`).includes(needle));
  }, [docs, kind, area, query, locale]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);
  const range = filtered.length ? `${currentPage * PAGE_SIZE + 1}–${currentPage * PAGE_SIZE + visible.length} ${t("common.of", locale)} ${filtered.length}` : "";

  const goToPage = (next: number) => {
    setPage(next);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={listRef} className="container-xl scroll-mt-[100px] pb-16 pt-6 md:pb-20 md:pt-[72px] lg:pb-[120px]">
      <KindTabs docs={docs} kind={kind} locale={locale} onChange={(next) => { setKind(next); setPage(0); }} />
      <div className="mt-6 grid gap-4 border-b border-line pb-6 md:mt-12 md:grid-cols-2 md:gap-6 md:pb-10">
        <label className="flex flex-col gap-2 text-body-sm font-medium md:gap-3 md:text-body-md md:font-medium">
          {t("knowledge.searchLabel", locale)}
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 md:left-5 -translate-y-1/2 text-content-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => { setQuery(event.target.value); setPage(0); }}
              placeholder={t("knowledge.searchPlaceholder", locale)}
              className="field field-with-icon rounded-[14px] border-line-strong font-normal md:h-[58px] md:rounded-xl md:text-body-base"
            />
          </div>
        </label>
        <label className="flex flex-col gap-2 text-body-sm font-medium md:gap-3 md:text-body-md md:font-medium">
          {t("knowledge.area", locale)}
          <div className="relative">
            <select
              value={area}
              onChange={(event) => { setArea(event.target.value); setPage(0); }}
              className="field cursor-pointer appearance-none rounded-[14px] border-line-strong pr-12 font-normal md:h-[58px] md:rounded-xl md:text-body-base"
            >
              <option value={ALL}>{t("common.all", locale)}</option>
              {areas.map((value) => (
                <option key={value} value={value}>{translateTerm(value, locale)}</option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" />
          </div>
        </label>
      </div>
      <div className="pb-1 pt-4 text-caption-md text-content-muted md:pt-5 md:text-body-sm" aria-live="polite">{range}</div>
      <div className="flex flex-col">
        {visible.map((doc) => (
          <DocRow key={doc.id} doc={doc} locale={locale} />
        ))}
        {filtered.length === 0 && (
          <div className="mt-6 rounded-2xl bg-surface-raised px-4 py-8 text-center text-body-md text-content-muted md:mt-8 md:p-14 md:text-body-lg">{t("common.noResults", locale)}</div>
        )}
      </div>
      {pageCount > 1 && <Pager page={currentPage} count={pageCount} locale={locale} onChange={goToPage} />}
    </section>
  );
}
