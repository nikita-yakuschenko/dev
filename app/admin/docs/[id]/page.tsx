import Link from "next/link";
import { notFound } from "next/navigation";

import { DocForm } from "@/components/admin/doc-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { getDocById } from "@/lib/docs/repository";

export const dynamic = "force-dynamic";

export default async function EditDocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const doc = getDocById(Number(id));

  if (!doc) {
    notFound();
  }

  return (
    <main className="min-h-svh bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{doc.title}</h1>
            <p className="mt-2 text-muted-foreground">Редактирование страницы документации.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/">На главную</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/docs">К списку</Link>
            </Button>
          </div>
        </div>

        <DocForm doc={doc} />
      </div>
    </main>
  );
}
