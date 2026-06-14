# AgentCoach

AgentCoach is an early-stage product website for a public network and future marketplace of expert-built AI Agent Recipes. Agent Recipes are complete expert workflow systems, not simple prompts: they combine instruction, workflow, input templates, output formats, tools, evaluation, risk boundaries, and deployment logic.

The site supports two primary paths:

- Become a Coach: experts package professional workflows into reusable Agent Recipes.
- Become a Client: individuals, teams, and enterprises use Agent Recipes or deploy private AI coaches.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons
- Supabase for lead storage and authentication
- Resend for lead notification emails

## Routes

- `/` - Premium homepage with Agent Recipe positioning, conversion paths, industries, featured recipes, use cases, enterprise narrative, and waitlist.
- `/become-a-coach` - Coach application page for experts and creators.
- `/become-a-client` - Client access page for individuals, teams, and companies.
- `/industries/[slug]` - Data-driven industry detail pages for all six industries.
- `/recipes` - Static Agent Recipe catalog with client-side filters.
- `/login` - Supabase magic-link login foundation.
- `/account` - Early account shell for future client and coach workspaces.
- `/api/leads` - Server-side lead capture route that writes to Supabase and sends Resend notifications.

## Environment Variables

Public variables can be exposed to the browser:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Server-only variables must never use `NEXT_PUBLIC_`:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
NOTIFICATION_TO_EMAIL=founder_or_team_email@example.com
NOTIFICATION_FROM_EMAIL=AgentCoach <notifications@your-verified-domain.com>
```

If Supabase or Resend variables are missing, the app should not crash. Lead forms return a clear configuration error on submission, and login/account screens show a configuration state when public Supabase Auth variables are missing.

## Supabase Setup

Create one `leads` table for all public lead capture. Inserts happen through the secure Next.js route handler at `/api/leads` using the service role key on the server.

```sql
create extension if not exists pgcrypto;

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_type text not null check (lead_type in ('waitlist', 'client', 'coach')),
  name text,
  email text not null,
  company text,
  role text,
  industry text,
  expertise_area text,
  linkedin_or_website text,
  improvement_goal text,
  recipe_interest text,
  team_size text,
  message text,
  source text,
  created_at timestamptz default now()
);

alter table public.leads enable row level security;
```

Recommended RLS posture:

- Do not create a public `select` policy for `leads`.
- Do not allow public users to read all lead records.
- Public form inserts should go through `/api/leads`, which uses `SUPABASE_SERVICE_ROLE_KEY` server-side.
- If you later allow direct anonymous inserts, create an insert-only policy and keep `select`, `update`, and `delete` closed to anonymous users.

Example insert-only policy if you intentionally choose direct anonymous inserts later:

```sql
create policy "Allow anonymous lead inserts only"
on public.leads
for insert
to anon
with check (
  lead_type in ('waitlist', 'client', 'coach')
  and email is not null
);
```

The current app does not require that policy because lead writes happen on the server.

## Supabase Auth Setup

1. In Supabase, enable Email provider authentication.
2. Keep magic-link login enabled.
3. Add local and deployed redirect URLs, for example:
   - `http://localhost:3000/account`
   - `https://your-vercel-domain.com/account`
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` locally and in Vercel.

The current auth implementation is a foundation only. It supports magic-link login, account status display, and sign out. It does not include role management, payments, recipe publishing, or a full dashboard yet.

## Resend Setup

1. Create a Resend account.
2. Verify a sending domain or sender address.
3. Create a Resend API key.
4. Set `RESEND_API_KEY` as a server-only environment variable.
5. Set `NOTIFICATION_FROM_EMAIL` to the verified sender.
6. Set `NOTIFICATION_TO_EMAIL` to the inbox that should receive new AgentCoach lead alerts.

Notification emails include lead type, name, email, company, role, industry, notes, source page, and timestamp. Secrets are never included in notification emails.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run checks:

```bash
npm run lint
npm run build
```

## Project Structure

```text
src/
  app/
    account/
    api/leads/
    become-a-client/
    become-a-coach/
    industries/[slug]/
    login/
    recipes/
    globals.css
    layout.tsx
    page.tsx
  components/
    auth/
    forms/
    landing/
    recipes/
  lib/
    email/
    supabase/
    industries-data.ts
    landing-data.ts
    lead-submission.ts
    personas-data.ts
    recipes-data.ts
    use-cases-data.ts
```

## Development Guardrails

- Do not rebuild the project from scratch.
- Preserve the Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion stack.
- Keep the visual direction premium, dark, cinematic, and enterprise-grade.
- Do not make AgentCoach look like a prompt marketplace, forum, or generic SaaS template.
- Do not expose server secrets to the browser.
- Prefer shared data files and reusable components over duplicated page content.
- Run `npm run lint` and `npm run build` before opening a PR.

## Deployment

This project is ready for Vercel or any platform that supports Next.js.

For Vercel:

1. Import the GitHub repository.
2. Add all public and server-only environment variables.
3. Confirm Supabase Auth redirect URLs include the deployed `/account` URL.
4. Confirm Resend sender verification is complete.
5. Keep the default build command: `npm run build`.
6. Redeploy after setting or changing environment variables.
