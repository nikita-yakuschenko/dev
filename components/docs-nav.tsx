"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBook2,
  IconClock,
  IconKey,
  IconList,
  IconPlugConnected,
  IconServer,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import type { DocPage } from "@/lib/docs/types";

type NavGroup = {
  label: string;
  items: DocPage[];
  nested?: boolean;
};

const slugIcons: Record<string, typeof IconBook2> = {
  overview: IconBook2,
  auth: IconKey,
  environments: IconServer,
  methods: IconList,
  changelog: IconClock,
};

function docHref(slug: string) {
  return slug === "overview" ? "/api/1c-upp" : `/api/1c-upp/${slug}`;
}

function buildNavGroups(docs: DocPage[]): NavGroup[] {
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));

  const generalSlugs = ["overview", "auth", "environments"];
  const general = generalSlugs
    .map((slug) => bySlug.get(slug))
    .filter((doc): doc is DocPage => Boolean(doc));

  const methodsIndex = bySlug.get("methods");
  const methodPages = docs.filter((doc) => doc.slug.startsWith("methods/"));
  const methodsItems = methodsIndex ? [methodsIndex, ...methodPages] : methodPages;

  const changelog = bySlug.get("changelog");

  const groups: NavGroup[] = [
    { label: "Документация", items: general },
    { label: "Методы", items: methodsItems, nested: true },
  ];

  if (changelog) {
    groups.push({ label: "История", items: [changelog] });
  }

  return groups.filter((group) => group.items.length > 0);
}

function isActivePath(pathname: string, slug: string) {
  return pathname === docHref(slug);
}

function NavLink({
  doc,
  nested = false,
  pathname,
}: {
  doc: DocPage;
  nested?: boolean;
  pathname: string;
}) {
  const active = isActivePath(pathname, doc.slug);
  const Icon = slugIcons[doc.slug] ?? IconPlugConnected;
  const href = docHref(doc.slug);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg py-2 text-sm transition-colors",
        nested ? "pl-7 pr-2.5" : "px-2.5",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {!nested ? (
        <Icon
          className={cn(
            "size-4 shrink-0",
            active ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground",
          )}
        />
      ) : (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            active ? "bg-primary" : "bg-muted-foreground/35 group-hover:bg-muted-foreground/55",
          )}
        />
      )}
      <span className="min-w-0 leading-5">{doc.navTitle}</span>
    </Link>
  );
}

export function DocsNav({ docs }: { docs: DocPage[] }) {
  const pathname = usePathname();
  const groups = buildNavGroups(docs);

  return (
    <nav className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="mb-1.5 px-2.5 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {group.label}
          </div>
          <div className="flex flex-col gap-0.5">
            {group.items.map((doc) => (
              <NavLink
                key={doc.id}
                doc={doc}
                nested={group.nested && doc.slug !== "methods"}
                pathname={pathname}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
