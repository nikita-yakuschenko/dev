import { docHref } from "@/lib/docs/routes";
import { listDocs } from "@/lib/docs/repository";
import { searchRankedDocs, type DocSearchResult } from "@/lib/docs/search";

export type { DocSearchResult } from "@/lib/docs/search";

export function buildDocSearchResults(
  query: string,
  section = "1c-upp",
  limit = 8,
): DocSearchResult[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return searchRankedDocs(listDocs(section), trimmedQuery, limit).map((result) => ({
    slug: result.doc.slug,
    title: result.doc.navTitle || result.doc.title,
    href: docHref(result.doc.slug),
    excerpt: result.excerpt,
    score: result.score,
  }));
}

export function searchDocsRanked(query: string, section = "1c-upp", limit = 8) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return searchRankedDocs(listDocs(section), trimmedQuery, limit);
}
