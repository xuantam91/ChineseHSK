# Chinese Learning Journey — Deployment Guide

## 1. Prerequisites
- Node.js >= 20.0.0
- A Supabase Project (created at [supabase.com](https://supabase.com))
- A Vercel Account (connected to GitHub repository)
- Optional: Google Cloud Project for Google Drive API credentials if automated folder sync is desired.

---

## 2. Supabase Setup & Database Migration

### Step 1: Connect to Supabase
In your Supabase project dashboard, navigate to **Project Settings -> API** to retrieve:
- `Project URL`
- `anon public` key
- `service_role secret` key (keep this strictly private)

### Step 2: Apply Database Migrations
You can apply the SQL migrations using either Supabase CLI or the SQL Editor in the Dashboard:

**Method A: Using Supabase CLI**
```bash
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase db push
```

**Method B: Using Supabase Dashboard SQL Editor**
1. Copy the contents of `supabase/migrations/20261110000000_init_schema.sql` and run it in the SQL Editor.
2. (Optional Demo Data): Copy the contents of `supabase/seed.sql` and run it to populate Month 1 `[DEMO]` content.

---

## 3. Environment Variables Configuration

In Vercel or your production hosting environment, configure the following variables:

```bash
# Web application root URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Disable mock mode in production
USE_MOCK_SUPABASE=false

# Optional Integrations
NOTION_API_TOKEN=
NOTION_ROOT_PAGE_ID=129db0ebd82b4b5cb9c13a343a937567
GOOGLE_DRIVE_ROOT_FOLDER_ID=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
GOOGLE_OAUTH_REFRESH_TOKEN=
CRON_SECRET=
```

---

## 4. Vercel Deployment

1. Push your repository to GitHub.
2. Go to Vercel Dashboard -> **Add New Project** -> Import repository.
3. Framework Preset: **Next.js**.
4. In **Environment Variables**, paste all production variables from Section 3 above.
5. Click **Deploy**.

---

## 5. Post-Deployment Verification Checklist

1. [ ] Access landing page `/` and verify hero, curriculum preview, and responsive mobile rendering.
2. [ ] Test student registration at `/register` and login at `/login`.
3. [ ] Complete onboarding at `/onboarding` and verify student dashboard at `/dashboard`.
4. [ ] Verify today's lesson opening and check that future lessons are locked in `/roadmap`.
5. [ ] Perform a lesson in `/lesson/[lessonId]`, complete required blocks, take the quiz, and verify progress saves.
6. [ ] Sign in as admin, access `/admin`, test Google Drive URL parser at `/admin/assets`, and run dry-run import at `/admin/import`.
