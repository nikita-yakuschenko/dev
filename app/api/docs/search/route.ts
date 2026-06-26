import { NextResponse } from "next/server";

import { buildDocSearchResults } from "@/lib/docs/search-results";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const results = buildDocSearchResults(query);

  return NextResponse.json(
    { query: query.trim(), results },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
