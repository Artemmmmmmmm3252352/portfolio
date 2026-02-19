export type Locale = "ru" | "en";

export type Author = "artem" | "nikita";

export type ProjectStatus = "draft" | "published" | "hidden";

export interface ProjectRow {
  id: string;
  slug: string;
  title_ru: string;
  title_en: string;
  excerpt_ru: string;
  excerpt_en: string;
  description_ru: string;
  description_en: string;
  author: Author;
  cover_path: string;
  tags: string[];
  project_date: string | null;
  status: ProjectStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProjectView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  author: Author;
  coverPath: string;
  tags: string[];
  projectDate: string | null;
  status: ProjectStatus;
  updatedAt: string;
}

export interface SiteContentRow {
  id: number;
  studio_name: string;
  hero_title_ru: string;
  hero_title_en: string;
  hero_subtitle_ru: string;
  hero_subtitle_en: string;
  about_text_ru: string;
  about_text_en: string;
  strengths_ru: string;
  strengths_en: string;
  work_format_ru: string;
  work_format_en: string;
  contact_email: string;
  team_photo_1_path: string | null;
  team_photo_2_path: string | null;
  updated_at: string;
}

export interface SiteContentView {
  studioName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  strengths: string;
  workFormat: string;
  contactEmail: string;
  teamPhoto1Path: string | null;
  teamPhoto2Path: string | null;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
  locale: Locale;
  hp?: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  locale: Locale;
  created_at: string;
  ip_hash: string | null;
  user_agent: string | null;
}
