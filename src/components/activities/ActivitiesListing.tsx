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
      <section className="page-top bg-surface-raised pb-20 lg:pb-[120px]">
        <div className="container-xl">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:mb-[72px] lg:flex-row lg:items-end lg:gap-[60px]">
            <div>
              <p data-reveal className="eyebrow" data-tina-field={tinaField(page.hero, "eyebrow")}>{tField(page.hero, "eyebrow", locale)}</p>
              <h1 data-reveal style={revealDelay(100)} className="max-w-[760px] text-display-lg" data-tina-field={tinaField(page.hero, "title")}>
                {tField(page.hero, "title", locale)}
              </h1>
            </div>
            <p data-reveal style={revealDelay(200)} className="max-w-[360px] text-body-lg text-content-muted" data-tina-field={tinaField(page.hero, "subtitle")}>
              {tField(page.hero, "subtitle", locale)}
            </p>
          </div>
          <h2 data-reveal className="mb-9 text-heading-md" data-tina-field={tinaField(page, "congressesTitle")}>
            {tField(page, "congressesTitle", locale)}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {congresses.map((activity) => (
              <div key={activity.slug} data-reveal>
                <ActivityCard activity={activity} ctaLabel={ctaLabel} framed />
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.training && trainings.length > 0 && (
        <section className="section">
          <div className="container-xl">
            <p data-reveal className="eyebrow" data-tina-field={tinaField(page.training, "eyebrow")}>{tField(page.training, "eyebrow", locale)}</p>
            <h2 data-reveal style={revealDelay(100)} className="mb-14 text-heading-xl" data-tina-field={tinaField(page.training, "title")}>
              {tField(page.training, "title", locale)}
            </h2>
            <h3 data-reveal className="mb-8 text-subtitle-lg" data-tina-field={tinaField(page.training, "listTitle")}>
              {tField(page.training, "listTitle", locale)}
            </h3>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
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
