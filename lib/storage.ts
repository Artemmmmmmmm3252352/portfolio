import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

const client = env.hasSupabaseAuth
  ? createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

function publicUrl(bucket: string, path: string | null) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("uploads/")) {
    return `/${path}`;
  }

  if (!client) {
    return null;
  }

  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function projectCoverUrl(path: string) {
  return publicUrl("project-covers", path);
}

export function teamPhotoUrl(path: string | null) {
  return publicUrl("team-photos", path);
}
