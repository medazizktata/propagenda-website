alter table public.services
  add column if not exists hub jsonb;

comment on column public.services.hub is
  'Services index presentation: image, tag, descriptor, preview, subBullets.';
