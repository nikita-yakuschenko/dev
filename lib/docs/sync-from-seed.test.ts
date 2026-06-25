import { describe, expect, it } from "vitest";

import { getDocBySlug } from "@/lib/docs/repository";
import { runDocsSync } from "@/lib/docs/sync-from-seed";

describe("runDocsSync", () => {
  it("overwrites documentation pages from seed", () => {
    runDocsSync();
    const doc = getDocBySlug("methods/morders-get");

    expect(doc?.content).toContain("ЗП-00001042");
    expect(doc?.content).toContain("Договор DEMO-001");
    expect(doc?.content).not.toContain("ИПК00000565");
    expect(doc?.content).not.toContain("Якущенко");
  });
});
