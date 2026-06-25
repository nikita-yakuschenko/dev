import Link from "next/link";
import { IconEdit, IconSearch, IconShieldCheck, IconSparkles } from "@tabler/icons-react";

import { McpStatusIndicator } from "@/components/mcp-status-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Badge variant="outline" className="hidden border-primary/30 text-primary sm:inline-flex">
            <IconSparkles className="size-3" />
            Internal Beta
          </Badge>
          <McpStatusIndicator />
          <div className="hidden h-9 min-w-64 items-center gap-2 rounded-xl border border-border/70 bg-card/65 px-3 text-sm text-muted-foreground shadow-sm md:flex">
            <IconSearch className="size-4" />
            Поиск по документации скоро
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/18">
            <IconShieldCheck className="size-3" />
            API Docs
          </Badge>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
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
