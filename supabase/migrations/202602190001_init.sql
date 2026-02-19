create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ru text not null,
  title_en text not null,
  excerpt_ru text not null,
  excerpt_en text not null,
  description_ru text not null,
  description_en text not null,
  author text not null check (author in ('artem', 'nikita')),
  cover_path text not null,
  tags text[] not null default '{}',
  project_date date null,
  status text not null default 'draft' check (status in ('draft', 'published', 'hidden')),
  published_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create table if not exists public.site_content (
  id integer primary key default 1,
  studio_name text not null,
  hero_title_ru text not null,
  hero_title_en text not null,
  hero_subtitle_ru text not null,
  hero_subtitle_en text not null,
  about_text_ru text not null,
  about_text_en text not null,
  strengths_ru text not null,
  strengths_en text not null,
  work_format_ru text not null,
  work_format_en text not null,
  contact_email text not null,
  team_photo_1_path text null,
  team_photo_2_path text null,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  locale text not null check (locale in ('ru', 'en')),
  created_at timestamptz not null default now(),
  ip_hash text null,
  user_agent text null
);

create index if not exists idx_projects_status_author on public.projects (status, author);
create index if not exists idx_projects_deleted_at on public.projects (deleted_at);
create index if not exists idx_projects_published_at on public.projects (published_at desc nulls last);

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published' and deleted_at is null);

drop policy if exists "Authenticated can read all projects" on public.projects;
create policy "Authenticated can read all projects"
on public.projects
for select
to authenticated
using (true);

drop policy if exists "Authenticated can write projects" on public.projects;
create policy "Authenticated can write projects"
on public.projects
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can write site content" on public.site_content;
create policy "Authenticated can write site content"
on public.site_content
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create contact messages" on public.contact_messages;
create policy "Public can create contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated can read contact messages" on public.contact_messages;
create policy "Authenticated can read contact messages"
on public.contact_messages
for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('project-covers', 'project-covers', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('team-photos', 'team-photos', true)
on conflict (id) do nothing;

drop policy if exists "Public can read project covers" on storage.objects;
create policy "Public can read project covers"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'project-covers');

drop policy if exists "Authenticated can upload project covers" on storage.objects;
create policy "Authenticated can upload project covers"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-covers');

drop policy if exists "Authenticated can update project covers" on storage.objects;
create policy "Authenticated can update project covers"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-covers')
with check (bucket_id = 'project-covers');

drop policy if exists "Public can read team photos" on storage.objects;
create policy "Public can read team photos"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'team-photos');

drop policy if exists "Authenticated can upload team photos" on storage.objects;
create policy "Authenticated can upload team photos"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'team-photos');

drop policy if exists "Authenticated can update team photos" on storage.objects;
create policy "Authenticated can update team photos"
on storage.objects
for update
to authenticated
using (bucket_id = 'team-photos')
with check (bucket_id = 'team-photos');
