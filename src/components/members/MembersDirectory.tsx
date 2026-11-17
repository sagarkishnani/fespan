import { useMemo, useState, type ReactNode } from "react";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import { normalizeForSearch } from "../../utils/format";
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

export default function MembersDirectory({ societies, locale, mapImage, children }: Props) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  const countries = useMemo(() => [...new Set(societies.map((society) => society.country))], [societies]);
  const visible = useMemo(() => {
    const needle = normalizeForSearch(query.trim());
    return societies
      .filter((society) => !country || society.country === country)
      .filter((society) => !needle || normalizeForSearch(`${society.name} ${society.city} ${society.country}`).includes(needle));
  }, [societies, query, country]);
  const visibleCodes = useMemo(() => new Set(visible.map((society) => society.countryCode)), [visible]);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:gap-[60px]">
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
        <ul className="flex flex-col gap-2">
          {visible.map((society) => {
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
                  className={`flex flex-col gap-0.5 rounded-[18px] py-4 pl-6 pr-4 transition-colors duration-300 ${active ? "bg-surface-mint" : "bg-surface-raised"}`}
                >
                  <span className={`text-subtitle-xs text-content ${active ? "font-medium" : ""}`}>{society.name}</span>
                  <span className="text-caption-md text-content-muted">{society.city}</span>
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
      <div className="flex items-center justify-center overflow-hidden rounded-4xl bg-surface-raised px-6 py-10 lg:h-[860px] lg:rounded-5xl lg:px-12">
        <MembersMap
          societies={societies}
          visibleCodes={visibleCodes}
          hovered={hovered}
          onHover={setHovered}
          mapImage={mapImage}
          mapAlt={t("members.mapAlt", locale)}
        />
      </div>
    </div>
  );
}
