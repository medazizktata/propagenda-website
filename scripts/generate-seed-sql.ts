import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildContentSeedRows, resolveSeedAdminCredentials } from '@/lib/cms/seedData';

const ADMIN_USER_ID = 'a0000000-0000-4000-8000-000000000001';

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function sqlJson(value: unknown): string {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function sqlNullableJson(value: unknown | null | undefined): string {
  if (value == null) return 'null';
  return sqlJson(value);
}

function sqlNullableText(value: string | null | undefined): string {
  if (value == null) return 'null';
  return sqlString(value);
}

function sqlTimestamp(value: string): string {
  return `${sqlString(value)}::timestamptz`;
}

function renderServicesInsert(
  rows: ReturnType<typeof buildContentSeedRows>['services'],
): string {
  if (rows.length === 0) return '';

  const values = rows
    .map(
      (row) => `  (
    ${sqlString(row.slug)},
    ${sqlString(row.locale)},
    ${sqlString(row.status)},
    ${row.sort_order},
    ${sqlString(row.title)},
    ${sqlString(row.h1)},
    ${sqlString(row.overview)},
    ${sqlJson(row.scope_items)},
    ${sqlJson(row.gallery)},
    ${sqlJson(row.seo)},
    ${sqlNullableJson(row.tiers)},
    ${sqlNullableJson(row.event_checklist)},
    ${sqlNullableJson(row.extended_bullets)},
    ${sqlNullableJson(row.related_work)},
    ${sqlNullableJson(row.tertiary_cta)},
    ${sqlNullableJson(row.hub)},
    ${sqlTimestamp(row.published_at)}
  )`,
    )
    .join(',\n');

  return `insert into public.services (
  slug, locale, status, sort_order, title, h1, overview,
  scope_items, gallery, seo, tiers, event_checklist, extended_bullets,
  related_work, tertiary_cta, hub, published_at
)
values
${values}
on conflict (slug, locale) do update set
  status = excluded.status,
  sort_order = excluded.sort_order,
  title = excluded.title,
  h1 = excluded.h1,
  overview = excluded.overview,
  scope_items = excluded.scope_items,
  gallery = excluded.gallery,
  seo = excluded.seo,
  tiers = excluded.tiers,
  event_checklist = excluded.event_checklist,
  extended_bullets = excluded.extended_bullets,
  related_work = excluded.related_work,
  tertiary_cta = excluded.tertiary_cta,
  hub = excluded.hub,
  published_at = excluded.published_at,
  updated_at = now();`;
}

function renderCaseStudiesInsert(
  rows: ReturnType<typeof buildContentSeedRows>['caseStudies'],
): string {
  if (rows.length === 0) return '';

  const values = rows
    .map(
      (row) => `  (
    ${sqlString(row.slug)},
    ${sqlString(row.locale)},
    ${sqlString(row.status)},
    ${row.sort_order},
    ${sqlString(row.title)},
    ${sqlString(row.h1)},
    ${sqlString(row.tier)},
    ${sqlString(row.category)},
    ${sqlString(row.overview)},
    ${sqlJson(row.scope_items)},
    ${sqlJson(row.gallery)},
    ${sqlJson(row.seo)},
    ${sqlNullableText(row.client)},
    ${sqlNullableText(row.industry)},
    ${sqlNullableText(row.year)},
    ${sqlNullableText(row.hero_image)},
    ${sqlNullableJson(row.deliverables)},
    ${sqlNullableJson(row.results)},
    ${sqlNullableText(row.challenge)},
    ${sqlNullableText(row.approach)},
    ${sqlNullableText(row.outcome)},
    ${sqlNullableJson(row.quote)},
    ${sqlNullableJson(row.accent)},
    ${sqlNullableText(row.prev_slug)},
    ${sqlNullableText(row.next_slug)},
    ${sqlTimestamp(row.published_at)}
  )`,
    )
    .join(',\n');

  return `insert into public.case_studies (
  slug, locale, status, sort_order, title, h1, tier, category, overview,
  scope_items, gallery, seo, client, industry, year, hero_image,
  deliverables, results, challenge, approach, outcome, quote, accent,
  prev_slug, next_slug, published_at
)
values
${values}
on conflict (slug, locale) do update set
  status = excluded.status,
  sort_order = excluded.sort_order,
  title = excluded.title,
  h1 = excluded.h1,
  tier = excluded.tier,
  category = excluded.category,
  overview = excluded.overview,
  scope_items = excluded.scope_items,
  gallery = excluded.gallery,
  seo = excluded.seo,
  client = excluded.client,
  industry = excluded.industry,
  year = excluded.year,
  hero_image = excluded.hero_image,
  deliverables = excluded.deliverables,
  results = excluded.results,
  challenge = excluded.challenge,
  approach = excluded.approach,
  outcome = excluded.outcome,
  quote = excluded.quote,
  accent = excluded.accent,
  prev_slug = excluded.prev_slug,
  next_slug = excluded.next_slug,
  published_at = excluded.published_at,
  updated_at = now();`;
}

function renderVideoProjectsInsert(
  rows: ReturnType<typeof buildContentSeedRows>['videos'],
): string {
  if (rows.length === 0) return '';

  const values = rows
    .map(
      (row) => `  (
    ${sqlString(row.slug)},
    ${sqlString(row.locale)},
    ${sqlString(row.status)},
    ${row.sort_order},
    ${row.is_showreel},
    ${sqlString(row.title)},
    ${sqlString(row.category)},
    ${sqlString(row.src)},
    ${sqlString(row.poster)},
    ${sqlString(row.orientation)},
    ${row.width},
    ${row.height},
    ${sqlNullableText(row.duration)},
    ${sqlNullableText(row.client)},
    ${sqlNullableText(row.description)},
    ${row.placeholder},
    ${sqlTimestamp(row.published_at)}
  )`,
    )
    .join(',\n');

  return `insert into public.video_projects (
  slug, locale, status, sort_order, is_showreel, title, category, src, poster,
  orientation, width, height, duration, client, description, placeholder, published_at
)
values
${values}
on conflict (slug, locale) do update set
  status = excluded.status,
  sort_order = excluded.sort_order,
  is_showreel = excluded.is_showreel,
  title = excluded.title,
  category = excluded.category,
  src = excluded.src,
  poster = excluded.poster,
  orientation = excluded.orientation,
  width = excluded.width,
  height = excluded.height,
  duration = excluded.duration,
  client = excluded.client,
  description = excluded.description,
  placeholder = excluded.placeholder,
  published_at = excluded.published_at,
  updated_at = now();`;
}

function renderAdminUserSeed(email: string, password: string): string {
  return `-- Local CMS admin: ${email}
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '${ADMIN_USER_ID}',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  ${sqlString(email)},
  crypt(${sqlString(password)}, gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"role":"cms_admin"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  '${ADMIN_USER_ID}',
  '${ADMIN_USER_ID}',
  jsonb_build_object('sub', '${ADMIN_USER_ID}', 'email', ${sqlString(email)}),
  'email',
  ${sqlString(ADMIN_USER_ID)},
  now(),
  now(),
  now()
)
on conflict (provider, provider_id) do update set
  identity_data = excluded.identity_data,
  updated_at = now();`;
}

function main() {
  const { services, caseStudies, videos } = buildContentSeedRows();
  const { email, password } = resolveSeedAdminCredentials();

  const sql = `-- Generated by pnpm seed:sql — do not edit by hand.
-- Regenerate after changing content/*.ts, then run: supabase db reset

create extension if not exists pgcrypto;

${renderAdminUserSeed(email, password)}

${renderServicesInsert(services)}

${renderCaseStudiesInsert(caseStudies)}

${renderVideoProjectsInsert(videos)}
`;

  const outputPath = resolve(process.cwd(), 'supabase/seed.sql');
  writeFileSync(outputPath, sql, 'utf8');

  console.log(`Wrote ${outputPath}`);
  console.log(`CMS admin: ${email}`);
  console.log('Run: supabase db reset');
}

main();
