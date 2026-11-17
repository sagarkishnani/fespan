import { useCallback, useEffect, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref, stripBase } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import LangSwitcher, { MobileLangSwitcher } from "./LangSwitcher";
import SiteSearch, { type QuickLink } from "./SiteSearch";
import { CloseIcon, MenuIcon } from "./icons";

interface Props {
  query: string;
  variables: object;
  data: any;
  locale: Locale;
  currentPath: string;
}

type Menu = "none" | "search" | "lang" | "mobile";

function sectionOf(path: string, locale: Locale): string {
  const relative = stripBase(path);
  const withoutLocale = locale === DEFAULT_LOCALE ? relative : relative.replace(new RegExp(`^${locale}/?`), "");
  return withoutLocale.split("/")[0] || "";
}

export default function HeaderReact({ query, variables, data: initialData, locale, currentPath }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const nav = data?.global?.nav;
  const [menu, setMenu] = useState<Menu>("none");

  const toggle = useCallback((target: Menu) => setMenu((current) => (current === target ? "none" : target)), []);
  const toggleSearch = useCallback(() => toggle("search"), [toggle]);
  const close = () => setMenu("none");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenu("none");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu === "mobile" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  const links = (nav?.links || []).filter(Boolean).map((link: any) => ({
    raw: link,
    label: tField(link, "label", locale),
    href: localizeHref(link.url, locale),
    section: (link.url || "/").replace(/^\//, "").split(/[/#?]/)[0],
  }));
  const activeSection = sectionOf(currentPath, locale);
  const ctaHref = localizeHref(nav?.cta?.url, locale);
  const ctaLabel = tField(nav?.cta, "label", locale);
  const quickPages: QuickLink[] = links.map((link: any) => ({ label: link.label, url: link.href }));
  const footerLinks: QuickLink[] = [
    ...(nav?.loginUrl ? [{ label: t("nav.login", locale), url: nav.loginUrl }] : []),
    ...(ctaLabel ? [{ label: ctaLabel, url: ctaHref }] : []),
  ];

  return (
    <>
      {(menu === "search" || menu === "lang") && <div className="fixed inset-0 z-[59]" onClick={close} aria-hidden="true" />}
      <header className="fixed inset-x-0 top-0 z-[60] border-b border-line bg-surface">
        <div className="container-xl flex h-[72px] items-center gap-6 lg:h-[88px]">
          <a href={localizeHref("/", locale)} className="shrink-0" aria-label="FESPAN">
            <img
              src={mediaUrl(nav?.logo) || "/images/marca/logo-fespan.svg"}
              alt={nav?.logoAlt || "FESPAN"}
              className="block h-12 w-auto lg:h-16"
              data-tina-field={tinaField(nav, "logo")}
            />
          </a>

          <nav className="mx-auto hidden items-center gap-1 xl:flex" aria-label="Principal">
            {links.map((link: any) => {
              const active = link.section === activeSection;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  data-tina-field={tinaField(link.raw, "label")}
                  className={`relative whitespace-nowrap rounded-full px-4 py-2.5 text-body-md transition-colors hover:text-brand-primary ${
                    active ? "bg-surface-mint font-medium text-brand-primary" : "text-content"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-[3px] left-1/2 -ml-[2.5px] h-[5px] w-[5px] rounded-full bg-brand-primary-light transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
            <SiteSearch locale={locale} open={menu === "search"} onToggle={toggleSearch} pages={quickPages} footerLinks={footerLinks} />
            <div className="hidden sm:block">
              <LangSwitcher locale={locale} currentPath={currentPath} open={menu === "lang"} onToggle={() => toggle("lang")} />
            </div>
            {ctaLabel && (
              <a href={ctaHref} className="btn-primary btn-sm ml-1 hidden md:inline-flex" data-tina-field={tinaField(nav?.cta, "label")}>
                {ctaLabel}
              </a>
            )}
            <button
              type="button"
              onClick={() => toggle("mobile")}
              className="flex h-control-sm w-control-sm items-center justify-center rounded-full bg-surface-sunken text-content xl:hidden"
              aria-label={menu === "mobile" ? t("nav.close", locale) : t("nav.menu", locale)}
              aria-expanded={menu === "mobile"}
            >
              {menu === "mobile" ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {menu === "mobile" && (
          <div className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-surface xl:hidden">
            <nav className="container-xl flex flex-col gap-1 py-6" aria-label="Principal">
              {links.map((link: any) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`rounded-2xl px-4 py-3.5 text-subtitle-sm ${
                    link.section === activeSection ? "bg-surface-mint text-brand-primary" : "text-content"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {ctaLabel && (
                <a href={ctaHref} className="btn-primary mt-4">
                  {ctaLabel}
                </a>
              )}
              <div className="mt-6 border-t border-line pt-6">
                <MobileLangSwitcher locale={locale} currentPath={currentPath} />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
