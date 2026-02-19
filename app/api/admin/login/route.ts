import { NextRequest, NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/admin-session";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (email === env.adminLogin && password === env.adminPassword) {
    const response = NextResponse.json({ ok: true, next: nextPath });
    await setAdminSessionCookie(response, email);
    return response;
  }

  if (!env.hasSupabaseAuth) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (!isAllowedAdminEmail(email)) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ ok: true, next: nextPath });
}
