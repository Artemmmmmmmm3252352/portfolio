import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { hasNeonDatabase, neonQuery } from "@/lib/neon";
import { hashIp, isRateLimited } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

const db = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

function getIpAddress(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "0.0.0.0";
  }
  return request.headers.get("x-real-ip") ?? "0.0.0.0";
}

async function insertContactMessage(input: {
  name: string;
  email: string;
  message: string;
  locale: string;
  ipHash: string;
  userAgent: string | null;
}) {
  if (hasNeonDatabase()) {
    try {
      await neonQuery(
        `
          insert into public.contact_messages (name, email, message, locale, ip_hash, user_agent)
          values ($1, $2, $3, $4, $5, $6)
        `,
        [input.name, input.email, input.message, input.locale, input.ipHash, input.userAgent]
      );
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Failed to insert contact message";
    }
  }

  const { error } = await db.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    message: input.message,
    locale: input.locale,
    ip_hash: input.ipHash,
    user_agent: input.userAgent
  });

  return error?.message ?? null;
}

async function resolveContactEmail() {
  if (hasNeonDatabase()) {
    try {
      const { rows } = await neonQuery<{ contact_email: string }>(
        "select contact_email from public.site_content where id = 1 limit 1"
      );
      return rows[0]?.contact_email ?? "ernestartem@outlook.com";
    } catch {
      return "ernestartem@outlook.com";
    }
  }

  const { data: siteContent } = await db.from("site_content").select("contact_email").eq("id", 1).maybeSingle();
  return siteContent?.contact_email ?? "ernestartem@outlook.com";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const payload = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    locale: String(formData.get("locale") ?? "ru"),
    hp: String(formData.get("hp") ?? "")
  };

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.hp) {
    return NextResponse.json({ ok: true });
  }

  const ipHash = hashIp(getIpAddress(request));
  if (isRateLimited(ipHash)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const userAgent = request.headers.get("user-agent");

  const insertError = await insertContactMessage({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    locale: parsed.data.locale,
    ipHash,
    userAgent
  });

  if (insertError) {
    return NextResponse.json({ error: insertError }, { status: 500 });
  }

  if (env.resendApiKey) {
    const toEmail = await resolveContactEmail();
    const resend = new Resend(env.resendApiKey);

    try {
      await resend.emails.send({
        from: env.resendFrom,
        to: [toEmail],
        subject: `New website lead: ${parsed.data.name}`,
        replyTo: parsed.data.email,
        text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nLocale: ${parsed.data.locale}\n\n${parsed.data.message}`
      });
    } catch {
      // Keep API success because contact was saved in DB.
    }
  }

  return NextResponse.json({ ok: true });
}
