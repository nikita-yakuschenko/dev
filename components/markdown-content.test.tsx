import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownContent } from "@/components/markdown-content";

describe("MarkdownContent", () => {
  it("renders headings, links and code blocks", () => {
    render(
      <MarkdownContent
        content={`# Заголовок

[Ссылка](/api/1c-upp)

\`\`\`http
GET /health
\`\`\``}
      />,
    );

    expect(screen.getByRole("heading", { name: "Заголовок" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ссылка" })).toHaveAttribute(
      "href",
      "/api/1c-upp",
    );
    expect(screen.getByText("GET /health")).toBeInTheDocument();
  });

  it("renders tables inside a scrollable wrapper", () => {
    const { container } = render(
      <MarkdownContent
        content={`| Параметр | Тип | Описание |
| --- | --- | --- |
| \`code\` | string | Фильтр по номеру |`}
      />,
    );

    expect(container.querySelector(".docs-table-wrap")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Параметр" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "code" })).toBeInTheDocument();
  });
});
