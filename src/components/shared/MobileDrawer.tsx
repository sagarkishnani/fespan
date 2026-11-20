import { useEffect, useRef } from "react";
import { tinaField } from "tinacms/dist/react";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import { localizeHref, tField } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import useFocusTrap from "../../hooks/useFocusTrap";
import { CloseIcon } from "./icons";
import { MobileLangSwitcher } from "./LangSwitcher";
import SocialLinks from "./SocialLinks";

interface Props {
  open: boolean;
  onClose: () => void;
  nav: any;
  footer: any;
  locale: Locale;
  currentPath: string;
  activeSection: string;
}

const DESKTOP_MENU_QUERY = "(min-width: 1280px)";

function sectionOfUrl(url: string | null | undefined): string {
  return (url || "/").replace(/^\//, "").split(/[/#?]/)[0];
}

export default function MobileDrawer({ open, onClose, nav, footer, locale, currentPath, activeSection }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const desktopMenu = window.matchMedia(DESKTOP_MENU_QUERY);
    const onChange = () => desktopMenu.matches && onClose();
    desktopMenu.addEventListener("change", onChange);
    return () => desktopMenu.removeEventListener("change", onChange);
  }, [open, onClose]);

  const links = (nav?.links || []).filter(Boolean);
  const ctaLabel = tField(nav?.cta, "label", locale);
  const phoneHref = `tel:${(footer?.phone || "").replace(/[^\d+]/g, "")}`;

  return (
    <>
      <div
        className={`fixed inset-0 z-[79] bg-content/40 transition-opacity duration-[400ms] xl:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu", locale)}
        className={`fixed inset-y-0 right-0 z-[80] flex w-full flex-col overflow-y-auto overscroll-contain bg-surface shadow-drawer duration-500 ease-drawer md:w-[420px] xl:hidden ${
          open ? "visible translate-x-0 transition-transform" : "invisible translate-x-full transition-[transform,visibility]"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4 md:px-6">
          <img src={mediaUrl(nav?.logo) || "/images/marca/logo-fespan.svg"} alt={nav?.logoAlt || "FESPAN"} className="block h-[34px] w-auto" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t("nav.close", locale)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken text-content transition-colors hover:bg-surface-mint"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-col px-4 pt-3 md:px-6" aria-label="Principal">
          {links.map((link: any) => {
            const active = sectionOfUrl(link.url) === activeSection;
            return (
              <a
                key={link.url}
                href={localizeHref(link.url, locale)}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                data-tina-field={tinaField(link, "label")}
                className={`flex min-h-[60px] items-center justify-between border-b border-line text-subtitle-lg tracking-[-0.01em] ${
                  active ? "font-medium text-accent" : "font-normal text-content"
                }`}
              >
                {tField(link, "label", locale)}
                <span className={`h-2 w-2 rounded-full bg-brand-primary-light ${active ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center justify-between gap-3 px-4 pt-6 md:px-6">
          <span className="text-caption-sm font-medium uppercase tracking-[0.1em] text-content-muted">{t("nav.language", locale)}</span>
          <MobileLangSwitcher locale={locale} currentPath={currentPath} />
        </div>

        <div className="mt-auto flex flex-col gap-5 px-4 pb-8 pt-7 md:px-6">
          {ctaLabel && (
            <a href={localizeHref(nav?.cta?.url, locale)} onClick={onClose} className="btn-primary btn-block" data-tina-field={tinaField(nav?.cta, "label")}>
              {ctaLabel}
            </a>
          )}
          {(footer?.phone || footer?.email) && (
            <div className="flex flex-col gap-1 text-body-sm">
              {footer?.phone && (
                <a href={phoneHref} className="flex min-h-11 items-center gap-2.5 text-accent hover:text-brand-primary">
                  <img src="/images/iconos/telefono.svg" alt="" className="h-[18px] w-[18px]" />
                  {footer.phone}
                </a>
              )}
              {footer?.email && (
                <a href={`mailto:${footer.email}`} className="flex min-h-11 items-center gap-2.5 break-all text-accent hover:text-brand-primary">
                  <img src="/images/iconos/correo.svg" alt="" className="h-[18px] w-[18px]" />
                  {footer.email}
                </a>
              )}
            </div>
          )}
          {footer?.social?.length > 0 && (
            <div className="flex items-center gap-2.5 border-t border-line pt-4">
              <span className="mr-auto text-caption-md text-content-muted">{t("nav.follow", locale)}</span>
              <SocialLinks items={footer.social} size="lg" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
