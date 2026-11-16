import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { paragraphs } from "../../utils/format";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function AboutIntro({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const intro = data?.about?.intro;
  if (!intro) return <div hidden />;

  return (
    <section id="nosotros" className="container-xl scroll-mt-[88px] py-20 lg:py-[130px]">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <h2 data-reveal style={revealDelay(100)} className="text-heading-xl" data-tina-field={tinaField(intro, "title")}>
            {tField(intro, "title", locale)}
          </h2>
          <div data-reveal style={revealDelay(150)} className="mt-7 flex flex-col gap-[18px]" data-tina-field={tinaField(intro, "body")}>
            {paragraphs(tField(intro, "body", locale)).map((paragraph) => (
              <p key={paragraph} className="text-body-lg text-content-muted [text-wrap:pretty]">{paragraph}</p>
            ))}
          </div>
          {intro.button?.label && (
            <div data-reveal style={revealDelay(250)} className="mt-11">
              <a href={localizeHref(intro.button.url, locale)} className="btn-primary" data-tina-field={tinaField(intro.button, "label")}>
                {tField(intro.button, "label", locale)}
              </a>
            </div>
          )}
        </div>
        {intro.image && (
          <div data-reveal style={revealDelay(150)} className="group h-[400px] overflow-hidden rounded-3xl lg:h-[620px]">
            <img src={mediaUrl(intro.image)} alt="" loading="lazy" className="block h-full w-full object-cover object-[30%_center] transition-transform duration-[1200ms] ease-smooth group-hover:scale-105" data-tina-field={tinaField(intro, "image")} />
          </div>
        )}
      </div>
    </section>
  );
}
