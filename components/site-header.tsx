import { DocsSearch } from "@/components/docs-search";
import Link from "next/link";
import { IconEdit } from "@tabler/icons-react";

import { McpStatusIndicator } from "@/components/mcp-status-indicator";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="relative flex h-16 items-center px-4 sm:px-6">
        <div className="z-10 flex shrink-0 items-center">
          <McpStatusIndicator />
        </div>

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center px-28 sm:px-36 md:flex">
          <div className="pointer-events-auto w-full max-w-2xl">
            <DocsSearch />
          </div>
        </div>

        <div className="z-10 ml-auto flex shrink-0 items-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/docs">
              <IconEdit className="size-4" />
              Редактор
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
