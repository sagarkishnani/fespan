import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function MembersHero({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const hero = data?.membersPage?.hero;
  if (!hero) return <div hidden />;
  return (
    <>
      <h1 data-reveal style={revealDelay(100)} className="text-display-lg" data-tina-field={tinaField(hero, "title")}>
        {tField(hero, "title", locale)}
      </h1>
      <p data-reveal style={revealDelay(150)} className="mb-7 mt-[22px] max-w-[460px] text-body-lg text-content-muted" data-tina-field={tinaField(hero, "subtitle")}>
        {tField(hero, "subtitle", locale)}
      </p>
    </>
  );
}
