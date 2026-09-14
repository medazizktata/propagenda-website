-- CMS content tables for Propagenda admin (services, case studies, video work).
-- Ported from supabase/migrations/20260831211511_cms_content_tables.sql +
-- 20260831213537_add_services_hub_column.sql, adapted for D1/SQLite:
--   - uuid PK -> INTEGER PRIMARY KEY AUTOINCREMENT (per the target architecture doc)
--   - Postgres enum -> TEXT + CHECK
--   - timestamptz -> TEXT (ISO 8601)
--   - jsonb -> TEXT (JSON.stringify/parse at the app boundary; D1 has JSON1 functions
--     available if querying inside JSON is ever needed, but current access patterns
--     only fetch-then-parse)
--   - Row Level Security has no D1 equivalent -- there is no exposed public REST
--     endpoint to gate. Public routes' queries only ever select status='published'
--     (enforced in the query itself), and /admin's queries are only reachable after
--     Cloudflare Access passes (see TASK-11.4). That replaces both Supabase Auth and
--     the RLS "authenticated" policy in one step.

CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  h1 TEXT NOT NULL,
  overview TEXT NOT NULL DEFAULT '',
  scope_items TEXT NOT NULL DEFAULT '[]',
  gallery TEXT NOT NULL DEFAULT '[]',
  seo TEXT NOT NULL DEFAULT '{}',
  tiers TEXT,
  event_checklist TEXT,
  extended_bullets TEXT,
  related_work TEXT,
  tertiary_cta TEXT,
  hub TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (slug, locale)
);

CREATE TABLE case_studies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  h1 TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'featured',
  category TEXT NOT NULL,
  overview TEXT NOT NULL DEFAULT '',
  scope_items TEXT NOT NULL DEFAULT '[]',
  gallery TEXT NOT NULL DEFAULT '[]',
  seo TEXT NOT NULL DEFAULT '{}',
  client TEXT,
  industry TEXT,
  year TEXT,
  hero_image TEXT,
  deliverables TEXT,
  results TEXT,
  challenge TEXT,
  approach TEXT,
  outcome TEXT,
  quote TEXT,
  accent TEXT,
  prev_slug TEXT,
  next_slug TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (slug, locale)
);

CREATE TABLE video_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_showreel INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  src TEXT NOT NULL DEFAULT '',
  poster TEXT NOT NULL,
  orientation TEXT NOT NULL DEFAULT 'landscape' CHECK (orientation IN ('landscape', 'portrait')),
  width INTEGER NOT NULL DEFAULT 1280,
  height INTEGER NOT NULL DEFAULT 720,
  duration TEXT,
  client TEXT,
  description TEXT,
  placeholder INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (slug, locale)
);

-- Target architecture's media table (see the Cloudflare-native handoff doc, section 7)
-- created now so the R2 migration (TASK-11.5) doesn't need a second schema change.
-- storage_key is a relative R2 object key (e.g. "case-study-media/sealand/hero.webp"),
-- never a complete URL, so the media domain/provider can change without touching rows.
CREATE TABLE case_study_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_study_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'pdf')),
  storage_key TEXT NOT NULL,
  alt_text TEXT,
  poster_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (case_study_id) REFERENCES case_studies (id) ON DELETE CASCADE
);

CREATE INDEX services_status_locale_idx ON services (status, locale);
CREATE INDEX case_studies_status_locale_idx ON case_studies (status, locale);
CREATE INDEX video_projects_status_locale_idx ON video_projects (status, locale);
CREATE INDEX services_sort_order_idx ON services (sort_order);
CREATE INDEX case_studies_sort_order_idx ON case_studies (sort_order);
CREATE INDEX video_projects_sort_order_idx ON video_projects (sort_order);
CREATE INDEX case_study_media_case_study_id_idx ON case_study_media (case_study_id);

-- Mirrors the Postgres set_updated_at() trigger 1:1 so callers don't need to
-- remember to stamp updated_at themselves on every write.
CREATE TRIGGER services_set_updated_at
  AFTER UPDATE ON services
  FOR EACH ROW
  BEGIN
    UPDATE services SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = OLD.id;
  END;

CREATE TRIGGER case_studies_set_updated_at
  AFTER UPDATE ON case_studies
  FOR EACH ROW
  BEGIN
    UPDATE case_studies SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = OLD.id;
  END;

CREATE TRIGGER video_projects_set_updated_at
  AFTER UPDATE ON video_projects
  FOR EACH ROW
  BEGIN
    UPDATE video_projects SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = OLD.id;
  END;
