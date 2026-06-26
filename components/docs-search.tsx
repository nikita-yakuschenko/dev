"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";

import type { DocSearchResult } from "@/lib/docs/search-results";
import { HighlightedText } from "@/components/highlighted-text";
import { splitTextByQuery } from "@/lib/docs/search";
import { cn } from "@/lib/utils";

type SearchResponse = {
  query: string;
  results: DocSearchResult[];
};

export function DocsSearch() {
  const listboxId = useId();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setLoading(false);
      setActiveIndex(-1);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(() => {
      void fetch(`/api/docs/search?q=${encodeURIComponent(trimmedQuery)}`, {
        cache: "no-store",
      })
        .then((response) => response.json() as Promise<SearchResponse>)
        .then((data) => {
          setResults(data.results);
          setActiveIndex(data.results.length > 0 ? 0 : -1);
          setOpen(true);
        })
        .catch(() => {
          setResults([]);
          setActiveIndex(-1);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function navigateTo(href: string) {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    router.push(href);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!open || results.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      navigateTo(results[activeIndex].href);
    }
  }

  const showPanel = open && query.trim().length > 0;
  const showEmpty = showPanel && !loading && results.length === 0;

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="sr-only" htmlFor="docs-search">
        Поиск по документации
      </label>
      <div className="flex h-9 items-center gap-2 rounded-lg border border-border/80 bg-card px-3 text-sm shadow-sm">
        <IconSearch className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          id="docs-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) {
              setOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Поиск по документации"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listboxId : undefined}
          aria-autocomplete="list"
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {showPanel ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-[calc(100%+0.5rem)] z-50 w-full overflow-hidden rounded-lg border border-border/80 bg-popover text-popover-foreground shadow-lg"
        >
          {loading ? (
            <div className="px-3 py-2.5 text-sm text-muted-foreground">Ищем…</div>
          ) : null}

          {showEmpty ? (
            <div className="px-3 py-2.5 text-sm text-muted-foreground">Ничего не найдено</div>
          ) : null}

          {!loading && results.length > 0
            ? results.map((result, index) => (
                <Link
                  key={result.slug}
                  href={result.href}
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={(event) => {
                    event.preventDefault();
                    navigateTo(result.href);
                  }}
                  className={cn(
                    "block border-b border-border/60 px-3 py-2.5 last:border-b-0",
                    index === activeIndex ? "bg-muted" : "hover:bg-muted/70",
                  )}
                >
                  <div className="text-sm font-medium text-foreground">
                    <HighlightedText parts={splitTextByQuery(result.title, query)} />
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    <HighlightedText
                      parts={splitTextByQuery(result.excerpt, query, { allowWordPrefix: true })}
                    />
                  </div>
                </Link>
              ))
            : null}
        </div>
      ) : null}
    </div>
  );
}
