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
        framed ? "rounded-4xl bg-surface px-5 pb-7 pt-5" : ""
      }`}
    >
      <a
        href={activity.href}
        className="relative block h-[260px] overflow-hidden rounded-2xl bg-surface-media lg:h-[300px]"
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
          <span className="absolute right-4 top-4 rounded-lg bg-brand-primary px-4 py-2.5 text-body-sm font-medium text-white">
            {activity.date}
          </span>
        )}
      </a>
      <div className={`flex flex-1 flex-col ${framed ? "px-3" : "px-1"}`}>
        <span className="mt-[26px] text-body-sm font-medium text-brand-primary">{activity.place}</span>
        <h3 className="mt-2.5 text-subtitle-lg text-content [text-wrap:balance]">
          <a href={activity.href} className="hover:text-brand-primary">{activity.title}</a>
        </h3>
        <p className="mt-3.5 text-body-md leading-relaxed text-content-muted [text-wrap:pretty]">{activity.summary}</p>
        <div className="mt-auto" />
        <a href={activity.href} className="btn-outline mt-7 h-[52px] self-start px-[26px] text-body-md lg:text-body-md">
          <span className="sr-only">{activity.title}: </span>
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}
