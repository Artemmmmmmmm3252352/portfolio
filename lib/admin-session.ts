import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function base64url(input: Uint8Array) {
  let binary = "";
  for (let index = 0; index < input.length; index += 1) {
    binary += String.fromCharCode(input[index]!);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(value: string) {
  const keyData = new TextEncoder().encode(env.adminSessionSecret);
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(value));
  return base64url(new Uint8Array(signature));
}

export async function createAdminSessionValue(login: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${login}.${expiresAt}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionValue(value?: string | null) {
  if (!value) {
    return false;
  }

  const [login, expiresAt, signature] = value.split(".");
  if (!login || !expiresAt || !signature) {
    return false;
  }

  const expires = Number(expiresAt);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const payload = `${login}.${expiresAt}`;
  const expected = await sign(payload);
  return expected === signature && login === env.adminLogin;
}

export async function setAdminSessionCookie(response: NextResponse, login: string) {
  const value = await createAdminSessionValue(login);
  response.cookies.set(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function hasAdminSessionFromRequest(request: NextRequest) {
  return verifyAdminSessionValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? null);
}

export async function hasAdminSessionFromCookies() {
  const cookieStore = await cookies();
  return verifyAdminSessionValue(cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null);
}
