import { useCallback, useEffect, useRef, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref, stripBase } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import LangSwitcher from "./LangSwitcher";
import MobileDrawer from "./MobileDrawer";
import SiteSearch from "./SiteSearch";
import type { QuickLink } from "../../hooks/useSiteSearch";
import { MenuIcon } from "./icons";
import { lockScroll, unlockScroll } from "../../utils/scrollLock";
import useHeaderVisibility from "../../hooks/useHeaderVisibility";

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
  const { hidden, scrolled } = useHeaderVisibility(menu === "mobile" || menu === "search");

  const toggle = useCallback((target: Menu) => setMenu((current) => (current === target ? "none" : target)), []);
  const toggleSearch = useCallback(() => toggle("search"), [toggle]);
  const close = useCallback(() => setMenu("none"), []);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerWasOpen = useRef(false);

  useEffect(() => {
    if (drawerWasOpen.current && menu !== "mobile") menuButtonRef.current?.focus({ preventScroll: true });
    drawerWasOpen.current = menu === "mobile";
  }, [menu]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenu("none");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (menu !== "mobile") return;
    lockScroll();
    return unlockScroll;
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
      <header
        className={`fixed inset-x-0 top-0 z-[60] h-16 border-b bg-surface md:h-[72px] lg:h-[88px] transition-[transform,box-shadow,border-color] duration-[350ms] ease-smooth ${
          hidden ? "-translate-y-full focus-within:translate-y-0" : "translate-y-0"
        } ${scrolled ? "border-transparent shadow-header" : "border-line"}`}
      >
        <div className="container-xl flex h-full items-center gap-6">
          <a href={localizeHref("/", locale)} className="shrink-0" aria-label="FESPAN">
            <img
              src={mediaUrl(nav?.logo) || "/images/marca/logo-fespan.svg"}
              alt={nav?.logoAlt || "FESPAN"}
              className="block h-[34px] w-auto md:h-12 lg:h-16"
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
              ref={menuButtonRef}
              type="button"
              onClick={() => toggle("mobile")}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-white transition-colors hover:bg-brand-primary-dark md:h-control-sm md:w-control-sm xl:hidden"
              aria-label={t("nav.menu", locale)}
              aria-expanded={menu === "mobile"}
              aria-controls="mobile-drawer"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer
        open={menu === "mobile"}
        onClose={close}
        nav={nav}
        footer={data?.global?.footer}
        locale={locale}
        currentPath={currentPath}
        activeSection={activeSection}
      />
    </>
  );
}
