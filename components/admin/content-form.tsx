"use client";

import { FormEvent, useState } from "react";
import { SiteContentRow } from "@/types/domain";

interface ContentFormProps {
  content: SiteContentRow;
}

export function ContentForm({ content }: ContentFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setOk(false);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/content", {
      method: "PATCH",
      body: formData
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Save failed" }));
      setError(payload.error ?? "Save failed");
      setSaving(false);
      return;
    }

    setSaving(false);
    setOk(true);
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <input className="field" name="studioName" defaultValue={content.studio_name} placeholder="Studio name" required />

      <div className="two-col">
        <input className="field" name="heroTitleRu" defaultValue={content.hero_title_ru} placeholder="Hero title RU" required />
        <input className="field" name="heroTitleEn" defaultValue={content.hero_title_en} placeholder="Hero title EN" required />
      </div>

      <div className="two-col">
        <input
          className="field"
          name="heroSubtitleRu"
          defaultValue={content.hero_subtitle_ru}
          placeholder="Hero subtitle RU"
          required
        />
        <input
          className="field"
          name="heroSubtitleEn"
          defaultValue={content.hero_subtitle_en}
          placeholder="Hero subtitle EN"
          required
        />
      </div>

      <div className="two-col">
        <textarea className="field" name="aboutTextRu" defaultValue={content.about_text_ru} placeholder="About RU" required />
        <textarea className="field" name="aboutTextEn" defaultValue={content.about_text_en} placeholder="About EN" required />
      </div>

      <div className="two-col">
        <textarea className="field" name="strengthsRu" defaultValue={content.strengths_ru} placeholder="Strengths RU" required />
        <textarea className="field" name="strengthsEn" defaultValue={content.strengths_en} placeholder="Strengths EN" required />
      </div>

      <div className="two-col">
        <textarea
          className="field"
          name="workFormatRu"
          defaultValue={content.work_format_ru}
          placeholder="Work format RU"
          required
        />
        <textarea
          className="field"
          name="workFormatEn"
          defaultValue={content.work_format_en}
          placeholder="Work format EN"
          required
        />
      </div>

      <input className="field" name="contactEmail" type="email" defaultValue={content.contact_email} required />

      <div className="two-col">
        <input className="field" name="teamPhoto1" type="file" accept="image/*" />
        <input className="field" name="teamPhoto2" type="file" accept="image/*" />
      </div>

      <button className="btn primary" disabled={saving} type="submit">
        {saving ? "Saving..." : "Save content"}
      </button>
      {ok ? <p className="small">Saved.</p> : null}
      {error ? <p className="small">{error}</p> : null}
    </form>
  );
}
