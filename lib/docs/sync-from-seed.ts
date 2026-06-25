import { deleteDocBySlug, upsertDocBySlug } from "@/lib/docs/repository";
import { syncableDocs } from "@/lib/docs/seed";

const removedSlugs = ["methods/example"];

export function runDocsSync() {
  for (const slug of removedSlugs) {
    deleteDocBySlug(slug);
  }

  for (const doc of syncableDocs) {
    upsertDocBySlug(doc);
  }

  return syncableDocs.length;
}
