import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { DocsNav } from "@/components/docs-nav";
import { PortalShell } from "@/components/portal-shell";
import { listDocs } from "@/lib/docs/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "API 1С УПП",
  description:
    "Документация HTTP API 1С УПП: обзор, авторизация, окружения, методы и changelog.",
  path: "/api/1c-upp",
});

export default function UppApiLayout({ children }: { children: ReactNode }) {
  const docsNav = listDocs();

  return (
    <PortalShell>
      <div className="grid gap-6 lg:gap-8 xl:grid-cols-[15rem_minmax(0,1fr)] 2xl:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-4 xl:h-fit">
          <div className="mb-3 px-1">
            <Link
              href="/api"
              className="text-xs font-medium tracking-wide text-muted-foreground uppercase transition hover:text-primary"
            >
              Каталог API
            </Link>
            <div className="mt-1 text-sm font-semibold text-foreground">1С УПП</div>
          </div>
          <DocsNav docs={docsNav} />
        </aside>

        <article className="min-w-0 w-full rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm md:p-8">
          <div className="docs-content">{children}</div>
        </article>
      </div>
    </PortalShell>
  );
}
