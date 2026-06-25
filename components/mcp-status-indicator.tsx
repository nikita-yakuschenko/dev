"use client";

import { useEffect, useState } from "react";
import { IconPlugConnected } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import type { McpHealthSnapshot, McpHealthStatus } from "@/lib/mcp/health";
import { cn } from "@/lib/utils";

type IndicatorState = "loading" | McpHealthStatus;

const badgeStyles: Record<IndicatorState, string> = {
  loading: "border-border/70 bg-muted/60 text-muted-foreground",
  ok: "border-emerald-500/25 bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/18",
  degraded: "border-amber-500/25 bg-amber-500/12 text-amber-800 hover:bg-amber-500/18",
  unavailable: "border-red-500/25 bg-red-500/12 text-red-700 hover:bg-red-500/18",
};

const dotStyles: Record<IndicatorState, string> = {
  loading: "bg-muted-foreground/50 animate-pulse",
  ok: "bg-emerald-500",
  degraded: "bg-amber-500",
  unavailable: "bg-red-500",
};

export function McpStatusIndicator() {
  const [state, setState] = useState<IndicatorState>("loading");
  const [snapshot, setSnapshot] = useState<McpHealthSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/mcp/status", { cache: "no-store" });
        const data = (await response.json()) as McpHealthSnapshot;

        if (cancelled) {
          return;
        }

        setSnapshot(data);
        setState(data.status);
      } catch {
        if (!cancelled) {
          setSnapshot(null);
          setState("unavailable");
        }
      }
    }

    void loadStatus();
    const timer = window.setInterval(loadStatus, 60_000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const label =
    state === "loading" ? "MCP…" : (snapshot?.label ?? "MCP недоступен");
  const detail =
    snapshot?.detail ??
    (state === "loading"
      ? "Проверяем доступность MCP…"
      : "Не удалось получить статус MCP.");

  return (
    <Badge
      variant="outline"
      className={cn("hidden sm:inline-flex", badgeStyles[state])}
      title={detail}
      aria-label={`${label}. ${detail}`}
    >
      <span className={cn("size-2 rounded-full", dotStyles[state])} aria-hidden="true" />
      <IconPlugConnected className="size-3" aria-hidden="true" />
      {label}
    </Badge>
  );
}
