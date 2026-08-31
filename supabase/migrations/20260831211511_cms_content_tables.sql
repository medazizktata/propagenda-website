-- CMS content tables for Propagenda admin (services, case studies, video work).

create type public.content_status as enum ('draft', 'published');

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'en',
  status public.content_status not null default 'draft',
  sort_order int not null default 0,
  title text not null,
  h1 text not null,
  overview text not null default '',
  scope_items jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  tiers jsonb,
  event_checklist jsonb,
  extended_bullets jsonb,
  related_work jsonb,
  tertiary_cta jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'en',
  status public.content_status not null default 'draft',
  sort_order int not null default 0,
  title text not null,
  h1 text not null,
  tier text not null default 'featured',
  category text not null,
  overview text not null default '',
  scope_items jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  client text,
  industry text,
  year text,
  hero_image text,
  deliverables jsonb,
  results jsonb,
  challenge text,
  approach text,
  outcome text,
  quote jsonb,
  accent jsonb,
  prev_slug text,
  next_slug text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

create table public.video_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'en',
  status public.content_status not null default 'draft',
  sort_order int not null default 0,
  is_showreel boolean not null default false,
  title text not null,
  category text not null,
  src text not null default '',
  poster text not null,
  orientation text not null default 'landscape' check (orientation in ('landscape', 'portrait')),
  width int not null default 1280,
  height int not null default 720,
  duration text,
  client text,
  description text,
  placeholder boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

create index services_status_locale_idx on public.services (status, locale);
create index case_studies_status_locale_idx on public.case_studies (status, locale);
create index video_projects_status_locale_idx on public.video_projects (status, locale);
create index services_sort_order_idx on public.services (sort_order);
create index case_studies_sort_order_idx on public.case_studies (sort_order);
create index video_projects_sort_order_idx on public.video_projects (sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create trigger case_studies_set_updated_at
  before update on public.case_studies
  for each row execute function public.set_updated_at();

create trigger video_projects_set_updated_at
  before update on public.video_projects
  for each row execute function public.set_updated_at();

alter table public.services enable row level security;
alter table public.case_studies enable row level security;
alter table public.video_projects enable row level security;

-- Public read: published content only.
create policy "services_public_read"
  on public.services for select
  to anon, authenticated
  using (status = 'published');

create policy "case_studies_public_read"
  on public.case_studies for select
  to anon, authenticated
  using (status = 'published');

create policy "video_projects_public_read"
  on public.video_projects for select
  to anon, authenticated
  using (status = 'published');

-- Authenticated admins: full CRUD (tighten with admin_users table later).
create policy "services_admin_all"
  on public.services for all
  to authenticated
  using (true)
  with check (true);

create policy "case_studies_admin_all"
  on public.case_studies for all
  to authenticated
  using (true)
  with check (true);

create policy "video_projects_admin_all"
  on public.video_projects for all
  to authenticated
  using (true)
  with check (true);
