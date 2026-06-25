import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { MarkdownContent } from "@/components/markdown-content";
import { docHref } from "@/lib/docs/routes";
import { getDocBySlug, normalizeDocSlug } from "@/lib/docs/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl, excerptFromMarkdown } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(normalizeDocSlug(slug));

  if (!doc) {
    return {};
  }

  return buildPageMetadata({
    title: doc.title,
    description: excerptFromMarkdown(doc.content),
    path: docHref(doc.slug),
    keywords: ["1С УПП", "HTTP API", doc.title, doc.navTitle],
  });
}

export default async function UppDocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(normalizeDocSlug(slug));

  if (!doc) {
    notFound();
  }

  const pageUrl = absoluteUrl(docHref(doc.slug));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: doc.title,
          name: doc.title,
          url: pageUrl,
          datePublished: doc.createdAt,
          dateModified: doc.updatedAt,
          inLanguage: "ru-RU",
          isPartOf: {
            "@type": "WebSite",
            name: "dev.avgst",
            url: absoluteUrl("/"),
          },
          about: {
            "@type": "SoftwareApplication",
            name: "1С УПП HTTP API",
            applicationCategory: "BusinessApplication",
          },
        }}
      />
      <MarkdownContent content={doc.content} />
    </>
  );
}
