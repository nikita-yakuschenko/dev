import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

process.env.ADMIN_PASSWORD = "test-password";
process.env.DOCS_DB_PATH = "./data/test-docs.sqlite";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: React.ReactNode;
  }) => React.createElement("a", { href, ...props }, children),
}));

vi.mock("next/font/google", () => ({
  Manrope: () => ({
    variable: "font-manrope",
  }),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
  usePathname: () => "/api/1c-upp",
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));
