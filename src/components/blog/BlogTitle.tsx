import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function BlogTitle({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const page = data?.blogPage;
  return (
    <h1 data-reveal style={revealDelay(100)} className="text-display-lg" data-tina-field={tinaField(page, "title")}>
      {tField(page, "title", locale)}
    </h1>
  );
}
