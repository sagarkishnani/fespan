import type { Locale } from "../i18n/config";
import { tField, localePrefix } from "../utils/i18n";
import { translateTerm } from "../i18n/ui";
import { formatShortDate } from "../utils/format";
import { mediaUrl } from "../utils/mediaUrl";

export interface PostCardModel {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  category: string;
  categoryKey: string;
  date: string;
  image: string;
  imageAlt: string;
  featured: boolean;
}

export interface ActivityCardModel {
  slug: string;
  href: string;
  kind: string;
  title: string;
  badge: string;
  date: string;
  place: string;
  summary: string;
  image: string;
  imagePosition: string;
}

export function nodesOf<T = any>(connection: { edges?: Array<{ node?: T | null } | null> | null } | null | undefined): T[] {
  return (connection?.edges || []).map((edge) => edge?.node).filter(Boolean) as T[];
}

export function sortByDateDesc<T extends { date?: string | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

export function sortByOrder<T extends { order?: number | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function toPostCard(post: any, locale: Locale): PostCardModel {
  const slug = post._sys.filename;
  return {
    slug,
    href: `${localePrefix(locale)}blog/${slug}`,
    title: tField(post, "title", locale),
    excerpt: tField(post, "excerpt", locale),
    category: translateTerm(post.category || "", locale),
    categoryKey: post.category || "",
    date: formatShortDate(post.date, locale),
    image: mediaUrl(post.coverImage),
    imageAlt: post.coverAlt || "",
    featured: Boolean(post.featured),
  };
}

export function toActivityCard(activity: any, locale: Locale): ActivityCardModel {
  const slug = activity._sys.filename;
  return {
    slug,
    href: `${localePrefix(locale)}actividades/${slug}`,
    kind: activity.kind || "",
    title: tField(activity, "title", locale),
    badge: tField(activity, "badge", locale),
    date: tField(activity, "dateLabel", locale),
    place: tField(activity, "place", locale),
    summary: tField(activity, "summary", locale),
    image: mediaUrl(activity.image),
    imagePosition: activity.imagePosition || "center",
  };
}
