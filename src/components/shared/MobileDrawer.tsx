import { useEffect, useRef } from "react";
import { tinaField } from "tinacms/dist/react";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import { localizeHref, tField } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import useFocusTrap from "../../hooks/useFocusTrap";
import { CloseIcon } from "./icons";

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

export default function MobileDrawer({ open, onClose, nav, locale, activeSection }: Props) {
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
      </div>
    </>
  );
}
