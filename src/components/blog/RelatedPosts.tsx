import Carousel from "../shared/Carousel";
import PostCard from "../cards/PostCard";
import type { PostCardModel } from "../../lib/viewModels";

interface Props {
  posts: PostCardModel[];
  title: string;
  ctaLabel: string;
  label: string;
}

export default function RelatedPosts({ posts, title, ctaLabel, label }: Props) {
  return (
    <section className="container-xl pb-16 pt-14 md:pb-20 md:pt-24 lg:pb-[120px] lg:pt-[130px]">
      <h2 data-reveal className="mb-5 text-heading-lg md:mb-12">{title}</h2>
      <div data-reveal>
        <Carousel label={label} slideClassName="w-[280px]" gridClassName="lg:grid-cols-3 lg:gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} ctaLabel={ctaLabel} variant="compact" />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
