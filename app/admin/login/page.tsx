import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { isAdminAuthenticated } from "@/lib/admin/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin/docs");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <form
        action="/api/admin/login"
        method="post"
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <h1 className="text-2xl font-semibold tracking-tight">Вход в админку</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Введите пароль администратора, чтобы редактировать документацию.
        </p>

        <label className="mt-6 block text-sm font-medium" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          required
        />

        {error ? (
          <p className="mt-3 text-sm text-destructive">Неверный пароль.</p>
        ) : null}

        <Button className="mt-6 w-full" type="submit">
          Войти
        </Button>

        <Button asChild className="mt-2 w-full" type="button" variant="ghost">
          <Link href="/">На главную</Link>
        </Button>
      </form>
    </main>
  );
}
