import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { hasNeonDatabase, neonQuery } from "@/lib/neon";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { uploadTeamPhoto } from "@/lib/project-service";
import { contentSchema } from "@/lib/validation";

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminApi();
    if (admin instanceof NextResponse) {
      return admin;
    }

    const formData = await request.formData();
    const raw = {
      studioName: String(formData.get("studioName") ?? ""),
      heroTitleRu: String(formData.get("heroTitleRu") ?? ""),
      heroTitleEn: String(formData.get("heroTitleEn") ?? ""),
      heroSubtitleRu: String(formData.get("heroSubtitleRu") ?? ""),
      heroSubtitleEn: String(formData.get("heroSubtitleEn") ?? ""),
      aboutTextRu: String(formData.get("aboutTextRu") ?? ""),
      aboutTextEn: String(formData.get("aboutTextEn") ?? ""),
      strengthsRu: String(formData.get("strengthsRu") ?? ""),
      strengthsEn: String(formData.get("strengthsEn") ?? ""),
      workFormatRu: String(formData.get("workFormatRu") ?? ""),
      workFormatEn: String(formData.get("workFormatEn") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? "")
    };

    const validation = contentSchema.safeParse(raw);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
    }

    let teamPhoto1Path: string | null = null;
    let teamPhoto2Path: string | null = null;

    if (hasNeonDatabase()) {
      const { rows } = await neonQuery<{ team_photo_1_path: string | null; team_photo_2_path: string | null }>(
        `
          select team_photo_1_path, team_photo_2_path
          from public.site_content
          where id = 1
          limit 1
        `
      );

      teamPhoto1Path = rows[0]?.team_photo_1_path ?? null;
      teamPhoto2Path = rows[0]?.team_photo_2_path ?? null;
    } else {
      const db = createSupabaseAdminClient();
      const { data: existing } = await db
        .from("site_content")
        .select("team_photo_1_path, team_photo_2_path")
        .eq("id", 1)
        .maybeSingle();
      teamPhoto1Path = existing?.team_photo_1_path ?? null;
      teamPhoto2Path = existing?.team_photo_2_path ?? null;
    }

    const teamPhoto1 = formData.get("teamPhoto1");
    const teamPhoto2 = formData.get("teamPhoto2");

    if (teamPhoto1 instanceof File && teamPhoto1.size > 0) {
      teamPhoto1Path = await uploadTeamPhoto(teamPhoto1, 1);
    }

    if (teamPhoto2 instanceof File && teamPhoto2.size > 0) {
      teamPhoto2Path = await uploadTeamPhoto(teamPhoto2, 2);
    }

    if (hasNeonDatabase()) {
      await neonQuery(
        `
          insert into public.site_content (
            id, studio_name, hero_title_ru, hero_title_en,
            hero_subtitle_ru, hero_subtitle_en, about_text_ru, about_text_en,
            strengths_ru, strengths_en, work_format_ru, work_format_en,
            contact_email, team_photo_1_path, team_photo_2_path, updated_at
          ) values (
            1, $1, $2, $3,
            $4, $5, $6, $7,
            $8, $9, $10, $11,
            $12, $13, $14, now()
          )
          on conflict (id) do update set
            studio_name = excluded.studio_name,
            hero_title_ru = excluded.hero_title_ru,
            hero_title_en = excluded.hero_title_en,
            hero_subtitle_ru = excluded.hero_subtitle_ru,
            hero_subtitle_en = excluded.hero_subtitle_en,
            about_text_ru = excluded.about_text_ru,
            about_text_en = excluded.about_text_en,
            strengths_ru = excluded.strengths_ru,
            strengths_en = excluded.strengths_en,
            work_format_ru = excluded.work_format_ru,
            work_format_en = excluded.work_format_en,
            contact_email = excluded.contact_email,
            team_photo_1_path = excluded.team_photo_1_path,
            team_photo_2_path = excluded.team_photo_2_path,
            updated_at = now()
        `,
        [
          validation.data.studioName,
          validation.data.heroTitleRu,
          validation.data.heroTitleEn,
          validation.data.heroSubtitleRu,
          validation.data.heroSubtitleEn,
          validation.data.aboutTextRu,
          validation.data.aboutTextEn,
          validation.data.strengthsRu,
          validation.data.strengthsEn,
          validation.data.workFormatRu,
          validation.data.workFormatEn,
          validation.data.contactEmail,
          teamPhoto1Path,
          teamPhoto2Path
        ]
      );

      return NextResponse.json({ ok: true });
    }

    const db = createSupabaseAdminClient();
    const { error } = await db.from("site_content").upsert(
      {
        id: 1,
        studio_name: validation.data.studioName,
        hero_title_ru: validation.data.heroTitleRu,
        hero_title_en: validation.data.heroTitleEn,
        hero_subtitle_ru: validation.data.heroSubtitleRu,
        hero_subtitle_en: validation.data.heroSubtitleEn,
        about_text_ru: validation.data.aboutTextRu,
        about_text_en: validation.data.aboutTextEn,
        strengths_ru: validation.data.strengthsRu,
        strengths_en: validation.data.strengthsEn,
        work_format_ru: validation.data.workFormatRu,
        work_format_en: validation.data.workFormatEn,
        contact_email: validation.data.contactEmail,
        team_photo_1_path: teamPhoto1Path,
        team_photo_2_path: teamPhoto2Path,
        updated_at: new Date().toISOString()
      },
      { onConflict: "id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
