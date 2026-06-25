import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DocForm } from "@/components/admin/doc-form";
import type { DocPage } from "@/lib/docs/types";

const existingDoc: DocPage = {
  id: 7,
  title: "Авторизация",
  slug: "auth",
  section: "1c-upp",
  navTitle: "Авторизация",
  order: 20,
  content: "# Авторизация\n\nТекст страницы",
  createdAt: "2026-06-25 10:00:00",
  updatedAt: "2026-06-25 10:00:00",
};

describe("DocForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders existing doc values and preview", () => {
    render(<DocForm doc={existingDoc} />);

    expect(screen.getByLabelText("Заголовок")).toHaveValue("Авторизация");
    expect(screen.getByLabelText("Slug")).toHaveValue("auth");
    expect(screen.getByRole("heading", { name: "Авторизация" })).toBeInTheDocument();
    expect(screen.getByText("Текст страницы")).toBeInTheDocument();
  });

  it("saves an existing doc through admin API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: existingDoc.id }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DocForm doc={existingDoc} />);

    fireEvent.change(screen.getByLabelText("Заголовок"), {
      target: { value: "Новая авторизация" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/admin/docs/7",
        expect.objectContaining({
          method: "PUT",
        }),
      );
    });
  });

  it("shows API error when save fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Slug уже занят" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DocForm doc={existingDoc} />);
    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    expect(await screen.findByText("Slug уже занят")).toBeInTheDocument();
  });

  it("creates a new doc through admin API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 10 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DocForm />);

    fireEvent.change(screen.getByLabelText("Заголовок"), {
      target: { value: "Новая страница" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "new-page" },
    });
    fireEvent.change(screen.getByLabelText("Название в меню"), {
      target: { value: "Новая" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/admin/docs",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });

  it("deletes an existing doc after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DocForm doc={existingDoc} />);
    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/docs/7", {
        method: "DELETE",
      });
    });
  });

  it("does not delete when confirmation is cancelled", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(<DocForm doc={existingDoc} />);
    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows an error when delete fails", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );

    render(<DocForm doc={existingDoc} />);
    fireEvent.click(screen.getByRole("button", { name: "Удалить" }));

    expect(await screen.findByText("Не удалось удалить страницу")).toBeInTheDocument();
  });
});
