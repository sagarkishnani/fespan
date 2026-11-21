import { useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import SocialLinks from "./SocialLinks";
import { ChevronDownIcon } from "./icons";

interface Props {
  query: string;
  variables: object;
  data: any;
  locale: Locale;
}

export default function FooterReact({ query, variables, data: initialData, locale }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const nav = data?.global?.nav;
  const footer = data?.global?.footer;
  const columns = (footer?.columns || []).filter(Boolean);
  const [openColumn, setOpenColumn] = useState<number | null>(null);
  const phoneHref = `tel:${(footer?.phone || "").replace(/[^\d+]/g, "")}`;

  return (
    <footer className="bg-surface-raised pb-10 pt-20">
      <div className="container-xl">
        <div className="grid md:grid-cols-2 md:gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr_1.4fr]">
          <div className="max-md:border-b max-md:border-line max-md:pb-8">
            <img src={mediaUrl(nav?.logo) || "/images/marca/logo-fespan.svg"} alt={nav?.logoAlt || "FESPAN"} className="block h-[104px] w-auto" loading="lazy" />
          </div>

          {columns.map((column: any, i: number) => {
            const open = openColumn === i;
            const panelId = `footer-col-${i}`;
            return (
              <div key={i} className="flex flex-col max-md:border-b max-md:border-line md:gap-4">
                <button
                  type="button"
                  className="flex h-14 w-full items-center justify-between text-left text-body-base font-medium text-accent md:hidden"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenColumn(open ? null : i)}
                  data-tina-field={tinaField(column, "title")}
                >
                  {tField(column, "title", locale)}
                  <ChevronDownIcon width={16} height={16} className={open ? "rotate-180" : ""} />
                </button>
                <span className="mb-1.5 hidden text-body-base font-medium text-accent md:block" data-tina-field={tinaField(column, "title")}>
                  {tField(column, "title", locale)}
                </span>
                <div id={panelId} className={`grid ${open ? "grid-rows-[1fr]" : "max-md:grid-rows-[0fr]"}`}>
                  <div className={`flex min-h-0 flex-col gap-4 max-md:overflow-hidden ${open ? "" : "max-md:invisible"}`}>
                    {(column.links || []).filter(Boolean).map((link: any, j: number) => (
                      <a key={j} href={localizeHref(link.url, locale)} className="text-body-sm text-content-muted hover:text-brand-primary">
                        {tField(link, "label", locale)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col gap-3.5 max-md:mt-7">
            <span className="text-body-base font-medium text-accent" data-tina-field={tinaField(footer, "helpTitle")}>
              {tField(footer, "helpTitle", locale)}
            </span>
            <span className="max-w-[260px] text-caption-md leading-normal text-content-muted" data-tina-field={tinaField(footer, "helpText")}>
              {tField(footer, "helpText", locale)}
            </span>
            {footer?.phone && (
              <a href={phoneHref} className="mt-3.5 flex items-center gap-3 text-body-sm text-accent hover:text-brand-primary">
                <img src="/images/iconos/telefono.svg" alt="" className="h-5 w-5" loading="lazy" />
                {footer.phone}
              </a>
            )}
            {footer?.email && (
              <a href={`mailto:${footer.email}`} className="flex items-center gap-3 break-all text-body-sm text-accent hover:text-brand-primary">
                <img src="/images/iconos/correo.svg" alt="" className="h-5 w-5" loading="lazy" />
                {footer.email}
              </a>
            )}
          </div>
        </div>

        <div className="mt-16 flex items-center gap-5 lg:mt-[72px]">
          <span className="text-caption-md text-content-muted">{t("footer.followUs", locale)}</span>
          <SocialLinks items={footer?.social || []} />
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-line pt-7 text-caption-sm text-content-muted md:flex-row md:items-center md:justify-between md:gap-6">
          <span data-tina-field={tinaField(footer, "legal")}>{tField(footer, "legal", locale)}</span>
          <span className="flex shrink-0 items-center gap-2">
            {t("footer.developedBy", locale)}
            <span className="text-[20px] font-light tracking-[0.02em] text-content-faint">TWINSTUDIOS</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
