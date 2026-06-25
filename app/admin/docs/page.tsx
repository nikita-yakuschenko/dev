import Link from "next/link";

import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { searchDocs } from "@/lib/docs/repository";

export const dynamic = "force-dynamic";

export default async function AdminDocsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q = "" } = await searchParams;
  const docs = searchDocs(q);

  return (
    <main className="min-h-svh bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Документация</h1>
            <p className="mt-2 text-muted-foreground">
              Редактирование страниц API 1С УПП без доступа к коду.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/">На главную</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/api/1c-upp">Открыть раздел</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/docs/new">Новая страница</Link>
            </Button>
          </div>
        </div>

        <form className="mt-6 flex gap-2" action="/admin/docs">
          <input
            name="q"
            defaultValue={q}
            placeholder="Поиск по заголовку, slug или тексту"
            className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" variant="outline">
            Найти
          </Button>
          {q ? (
            <Button asChild type="button" variant="ghost">
              <Link href="/admin/docs">Сбросить</Link>
            </Button>
          ) : null}
        </form>

        <div className="mt-3 text-sm text-muted-foreground">
          Найдено страниц: {docs.length}
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/admin/docs/${doc.id}`}
              className="grid gap-2 border-b border-border px-4 py-3 transition last:border-b-0 hover:bg-accent md:grid-cols-[minmax(0,1fr)_12rem_6rem]"
            >
              <div>
                <div className="font-medium">{doc.title}</div>
                <div className="text-sm text-muted-foreground">
                  /api/1c-upp/{doc.slug === "overview" ? "" : doc.slug}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{doc.slug}</div>
              <div className="text-sm text-muted-foreground">#{doc.order}</div>
            </Link>
          ))}

          {docs.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Ничего не найдено.
              </div>
          ) : null}
        </div>

        <form action="/api/admin/logout" method="post" className="mt-6">
          <Button variant="outline" type="submit">
            Выйти
          </Button>
        </form>
      </div>
    </main>
  );
}
