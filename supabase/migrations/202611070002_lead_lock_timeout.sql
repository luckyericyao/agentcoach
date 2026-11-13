begin;

alter function public.accept_lead_v1(uuid, jsonb) set lock_timeout to '2s';

commit;
