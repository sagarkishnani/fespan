import { useTina, tinaField } from "tinacms/dist/react";
import { tField, localizeHref } from "../../utils/i18n";
import { t } from "../../i18n/ui";
import PostCard from "../cards/PostCard";
import { revealDelay, type TinaSectionProps } from "../../lib/tinaProps";
import type { PostCardModel } from "../../lib/viewModels";

interface Props extends TinaSectionProps {
  posts: PostCardModel[];
}

export default function HomeNews({ query, variables, data: initialData, locale, posts }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const news = data?.home?.news;
  const transparency = data?.home?.transparency;

  return (
    <section className="container-xl section">
      {news && (
        <>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10 lg:mb-14">
            <h2 data-reveal style={revealDelay(100)} className="text-heading-xl">
              <span data-tina-field={tinaField(news, "title")}>{tField(news, "title", locale)}</span>{" "}
              <span className="text-brand-primary" data-tina-field={tinaField(news, "highlight")}>{tField(news, "highlight", locale)}</span>
            </h2>
            {news.link?.label && (
              <a href={localizeHref(news.link.url, locale)} className="link-arrow text-[17px]" data-tina-field={tinaField(news.link, "label")}>
                {tField(news.link, "label", locale)}
              </a>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <div key={post.slug} data-reveal>
                <PostCard post={post} ctaLabel={t("common.readArticle", locale)} />
              </div>
            ))}
          </div>
        </>
      )}

      {transparency?.title && (
        <div data-reveal className="mt-20 flex flex-col items-start gap-8 rounded-3xl bg-brand-primary-dark px-8 py-10 md:flex-row md:items-center md:justify-between md:gap-10 lg:mt-24 lg:px-14 lg:py-[52px]">
          <div>
            <h2 className="text-heading-sm text-white" data-tina-field={tinaField(transparency, "title")}>{tField(transparency, "title", locale)}</h2>
            <p className="mt-3 text-body-lg text-white/90" data-tina-field={tinaField(transparency, "text")}>{tField(transparency, "text", locale)}</p>
          </div>
          {transparency.button?.label && (
            <a href={localizeHref(transparency.button.url, locale)} className="btn h-[60px] shrink-0 bg-brand-primary-light text-white hover:bg-[#25A85E] hover:text-white" data-tina-field={tinaField(transparency.button, "label")}>
              {tField(transparency.button, "label", locale)}
            </a>
          )}
        </div>
      )}
    </section>
  );
}
