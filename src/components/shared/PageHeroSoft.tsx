import { tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { revealDelay } from "../../lib/tinaProps";
import type { Locale } from "../../i18n/config";

export default function PageHeroSoft({ hero, locale }: { hero: any; locale: Locale }) {
  return (
    <section className="relative overflow-hidden bg-hero-soft pb-20 pt-[150px] lg:pb-[110px] lg:pt-[190px]">
      <div className="pointer-events-none absolute -right-[180px] -top-[60px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(45,190,108,.28)_0%,rgba(45,190,108,0)_65%)]" />
      <div className="container-xl relative">
        <h1 data-reveal className="text-display-xl text-accent" data-tina-field={tinaField(hero, "title")}>
          {tField(hero, "title", locale)}
        </h1>
        <p data-reveal style={revealDelay(100)} className="mt-7 text-body-xl text-content-soft" data-tina-field={tinaField(hero, "subtitle")}>
          {tField(hero, "subtitle", locale)}
        </p>
      </div>
    </section>
  );
}
