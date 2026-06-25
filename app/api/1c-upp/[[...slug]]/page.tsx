import { notFound } from "next/navigation";

import { MarkdownContent } from "@/components/markdown-content";
import { getDocBySlug, normalizeDocSlug } from "@/lib/docs/repository";

export const dynamic = "force-dynamic";

export default async function UppDocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(normalizeDocSlug(slug));

  if (!doc) {
    notFound();
  }

  return <MarkdownContent content={doc.content} />;
}
