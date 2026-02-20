import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SetAllCookies } from "@supabase/ssr";
import { env } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookieList: Parameters<SetAllCookies>[0]) {
        try {
          cookieList.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server components can be read-only for cookies. Route handlers will still persist sessions.
        }
      }
    }
  });
}
