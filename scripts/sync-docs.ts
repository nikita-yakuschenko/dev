import { runDocsSync } from "@/lib/docs/sync-from-seed";

const count = runDocsSync();
console.log(`Done. ${count} page(s) updated.`);
