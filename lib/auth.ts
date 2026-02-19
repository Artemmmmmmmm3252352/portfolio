import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { hasAdminSessionFromCookies } from "@/lib/admin-session";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  const hasLocalSession = await hasAdminSessionFromCookies();
  if (hasLocalSession) {
    return { email: env.adminLogin, id: "local-admin" };
  }

  if (!env.hasSupabaseAuth) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
}

export async function requireAdminPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.email !== env.adminLogin && !isAllowedAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  return user;
}

export async function requireAdminApi() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.email !== env.adminLogin && !isAllowedAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}
