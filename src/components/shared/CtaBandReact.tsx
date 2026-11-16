import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import type { Locale } from "../../i18n/config";
import { revealDelay } from "../../lib/tinaProps";

interface Props {
  query: string;
  variables: object;
  data: any;
  locale: Locale;
}

export default function CtaBandReact({ query, variables, data: initialData, locale }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const band = data?.global?.ctaBand;
  if (!band?.title) return <div hidden />;

  return (
    <section className="relative overflow-hidden bg-brand-primary-dark">
      <img src="/images/marca/isotipo.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -left-10 -top-[60px] h-[560px] opacity-[0.07]" loading="lazy" />
      <div className="container-xl relative flex flex-col items-start gap-10 py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-[60px] lg:py-[120px]">
        <h2 data-reveal className="max-w-[720px] text-heading-lg text-white" data-tina-field={tinaField(band, "title")}>
          {tField(band, "title", locale)}
        </h2>
        {band.button?.label && (
          <div data-reveal style={revealDelay(150)}>
            <a href={localizeHref(band.button.url, locale)} className="btn-light shrink-0 px-[34px]" data-tina-field={tinaField(band.button, "label")}>
              {tField(band.button, "label", locale)}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
