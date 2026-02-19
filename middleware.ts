import { NextRequest, NextResponse } from "next/server";
import { hasAdminSessionFromRequest } from "@/lib/admin-session";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { env } from "@/lib/env";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    const { response } = updateSession(request);
    return response;
  }

  if (request.nextUrl.pathname === "/admin/login") {
    const { response } = updateSession(request);
    return response;
  }

  const hasLocalSession = await hasAdminSessionFromRequest(request);
  if (hasLocalSession) {
    return NextResponse.next();
  }

  if (!env.hasSupabaseAuth) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { supabase, response } = updateSession(request);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
