import type { MetadataRoute } from "next";

import { docHref, docPriority } from "@/lib/docs/routes";
import { listDocs } from "@/lib/docs/repository";
import { absoluteUrl } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = listDocs();
  const staticRoutes: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/api", priority: 0.9 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: absoluteUrl(path),
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...docs.map((doc) => ({
      url: absoluteUrl(docHref(doc.slug)),
      lastModified: new Date(doc.updatedAt),
      changeFrequency: "weekly" as const,
      priority: docPriority(doc.slug),
    })),
  ];
}
