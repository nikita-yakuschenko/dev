"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  IconBook2,
  IconChevronDown,
  IconClock,
  IconKey,
  IconList,
  IconPlugConnected,
  IconServer,
} from "@tabler/icons-react";

import { METHOD_CATEGORIES, getMethodCategoryId } from "@/lib/docs/method-categories";
import { docHref } from "@/lib/docs/routes";
import { cn } from "@/lib/utils";
import type { DocPage } from "@/lib/docs/types";

const slugIcons: Record<string, typeof IconBook2> = {
  overview: IconBook2,
  auth: IconKey,
  environments: IconServer,
  changelog: IconClock,
};

function buildNavStructure(docs: DocPage[]) {
  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]));

  const documentationSlugs = ["overview", "auth", "environments", "changelog"];
  const documentation = documentationSlugs
    .map((slug) => bySlug.get(slug))
    .filter((doc): doc is DocPage => Boolean(doc));

  const methodCategories = METHOD_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    items: docs
      .filter((doc) => getMethodCategoryId(doc.slug) === category.id)
      .sort((left, right) => left.order - right.order),
  })).filter((category) => category.items.length > 0);

  return { documentation, methodCategories };
}

function isActivePath(pathname: string, slug: string) {
  return pathname === docHref(slug);
}

function NavSectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 px-2.5 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </div>
  );
}

function NavLink({
  doc,
  depth = 0,
  pathname,
}: {
  doc: DocPage;
  depth?: 0 | 1 | 2;
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
        "group flex items-center gap-2.5 rounded-lg py-2 pr-2.5 text-sm transition-colors",
        depth === 0 && "px-2.5",
        depth === 1 && "pl-9 pr-2.5",
        depth === 2 && "pl-[3.25rem] pr-2.5",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {depth === 0 ? (
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

function NavStaticItem({
  icon: Icon,
  label,
}: {
  icon: typeof IconBook2;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground">
      <Icon className="size-4 shrink-0 text-muted-foreground/80" />
      <span className="min-w-0 leading-5">{label}</span>
    </div>
  );
}

function CollapsibleNavSection({
  label,
  children,
  depth = 1,
  initialOpen = false,
  forceOpen = false,
}: {
  label: string;
  children: ReactNode;
  depth?: 1 | 2;
  initialOpen?: boolean;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    }
  }, [forceOpen]);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg py-2 pr-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
          depth === 1 && "pl-9",
          depth === 2 && "pl-[3.25rem]",
        )}
      >
        <IconChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            open ? "rotate-0" : "-rotate-90",
          )}
        />
        <span className="min-w-0 flex-1 leading-5">{label}</span>
      </button>
      {open ? <div className="flex flex-col gap-0.5">{children}</div> : null}
    </div>
  );
}

export function DocsNav({ docs }: { docs: DocPage[] }) {
  const pathname = usePathname();
  const { documentation, methodCategories } = buildNavStructure(docs);

  return (
    <nav className="flex flex-col gap-6">
      {documentation.length > 0 ? (
        <div>
          <NavSectionLabel>Документация</NavSectionLabel>
          <div className="flex flex-col gap-0.5">
            {documentation.map((doc) => (
              <NavLink key={doc.id} doc={doc} pathname={pathname} />
            ))}
          </div>
        </div>
      ) : null}

      {methodCategories.length > 0 ? (
        <div>
          <NavStaticItem icon={IconList} label="Список методов" />
          <div className="mt-0.5 flex flex-col gap-0.5">
            {methodCategories.map((category) => {
              const categoryActive = category.items.some((doc) =>
                isActivePath(pathname, doc.slug),
              );

              return (
                <CollapsibleNavSection
                  key={category.id}
                  label={category.label}
                  initialOpen={categoryActive}
                  forceOpen={categoryActive}
                >
                  {category.items.map((doc) => (
                    <NavLink key={doc.id} doc={doc} depth={2} pathname={pathname} />
                  ))}
                </CollapsibleNavSection>
              );
            })}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
