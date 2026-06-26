import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DocsSearch } from "@/components/docs-search";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("DocsSearch", () => {
  it("shows highlighted excerpt around the matched fragment", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          query: "проверка",
          results: [
            {
              slug: "methods/health",
              title: "Health",
              href: "/api/1c-upp/methods/health",
              excerpt: "…Проверка доступности HTTP-сервиса…",
              score: 40,
            },
          ],
        }),
      }),
    );

    render(<DocsSearch />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "проверка" } });

    await waitFor(() => {
      expect(screen.getByText("Проверка")).toBeInTheDocument();
    });

    expect(document.querySelector("mark")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it("shows results from the search API and navigates on selection", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          query: "health",
          results: [
            {
              slug: "methods/health",
              title: "Health",
              href: "/api/1c-upp/methods/health",
              excerpt: "Проверка доступности HTTP-сервиса.",
            },
          ],
        }),
      }),
    );

    render(<DocsSearch />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "health" } });

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Health/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("option", { name: /Health/i }));

    expect(push).toHaveBeenCalledWith("/api/1c-upp/methods/health");

    vi.unstubAllGlobals();
  });
});
