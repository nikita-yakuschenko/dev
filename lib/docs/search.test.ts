import { describe, expect, it } from "vitest";

import {
  buildMatchSnippet,
  normalizeSearchText,
  scoreDoc,
  searchRankedDocs,
  splitTextByQuery,
} from "@/lib/docs/search";
import { buildDocSearchResults } from "@/lib/docs/search-results";
import { listDocs, getDocBySlug } from "@/lib/docs/repository";

describe("docs search", () => {
  it("normalizes cyrillic case for matching", () => {
    expect(normalizeSearchText("  Проверка ")).toBe("проверка");
  });

  it("finds health when query uses lowercase проверка", () => {
    const slugs = buildDocSearchResults("проверка").map((item) => item.slug);

    expect(slugs).toContain("methods/health");
    expect(slugs.indexOf("methods/health")).toBeLessThan(slugs.indexOf("environments"));
  });

  it("ranks title and nav matches above body-only matches", () => {
    const results = searchRankedDocs(listDocs(), "авторизация");

    expect(results[0]?.doc.slug).toBe("auth");
    expect(results[0]?.score).toBeGreaterThan(results[1]?.score ?? 0);
  });

  it("builds snippet around the matched fragment", () => {
    const health = getDocBySlug("methods/health");

    expect(health).not.toBeNull();

    const snippet = buildMatchSnippet(health!.content, "проверки");

    expect(snippet.toLowerCase()).toContain("проверк");
    expect(snippet.startsWith("…") || snippet.includes("HTTP")).toBe(true);
  });

  it("splits text into highlighted parts", () => {
    expect(splitTextByQuery("Проверка доступности", "проверка")).toEqual([
      { text: "Проверка", highlight: true },
      { text: " доступности", highlight: false },
    ]);
  });

  it("matches word prefixes for cyrillic morphology in content", () => {
    const health = getDocBySlug("methods/health");

    expect(health).not.toBeNull();
    expect(scoreDoc(health!, "проверка")).toBeGreaterThan(0);
  });

  it("highlights word prefixes in excerpts", () => {
    expect(splitTextByQuery("для проверки, что сервис отвечает", "проверка", { allowWordPrefix: true })).toEqual([
      { text: "для ", highlight: false },
      { text: "проверки", highlight: true },
      { text: ", что сервис отвечает", highlight: false },
    ]);
  });

  it("scores exact slug matches higher than incidental body matches", () => {
    const health = getDocBySlug("methods/health");
    const environments = getDocBySlug("environments");

    expect(health).not.toBeNull();
    expect(environments).not.toBeNull();

    expect(scoreDoc(health!, "health")).toBeGreaterThan(scoreDoc(environments!, "health"));
  });
});
