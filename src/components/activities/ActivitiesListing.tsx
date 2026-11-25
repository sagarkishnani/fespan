import { useTina, tinaField } from "tinacms/dist/react";
import { tField } from "../../utils/i18n";
import { t } from "../../i18n/ui";
import ActivityCard from "../cards/ActivityCard";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";
import type { ActivityCardModel } from "../../lib/viewModels";

interface Props extends TinaSectionProps {
  congresses: ActivityCardModel[];
  trainings: ActivityCardModel[];
}

export default function ActivitiesListing({ query, variables, data: initialData, locale, congresses, trainings }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const page = data?.activitiesPage;
  if (!page) return <div hidden />;
  const ctaLabel = t("common.moreInfo", locale);

  return (
    <>
      <section className="bg-surface-raised pb-14 pt-[104px] md:pb-20 md:pt-[136px] lg:pb-[120px] lg:pt-[180px]">
        <div className="container-xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-14 md:gap-6 lg:mb-[72px] lg:flex-row lg:items-end lg:gap-[60px]">
            <div>
              <p data-reveal className="eyebrow" data-tina-field={tinaField(page.hero, "eyebrow")}>{tField(page.hero, "eyebrow", locale)}</p>
              <h1 data-reveal style={revealDelay(100)} className="max-w-[760px] text-display-lg" data-tina-field={tinaField(page.hero, "title")}>
                {tField(page.hero, "title", locale)}
              </h1>
            </div>
            <p data-reveal style={revealDelay(200)} className="max-w-[360px] text-body-md text-content-muted md:text-body-lg" data-tina-field={tinaField(page.hero, "subtitle")}>
              {tField(page.hero, "subtitle", locale)}
            </p>
          </div>
          <h2 data-reveal className="mb-5 text-heading-md md:mb-9" data-tina-field={tinaField(page, "congressesTitle")}>
            {tField(page, "congressesTitle", locale)}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {congresses.map((activity) => (
              <div key={activity.slug} data-reveal>
                <ActivityCard activity={activity} ctaLabel={ctaLabel} framed />
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.training && trainings.length > 0 && (
        <section className="pb-16 pt-14 md:py-20 lg:py-[120px]">
          <div className="container-xl">
            <p data-reveal className="eyebrow" data-tina-field={tinaField(page.training, "eyebrow")}>{tField(page.training, "eyebrow", locale)}</p>
            <h2 data-reveal style={revealDelay(100)} className="mb-6 text-heading-xl md:mb-14" data-tina-field={tinaField(page.training, "title")}>
              {tField(page.training, "title", locale)}
            </h2>
            <h3 data-reveal className="mb-5 text-subtitle-lg md:mb-8" data-tina-field={tinaField(page.training, "listTitle")}>
              {tField(page.training, "listTitle", locale)}
            </h3>
            <div className="grid gap-7 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
              {trainings.map((activity) => (
                <div key={activity.slug} data-reveal>
                  <ActivityCard activity={activity} ctaLabel={ctaLabel} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
