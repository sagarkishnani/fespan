import { useTina, tinaField } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tField, richField } from "../../utils/i18n";
import { formatShortDate } from "../../utils/format";
import type { TinaSectionProps } from "../../lib/tinaProps";

export default function LegalPage({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const page = data?.legal;
  if (!page) return <div hidden />;

  return (
    <article className="container-md page-top pb-20 lg:pb-[120px]">
      <h1 className="text-display-md" data-tina-field={tinaField(page, "title")}>{tField(page, "title", locale)}</h1>
      {page.updated && <p className="mt-4 text-body-sm text-content-muted">{formatShortDate(page.updated, locale)}</p>}
      <div className="prose prose-lg mt-10 max-w-none prose-headings:font-medium prose-p:text-content-soft prose-a:text-brand-primary" data-tina-field={tinaField(page, "body")}>
        <TinaMarkdown content={richField(page, "body", locale)} />
      </div>
    </article>
  );
}
