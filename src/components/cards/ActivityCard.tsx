import type { ActivityCardModel } from "../../lib/viewModels";

interface Props {
  activity: ActivityCardModel;
  ctaLabel: string;
  framed?: boolean;
}

export default function ActivityCard({ activity, ctaLabel, framed = false }: Props) {
  return (
    <article
      className={`group flex h-full flex-col transition-transform duration-[400ms] hover:-translate-y-1.5 ${
        framed ? "rounded-2xl bg-surface p-3 pb-5 md:rounded-4xl md:px-5 md:pb-7 md:pt-5" : ""
      }`}
    >
      <a
        href={activity.href}
        className={`relative block h-[200px] overflow-hidden bg-surface-media md:h-[260px] md:rounded-2xl lg:h-[300px] ${framed ? "rounded-[18px]" : "rounded-[20px]"}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        {activity.image && (
          <img
            src={activity.image}
            alt=""
            loading="lazy"
            className="media-zoom block h-full w-full object-cover"
            style={{ objectPosition: activity.imagePosition }}
          />
        )}
        {activity.date && (
          <span className="absolute right-3 top-3 rounded-[10px] bg-brand-primary px-3 py-2 text-caption-md font-medium text-white md:right-4 md:top-4 md:rounded-lg md:px-4 md:py-2.5 md:text-body-sm md:font-medium">
            {activity.date}
          </span>
        )}
      </a>
      <div className={`flex flex-1 flex-col ${framed ? "px-2 md:px-3" : "px-1"}`}>
        <span className={`text-caption-md font-medium text-brand-primary md:mt-[26px] md:text-body-sm md:font-medium ${framed ? "mt-[18px]" : "mt-4"}`}>{activity.place}</span>
        <h3 className="mt-2 text-subtitle-lg md:mt-2.5 text-content [text-wrap:balance]">
          <a href={activity.href} className="hover:text-brand-primary">{activity.title}</a>
        </h3>
        <p className="mt-2.5 text-body-sm leading-relaxed text-content-muted md:mt-3.5 md:text-body-md md:leading-relaxed [text-wrap:pretty]">{activity.summary}</p>
        <div className="mt-auto" />
        <a href={activity.href} className="btn-outline btn-block mt-[18px] h-[52px] self-start px-[26px] text-body-md md:mt-7 lg:text-body-md">
          <span className="sr-only">{activity.title}: </span>
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}
