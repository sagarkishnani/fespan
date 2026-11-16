import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function ContactHero({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const hero = data?.contactPage?.hero;
  if (!hero) return <div hidden />;

  return (
    <section className="relative flex min-h-[480px] overflow-hidden bg-surface-warm lg:min-h-[540px]">
      {hero.image && (
        <img src={mediaUrl(hero.image)} alt="" fetchPriority="high" className="absolute right-0 top-0 h-full w-full -scale-x-100 object-cover object-left opacity-40 md:w-[58%] md:opacity-100" data-tina-field={tinaField(hero, "image")} />
      )}
      <div className="absolute inset-0 bg-hero-contact-scrim" />
      <div className="container-xl relative flex flex-col justify-end pb-16 pt-[160px] lg:pb-24 lg:pt-[180px]">
        <h1 data-reveal className="text-display-xl" data-tina-field={tinaField(hero, "title")}>{tField(hero, "title", locale)}</h1>
        <p data-reveal style={revealDelay(100)} className="mt-6 max-w-[480px] text-body-xl text-content-muted" data-tina-field={tinaField(hero, "subtitle")}>
          {tField(hero, "subtitle", locale)}
        </p>
      </div>
    </section>
  );
}
