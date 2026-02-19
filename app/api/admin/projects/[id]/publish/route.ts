import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { hasNeonDatabase, neonQuery } from "@/lib/neon";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
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
          set status = 'published', published_at = now(), updated_at = now()
          where id = $1 and deleted_at is null
        `,
        [id]
      );
      return NextResponse.json({ ok: true });
    }

    const db = createSupabaseAdminClient();
    const { error } = await db
      .from("projects")
      .update({
        status: "published",
        published_at: new Date().toISOString()
      })
      .eq("id", id)
      .is("deleted_at", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected error" }, { status: 500 });
  }
}
