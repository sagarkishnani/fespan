import { CalendarIcon } from "../shared/icons";
import type { PostCardModel } from "../../lib/viewModels";

interface Props {
  post: PostCardModel;
  ctaLabel: string;
  variant?: "compact" | "categorized";
}

const CARD = {
  compact: {
    root: "group card-lift flex h-full flex-col overflow-hidden rounded-3xl bg-surface-raised lg:rounded-4xl",
    media: "h-[220px] overflow-hidden rounded-3xl lg:h-[260px] lg:rounded-4xl",
    body: "flex flex-1 flex-col px-7 pb-[30px] pt-[26px]",
    meta: "flex items-center gap-2.5 border-b border-line pb-[18px] text-body-sm text-content-muted",
    title: "mt-5 text-subtitle-md text-content [text-wrap:pretty]",
    cta: "mt-auto pt-6 text-body-md font-medium text-brand-primary",
  },
  categorized: {
    root: "group flex gap-3.5 border-b border-line pb-4 md:card-lift md:h-full md:flex-col md:gap-0 md:overflow-hidden md:rounded-3xl md:border-b-0 md:bg-surface-raised md:pb-0 lg:rounded-4xl",
    media: "h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-surface-media md:h-[220px] md:w-auto md:rounded-3xl md:bg-transparent lg:h-[260px] lg:rounded-4xl",
    body: "flex min-w-0 flex-1 flex-col gap-2 md:gap-0 md:px-7 md:pb-[30px] md:pt-[26px]",
    meta: "flex items-center gap-2.5 text-caption-sm tracking-[0.08em] text-content-muted md:border-b md:border-line md:pb-[18px]",
    title: "text-body-base font-medium text-content [text-wrap:pretty] md:mt-5 md:text-subtitle-md",
    cta: "text-body-sm font-medium text-content transition-colors group-hover:text-brand-primary md:mt-auto md:pt-6 md:text-body-md md:font-medium",
  },
};

export default function PostCard({ post, ctaLabel, variant = "compact" }: Props) {
  const classes = CARD[variant];
  return (
    <a href={post.href} className={classes.root}>
      <div className={classes.media}>
        {post.image && (
          <img src={post.image} alt={post.imageAlt} loading="lazy" className="media-zoom block h-full w-full object-cover" />
        )}
      </div>
      <div className={classes.body}>
        <div className={classes.meta}>
          {variant === "categorized" ? (
            <>
              <span className="uppercase text-brand-primary">{post.category}</span>
              <span className="meta-dot" />
            </>
          ) : (
            <CalendarIcon />
          )}
          {post.date}
        </div>
        <h3 className={classes.title}>{post.title}</h3>
        <span className={classes.cta}>{ctaLabel}</span>
      </div>
    </a>
  );
}
