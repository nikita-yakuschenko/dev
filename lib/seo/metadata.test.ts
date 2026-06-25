import { describe, expect, it } from "vitest";

import { buildPageMetadata } from "@/lib/seo/metadata";

describe("buildPageMetadata", () => {
  it("sets canonical and open graph fields", () => {
    const metadata = buildPageMetadata({
      title: "API 1С УПП",
      description: "Описание страницы",
      path: "/api/1c-upp",
    });

    expect(metadata.title).toBe("API 1С УПП · dev.avgst");
    expect(metadata.description).toBe("Описание страницы");
    expect(metadata.alternates?.canonical).toBe("https://dev.avgst.ru/api/1c-upp");
    expect(metadata.openGraph?.url).toBe("https://dev.avgst.ru/api/1c-upp");
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("marks admin pages as noindex", () => {
    const metadata = buildPageMetadata({ noIndex: true, path: "/admin/docs" });

    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });
});
