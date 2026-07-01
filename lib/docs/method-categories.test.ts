import { describe, expect, it } from "vitest";

import {
  METHOD_CATALOG,
  buildMethodsIndexMarkdown,
  getMethodCategoryId,
  getMethodSortOrder,
} from "@/lib/docs/method-categories";

describe("method-categories", () => {
  it("maps every catalog method to a category", () => {
    const slugs = Object.values(METHOD_CATALOG).flatMap((entries) =>
      entries.map((entry) => entry.slug),
    );

    expect(slugs).toHaveLength(14);
    for (const slug of slugs) {
      expect(getMethodCategoryId(slug)).toBeTruthy();
    }
  });

  it("sorts methods within and across categories", () => {
    expect(getMethodSortOrder("methods/health")).toBeLessThan(
      getMethodSortOrder("methods/cashflows-get")!,
    );
    expect(getMethodSortOrder("methods/cashflows-get")).toBeLessThan(
      getMethodSortOrder("methods/payments-get")!,
    );
    expect(getMethodSortOrder("methods/demands-get")).toBeGreaterThan(
      getMethodSortOrder("methods/receipts-get")!,
    );
  });

  it("builds grouped methods index", () => {
    const markdown = buildMethodsIndexMarkdown();

    expect(markdown).toContain("## Система");
    expect(markdown).toContain("## Финансы");
    expect(markdown).toContain("## Склад");
    expect(markdown).toContain("Получить поступления товаров и услуг");
    expect(markdown).not.toContain("## Заказы на производство");
  });
});
