import { NextRequest, NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/data";
import { resolveLocale } from "@/lib/i18n";
import { Author } from "@/types/domain";

function parseAuthor(value: string | null): "all" | Author {
  if (value === "artem" || value === "nikita") {
    return value;
  }
  return "all";
}

export async function GET(request: NextRequest) {
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale") ?? "ru");
  const author = parseAuthor(request.nextUrl.searchParams.get("author"));
  const projects = await getPublishedProjects(locale, author);

  return NextResponse.json({ items: projects });
}
