"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MarkdownContent } from "@/components/markdown-content";
import { Button } from "@/components/ui/button";
import type { DocPage } from "@/lib/docs/types";

type DocFormProps = {
  doc?: DocPage;
};

const emptyDoc = {
  title: "",
  slug: "",
  section: "1c-upp",
  navTitle: "",
  order: 100,
  content: "# Новая страница\n\nОпишите здесь новую документацию.",
};

export function DocForm({ doc }: DocFormProps) {
  const router = useRouter();
  const initialValue = useMemo(
    () =>
      doc
        ? {
            title: doc.title,
            slug: doc.slug,
            section: doc.section,
            navTitle: doc.navTitle,
            order: doc.order,
            content: doc.content,
          }
        : emptyDoc,
    [doc],
  );
  const [form, setForm] = useState(initialValue);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveDoc() {
    setIsSaving(true);
    setError("");

    const response = await fetch(doc ? `/api/admin/docs/${doc.id}` : "/api/admin/docs", {
      method: doc ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setIsSaving(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Не удалось сохранить страницу");
      return;
    }

    const payload = (await response.json()) as { id: number };
    router.push(`/admin/docs/${payload.id}`);
    router.refresh();
  }

  async function deleteDoc() {
    if (!doc || !window.confirm("Удалить страницу документации?")) {
      return;
    }

    const response = await fetch(`/api/admin/docs/${doc.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Не удалось удалить страницу");
      return;
    }

    router.push("/admin/docs");
    router.refresh();
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Заголовок
            <input
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-medium">
              Slug
              <input
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Название в меню
              <input
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={form.navTitle}
                onChange={(event) => setForm({ ...form, navTitle: event.target.value })}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Порядок
              <input
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                type="number"
                value={form.order}
                onChange={(event) => setForm({ ...form, order: Number(event.target.value) })}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium">
            Markdown
            <textarea
              className="min-h-112 rounded-md border border-input bg-background p-3 font-mono text-sm leading-6"
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
            />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={saveDoc} disabled={isSaving}>
              {isSaving ? "Сохраняю..." : "Сохранить"}
            </Button>
            {doc ? (
              <Button type="button" variant="destructive" onClick={deleteDoc}>
                Удалить
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 text-sm font-medium text-muted-foreground">Preview</div>
        <MarkdownContent content={form.content} />
      </section>
    </div>
  );
}
