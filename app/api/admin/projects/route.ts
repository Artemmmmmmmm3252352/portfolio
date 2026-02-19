import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { hasNeonDatabase, neonQuery } from "@/lib/neon";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ensureUniqueSlug, parseProjectPayload, uploadProjectCover } from "@/lib/project-service";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminApi();
    if (admin instanceof NextResponse) {
      return admin;
    }

    const formData = await request.formData();
    const parsed = parseProjectPayload(formData);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const cover = formData.get("cover");
    if (!(cover instanceof File) || cover.size === 0) {
      return NextResponse.json({ error: "Cover image is required" }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(parsed.data.titleEn || parsed.data.titleRu);
    const coverPath = await uploadProjectCover(cover);
    const shouldPublish = parsed.data.status === "published";

    if (hasNeonDatabase()) {
      const { rows } = await neonQuery<{ id: string }>(
        `
          insert into public.projects (
            slug, title_ru, title_en, excerpt_ru, excerpt_en,
            description_ru, description_en, author, cover_path,
            tags, project_date, status, published_at
          ) values (
            $1,$2,$3,$4,$5,
            $6,$7,$8,$9,
            $10,$11,$12,$13
          )
          returning id
        `,
        [
          slug,
          parsed.data.titleRu,
          parsed.data.titleEn,
          parsed.data.excerptRu,
          parsed.data.excerptEn,
          parsed.data.descriptionRu,
          parsed.data.descriptionEn,
          parsed.data.author,
          coverPath,
          parsed.data.tags,
          parsed.data.projectDate,
          parsed.data.status,
          shouldPublish ? new Date().toISOString() : null
        ]
      );

      return NextResponse.json({ ok: true, id: rows[0]?.id ?? null });
    }

    const db = createSupabaseAdminClient();
    const { data, error } = await db
      .from("projects")
      .insert({
        slug,
        title_ru: parsed.data.titleRu,
        title_en: parsed.data.titleEn,
        excerpt_ru: parsed.data.excerptRu,
        excerpt_en: parsed.data.excerptEn,
        description_ru: parsed.data.descriptionRu,
        description_en: parsed.data.descriptionEn,
        author: parsed.data.author,
        cover_path: coverPath,
        tags: parsed.data.tags,
        project_date: parsed.data.projectDate,
        status: parsed.data.status,
        published_at: shouldPublish ? new Date().toISOString() : null
      })
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
