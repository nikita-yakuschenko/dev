import Image from "next/image";
import Link from "next/link";
import {
  IconBraces,
  IconChevronDown,
  IconGauge,
  IconPlugConnected,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export function AppSidebar() {
  return (
    <aside className="hidden h-svh w-72 shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col gap-6 px-4 py-5">
        <Link href="/" className="group flex items-center gap-3 rounded-lg px-2 py-2">
          <Image
            src="/icon.svg"
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0"
            priority
          />
          <span className="text-sm font-semibold tracking-wide text-sidebar-foreground">
            dev.avgst
          </span>
        </Link>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          <Link
            href="/"
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/72 transition",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <IconGauge className="size-4 text-sidebar-foreground/50 transition group-hover:text-primary" />
            <span className="flex-1">Обзор</span>
          </Link>

          <details open className="group/catalog">
            <summary
              className={cn(
                "flex cursor-pointer list-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/72 transition",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&::-webkit-details-marker]:hidden",
              )}
            >
              <IconBraces className="size-4 text-sidebar-foreground/50 transition group-hover/catalog:text-primary" />
              <span className="flex-1">Каталог API</span>
              <IconChevronDown className="size-4 text-sidebar-foreground/45 transition group-open/catalog:rotate-180" />
            </summary>

            <div className="mt-1 space-y-1 pl-7">
              <Link
                href="/api/1c-upp"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/64 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <IconPlugConnected className="size-4 text-sidebar-foreground/45" />
                API 1С УПП
              </Link>
            </div>
          </details>
        </nav>
      </div>
    </aside>
  );
}
