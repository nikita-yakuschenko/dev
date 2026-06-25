export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const shouldSync =
    process.env.DOCS_SYNC_ON_START === "true" ||
    (process.env.NODE_ENV === "production" && process.env.DOCS_SYNC_ON_START !== "false");

  if (!shouldSync) {
    return;
  }

  const { runDocsSync } = await import("@/lib/docs/sync-from-seed");
  runDocsSync();
}
