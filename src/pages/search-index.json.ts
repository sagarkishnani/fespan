import type { APIRoute } from "astro";
import client from "../../tina/__generated__/client";
import { LOCALES, type Locale } from "../i18n/config";
import { localePrefix, localizeHref, tField } from "../utils/i18n";
import { translateTerm } from "../i18n/ui";
import { nodesOf } from "../lib/viewModels";
import type { SearchEntry } from "../components/shared/SiteSearch";

async function loadSources() {
  const [global, activities, knowledge, societies, posts] = await Promise.all([
    client.queries.global({ relativePath: "index.json" }),
    client.queries.activityConnection({ first: 200 }),
    client.queries.knowledgeDocConnection({ first: 500 }),
    client.queries.societyConnection({ first: 200 }),
    client.queries.postConnection({ first: 500 }),
  ]);
  return {
    navLinks: (global.data.global.nav?.links || []).filter(Boolean),
    activities: nodesOf(activities.data.activityConnection),
    knowledge: nodesOf(knowledge.data.knowledgeDocConnection),
    societies: nodesOf(societies.data.societyConnection),
    posts: nodesOf(posts.data.postConnection),
  };
}

function entriesFor(locale: Locale, sources: Awaited<ReturnType<typeof loadSources>>): SearchEntry[] {
  const prefix = localePrefix(locale);
  const knowledgeUrl = localizeHref("/conocimiento", locale);
  const membersUrl = localizeHref("/miembros", locale);
  return [
    ...sources.navLinks.map((link: any) => ({ kind: "page" as const, locale, title: tField(link, "label", locale), keywords: "", url: localizeHref(link.url, locale) })),
    ...sources.activities.map((activity: any) => ({
      kind: "activity" as const,
      locale,
      title: tField(activity, "title", locale),
      keywords: `${tField(activity, "place", locale)} ${tField(activity, "summary", locale)}`,
      url: `${prefix}actividades/${activity._sys.filename}`,
    })),
    ...sources.knowledge.map((doc: any) => ({
      kind: "knowledge" as const,
      locale,
      title: tField(doc, "title", locale),
      keywords: `${doc.area} ${translateTerm(doc.area, locale)} ${doc.authors || ""}`,
      url: knowledgeUrl,
    })),
    ...sources.societies.map((society: any) => ({
      kind: "member" as const,
      locale,
      title: tField(society, "name", locale),
      keywords: tField(society, "city", locale),
      url: membersUrl,
    })),
    ...sources.posts.map((post: any) => ({
      kind: "blog" as const,
      locale,
      title: tField(post, "title", locale),
      keywords: tField(post, "excerpt", locale),
      url: `${prefix}blog/${post._sys.filename}`,
    })),
  ];
}

export const GET: APIRoute = async () => {
  const sources = await loadSources();
  const entries = LOCALES.flatMap((locale) => entriesFor(locale, sources));
  return new Response(JSON.stringify(entries), { headers: { "Content-Type": "application/json" } });
};
