import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CopyCodeBlock } from "@/components/copy-code-block";

describe("CopyCodeBlock", () => {
  it("copies code block text to clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: { writeText },
    });

    render(
      <CopyCodeBlock>
        <code>{`GET /main/hs/health`}</code>
      </CopyCodeBlock>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Копировать код" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("GET /main/hs/health");
    });

    expect(await screen.findByRole("button", { name: "Скопировано" })).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
