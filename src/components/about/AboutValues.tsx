import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function AboutValues({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const values = data?.about?.values;
  if (!values) return <div hidden />;
  const items = (values.items || []).filter(Boolean);

  return (
    <section className="section bg-surface-mint">
      <div className="container-xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10 lg:mb-14">
          <h2 data-reveal style={revealDelay(100)} className="text-heading-xl" data-tina-field={tinaField(values, "title")}>
            {tField(values, "title", locale)}
          </h2>
          {values.button?.label && (
            <a href={localizeHref(values.button.url, locale)} className="btn-primary shrink-0 px-[30px] text-body-base lg:text-body-base" data-tina-field={tinaField(values.button, "label")}>
              {tField(values.button, "label", locale)}
            </a>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item: any, i: number) => (
            <div key={i} data-reveal>
              <div className="card-lift flex h-full min-h-[340px] flex-col rounded-3xl bg-surface p-9 lg:min-h-[380px]">
                {item.icon && (
                  <img src={mediaUrl(item.icon)} alt="" loading="lazy" className="block h-[84px] w-[84px] rounded-full bg-surface-sunken p-5" data-tina-field={tinaField(item, "icon")} />
                )}
                <h3 className="mt-8 text-subtitle-lg" data-tina-field={tinaField(item, "title")}>{tField(item, "title", locale)}</h3>
                <p className="mt-3.5 text-body-base leading-relaxed text-accent [text-wrap:pretty]" data-tina-field={tinaField(item, "text")}>
                  {tField(item, "text", locale)}
                </p>
                {item.link?.label && (
                  <a href={localizeHref(item.link.url, locale)} className="link-arrow mt-auto self-start pt-7 text-body-md" data-tina-field={tinaField(item.link, "label")}>
                    {tField(item.link, "label", locale)}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
