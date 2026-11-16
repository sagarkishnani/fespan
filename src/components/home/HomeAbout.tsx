import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { paragraphs } from "../../utils/format";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function HomeAbout({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const about = data?.home?.about;
  if (!about) return <div hidden />;
  const stats = (about.stats || []).filter(Boolean);

  return (
    <section className="container-xl section">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <p data-reveal className="eyebrow" data-tina-field={tinaField(about, "eyebrow")}>{tField(about, "eyebrow", locale)}</p>
          <h2 data-reveal style={revealDelay(100)} className="text-heading-xl" data-tina-field={tinaField(about, "title")}>
            {tField(about, "title", locale)}
          </h2>
          <div data-reveal style={revealDelay(150)} className="mt-7 flex flex-col gap-[18px]" data-tina-field={tinaField(about, "body")}>
            {paragraphs(tField(about, "body", locale)).map((paragraph) => (
              <p key={paragraph} className="text-body-lg text-content-muted [text-wrap:pretty]">{paragraph}</p>
            ))}
          </div>
          {stats.length > 0 && (
            <div data-reveal style={revealDelay(250)} className="mt-12 flex flex-wrap gap-x-[72px] gap-y-8">
              {stats.map((stat: any, i: number) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="flex items-baseline text-[clamp(3.5rem,4vw+1.5rem,4.5rem)] font-medium leading-none tracking-[-0.04em]" data-tina-field={tinaField(stat, "value")}>
                    <span data-count={stat.value ?? 0}>{(stat.value ?? 0).toLocaleString("en-US")}</span>
                    <span className="text-brand-primary-light">{stat.suffix}</span>
                  </div>
                  <span className="text-body-base" data-tina-field={tinaField(stat, "label")}>{tField(stat, "label", locale)}</span>
                </div>
              ))}
            </div>
          )}
          {about.button?.label && (
            <div data-reveal style={revealDelay(300)} className="mt-12">
              <a href={localizeHref(about.button.url, locale)} className="btn-primary" data-tina-field={tinaField(about.button, "label")}>
                {tField(about.button, "label", locale)}
              </a>
            </div>
          )}
        </div>
        {about.image && (
          <div data-reveal style={revealDelay(150)} className="group h-[420px] overflow-hidden rounded-3xl lg:h-[660px]">
            <img src={mediaUrl(about.image)} alt="" loading="lazy" className="block h-full w-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-105" data-tina-field={tinaField(about, "image")} />
          </div>
        )}
      </div>
    </section>
  );
}
