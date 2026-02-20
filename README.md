# Portfolio Studio

Modern portfolio website with admin panel built on Next.js + Supabase.

## Stack

- Next.js (App Router, TypeScript)
- Supabase (Postgres, Auth, Storage)
- Resend (contact form email)

## Features

- Public website:
  - `/:locale` (`ru`, `en`) landing page
  - `/:locale/projects` with author filter tabs
  - `/:locale/projects/:slug` project detail page
  - About/contacts section with clickable email
  - Contact form with validation, honeypot and rate limiting
- Admin panel:
  - `/admin/login` email/password auth
  - `/admin` dashboard
  - `/admin/projects` CRUD with publish/hide/soft delete
  - `/admin/content` edit hero/about/contacts + team photos
- API:
  - `POST /api/contact`
  - `GET /api/projects`
  - `POST /api/admin/projects`
  - `PATCH /api/admin/projects/:id`
  - `DELETE /api/admin/projects/:id`
  - `POST /api/admin/projects/:id/publish`
  - `POST /api/admin/projects/:id/hide`
  - `PATCH /api/admin/content`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill all values.
3. (Optional) If you use Neon Postgres for content/projects, set `DATABASE_URL`.
4. Run Supabase migrations:

```bash
supabase db push
```

5. Seed data:

```bash
supabase db seed --file supabase/seed/seed.sql
```

6. Start dev server:

```bash
npm run dev
```

## Cloudflare Deployment

For full-stack Next.js (SSR + API routes + admin), deploy with Cloudflare Workers via OpenNext.
Cloudflare Pages static mode is not enough for this app.

1. Install dependencies:

```bash
npm install
```

2. Build for Cloudflare:

```bash
npm run cf:build
```

3. Deploy:

```bash
npm run cf:deploy
```

4. In Cloudflare project variables/secrets set:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_LOGIN`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `ADMIN_ALLOWED_EMAILS`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

`wrangler.jsonc` is already configured to use `.open-next/worker.js` and `.open-next/assets`.

## Notes

- Admin access is restricted by `ADMIN_ALLOWED_EMAILS`.
- Soft delete uses `projects.deleted_at`.
- Public project list only shows `status = published` and `deleted_at is null`.
- When `DATABASE_URL` is set, public data is read from Neon/Postgres first (with Supabase fallback).
- Storage buckets expected:
  - `project-covers`
  - `team-photos`
