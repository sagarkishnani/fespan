import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import { t } from "../../i18n/ui";
import { CalendarIcon } from "../shared/icons";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";
import type { ActivityCardModel } from "../../lib/viewModels";

interface Props extends TinaSectionProps {
  activities: ActivityCardModel[];
}

export default function HomeActivities({ query, variables, data: initialData, locale, activities }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const section = data?.home?.activities;
  if (!section) return <div hidden />;

  return (
    <section className="section bg-surface-raised">
      <div className="container-xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10 lg:mb-14">
          <div>
            <p data-reveal className="eyebrow" data-tina-field={tinaField(section, "eyebrow")}>{tField(section, "eyebrow", locale)}</p>
            <h2 data-reveal style={revealDelay(100)} className="text-heading-xl" data-tina-field={tinaField(section, "title")}>
              {tField(section, "title", locale)}
            </h2>
          </div>
          {section.button?.label && (
            <a href={localizeHref(section.button.url, locale)} className="btn-secondary shrink-0 px-7" data-tina-field={tinaField(section.button, "label")}>
              {tField(section.button, "label", locale)}
            </a>
          )}
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.slug} data-reveal className="w-[85%] shrink-0 snap-start md:w-auto">
              <a href={activity.href} className="group card-lift flex h-full flex-col overflow-hidden rounded-3xl bg-surface">
                <div className="h-[220px] shrink-0 overflow-hidden rounded-3xl bg-surface-media lg:h-[260px]">
                  {activity.image && (
                    <img src={activity.image} alt="" loading="lazy" className="media-zoom block h-full w-full object-cover" style={{ objectPosition: activity.imagePosition }} />
                  )}
                </div>
                <div className="flex flex-1 flex-col px-7 pb-[30px] pt-[26px]">
                  <div className="flex items-center gap-2.5 border-b border-line pb-[18px] text-body-sm text-content-muted">
                    <CalendarIcon />
                    {activity.date}
                    <span className="meta-dot" />
                    {activity.place}
                  </div>
                  <h3 className="mt-5 text-subtitle-md [text-wrap:pretty]">{activity.title}</h3>
                  <span className="mt-auto pt-6 text-body-md font-medium text-brand-primary">{t("common.moreInfo", locale)}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
