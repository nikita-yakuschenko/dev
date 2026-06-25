import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "avgst_admin_session";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "change-me";
}

export function isValidAdminPassword(password: string) {
  const expectedPassword = getAdminPassword();

  return password.length > 0 && password === expectedPassword;
}

export function createAdminSessionValue() {
  return Buffer.from(`admin:${getAdminPassword()}`).toString("base64url");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value === createAdminSessionValue();
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}
