import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-session";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearAdminSessionCookie(response);

  if (env.hasSupabaseAuth) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return response;
}
