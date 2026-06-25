import { describe, expect, it } from "vitest";

import { docHref, docPriority } from "@/lib/docs/routes";
import { buildPageTitle, excerptFromMarkdown } from "@/lib/seo/site";

describe("doc routes", () => {
  it("maps overview slug to section root", () => {
    expect(docHref("overview")).toBe("/api/1c-upp");
  });

  it("maps nested slugs to nested paths", () => {
    expect(docHref("methods/health")).toBe("/api/1c-upp/methods/health");
  });

  it("assigns higher priority to overview and methods index", () => {
    expect(docPriority("overview")).toBeGreaterThan(docPriority("changelog"));
    expect(docPriority("methods")).toBeGreaterThan(docPriority("methods/health"));
  });
});

describe("seo helpers", () => {
  it("builds page titles with site suffix", () => {
    expect(buildPageTitle("Авторизация")).toBe("Авторизация · dev.avgst");
  });

  it("extracts plain-text excerpt from markdown", () => {
    expect(
      excerptFromMarkdown("# Заголовок\n\nТекст [ссылка](/path) и `код` для описания."),
    ).toContain("Заголовок Текст ссылка и код");
  });
});
