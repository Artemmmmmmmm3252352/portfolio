import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { hasNeonDatabase, neonQuery } from "@/lib/neon";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ensureUniqueSlug, parseProjectPayload, uploadProjectCover } from "@/lib/project-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminApi();
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { id } = await params;
    const formData = await request.formData();
    const parsed = parseProjectPayload(formData);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const cover = formData.get("cover");
    let coverPath = "";

    if (hasNeonDatabase()) {
      const { rows } = await neonQuery<{ cover_path: string }>(
        `
          select cover_path
          from public.projects
          where id = $1 and deleted_at is null
          limit 1
        `,
        [id]
      );

      if (!rows[0]) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      coverPath = rows[0].cover_path;
    } else {
      const db = createSupabaseAdminClient();
      const { data: current } = await db.from("projects").select("cover_path").eq("id", id).maybeSingle();
      if (!current) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      coverPath = current.cover_path as string;
    }

    if (cover instanceof File && cover.size > 0) {
      coverPath = await uploadProjectCover(cover);
    }

    const slug = await ensureUniqueSlug(parsed.data.titleEn || parsed.data.titleRu, id);
    const shouldPublish = parsed.data.status === "published";

    if (hasNeonDatabase()) {
      await neonQuery(
        `
          update public.projects
          set
            slug = $2,
            title_ru = $3,
            title_en = $4,
            excerpt_ru = $5,
            excerpt_en = $6,
            description_ru = $7,
            description_en = $8,
            author = $9,
            cover_path = $10,
            tags = $11,
            project_date = $12,
            status = $13,
            published_at = $14,
            updated_at = now()
          where id = $1
        `,
        [
          id,
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

      return NextResponse.json({ ok: true });
    }

    const db = createSupabaseAdminClient();
    const { error } = await db
      .from("projects")
      .update({
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
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminApi();
    if (admin instanceof NextResponse) {
      return admin;
    }

    const { id } = await params;
    if (hasNeonDatabase()) {
      await neonQuery(
        `
          update public.projects
          set deleted_at = now(), status = 'hidden', updated_at = now()
          where id = $1
        `,
        [id]
      );
      return NextResponse.json({ ok: true });
    }

    const db = createSupabaseAdminClient();
    const { error } = await db
      .from("projects")
      .update({
        deleted_at: new Date().toISOString(),
        status: "hidden"
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
