import { CalendarIcon } from "../shared/icons";
import type { PostCardModel } from "../../lib/viewModels";

interface Props {
  post: PostCardModel;
  ctaLabel: string;
  variant?: "compact" | "categorized";
}

export default function PostCard({ post, ctaLabel, variant = "compact" }: Props) {
  const categorized = variant === "categorized";
  return (
    <a
      href={post.href}
      className="group card-lift flex h-full flex-col overflow-hidden rounded-3xl bg-surface-raised lg:rounded-4xl"
    >
      <div className="h-[220px] overflow-hidden rounded-3xl lg:h-[260px] lg:rounded-4xl">
        {post.image && (
          <img src={post.image} alt={post.imageAlt} loading="lazy" className="media-zoom block h-full w-full object-cover" />
        )}
      </div>
      <div className="flex flex-1 flex-col px-7 pb-[30px] pt-[26px]">
        <div
          className={`flex items-center gap-2.5 border-b border-line pb-[18px] text-content-muted ${
            categorized ? "text-caption-sm tracking-[0.08em]" : "text-body-sm"
          }`}
        >
          {categorized ? (
            <>
              <span className="uppercase text-brand-primary">{post.category}</span>
              <span className="meta-dot" />
            </>
          ) : (
            <CalendarIcon />
          )}
          {post.date}
        </div>
        <h3 className="mt-5 text-subtitle-md text-content [text-wrap:pretty]">{post.title}</h3>
        <span
          className={`mt-auto pt-6 text-body-md font-medium ${
            categorized ? "text-content transition-colors group-hover:text-brand-primary" : "text-brand-primary"
          }`}
        >
          {ctaLabel}
        </span>
      </div>
    </a>
  );
}
