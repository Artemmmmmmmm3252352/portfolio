import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";
import { env } from "@/lib/env";

export function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookieList: Parameters<SetAllCookies>[0]) {
        cookieList.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({
          request: {
            headers: request.headers
          }
        });

        cookieList.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  return { supabase, response };
}
