import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { hasNeonDatabase, neonQuery } from "@/lib/neon";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Author, Locale, ProjectRow, ProjectView, SiteContentRow, SiteContentView } from "@/types/domain";

const publicDb = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function getAdminDb() {
  try {
    return createSupabaseAdminClient();
  } catch {
    return createSupabaseServerClient();
  }
}

const FALLBACK_CONTENT: SiteContentRow = {
  id: 1,
  studio_name: "Studio",
  hero_title_ru: "\u0414\u0435\u043b\u0430\u0435\u043c \u0441\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0434\u0443\u043a\u0442\u044b",
  hero_title_en: "We build modern products",
  hero_subtitle_ru:
    "\u0421\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0435 \u043f\u0440\u043e\u0434\u0443\u043a\u0442\u044b | UI/UX | \u0410\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f",
  hero_subtitle_en: "Modern products | UI/UX | Automation",
  about_text_ru:
    "\u041c\u044b \u043f\u0440\u043e\u0435\u043a\u0442\u0438\u0440\u0443\u0435\u043c \u0438 \u0437\u0430\u043f\u0443\u0441\u043a\u0430\u0435\u043c \u0446\u0438\u0444\u0440\u043e\u0432\u044b\u0435 \u043f\u0440\u043e\u0434\u0443\u043a\u0442\u044b: \u043e\u0442 MVP \u0438 \u043b\u0435\u043d\u0434\u0438\u043d\u0433\u043e\u0432 \u0434\u043e \u0432\u043d\u0443\u0442\u0440\u0435\u043d\u043d\u0438\u0445 \u0441\u0435\u0440\u0432\u0438\u0441\u043e\u0432.",
  about_text_en: "We design and launch digital products, from MVPs and landing pages to internal services.",
  strengths_ru:
    "\u0421\u0438\u043b\u044c\u043d\u044b \u0432 \u043f\u0440\u043e\u0434\u0443\u043a\u0442\u043e\u0432\u043e\u0439 \u043b\u043e\u0433\u0438\u043a\u0435, UX \u0438 \u0447\u0438\u0441\u0442\u043e\u0439 \u0440\u0435\u0430\u043b\u0438\u0437\u0430\u0446\u0438\u0438.",
  strengths_en: "Strong in product logic, UX and clean delivery.",
  work_format_ru:
    "\u0420\u0430\u0431\u043e\u0442\u0430\u0435\u043c \u0431\u044b\u0441\u0442\u0440\u043e, \u0430\u043a\u043a\u0443\u0440\u0430\u0442\u043d\u043e \u0438 \u043f\u043e\u0434 \u043a\u043b\u044e\u0447.",
  work_format_en: "We deliver fast, carefully, and turnkey.",
  contact_email: "ernestartem@outlook.com",
  team_photo_1_path: null,
  team_photo_2_path: null,
  updated_at: new Date().toISOString()
};

function mapProject(row: ProjectRow, locale: Locale): ProjectView {
  return {
    id: row.id,
    slug: row.slug,
    title: locale === "ru" ? row.title_ru : row.title_en,
    excerpt: locale === "ru" ? row.excerpt_ru : row.excerpt_en,
    description: locale === "ru" ? row.description_ru : row.description_en,
    author: row.author,
    coverPath: row.cover_path,
    tags: row.tags ?? [],
    projectDate: row.project_date,
    status: row.status,
    updatedAt: row.updated_at
  };
}

function mapSiteContent(row: SiteContentRow, locale: Locale): SiteContentView {
  return {
    studioName: row.studio_name,
    heroTitle: locale === "ru" ? row.hero_title_ru : row.hero_title_en,
    heroSubtitle: locale === "ru" ? row.hero_subtitle_ru : row.hero_subtitle_en,
    aboutText: locale === "ru" ? row.about_text_ru : row.about_text_en,
    strengths: locale === "ru" ? row.strengths_ru : row.strengths_en,
    workFormat: locale === "ru" ? row.work_format_ru : row.work_format_en,
    contactEmail: row.contact_email,
    teamPhoto1Path: row.team_photo_1_path,
    teamPhoto2Path: row.team_photo_2_path
  };
}

async function getNeonSiteContentRow() {
  if (!hasNeonDatabase()) {
    return null;
  }

  try {
    const { rows } = await neonQuery<SiteContentRow>("select * from public.site_content where id = 1 limit 1");
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

async function getNeonPublishedProjects(author: Author | "all") {
  if (!hasNeonDatabase()) {
    return null;
  }

  try {
    const values: unknown[] = ["published"];
    let authorSql = "";

    if (author !== "all") {
      values.push(author);
      authorSql = " and author = $2";
    }

    const { rows } = await neonQuery<ProjectRow>(
      `
        select *
        from public.projects
        where status = $1
          and deleted_at is null
          ${authorSql}
        order by project_date desc nulls last, created_at desc
      `,
      values
    );

    return rows;
  } catch {
    return null;
  }
}

export async function getSiteContent(locale: Locale) {
  const neonContent = await getNeonSiteContentRow();
  if (neonContent) {
    return mapSiteContent(neonContent, locale);
  }

  const { data } = await publicDb.from("site_content").select("*").eq("id", 1).maybeSingle();
  return mapSiteContent((data as SiteContentRow | null) ?? FALLBACK_CONTENT, locale);
}

export async function getPublishedProjects(locale: Locale, author: Author | "all" = "all") {
  const neonRows = await getNeonPublishedProjects(author);
  if (neonRows) {
    return neonRows.map((row) => mapProject(row, locale));
  }

  let query = publicDb
    .from("projects")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("project_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (author !== "all") {
    query = query.eq("author", author);
  }

  const { data } = await query;
  return ((data ?? []) as ProjectRow[]).map((row) => mapProject(row, locale));
}

export async function getFeaturedProjects(locale: Locale, limit = 3) {
  if (hasNeonDatabase()) {
    try {
      const { rows } = await neonQuery<ProjectRow>(
        `
          select *
          from public.projects
          where status = $1 and deleted_at is null
          order by published_at desc nulls last, created_at desc
          limit $2
        `,
        ["published", limit]
      );

      return rows.map((row) => mapProject(row, locale));
    } catch {
      // fallback to Supabase
    }
  }

  const { data } = await publicDb
    .from("projects")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return ((data ?? []) as ProjectRow[]).map((row) => mapProject(row, locale));
}

export async function getPublishedProjectBySlug(locale: Locale, slug: string) {
  if (hasNeonDatabase()) {
    try {
      const { rows } = await neonQuery<ProjectRow>(
        `
          select *
          from public.projects
          where slug = $1
            and status = $2
            and deleted_at is null
          limit 1
        `,
        [slug, "published"]
      );

      if (rows[0]) {
        return mapProject(rows[0], locale);
      }
    } catch {
      // fallback to Supabase
    }
  }

  const { data } = await publicDb
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return mapProject(data as ProjectRow, locale);
}

export async function getAdminProjects() {
  if (hasNeonDatabase()) {
    try {
      const { rows } = await neonQuery<ProjectRow>(
        `
          select *
          from public.projects
          where deleted_at is null
          order by updated_at desc
        `
      );
      return rows;
    } catch {
      // fallback to Supabase
    }
  }

  const db = await getAdminDb();
  const { data } = await db
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  return (data ?? []) as ProjectRow[];
}

export async function getAdminProjectById(id: string) {
  if (hasNeonDatabase()) {
    try {
      const { rows } = await neonQuery<ProjectRow>(
        `
          select *
          from public.projects
          where id = $1
            and deleted_at is null
          limit 1
        `,
        [id]
      );

      return rows[0] ?? null;
    } catch {
      // fallback to Supabase
    }
  }

  const db = await getAdminDb();
  const { data } = await db
    .from("projects")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  return (data as ProjectRow | null) ?? null;
}

export async function getAdminSiteContent() {
  const neonContent = await getNeonSiteContentRow();
  if (neonContent) {
    return neonContent;
  }

  const db = await getAdminDb();
  const { data } = await db.from("site_content").select("*").eq("id", 1).maybeSingle();
  return (data as SiteContentRow | null) ?? FALLBACK_CONTENT;
}
