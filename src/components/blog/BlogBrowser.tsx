import { useMemo, useState, type ReactNode } from "react";
import type { Locale } from "../../i18n/config";
import { t } from "../../i18n/ui";
import { normalizeForSearch } from "../../utils/format";
import { SearchIcon } from "../shared/icons";
import PostCard from "../cards/PostCard";
import type { PostCardModel } from "../../lib/viewModels";

interface Props {
  posts: PostCardModel[];
  categories: Array<{ key: string; label: string }>;
  locale: Locale;
  children?: ReactNode;
}

const ALL = "";

function PostMeta({ post, inverted = false }: { post: PostCardModel; inverted?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 text-caption-sm tracking-[0.08em] ${inverted ? "text-white/85" : "text-content-muted"}`}>
      <span className={`uppercase ${inverted ? "text-brand-primary-light" : "text-brand-primary"}`}>{post.category}</span>
      <span className={inverted ? "h-1 w-1 rounded-full bg-white/60" : "meta-dot"} />
      {post.date}
    </div>
  );
}

function FeaturedPost({ post, locale }: { post: PostCardModel; locale: Locale }) {
  return (
    <a href={post.href} className="group relative block h-[420px] overflow-hidden rounded-4xl bg-brand-primary-dark lg:h-[480px]">
      {post.image && <img src={post.image} alt={post.imageAlt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-105" />}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(15,46,42,.92)_0%,rgba(15,46,42,.35)_55%,rgba(15,46,42,.1)_100%)]" />
      <div className="absolute inset-x-7 bottom-7 text-white lg:inset-x-11 lg:bottom-11">
        <PostMeta post={post} inverted />
        <h2 className="mt-4 max-w-[640px] text-heading-lg">{post.title}</h2>
        <span className="mt-7 inline-flex items-center rounded-full bg-white py-3 pl-6 pr-6 text-body-md font-medium text-content">
          {t("common.readMore", locale)}
        </span>
      </div>
    </a>
  );
}

function SidePost({ post, locale }: { post: PostCardModel; locale: Locale }) {
  return (
    <a href={post.href} className="group card-lift flex h-full flex-col overflow-hidden rounded-4xl bg-surface-raised">
      <div className="h-[250px] overflow-hidden rounded-4xl">
        {post.image && <img src={post.image} alt={post.imageAlt} className="media-zoom block h-full w-full object-cover" />}
      </div>
      <div className="flex flex-1 flex-col px-[30px] pb-[30px] pt-[26px]">
        <PostMeta post={post} />
        <h3 className="mt-3.5 text-subtitle-lg">{post.title}</h3>
        <span className="mt-auto pt-6 text-body-md font-medium text-brand-primary">{t("common.readMore", locale)}</span>
      </div>
    </a>
  );
}

export default function BlogBrowser({ posts, categories, locale, children }: Props) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");
  const needle = normalizeForSearch(query.trim());
  const filtering = category !== ALL || needle !== "";

  const featured = posts.find((post) => post.featured) ?? posts[0];
  const side = posts.find((post) => post !== featured);

  const listed = useMemo(() => {
    if (!filtering) return posts.filter((post) => post !== featured && post !== side);
    return posts
      .filter((post) => category === ALL || post.categoryKey === category)
      .filter((post) => !needle || normalizeForSearch(`${post.title} ${post.excerpt}`).includes(needle));
  }, [posts, category, needle, filtering, featured, side]);

  const chips = [{ key: ALL, label: t("common.all", locale) }, ...categories];

  return (
    <div>
      <div className="mb-6 md:mb-12">
        {children}
        <div className="mt-6 flex flex-col gap-3.5 md:mt-9 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-5">
          <div className="relative w-full md:w-auto md:min-w-[260px] md:max-w-[460px] md:flex-1">
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("blog.searchPlaceholder", locale)}
              aria-label={t("blog.searchPlaceholder", locale)}
              className="field field-with-icon"
            />
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {chips.map((chip) => {
              const active = chip.key === category;
              return (
                <button
                  key={chip.key || "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(chip.key)}
                  className={`h-11 shrink-0 rounded-full border px-5 text-body-sm transition-colors ${
                    active ? "border-brand-primary bg-brand-primary text-white" : "border-line bg-surface text-content hover:border-brand-primary"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!filtering && featured && (
        <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <FeaturedPost post={featured} locale={locale} />
          {side && <SidePost post={side} locale={locale} />}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listed.map((post) => (
          <PostCard key={post.slug} post={post} ctaLabel={t("common.readMore", locale)} variant="categorized" />
        ))}
        {filtering && listed.length === 0 && (
          <div className="col-span-full rounded-2xl bg-surface-raised p-14 text-center text-body-lg text-content-muted">{t("common.noResults", locale)}</div>
        )}
      </div>
    </div>
  );
}
