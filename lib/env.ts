function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function isPlaceholderSupabase(url: string, anonKey: string) {
  return url.includes("example.supabase.co") || anonKey === "demo-anon-key";
}

const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "demo-anon-key");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const supabasePlaceholder = isPlaceholderSupabase(supabaseUrl, supabaseAnonKey);

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceRoleKey,
  hasSupabaseAuth: !supabasePlaceholder,
  hasSupabaseServiceRole: !supabasePlaceholder && Boolean(supabaseServiceRoleKey),
  adminLogin: process.env.ADMIN_LOGIN ?? "admin",
  adminPassword: process.env.ADMIN_PASSWORD ?? "admin12345",
  adminSessionSecret: process.env.ADMIN_SESSION_SECRET ?? "local-admin-session-secret",
  allowedAdminEmails: (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendFrom: process.env.RESEND_FROM_EMAIL ?? "Portfolio Studio <no-reply@example.com>"
};
