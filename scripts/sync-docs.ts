import { deleteDocBySlug, upsertDocBySlug } from "@/lib/docs/repository";
import { syncableDocs } from "@/lib/docs/seed";

const removedSlugs = ["methods/example"];

for (const slug of removedSlugs) {
  if (deleteDocBySlug(slug)) {
    console.log(`Removed: ${slug}`);
  }
}

for (const doc of syncableDocs) {
  upsertDocBySlug(doc);
  console.log(`Synced: ${doc.slug}`);
}

console.log(`Done. ${syncableDocs.length} page(s) updated.`);
