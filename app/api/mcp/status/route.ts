import { NextResponse } from "next/server";

import { fetchMcpHealth } from "@/lib/mcp/health";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await fetchMcpHealth();

  return NextResponse.json(snapshot, {
    status: snapshot.status === "unavailable" ? 503 : 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
