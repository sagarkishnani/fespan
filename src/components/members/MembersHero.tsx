import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

const subtitleClasses = "mb-6 mt-3.5 max-w-[460px] text-body-md text-content-muted md:mb-7 md:mt-[22px] md:text-body-lg";

export default function MembersHero({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const hero = data?.membersPage?.hero;
  if (!hero) return <div hidden />;
  const subtitle = tField(hero, "subtitle", locale);
  const touchSubtitle = tField(hero, "touchSubtitle", locale);
  return (
    <>
      <h1 data-reveal style={revealDelay(100)} className="text-display-lg" data-tina-field={tinaField(hero, "title")}>
        {tField(hero, "title", locale)}
      </h1>
      <p data-reveal style={revealDelay(150)} className={`${subtitleClasses} hidden can-hover:block`} data-tina-field={tinaField(hero, "subtitle")}>
        {subtitle}
      </p>
      <p data-reveal style={revealDelay(150)} className={`${subtitleClasses} can-hover:hidden`} data-tina-field={tinaField(hero, "touchSubtitle")}>
        {touchSubtitle || subtitle}
      </p>
    </>
  );
}
