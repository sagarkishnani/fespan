import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import { normalizeForSearch } from "../../utils/format";
import useCanHover from "../../hooks/useCanHover";
import { ChevronDownIcon, SearchIcon } from "../shared/icons";
import MembersMap from "./MembersMap";

export interface SocietyModel {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  url: string;
  site: string;
}

interface Props {
  societies: SocietyModel[];
  locale: Locale;
  mapImage: string;
  children?: ReactNode;
}

const rowClasses = "flex min-h-16 rounded-xl px-4 py-3.5 transition-colors duration-300 md:rounded-[18px] md:py-4 md:pl-6 md:pr-4";

function rowBackground(active: boolean) {
  return active ? "bg-surface-mint" : "bg-surface-raised";
}

function SocietyName({ society, active }: { society: SocietyModel; active: boolean }) {
  return (
    <>
      <span className={`text-body-base text-content md:text-subtitle-xs ${active ? "font-medium" : ""}`}>{society.name}</span>
      <span className="text-caption-md text-content-muted">{society.city}</span>
    </>
  );
}

function SocietyCard({ society, locale }: { society: SocietyModel; locale: Locale }) {
  return (
    <div className="mt-3 flex animate-fade-up flex-col gap-1.5 rounded-[20px] bg-accent p-5 text-white">
      <span className="text-overline uppercase text-brand-primary-pale">{society.country}</span>
      <span className="text-subtitle-xs font-medium">{society.name}</span>
      <span className="text-body-sm text-white/85">{society.city}</span>
      {society.url && (
        <a href={society.url} target="_blank" rel="noopener noreferrer" className="btn mt-2.5 w-full bg-surface text-content hover:text-content">
          {t("members.visitSite", locale)}
        </a>
      )}
    </div>
  );
}

export default function MembersDirectory({ societies, locale, mapImage, children }: Props) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canHover = useCanHover();

  const countries = useMemo(() => [...new Set(societies.map((society) => society.country))], [societies]);
  const visible = useMemo(() => {
    const needle = normalizeForSearch(query.trim());
    return societies
      .filter((society) => !country || society.country === country)
      .filter((society) => !needle || normalizeForSearch(`${society.name} ${society.city} ${society.country}`).includes(needle));
  }, [societies, query, country]);
  const visibleCodes = useMemo(() => new Set(visible.map((society) => society.countryCode)), [visible]);
  const selected = canHover ? undefined : visible.find((society) => society.id === selectedId);
  const highlighted = canHover ? hovered : selected?.countryCode ?? null;

  useEffect(() => {
    if (selectedId && !visible.some((society) => society.id === selectedId)) setSelectedId(null);
  }, [visible, selectedId]);

  const selectCountry = (code: string) => {
    const society = visible.find((item) => item.countryCode === code);
    if (society) setSelectedId(society.id);
  };

  const openCountrySite = (code: string) => {
    const url = societies.find((society) => society.countryCode === code)?.url;
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:items-center lg:gap-[60px]">
      <div className="contents lg:block">
        <div>
          {children}
          <div className="mb-5 flex flex-col gap-2.5 sm:flex-row">
            <div className="relative min-w-0 flex-1 sm:max-w-[460px]">
              <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("members.searchPlaceholder", locale)}
                aria-label={t("members.searchPlaceholder", locale)}
                className="field field-with-icon"
              />
            </div>
            <div className="relative shrink-0">
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                aria-label={t("members.allCountries", locale)}
                className="field cursor-pointer appearance-none pr-12 text-body-sm"
              >
                <option value="">{t("members.allCountries", locale)}</option>
                {countries.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
        <div className="order-last mt-5 lg:mt-0">
          <ul className="flex flex-col gap-2">
            {visible.map((society) => {
              if (!canHover) {
                const active = society.id === selected?.id;
                return (
                  <li key={society.id}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedId(society.id)}
                      className={`${rowClasses} w-full items-center gap-3 text-left ${rowBackground(active)}`}
                    >
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <SocietyName society={society} active={active} />
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-3 w-3 shrink-0 rounded-full border-2 border-brand-primary ${active ? "bg-brand-primary-light" : "bg-surface"}`}
                      />
                    </button>
                  </li>
                );
              }
              const active = hovered === society.countryCode;
              const Tag = society.url ? "a" : "div";
              return (
                <li key={society.id}>
                  <Tag
                    {...(society.url ? { href: society.url, target: "_blank", rel: "noopener noreferrer" } : {})}
                    onMouseEnter={() => setHovered(society.countryCode)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(society.countryCode)}
                    onBlur={() => setHovered(null)}
                    className={`${rowClasses} flex-col gap-0.5 ${rowBackground(active)}`}
                  >
                    <SocietyName society={society} active={active} />
                    {society.site && <span className="mt-0.5 text-caption-sm text-brand-primary">{society.site}</span>}
                  </Tag>
                </li>
              );
            })}
          </ul>
          {visible.length === 0 && (
            <div className="rounded-2xl bg-surface-raised p-14 text-center text-body-lg text-content-muted">{t("common.noResults", locale)}</div>
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center overflow-hidden rounded-2xl bg-surface-raised p-4 md:rounded-4xl md:px-6 md:py-10 lg:h-[860px] lg:rounded-5xl lg:px-12 lg:py-0">
          <MembersMap
            societies={societies}
            visibleCodes={visibleCodes}
            highlighted={highlighted}
            showTooltip={canHover}
            onHover={canHover ? setHovered : () => {}}
            onCountryClick={canHover ? openCountrySite : selectCountry}
            mapImage={mapImage}
            mapAlt={t("members.mapAlt", locale)}
          />
        </div>
        <div aria-live="polite">{selected && <SocietyCard key={selected.id} society={selected} locale={locale} />}</div>
      </div>
    </div>
  );
}
