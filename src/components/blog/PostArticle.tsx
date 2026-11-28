import { useTina, tinaField } from "tinacms/dist/react";
import { tField, richField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { formatShortDate } from "../../utils/format";
import { t, translateTerm } from "../../i18n/ui";
import { FaChevronLeft } from "react-icons/fa6";
import PostBody from "./PostBody";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";
import type { ReactNode } from "react";

interface Props extends TinaSectionProps {
  children?: ReactNode;
}

export default function PostArticle({ query, variables, data: initialData, locale, children }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const post = data?.post;
  if (!post) return <div hidden />;
  const title = tField(post, "title", locale);
  const tags: string[] = ((locale !== "es" && post[`tags_${locale}`]?.length ? post[`tags_${locale}`] : post.tags) || []).filter(Boolean);
  const author = post.author;

  return (
    <div className="pt-[76px] md:pt-[120px] lg:pt-[150px]">
      <div className="container-xl">
        <a href={localizeHref("/blog", locale)} className="link-arrow min-h-11 text-body-md font-medium md:hidden">
          <FaChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
          {t("blog.back", locale)}
        </a>
        <nav aria-label="Breadcrumb" className="hidden flex-wrap items-center gap-2 text-body-sm text-content-muted md:flex">
          <a href={localizeHref("/", locale)} className="text-content hover:text-brand-primary">{t("nav.home", locale)}</a>
          <span>/</span>
          <a href={localizeHref("/blog", locale)} className="text-content hover:text-brand-primary">Blog</a>
          <span>/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <header className="mx-auto mt-4 flex max-w-[860px] flex-col items-start text-left md:mt-14 md:items-center md:text-center">
          <div data-reveal className="flex items-center gap-2.5 text-caption-md tracking-[0.08em] text-content-muted">
            <span className="uppercase text-brand-primary" data-tina-field={tinaField(post, "category")}>{translateTerm(post.category || "", locale)}</span>
            <span className="meta-dot" />
            <time dateTime={post.date}>{formatShortDate(post.date, locale)}</time>
          </div>
          <h1 data-reveal style={revealDelay(100)} className="mt-3 text-display-md md:mt-[18px] [text-wrap:balance]" data-tina-field={tinaField(post, "title")}>{title}</h1>
          {post.excerpt && (
            <p data-reveal style={revealDelay(200)} className="mt-3.5 max-w-[620px] text-body-xl md:mt-[22px] text-content-muted" data-tina-field={tinaField(post, "excerpt")}>
              {tField(post, "excerpt", locale)}
            </p>
          )}
          {author?.name && (
            <div data-reveal style={revealDelay(300)} className="mt-5 flex items-center gap-3 md:hidden">
              {author.photo && <img src={mediaUrl(author.photo)} alt={author.name} className="h-11 w-11 rounded-full object-cover object-[center_20%]" />}
              <div>
                <div className="text-body-sm font-medium" data-tina-field={tinaField(author, "name")}>{author.name}</div>
                <div className="text-caption-md text-content-muted" data-tina-field={tinaField(author, "role")}>{tField(author, "role", locale)}</div>
              </div>
            </div>
          )}
        </header>
        {post.coverImage && (
          <div data-reveal className="mt-7 h-[260px] overflow-hidden rounded-2xl md:mt-14 md:h-[300px] md:rounded-4xl lg:h-[560px] lg:rounded-5xl">
            <img src={mediaUrl(post.coverImage)} alt={post.coverAlt || ""} fetchPriority="high" className="block h-full w-full object-cover" data-tina-field={tinaField(post, "coverImage")} />
          </div>
        )}
      </div>

      <article className="container-md pt-8 md:pt-16 lg:pt-20">
        <div
          className="prose prose-lg max-w-none prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-content prose-h2:mt-12 prose-h2:text-heading-sm prose-p:text-content-soft prose-p:leading-[1.7] max-md:prose-p:text-body-base prose-a:text-brand-primary prose-a:underline prose-strong:text-content [&>p:first-child]:border-b [&>p:first-child]:border-line [&>p:first-child]:pb-6 md:[&>p:first-child]:pb-9 [&>p:first-child]:text-body-xl [&>p:first-child]:text-content"
          data-tina-field={tinaField(post, "body")}
        >
          <PostBody content={richField(post, "body", locale)} />
        </div>

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="mr-1.5 text-body-sm text-content-muted">{t("blog.tags", locale)}</span>
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-surface-mint px-4 py-2 text-caption-md text-brand-primary">{tag}</span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-6 border-t border-line pt-5 sm:flex-row md:pt-7 sm:items-center sm:justify-between">
          {author?.name ? (
            <div className="hidden items-center gap-4 md:flex">
              {author.photo && <img src={mediaUrl(author.photo)} alt={author.name} className="h-14 w-14 rounded-full object-cover object-[center_20%]" loading="lazy" />}
              <div>
                <div className="text-body-base font-medium" data-tina-field={tinaField(author, "name")}>{author.name}</div>
                <div className="mt-0.5 text-body-sm text-content-muted" data-tina-field={tinaField(author, "role")}>{tField(author, "role", locale)}</div>
              </div>
            </div>
          ) : (
            <span className="hidden md:block" />
          )}
          {children}
        </div>
      </article>
    </div>
  );
}
