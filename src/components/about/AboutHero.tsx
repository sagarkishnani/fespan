import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function AboutHero({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const hero = data?.about?.hero;
  if (!hero) return <div hidden />;

  return (
    <section className="relative flex overflow-hidden bg-hero-about md:min-h-[560px] lg:min-h-[620px]">
      {hero.image && (
        <img src={mediaUrl(hero.image)} alt={tField(hero, "imageAlt", locale)} fetchPriority="high" className="absolute right-0 top-0 h-full w-[52%] object-cover max-md:hidden" data-tina-field={tinaField(hero, "image")} />
      )}
      <div className="absolute inset-0 bg-hero-about-scrim max-md:hidden" />
      <div className="container-xl relative flex flex-col justify-end pb-8 pt-[112px] md:pb-16 md:pt-[160px] lg:pb-[100px] lg:pt-[180px]">
        <h1 data-reveal style={revealDelay(100)} className="text-display-xl text-accent" data-tina-field={tinaField(hero, "title")}>
          {tField(hero, "title", locale)}
        </h1>
        <p data-reveal style={revealDelay(200)} className="mt-4 max-w-[520px] text-body-base text-content-soft md:mt-7 md:text-body-xl" data-tina-field={tinaField(hero, "subtitle")}>
          {tField(hero, "subtitle", locale)}
        </p>
        {hero.image && (
          <div data-reveal style={revealDelay(150)} className="mt-7 h-[260px] overflow-hidden rounded-2xl md:hidden">
            <img src={mediaUrl(hero.image)} alt={tField(hero, "imageAlt", locale)} fetchPriority="high" className="block h-full w-full object-cover" />
          </div>
        )}
        {hero.buttonLabel && (
          <div data-reveal style={revealDelay(300)} className="mt-10 hidden md:block">
            <a href="#nosotros" className="btn h-14 border border-accent bg-transparent px-[30px] text-body-base text-accent hover:bg-accent hover:text-white lg:text-body-base" data-tina-field={tinaField(hero, "buttonLabel")}>
              {tField(hero, "buttonLabel", locale)}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
