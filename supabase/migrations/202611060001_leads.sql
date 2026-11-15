begin;

create table if not exists public.leads (
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
  created_at timestamptz not null default now()
);

-- Also upgrades the leads table described in the previous README.
alter table public.leads add column if not exists notification_status text not null
  default 'pending' check (notification_status in ('pending', 'sent', 'failed', 'not-configured'));
alter table public.leads add column if not exists notification_id text;

alter table public.leads enable row level security;
revoke all on table public.leads from public, anon, authenticated;
grant select, insert, update on table public.leads to service_role;

create index if not exists leads_notification_review_idx
  on public.leads (created_at) where notification_status <> 'sent';

commit;
