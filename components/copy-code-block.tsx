"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useState } from "react";

function extractText(node: ReactNode): string {
  if (typeof node === "string") {
    return node;
  }

  if (typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return extractText(props.children ?? "");
  }

  return "";
}

export function CopyCodeBlock({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);
  const text = extractText(children);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Скопировано" : "Копировать код"}
        title={copied ? "Скопировано" : "Копировать"}
        className="absolute top-3 right-3 z-10 inline-flex size-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/90 text-slate-200 opacity-0 transition hover:bg-slate-800 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        {copied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
      </button>
      <pre className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}
