import { useTina } from "tinacms/dist/react";
import PageHeroSoft from "../shared/PageHeroSoft";
import type { TinaSectionProps } from "../../lib/tinaProps";

export default function KnowledgeHero({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const hero = data?.knowledgePage?.hero;
  if (!hero) return <div hidden />;
  return <PageHeroSoft hero={hero} locale={locale} />;
}
