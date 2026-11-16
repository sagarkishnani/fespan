import { LOCALES, type Locale } from "../../i18n/config";
import { localizedPath } from "../../utils/i18n";

export default function LangSwitcher({ locale }: { locale: Locale }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <div className="flex items-center gap-1 text-body-sm">
      {LOCALES.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className="text-content-subtle">/</span>}
          <a
            href={localizedPath(pathname, code as Locale)}
            aria-current={code === locale ? "true" : undefined}
            className={
              code === locale
                ? "font-semibold text-content"
                : "text-content-subtle transition-colors hover:text-content"
            }
          >
            {code.toUpperCase()}
          </a>
        </span>
      ))}
    </div>
  );
}
