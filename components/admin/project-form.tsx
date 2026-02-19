"use client";

import { FormEvent, useState } from "react";
import { ProjectRow } from "@/types/domain";

interface ProjectFormProps {
  mode: "create" | "edit";
  project?: ProjectRow;
}

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const response = await fetch(mode === "create" ? "/api/admin/projects" : `/api/admin/projects/${project?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      body: formData
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Save failed" }));
      setError(payload.error ?? "Save failed");
      setSaving(false);
      return;
    }

    window.location.href = "/admin/projects";
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <input
        className="field"
        name="titleRu"
        placeholder="Title RU"
        minLength={2}
        maxLength={120}
        defaultValue={project?.title_ru}
        required
      />
      <input
        className="field"
        name="titleEn"
        placeholder="Title EN"
        minLength={2}
        maxLength={120}
        defaultValue={project?.title_en}
        required
      />
      <textarea
        className="field"
        name="excerptRu"
        placeholder="Short description RU"
        minLength={10}
        maxLength={240}
        defaultValue={project?.excerpt_ru}
        required
      />
      <textarea
        className="field"
        name="excerptEn"
        placeholder="Short description EN"
        minLength={10}
        maxLength={240}
        defaultValue={project?.excerpt_en}
        required
      />
      <textarea
        className="field"
        name="descriptionRu"
        placeholder="Full description RU"
        minLength={20}
        defaultValue={project?.description_ru}
        required
      />
      <textarea
        className="field"
        name="descriptionEn"
        placeholder="Full description EN"
        minLength={20}
        defaultValue={project?.description_en}
        required
      />
      <div className="two-col">
        <select className="field" name="author" defaultValue={project?.author ?? "artem"}>
          <option value="artem">by Artem</option>
          <option value="nikita">by Nikita</option>
        </select>
        <select className="field" name="status" defaultValue={project?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>
      <input className="field" name="tags" placeholder="Tags separated by comma" defaultValue={(project?.tags ?? []).join(", ")} />
      <input className="field" name="projectDate" type="date" defaultValue={project?.project_date ?? ""} />
      <input className="field" name="cover" type="file" accept="image/*" required={mode === "create"} />
      <p className="small">
        Required: titles 2-120 chars, excerpts 10-240 chars, full descriptions 20+ chars, date in YYYY-MM-DD format.
      </p>
      <button className="btn primary" disabled={saving} type="submit">
        {saving ? "Saving..." : "Save"}
      </button>
      {error ? <p className="small">{error}</p> : null}
    </form>
  );
}
