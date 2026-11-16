import { TinaMarkdown, type Components } from "tinacms/dist/rich-text";
import { mediaUrl } from "../../utils/mediaUrl";

const components: Components<{
  Callout: { title?: string; text?: string };
  Figure: { src?: string; alt?: string; caption?: string; creditUrl?: string };
  Quote: { text?: string; author?: string };
}> = {
  Callout: ({ title, text }) => (
    <div className="not-prose mt-5 rounded-3xl bg-surface-mint px-8 py-9 lg:px-11 lg:py-10">
      {title && <h3 className="text-subtitle-lg">{title}</h3>}
      {text && <p className="mt-4 text-body-lg leading-[1.7] text-content-soft">{text}</p>}
    </div>
  ),
  Figure: ({ src, alt, caption, creditUrl }) => (
    <figure className="not-prose my-6">
      <div className="h-[280px] overflow-hidden rounded-3xl lg:h-[440px]">
        {src && <img src={mediaUrl(src)} alt={alt || ""} loading="lazy" className="block h-full w-full object-cover" />}
      </div>
      {caption && (
        <figcaption className="mt-3.5 text-[14px] text-content-muted">
          {creditUrl ? <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="underline">{caption}</a> : caption}
        </figcaption>
      )}
    </figure>
  ),
  Quote: ({ text, author }) => (
    <blockquote className="not-prose my-4 border-l-[3px] border-brand-primary py-2 pl-8">
      <p className="text-[clamp(1.25rem,1vw+1rem,1.625rem)] font-light italic leading-[1.45] tracking-[-0.01em] text-content">“{text}”</p>
      {author && <footer className="mt-5 text-body-sm text-content-muted">— {author}</footer>}
    </blockquote>
  ),
};

export default function PostBody({ content }: { content: any }) {
  if (!content) return <div hidden />;
  return <TinaMarkdown content={content} components={components} />;
}
