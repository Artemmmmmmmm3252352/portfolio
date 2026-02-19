import { env } from "@/lib/env";

export function isAllowedAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  if (env.allowedAdminEmails.length === 0) {
    return true;
  }

  return env.allowedAdminEmails.includes(email.toLowerCase());
}
