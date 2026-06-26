import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ApiCatalogPage from "@/app/api/page";
import UppApiLayout from "@/app/api/1c-upp/layout";
import UppDocPage from "@/app/api/1c-upp/[[...slug]]/page";
import RootLayout, { metadata } from "@/app/layout";
import HomePage from "@/app/page";
import { AppSidebar } from "@/components/app-sidebar";
import { mdxComponents } from "@/components/mdx-components";
import { PortalShell } from "@/components/portal-shell";
import { SiteHeader } from "@/components/site-header";
import { useMDXComponents } from "@/mdx-components";

describe("portal shell and pages", () => {
  it("renders the AVGST sidebar navigation", () => {
    render(<AppSidebar />);

    expect(screen.getByText("dev.avgst")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Обзор" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Каталог API")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "API 1С УПП" })).toHaveAttribute(
      "href",
      "/api/1c-upp",
    );
    expect(screen.queryByRole("link", { name: "Все API" })).not.toBeInTheDocument();
  });

  it("renders the sticky header with status and action", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "ok",
          label: "MCP online",
          detail: "Сервис 1C UPP MCP и база документации доступны.",
        }),
      }),
    );

    render(<SiteHeader />);

    expect(await screen.findByText("MCP online")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Поиск по документации" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Редактор" })).toHaveAttribute(
      "href",
      "/admin/docs",
    );

    vi.unstubAllGlobals();
  });

  it("wraps content into the dashboard shell", () => {
    render(
      <PortalShell>
        <h1>Inner portal content</h1>
      </PortalShell>,
    );

    expect(screen.getByTestId("portal-shell")).toBeInTheDocument();
    expect(screen.getByText("dev.avgst")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Inner portal content" })).toBeInTheDocument();
  });

  it("renders the home page with hero and portal cards", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /Dev-портал для разработки продуктов AVGST/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Открыть API 1С УПП/i })).toHaveAttribute(
      "href",
      "/api/1c-upp",
    );
    expect(screen.getByText("Документация API 1С УПП")).toBeInTheDocument();
    expect(screen.getByText("Авторизация и доступы")).toBeInTheDocument();
    expect(screen.getByText("Окружения и стенды")).toBeInTheDocument();
  });

  it("renders the API catalog page", () => {
    render(<ApiCatalogPage />);

    expect(
      screen.getByRole("heading", { name: /API для разработки продуктов/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("13 методов")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Открыть/i })[0]).toHaveAttribute(
      "href",
      "/api/1c-upp",
    );
    expect(screen.getByText("Changelog")).toBeInTheDocument();
  });

  it("renders the 1C UPP docs layout and local docs navigation", () => {
    render(
      <UppApiLayout>
        <h1>Документация метода</h1>
      </UppApiLayout>,
    );

    expect(screen.getByRole("link", { name: "Каталог API" })).toBeInTheDocument();
    expect(screen.getAllByText("Документация").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Авторизация" })).toHaveAttribute(
      "href",
      "/api/1c-upp/auth",
    );
    expect(screen.getByRole("link", { name: "Окружения" })).toHaveAttribute(
      "href",
      "/api/1c-upp/environments",
    );
    expect(screen.getByRole("heading", { name: "Документация метода" })).toBeInTheDocument();
  });

  it("renders public documentation from SQLite content", async () => {
    render(await UppDocPage({ params: Promise.resolve({}) }));

    expect(screen.getByRole("heading", { name: "API 1С УПП" })).toBeInTheDocument();
    expect(screen.getByText(/Как устроены вызовы/i)).toBeInTheDocument();
  });

  it("returns not found for missing documentation page", async () => {
    await expect(
      UppDocPage({ params: Promise.resolve({ slug: ["missing-page"] }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("exports metadata and renders the root layout with the font variable", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Root content</main>
      </RootLayout>,
    );

    expect(metadata.title).toEqual({
      default: "dev.avgst — портал разработчика AVGST",
      template: "%s · dev.avgst",
    });
    expect(metadata.description).toContain("разработки продуктов");
    expect(markup).toContain('lang="ru"');
    expect(markup).not.toContain('class="dark"');
    expect(markup).toContain("font-manrope");
    expect(markup).toContain("Root content");
  });

  it("provides MDX components and allows overrides", () => {
    const mergedComponents = useMDXComponents({
      h1: (props) => <h1 data-testid="custom-heading" {...props} />,
    });
    const StatusBadge = mdxComponents.StatusBadge;
    const Heading = mergedComponents.h1;

    expect(StatusBadge).toBeDefined();
    expect(Heading).toBeDefined();

    render(
      <div>
        {StatusBadge?.({ children: "Готово" })}
        {Heading?.({ children: "Заголовок" })}
      </div>,
    );

    expect(screen.getByText("Готово")).toHaveAttribute("data-slot", "badge");
    expect(screen.getByTestId("custom-heading")).toHaveTextContent("Заголовок");
  });
});
