import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { t } from "../../i18n/ui";
import { CalendarIcon, PinIcon } from "../shared/icons";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";

export default function ActivityDetail({ query, variables, data: initialData, locale }: TinaSectionProps) {
  const { data } = useTina({ query, variables, data: initialData });
  const activity = data?.activity;
  if (!activity) return <div hidden />;
  const facts = (activity.facts || []).filter(Boolean);
  const title = tField(activity, "title", locale);

  return (
    <>
      <section className="bg-hero-activity pb-20 pt-[130px] lg:pb-[100px] lg:pt-[150px]">
        <div className="container-xl grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-[72px]">
          <div>
            <a href={localizeHref("/actividades", locale)} className="link-arrow text-body-base">
              <span aria-hidden="true">←</span>
              {t("activity.back", locale)}
            </a>
            {activity.badge && (
              <div className="mt-7">
                <span className="inline-flex rounded-full bg-content px-4 py-[9px] text-body-sm font-medium text-white" data-tina-field={tinaField(activity, "badge")}>
                  {tField(activity, "badge", locale)}
                </span>
              </div>
            )}
            <h1 data-reveal className="mt-6 text-display-md text-accent [text-wrap:balance]" data-tina-field={tinaField(activity, "title")}>{title}</h1>
            <div data-reveal style={revealDelay(100)} className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-subtitle-xs">
              <span className="flex items-center gap-2.5" data-tina-field={tinaField(activity, "dateLabel")}>
                <CalendarIcon width={20} height={20} className="text-accent" />
                {tField(activity, "dateLabel", locale)}
              </span>
              <span className="flex items-center gap-2.5" data-tina-field={tinaField(activity, "place")}>
                <PinIcon className="text-accent" />
                {tField(activity, "place", locale)}
              </span>
            </div>
            <p data-reveal style={revealDelay(150)} className="mt-[22px] max-w-[620px] text-subtitle-xs leading-relaxed text-content-soft [text-wrap:pretty]" data-tina-field={tinaField(activity, "summary")}>
              {tField(activity, "summary", locale)}
            </p>
            <div data-reveal style={revealDelay(200)} className="mt-10 flex flex-wrap gap-3.5">
              {activity.registerUrl && (
                <a href={localizeHref(activity.registerUrl, locale)} className="btn-primary btn-lg px-[34px]">{t("activity.register", locale)}</a>
              )}
              {activity.abstractUrl && (
                <a href={localizeHref(activity.abstractUrl, locale)} className="btn-outline btn-lg">{t("activity.abstract", locale)}</a>
              )}
            </div>
          </div>
          {activity.image && (
            <div data-reveal style={revealDelay(150)} className="h-[360px] overflow-hidden rounded-3xl bg-surface-media shadow-media lg:h-[520px]">
              <img src={mediaUrl(activity.image)} alt={title} fetchPriority="high" className="block h-full w-full object-cover" style={{ objectPosition: activity.imagePosition || "center" }} data-tina-field={tinaField(activity, "image")} />
            </div>
          )}
        </div>
      </section>
      {facts.length > 0 && (
        <section className="container-xl pb-20 pt-16 lg:pb-[130px] lg:pt-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact: any, i: number) => (
              <div key={i} data-reveal className="flex flex-col gap-2.5 rounded-[22px] border border-line px-7 py-[26px]">
                <span className="text-eyebrow uppercase text-accent" data-tina-field={tinaField(fact, "label")}>{tField(fact, "label", locale)}</span>
                <span className="text-[20px] font-medium leading-snug [text-wrap:pretty]" data-tina-field={tinaField(fact, "value")}>{tField(fact, "value", locale)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
