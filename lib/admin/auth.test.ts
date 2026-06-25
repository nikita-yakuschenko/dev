import { describe, expect, it, vi } from "vitest";

const cookieValue = vi.hoisted(() => ({ value: "" }));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => (cookieValue.value ? { value: cookieValue.value } : undefined),
  }),
}));

import {
  createAdminSessionValue,
  isAdminAuthenticated,
  isValidAdminPassword,
  requireAdmin,
} from "@/lib/admin/auth";

describe("admin auth helpers", () => {
  it("validates the configured admin password", () => {
    expect(isValidAdminPassword("test-password")).toBe(true);
    expect(isValidAdminPassword("wrong-password")).toBe(false);
    expect(isValidAdminPassword("")).toBe(false);
  });

  it("creates a deterministic session value from the configured password", () => {
    expect(createAdminSessionValue()).toBe(
      Buffer.from("admin:test-password").toString("base64url"),
    );
  });

  it("checks admin session cookie", async () => {
    cookieValue.value = "";
    await expect(isAdminAuthenticated()).resolves.toBe(false);

    cookieValue.value = createAdminSessionValue();
    await expect(isAdminAuthenticated()).resolves.toBe(true);
  });

  it("redirects when admin session is missing", async () => {
    cookieValue.value = "";

    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT:/admin/login");
  });
});
