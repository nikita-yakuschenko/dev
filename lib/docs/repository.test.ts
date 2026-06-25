import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { resetDocsDbForTests } from "@/lib/docs/db";
import {
  createDoc,
  deleteDoc,
  getDocById,
  getDocBySlug,
  listDocs,
  normalizeDocSlug,
  searchDocs,
  updateDoc,
  upsertDocBySlug,
} from "@/lib/docs/repository";
import { mordersGetDoc } from "@/lib/docs/seed";

const testDbPath = path.resolve(process.cwd(), "data", "test-docs.sqlite");

function resetDbFile() {
  resetDocsDbForTests();
  fs.rmSync(testDbPath, { force: true });
  fs.rmSync(`${testDbPath}-shm`, { force: true });
  fs.rmSync(`${testDbPath}-wal`, { force: true });
}

describe("docs repository", () => {
  beforeEach(() => {
    resetDbFile();
  });

  it("seeds initial documentation pages", () => {
    const docs = listDocs();

    expect(docs.length).toBeGreaterThanOrEqual(6);
    expect(docs[0]).toMatchObject({
      slug: "overview",
      navTitle: "Обзор",
    });
    expect(getDocBySlug("auth")?.title).toBe("Авторизация");
  });

  it("normalizes catch-all route slugs", () => {
    expect(normalizeDocSlug()).toBe("overview");
    expect(normalizeDocSlug([])).toBe("overview");
    expect(normalizeDocSlug(["methods", "example"])).toBe("methods/example");
    expect(normalizeDocSlug("auth")).toBe("auth");
  });

  it("creates, updates and deletes a documentation page", () => {
    const created = createDoc({
      title: "Новый метод",
      slug: "methods/new-method",
      section: "1c-upp",
      navTitle: "Новый метод",
      order: 70,
      content: "# Новый метод",
    });

    expect(created?.id).toEqual(expect.any(Number));
    expect(getDocById(created!.id)?.slug).toBe("methods/new-method");

    const updated = updateDoc(created!.id, {
      title: "Обновлённый метод",
      slug: "methods/new-method",
      section: "1c-upp",
      navTitle: "Обновлённый",
      order: 80,
      content: "# Обновлённый метод",
    });

    expect(updated?.title).toBe("Обновлённый метод");
    expect(deleteDoc(created!.id)).toBe(true);
    expect(getDocById(created!.id)).toBeNull();
    expect(deleteDoc(created!.id)).toBe(false);
  });

  it("searches docs by title, slug and content", () => {
    expect(searchDocs("Авторизация").map((doc) => doc.slug)).toContain("auth");
    expect(searchDocs("balances-get").map((doc) => doc.slug)).toContain("methods/balances-get");
    expect(searchDocs("traceId").length).toBeGreaterThan(0);
    expect(searchDocs("")).toHaveLength(listDocs().length);
  });

  it("upserts a doc by slug without duplicating rows", () => {
    const first = upsertDocBySlug(mordersGetDoc);
    const second = upsertDocBySlug({
      ...mordersGetDoc,
      title: "Обновлённые заказы на производство",
    });

    expect(first?.id).toBe(second?.id);
    expect(getDocBySlug("methods/morders-get")?.title).toBe(
      "Обновлённые заказы на производство",
    );
    expect(listDocs().filter((doc) => doc.slug === "methods/morders-get")).toHaveLength(1);

    upsertDocBySlug(mordersGetDoc);
  });
});
