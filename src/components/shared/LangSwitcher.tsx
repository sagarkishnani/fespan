import { LOCALES, LOCALE_NAMES, type Locale } from "../../i18n/config";
import { localizedPath } from "../../utils/i18n";
import { t } from "../../i18n/ui";
import { ChevronDownIcon } from "./icons";
import Dropdown from "./Dropdown";

interface Props {
  locale: Locale;
  currentPath: string;
  open: boolean;
  onToggle: () => void;
}

export default function LangSwitcher({ locale, currentPath, open, onToggle }: Props) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={t("lang.switch", locale)}
        className="flex h-control-sm items-center gap-1.5 rounded-full border border-line bg-surface pl-4 pr-3 text-body-sm font-semibold text-brand-primary transition-colors hover:border-brand-primary"
      >
        {locale.toUpperCase()}
        <ChevronDownIcon className={`text-content transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <Dropdown className="right-0 top-[54px] min-w-[170px] p-1.5">
          {LOCALES.map((code) => (
            <a
              key={code}
              href={localizedPath(currentPath, code)}
              hrefLang={code}
              aria-current={code === locale ? "true" : undefined}
              className={`flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 text-body-sm hover:bg-surface-raised ${
                code === locale ? "bg-surface-mint font-semibold text-brand-primary" : "text-content"
              }`}
            >
              <span>{LOCALE_NAMES[code]}</span>
              <span className="text-caption-sm text-content-muted">{code.toUpperCase()}</span>
            </a>
          ))}
        </Dropdown>
      )}
    </div>
  );
}

export function MobileLangSwitcher({ locale, currentPath }: { locale: Locale; currentPath: string }) {
  return (
    <div className="flex gap-2">
      {LOCALES.map((code) => (
        <a
          key={code}
          href={localizedPath(currentPath, code)}
          hrefLang={code}
          aria-current={code === locale ? "true" : undefined}
          className={`rounded-full border px-4 py-2 text-body-sm ${
            code === locale ? "border-brand-primary bg-surface-mint font-semibold text-brand-primary" : "border-line text-content"
          }`}
        >
          {LOCALE_NAMES[code]}
        </a>
      ))}
    </div>
  );
}
