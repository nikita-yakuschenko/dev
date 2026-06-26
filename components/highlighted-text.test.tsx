import { describe, expect, it } from "vitest";

import { HighlightedText } from "@/components/highlighted-text";
import { splitTextByQuery } from "@/lib/docs/search";
import { render, screen } from "@testing-library/react";

describe("HighlightedText", () => {
  it("renders matched fragments inside mark", () => {
    render(
      <HighlightedText
        parts={splitTextByQuery("Проверка доступности API", "проверка")}
      />,
    );

    const mark = screen.getByText("Проверка");
    expect(mark.tagName).toBe("MARK");
    expect(screen.getByText(/доступности API/)).toBeInTheDocument();
  });
});
