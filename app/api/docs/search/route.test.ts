import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/docs/search/route";
import { buildDocSearchResults } from "@/lib/docs/search-results";

describe("buildDocSearchResults", () => {
  it("returns empty list for blank query", () => {
    expect(buildDocSearchResults("")).toEqual([]);
    expect(buildDocSearchResults("   ")).toEqual([]);
  });

  it("finds docs by title and slug", () => {
    const results = buildDocSearchResults("Авторизация");

    expect(results.some((item) => item.slug === "auth")).toBe(true);
    expect(results[0]).toMatchObject({
      href: expect.stringContaining("/api/1c-upp"),
      title: expect.any(String),
      excerpt: expect.any(String),
    });
  });
});

describe("GET /api/docs/search", () => {
  it("finds health for lowercase проверка with ranking", async () => {
    const response = await GET(new Request("http://localhost/api/docs/search?q=проверка"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.results[0]?.slug).toBe("methods/health");
    expect(body.results.some((item: { slug: string }) => item.slug === "methods/health")).toBe(
      true,
    );
  });

  it("returns search results for query", async () => {
    const response = await GET(new Request("http://localhost/api/docs/search?q=health"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.query).toBe("health");
    expect(body.results.some((item: { slug: string }) => item.slug === "methods/health")).toBe(
      true,
    );
  });

  it("returns empty results for blank query", async () => {
    const response = await GET(new Request("http://localhost/api/docs/search?q="));
    const body = await response.json();

    expect(body.results).toEqual([]);
  });
});
