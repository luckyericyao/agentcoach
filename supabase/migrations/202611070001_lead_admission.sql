begin;

create index if not exists leads_intake_recent_idx on public.leads (created_at desc);
create index if not exists leads_intake_email_recent_idx
  on public.leads (lower(btrim(email)), created_at desc);

create or replace function public.accept_lead_v1(p_id uuid, p_payload jsonb)
returns table (outcome text, lead jsonb, retry_after integer)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  saved public.leads%rowtype;
  intake_email text := lower(btrim(p_payload->>'email'));
  intake_time timestamptz;
  email_available_at timestamptz;
  global_available_at timestamptz;
  available_at timestamptz;
begin
  if p_id is null or jsonb_typeof(p_payload) is distinct from 'object' or nullif(intake_email, '') is null then
    raise exception 'Invalid lead admission arguments' using errcode = '22023';
  end if;

  -- Quota reads must see commits made by the previous lock holder.
  if current_setting('transaction_isolation') <> 'read committed' then
    raise exception 'Lead admission requires read committed isolation' using errcode = '0A000';
  end if;
  perform pg_advisory_xact_lock(hashtext('agentcoach'), hashtext('lead-intake'));

  select * into saved from public.leads where id = p_id;
  if found then
    return query select 'replayed'::text, to_jsonb(saved), null::integer;
    return;
  end if;

  intake_time := clock_timestamp();
  select created_at + interval '1 hour' into email_available_at
    from public.leads
    where lower(btrim(email)) = intake_email
      and created_at > intake_time - interval '1 hour' and created_at <= intake_time
    order by created_at desc limit 1 offset 2;
  select created_at + interval '1 minute' into global_available_at
    from public.leads
    where created_at > intake_time - interval '1 minute' and created_at <= intake_time
    order by created_at desc limit 1 offset 29;

  available_at := greatest(email_available_at, global_available_at);
  if available_at is not null then
    return query select 'rate-limited'::text, null::jsonb,
      greatest(1, ceil(extract(epoch from available_at - intake_time))::integer);
    return;
  end if;

  insert into public.leads (
    id, lead_type, email, name, company, role, industry, expertise_area,
    linkedin_or_website, improvement_goal, recipe_interest, team_size, message, source, created_at
  ) values (
    p_id, p_payload->>'lead_type', intake_email, p_payload->>'name', p_payload->>'company',
    p_payload->>'role', p_payload->>'industry', p_payload->>'expertise_area', p_payload->>'linkedin_or_website',
    p_payload->>'improvement_goal', p_payload->>'recipe_interest', p_payload->>'team_size',
    p_payload->>'message', p_payload->>'source', intake_time
  ) returning * into saved;

  return query select 'inserted'::text, to_jsonb(saved), null::integer;
end;
$$;

revoke all on function public.accept_lead_v1(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.accept_lead_v1(uuid, jsonb) to service_role;

commit;
