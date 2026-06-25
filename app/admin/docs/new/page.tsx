import Link from "next/link";

import { DocForm } from "@/components/admin/doc-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";

export default async function NewDocPage() {
  await requireAdmin();

  return (
    <main className="min-h-svh bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Новая страница</h1>
            <p className="mt-2 text-muted-foreground">Добавьте новую страницу документации.</p>
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

        <DocForm />
      </div>
    </main>
  );
}
