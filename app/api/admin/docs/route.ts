import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin/auth";
import { createDoc, listDocs } from "@/lib/docs/repository";
import { docInputSchema } from "@/lib/docs/types";

async function ensureAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function GET() {
  const authError = await ensureAdmin();
  if (authError) return authError;

  return NextResponse.json({ docs: listDocs() });
}

export async function POST(request: Request) {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const result = docInputSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const doc = createDoc(result.data);
    return NextResponse.json(doc, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Страница с таким slug уже существует" }, { status: 409 });
  }
}
