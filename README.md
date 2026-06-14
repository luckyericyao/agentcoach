# AgentCoach

AgentCoach is an early-stage product website for a public network and future marketplace of expert-built AI Agent Recipes. Agent Recipes are complete expert workflow systems, not simple prompts: they combine instruction, workflow, input templates, output formats, tools, evaluation, risk boundaries, and deployment logic.

The site supports two primary paths:

- Become a Coach: experts package professional workflows into reusable Agent Recipes.
- Become a Client: individuals, teams, and enterprises use Agent Recipes or deploy private AI agents.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons
- Supabase REST API for optional lead-form submissions

## Routes

- `/` - Premium homepage with Agent Recipe positioning, conversion paths, industries, featured recipes, use cases, enterprise narrative, and waitlist.
- `/become-a-coach` - Coach application page for experts and creators.
- `/become-a-client` - Client access page for individuals, teams, and companies.
- `/industries/[slug]` - Data-driven industry detail pages for all six industries.
- `/recipes` - Static Agent Recipe catalog with client-side filters.

## Environment Variables

Lead forms gracefully show a configuration message when Supabase is not configured. To enable submissions, set:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not expose a Supabase service role key in the frontend.

## Supabase Tables

### `waitlist`

```sql
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamp with time zone default now()
);
```

### `coach_leads`

```sql
create table coach_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  linkedin_or_website text,
  expertise_area text not null,
  recipe_interest text not null,
  notes text,
  created_at timestamp with time zone default now()
);
```

### `client_leads`

```sql
create table client_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  role text,
  industry text not null,
  improvement_goal text not null,
  team_size text,
  notes text,
  created_at timestamp with time zone default now()
);
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Project Structure

```text
src/
  app/
    become-a-client/
    become-a-coach/
    industries/[slug]/
    recipes/
    globals.css
    layout.tsx
    page.tsx
  components/
    forms/
    landing/
    recipes/
  lib/
    industries-data.ts
    landing-data.ts
    personas-data.ts
    recipes-data.ts
    supabase.ts
    use-cases-data.ts
```

## Development Guardrails

- Do not rebuild the project from scratch.
- Preserve the Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion stack.
- Keep the visual direction premium, dark, cinematic, and enterprise-grade.
- Do not make AgentCoach look like a prompt marketplace, forum, or generic SaaS template.
- Prefer shared data files and reusable components over duplicated page content.
- Run `npm run lint` and `npm run build` before opening a PR.

## Deployment

This project is ready for Vercel or any platform that supports Next.js.

For Vercel:

1. Import the GitHub repository.
2. Set the optional Supabase environment variables if lead forms should submit.
3. Keep the default build command: `npm run build`.
4. Keep the default output settings for Next.js.
5. Deploy.
