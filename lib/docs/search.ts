import type { DocPage } from "@/lib/docs/types";

export type RankedDocSearchResult = {
  doc: DocPage;
  score: number;
  excerpt: string;
};

export type DocSearchResult = {
  slug: string;
  title: string;
  href: string;
  excerpt: string;
  score: number;
};

const SNIPPET_RADIUS = 56;
const SNIPPET_MAX_LENGTH = 160;

export function normalizeSearchText(value: string) {
  return value.trim().toLocaleLowerCase("ru");
}

export function markdownToPlainText(content: string) {
  return content
    .replace(/^#+\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[*_>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findInsensitiveIndex(haystack: string, needle: string) {
  if (!needle) {
    return -1;
  }

  return haystack.toLocaleLowerCase("ru").indexOf(needle.toLocaleLowerCase("ru"));
}

export function scoreDoc(doc: DocPage, normalizedQuery: string) {
  const navTitle = normalizeSearchText(doc.navTitle);
  const title = normalizeSearchText(doc.title);
  const slug = normalizeSearchText(doc.slug);
  const plainContent = markdownToPlainText(doc.content);
  const content = normalizeSearchText(plainContent);

  let score = 0;

  if (navTitle === normalizedQuery) {
    score += 220;
  } else if (navTitle.includes(normalizedQuery)) {
    score += 100;
  }

  if (title === normalizedQuery) {
    score += 200;
  } else if (title.includes(normalizedQuery)) {
    score += 90;
  }

  if (slug === normalizedQuery || slug.endsWith(`/${normalizedQuery}`)) {
    score += 180;
  } else if (slug.includes(normalizedQuery)) {
    score += 80;
  }

  const contentIndex = findInsensitiveIndex(plainContent, normalizedQuery);
  if (contentIndex >= 0) {
    score += 40;

    const occurrences = countInsensitiveOccurrences(plainContent, normalizedQuery);
    score += Math.min(occurrences - 1, 3) * 5;
  } else if (normalizedQuery.length >= 5 && containsWordStartingWith(plainContent, normalizedQuery)) {
    score += 35;
  }

  const queryWords = normalizedQuery.split(/\s+/).filter((word) => word.length > 1);
  if (queryWords.length > 1) {
    for (const word of queryWords) {
      if (navTitle.includes(word)) score += 25;
      if (title.includes(word)) score += 20;
      if (slug.includes(word)) score += 15;
      if (content.includes(word)) score += 10;
    }
  }

  return score;
}

export function buildMatchSnippet(content: string, query: string) {
  const plain = markdownToPlainText(content);

  if (!query.trim()) {
    return plain.slice(0, SNIPPET_MAX_LENGTH);
  }

  const match =
    findInsensitiveIndex(plain, query) >= 0
      ? {
          start: findInsensitiveIndex(plain, query),
          length: query.length,
        }
      : (() => {
          const relaxed = findRelaxedWordMatch(plain, 0, query);
          return relaxed
            ? { start: relaxed.start, length: relaxed.end - relaxed.start }
            : null;
        })();

  if (!match) {
    return plain.slice(0, SNIPPET_MAX_LENGTH);
  }

  const { start: matchIndex, length: matchLength } = match;
  let start = Math.max(0, matchIndex - SNIPPET_RADIUS);
  let end = Math.min(plain.length, matchIndex + matchLength + SNIPPET_RADIUS);

  if (end - start > SNIPPET_MAX_LENGTH) {
    end = start + SNIPPET_MAX_LENGTH;
  }

  let snippet = plain.slice(start, end).trim();

  if (start > 0) {
    snippet = `…${snippet}`;
  }

  if (end < plain.length) {
    snippet = `${snippet}…`;
  }

  return snippet;
}

export type TextPart = {
  text: string;
  highlight: boolean;
};

export function splitTextByQuery(
  text: string,
  query: string,
  options?: { allowWordPrefix?: boolean },
): TextPart[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [{ text, highlight: false }];
  }

  const exactParts = splitExactMatches(text, trimmedQuery);

  if (exactParts.some((part) => part.highlight)) {
    return exactParts;
  }

  if (options?.allowWordPrefix && trimmedQuery.length >= 4) {
    return splitWordPrefixMatches(text, trimmedQuery);
  }

  return exactParts;
}

function splitExactMatches(text: string, trimmedQuery: string): TextPart[] {
  const lowerText = text.toLocaleLowerCase("ru");
  const lowerQuery = trimmedQuery.toLocaleLowerCase("ru");
  const parts: TextPart[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = lowerText.indexOf(lowerQuery, cursor);

    if (matchIndex < 0) {
      parts.push({ text: text.slice(cursor), highlight: false });
      break;
    }

    if (matchIndex > cursor) {
      parts.push({ text: text.slice(cursor, matchIndex), highlight: false });
    }

    parts.push({
      text: text.slice(matchIndex, matchIndex + trimmedQuery.length),
      highlight: true,
    });

    cursor = matchIndex + trimmedQuery.length;
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }];
}

function splitWordPrefixMatches(text: string, trimmedQuery: string): TextPart[] {
  const parts: TextPart[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const match = findRelaxedWordMatch(text, cursor, trimmedQuery);

    if (!match) {
      parts.push({ text: text.slice(cursor), highlight: false });
      break;
    }

    if (match.start > cursor) {
      parts.push({ text: text.slice(cursor, match.start), highlight: false });
    }

    parts.push({
      text: text.slice(match.start, match.end),
      highlight: true,
    });

    cursor = match.end;
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }];
}

function containsWordStartingWith(text: string, query: string) {
  return findRelaxedWordMatch(text, 0, query) !== null;
}

function findRelaxedWordMatch(text: string, fromIndex: number, query: string) {
  const wordPattern = /[\p{L}\p{N}_-]+/gu;
  wordPattern.lastIndex = fromIndex;

  let match = wordPattern.exec(text);

  while (match) {
    if (wordMatchesQuery(match[0], query)) {
      return {
        start: match.index,
        end: match.index + match[0].length,
      };
    }

    match = wordPattern.exec(text);
  }

  return null;
}

function wordMatchesQuery(word: string, query: string) {
  const lowerWord = word.toLocaleLowerCase("ru");
  const lowerQuery = query.toLocaleLowerCase("ru");

  if (lowerWord.includes(lowerQuery) || lowerQuery.includes(lowerWord)) {
    return true;
  }

  const sharedPrefixLength = getSharedPrefixLength(lowerWord, lowerQuery);
  const threshold = Math.max(4, lowerQuery.length - 2);

  return sharedPrefixLength >= threshold;
}

function getSharedPrefixLength(left: string, right: string) {
  const limit = Math.min(left.length, right.length);
  let length = 0;

  while (length < limit && left[length] === right[length]) {
    length += 1;
  }

  return length;
}

function findWordPrefixIndex(text: string, query: string) {
  const match = findRelaxedWordMatch(text, 0, query);
  return match?.start ?? -1;
}

function findWordPrefixLength(text: string, startIndex: number, query: string) {
  const wordPattern = /[\p{L}\p{N}_-]+/gu;
  wordPattern.lastIndex = startIndex;
  const match = wordPattern.exec(text);

  if (!match || match.index !== startIndex) {
    return query.length;
  }

  return match[0].length;
}

function isWordChar(char: string) {
  return /[\p{L}\p{N}_-]/u.test(char);
}

export function searchRankedDocs(
  docs: DocPage[],
  query: string,
  limit = 8,
): RankedDocSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  return docs
    .map((doc) => ({
      doc,
      score: scoreDoc(doc, normalizedQuery),
      excerpt: buildMatchSnippet(doc.content, query.trim()),
    }))
    .filter((result) => result.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.doc.order - right.doc.order;
    })
    .slice(0, limit);
}

function countInsensitiveOccurrences(haystack: string, needle: string) {
  const lowerHaystack = haystack.toLocaleLowerCase("ru");
  const lowerNeedle = needle.toLocaleLowerCase("ru");
  let count = 0;
  let cursor = 0;

  while (cursor < lowerHaystack.length) {
    const matchIndex = lowerHaystack.indexOf(lowerNeedle, cursor);

    if (matchIndex < 0) {
      break;
    }

    count += 1;
    cursor = matchIndex + lowerNeedle.length;
  }

  return count;
}
