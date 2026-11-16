import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import { CopyIcon, LinkedInIcon, XLogoIcon } from "../shared/icons";

const COPIED_FEEDBACK_MS = 1800;

export default function ShareBar({ url, title, locale }: { url: string; title: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  const encodedUrl = encodeURIComponent(url);
  const round = "flex h-control-sm w-control-sm items-center justify-center rounded-full bg-surface-sunken text-content transition-colors hover:bg-surface-mint-strong";

  return (
    <div className="flex items-center gap-2.5">
      <button type="button" onClick={copy} className="flex h-control-sm items-center gap-2.5 rounded-full border border-line bg-surface px-5 text-body-sm transition-colors hover:border-brand-primary">
        <CopyIcon />
        <span aria-live="polite">{copied ? t("blog.copied", locale) : t("blog.copyLink", locale)}</span>
      </button>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" aria-label={t("share.x", locale)} className={round}>
        <XLogoIcon />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label={t("share.linkedin", locale)} className={round}>
        <LinkedInIcon width={18} height={18} />
      </a>
    </div>
  );
}
