import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DocsNav } from "@/components/docs-nav";
import type { DocPage } from "@/lib/docs/types";

const sampleDocs: DocPage[] = [
  {
    id: 1,
    title: "API 1С УПП",
    slug: "overview",
    section: "1c-upp",
    navTitle: "Обзор",
    order: 10,
    content: "",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 2,
    title: "Авторизация",
    slug: "auth",
    section: "1c-upp",
    navTitle: "Авторизация",
    order: 20,
    content: "",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 3,
    title: "Методы API",
    slug: "methods",
    section: "1c-upp",
    navTitle: "Список методов",
    order: 40,
    content: "",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 4,
    title: "Заказы",
    slug: "methods/morders-get",
    section: "1c-upp",
    navTitle: "Заказы на производство",
    order: 45,
    content: "",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 5,
    title: "Changelog",
    slug: "changelog",
    section: "1c-upp",
    navTitle: "Changelog",
    order: 60,
    content: "",
    createdAt: "",
    updatedAt: "",
  },
];

describe("DocsNav", () => {
  it("renders grouped navigation with section labels", () => {
    render(<DocsNav docs={sampleDocs} />);

    expect(screen.getByText("Документация")).toBeInTheDocument();
    expect(screen.getByText("Методы")).toBeInTheDocument();
    expect(screen.getByText("История")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Заказы на производство" })).toHaveAttribute(
      "href",
      "/api/1c-upp/methods/morders-get",
    );
  });

  it("marks only the exact matching page as active", () => {
    render(<DocsNav docs={sampleDocs} />);

    expect(screen.getByRole("link", { name: "Обзор" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Список методов" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Заказы на производство" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
