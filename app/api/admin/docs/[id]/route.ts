import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin/auth";
import { deleteDoc, getDocById, updateDoc } from "@/lib/docs/repository";
import { docInputSchema } from "@/lib/docs/types";

async function ensureAdmin() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const { id } = await params;
  const doc = getDocById(Number(id));

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(doc);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const { id } = await params;
  const result = docInputSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const doc = updateDoc(Number(id), result.data);

    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(doc);
  } catch {
    return NextResponse.json({ error: "Страница с таким slug уже существует" }, { status: 409 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authError = await ensureAdmin();
  if (authError) return authError;

  const { id } = await params;

  if (!deleteDoc(Number(id))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
