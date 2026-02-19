import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { env } from "@/lib/env";
import { hasNeonDatabase, neonQuery } from "@/lib/neon";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { projectSchema } from "@/lib/validation";

export interface ProjectPayload {
  titleRu: string;
  titleEn: string;
  excerptRu: string;
  excerptEn: string;
  descriptionRu: string;
  descriptionEn: string;
  author: "artem" | "nikita";
  tags: string[];
  projectDate: string | null;
  status: "draft" | "published" | "hidden";
}

export function parseTags(input: string) {
  return input
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 10);
}

export function parseProjectPayload(formData: FormData) {
  const payload: ProjectPayload = {
    titleRu: String(formData.get("titleRu") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    excerptRu: String(formData.get("excerptRu") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? ""),
    descriptionRu: String(formData.get("descriptionRu") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    author: String(formData.get("author") ?? "artem") as "artem" | "nikita",
    tags: parseTags(String(formData.get("tags") ?? "")),
    projectDate: String(formData.get("projectDate") ?? "") || null,
    status: String(formData.get("status") ?? "draft") as "draft" | "published" | "hidden"
  };

  const validation = projectSchema.safeParse({
    ...payload,
    projectDate: payload.projectDate ?? ""
  });

  if (!validation.success) {
    const issue = validation.error.issues[0];
    const field = issue?.path?.join(".") ?? "form";
    const message = issue?.message ?? "Invalid value";
    return { ok: false as const, error: `Invalid project form data: ${field} - ${message}` };
  }

  return { ok: true as const, data: payload };
}

export async function ensureUniqueSlug(baseText: string, projectId?: string) {
  const base = slugify(baseText) || "project";
  let candidate = base;
  let index = 1;

  while (true) {
    if (hasNeonDatabase()) {
      const values: unknown[] = [candidate];
      let idSql = "";
      if (projectId) {
        values.push(projectId);
        idSql = " and id <> $2";
      }

      const { rows } = await neonQuery<{ id: string }>(
        `
          select id
          from public.projects
          where slug = $1${idSql}
          limit 1
        `,
        values
      );

      if (!rows[0]) {
        return candidate;
      }
    } else {
      const db = createSupabaseAdminClient();
      const query = db.from("projects").select("id").eq("slug", candidate).maybeSingle();
      const { data } = await query;

      if (!data || data.id === projectId) {
        return candidate;
      }
    }

    index += 1;
    candidate = `${base}-${index}`;
  }
}

export async function uploadProjectCover(file: File) {
  const extension = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const fileName = `${randomUUID()}.${extension}`;
  const storagePath = `covers/${fileName}`;
  const arrayBuffer = await file.arrayBuffer();

  if (!env.hasSupabaseServiceRole) {
    const localDir = pathJoinUploadDir("covers");
    await fs.mkdir(localDir, { recursive: true });
    await fs.writeFile(path.join(localDir, fileName), Buffer.from(arrayBuffer));
    return `uploads/covers/${fileName}`;
  }

  const db = createSupabaseAdminClient();

  const { error } = await db.storage.from("project-covers").upload(storagePath, arrayBuffer, {
    contentType: file.type || "image/jpeg",
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  return storagePath;
}

export async function uploadTeamPhoto(file: File, slot: 1 | 2) {
  const extension = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const storagePath = `team-photo-${slot}-${Date.now()}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();

  if (!env.hasSupabaseServiceRole) {
    const localDir = pathJoinUploadDir("team");
    await fs.mkdir(localDir, { recursive: true });
    await fs.writeFile(path.join(localDir, storagePath), Buffer.from(arrayBuffer));
    return `uploads/team/${storagePath}`;
  }

  const db = createSupabaseAdminClient();

  const { error } = await db.storage.from("team-photos").upload(storagePath, arrayBuffer, {
    contentType: file.type || "image/jpeg",
    upsert: true
  });

  if (error) {
    throw new Error(error.message);
  }

  return storagePath;
}

function pathJoinUploadDir(folder: string) {
  return path.join(process.cwd(), "public", "uploads", folder);
}
