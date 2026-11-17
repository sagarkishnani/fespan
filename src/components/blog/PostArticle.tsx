import { useTina, tinaField } from "tinacms/dist/react";
import { tField, richField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import { formatShortDate } from "../../utils/format";
import { t, translateTerm } from "../../i18n/ui";
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
    <div className="pt-[120px] lg:pt-[150px]">
      <div className="container-xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-body-sm text-content-muted">
          <a href={localizeHref("/", locale)} className="text-content hover:text-brand-primary">{t("nav.home", locale)}</a>
          <span>/</span>
          <a href={localizeHref("/blog", locale)} className="text-content hover:text-brand-primary">Blog</a>
          <span>/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <header className="mx-auto mt-14 flex max-w-[860px] flex-col items-center text-center">
          <div data-reveal className="flex items-center gap-2.5 text-caption-md tracking-[0.08em] text-content-muted">
            <span className="uppercase text-brand-primary" data-tina-field={tinaField(post, "category")}>{translateTerm(post.category || "", locale)}</span>
            <span className="meta-dot" />
            <time dateTime={post.date}>{formatShortDate(post.date, locale)}</time>
          </div>
          <h1 data-reveal style={revealDelay(100)} className="mt-[18px] text-display-md [text-wrap:balance]" data-tina-field={tinaField(post, "title")}>{title}</h1>
          {post.excerpt && (
            <p data-reveal style={revealDelay(200)} className="mt-[22px] max-w-[620px] text-body-xl text-content-muted" data-tina-field={tinaField(post, "excerpt")}>
              {tField(post, "excerpt", locale)}
            </p>
          )}
        </header>
        {post.coverImage && (
          <div data-reveal className="mt-14 h-[300px] overflow-hidden rounded-4xl lg:h-[560px] lg:rounded-5xl">
            <img src={mediaUrl(post.coverImage)} alt={post.coverAlt || ""} fetchPriority="high" className="block h-full w-full object-cover" data-tina-field={tinaField(post, "coverImage")} />
          </div>
        )}
      </div>

      <article className="container-md pt-16 lg:pt-20">
        <div
          className="prose prose-lg max-w-none prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-content prose-h2:mt-12 prose-h2:text-heading-sm prose-p:text-content-soft prose-p:leading-[1.7] prose-a:text-brand-primary prose-a:underline prose-strong:text-content [&>div>p:first-child]:border-b [&>div>p:first-child]:border-line [&>div>p:first-child]:pb-9 [&>div>p:first-child]:text-body-xl [&>div>p:first-child]:text-content"
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

        <div className="mt-6 flex flex-col gap-6 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          {author?.name ? (
            <div className="flex items-center gap-4">
              {author.photo && <img src={mediaUrl(author.photo)} alt={author.name} className="h-14 w-14 rounded-full object-cover object-[center_20%]" loading="lazy" />}
              <div>
                <div className="text-body-base font-medium" data-tina-field={tinaField(author, "name")}>{author.name}</div>
                <div className="mt-0.5 text-body-sm text-content-muted" data-tina-field={tinaField(author, "role")}>{tField(author, "role", locale)}</div>
              </div>
            </div>
          ) : (
            <span />
          )}
          {children}
        </div>
      </article>
    </div>
  );
}
