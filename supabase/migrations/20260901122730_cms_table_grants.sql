-- PostgREST roles need explicit table grants; RLS policies alone are not enough.

grant usage on schema public to anon, authenticated, service_role;

grant select on table public.services to anon, authenticated;
grant insert, update, delete on table public.services to authenticated;
grant all on table public.services to service_role;

grant select on table public.case_studies to anon, authenticated;
grant insert, update, delete on table public.case_studies to authenticated;
grant all on table public.case_studies to service_role;

grant select on table public.video_projects to anon, authenticated;
grant insert, update, delete on table public.video_projects to authenticated;
grant all on table public.video_projects to service_role;

grant usage on type public.content_status to anon, authenticated, service_role;
