-- Read-only: report schema and privilege checks, not lead contents.
with objects as (
  select to_regclass('public.leads') as leads,
    to_regprocedure('public.accept_lead_v1(uuid,jsonb)') as admission,
    to_regrole('service_role') as service_role
), expected_columns(name, datatype) as (
  select unnest(array[
    'lead_type', 'name', 'email', 'company', 'role', 'industry', 'expertise_area',
    'linkedin_or_website', 'improvement_goal', 'recipe_interest', 'team_size',
    'message', 'source', 'notification_status', 'notification_id'
  ]), 'text'::regtype
  union all values ('id', 'uuid'::regtype), ('created_at', 'timestamptz'::regtype)
), checks as (
  select checks.name, checks.passed
  from objects cross join lateral (values
    ('leads_columns', not exists (
      select 1 from expected_columns e where not exists (
        select 1 from pg_attribute a
        where a.attrelid = objects.leads and a.attname = e.name
          and a.atttypid = e.datatype and not a.attisdropped
      )
    )),
    ('lead_id_primary_key', exists (
      select 1 from pg_constraint c
      join pg_attribute a on a.attrelid = c.conrelid and a.attname = 'id' and not a.attisdropped
      where c.conrelid = objects.leads and c.contype = 'p' and c.conkey = array[a.attnum]
    )),
    ('leads_rls', exists (
      select 1 from pg_class c where c.oid = objects.leads and c.relrowsecurity
    )),
    ('admission_function', exists (
      select 1 from pg_proc p
      where p.oid = objects.admission and not p.prosecdef and p.provolatile = 'v'
        and p.proconfig @> array['search_path=""', 'lock_timeout=2s']
    )),
    ('quota_indexes', (
      select count(*) = 2 from pg_index i
      where i.indrelid = objects.leads and i.indisvalid and i.indisready
        and i.indexrelid in (to_regclass('public.leads_intake_recent_idx'), to_regclass('public.leads_intake_email_recent_idx'))
    )),
    ('service_role_access', exists (
      select 1 from pg_roles r where r.oid = objects.service_role and r.rolbypassrls
    ) and has_schema_privilege(objects.service_role, 'public', 'USAGE')
      and has_function_privilege(objects.service_role, objects.admission, 'EXECUTE')
      and has_table_privilege(objects.service_role, objects.leads, 'SELECT')
      and has_table_privilege(objects.service_role, objects.leads, 'INSERT')
      and has_table_privilege(objects.service_role, objects.leads, 'UPDATE'))
  ) as checks(name, passed)
  union all
  select public_role.name || '_blocked',
    not has_table_privilege(to_regrole(public_role.name), objects.leads, 'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER')
      and not has_any_column_privilege(to_regrole(public_role.name), objects.leads, 'SELECT, INSERT, UPDATE, REFERENCES')
      and not has_function_privilege(to_regrole(public_role.name), objects.admission, 'EXECUTE')
  from objects cross join (values ('anon'), ('authenticated')) as public_role(name)
)
select name as check_name, coalesce(passed, false) as passed
from checks order by name;
