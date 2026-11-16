import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function HomeHero({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const hero = data?.home?.hero;
  if (!hero) return <div hidden />;

  return (
    <section className="relative flex min-h-[640px] overflow-hidden bg-brand-primary-dark lg:min-h-[760px]">
      {hero.image && (
        <img src={mediaUrl(hero.image)} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" data-tina-field={tinaField(hero, "image")} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,30,27,.78)_0%,rgba(10,30,27,.55)_42%,rgba(10,30,27,.1)_80%)] lg:bg-[linear-gradient(90deg,rgba(10,30,27,.78)_0%,rgba(10,30,27,.45)_42%,rgba(10,30,27,0)_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,30,27,.55)_0%,rgba(10,30,27,0)_40%)]" />
      <div className="container-xl relative flex flex-col justify-end pb-16 pt-[160px] lg:pb-24 lg:pt-[180px]">
        <h1 data-reveal style={revealDelay(100)} className="max-w-[680px] text-display-md text-white [text-wrap:balance]" data-tina-field={tinaField(hero, "title")}>
          {tField(hero, "title", locale)}
        </h1>
        <p data-reveal style={revealDelay(200)} className="mt-8 max-w-[560px] text-body-xl text-white/80" data-tina-field={tinaField(hero, "subtitle")}>
          {tField(hero, "subtitle", locale)}
        </p>
        <div data-reveal style={revealDelay(300)} className="mt-11 flex flex-wrap gap-3.5">
          {hero.primaryButton?.label && (
            <a href={localizeHref(hero.primaryButton.url, locale)} className="btn-primary" data-tina-field={tinaField(hero.primaryButton, "label")}>
              {tField(hero.primaryButton, "label", locale)}
            </a>
          )}
          {hero.secondaryButton?.label && (
            <a href={localizeHref(hero.secondaryButton.url, locale)} className="btn-ghost-light" data-tina-field={tinaField(hero.secondaryButton, "label")}>
              {tField(hero.secondaryButton, "label", locale)}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
