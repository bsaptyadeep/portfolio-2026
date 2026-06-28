-- =============================================================================
-- Portfolio CMS — complete Supabase database schema
-- =============================================================================
-- Run in Supabase → SQL Editor.
--
-- Tables: profiles, experiences, projects, blogs, tags, blog_tags, settings
-- Supporting: contact_messages (contact form inbox)
--
-- WARNING: The reset block DELETES all CMS data.
--
-- After setup:
--   1. Create a user in Authentication → Users
--   2. Promote to admin:
--        UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -----------------------------------------------------------------------------
-- Reset — drop everything first (safe to re-run)
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

DROP VIEW IF EXISTS blog_posts CASCADE;

DROP TABLE IF EXISTS blog_tags        CASCADE;
DROP TABLE IF EXISTS tags             CASCADE;
DROP TABLE IF EXISTS blogs            CASCADE;
DROP TABLE IF EXISTS blog_posts       CASCADE;
DROP TABLE IF EXISTS projects         CASCADE;
DROP TABLE IF EXISTS experiences      CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS settings         CASCADE;
DROP TABLE IF EXISTS site_settings    CASCADE;
DROP TABLE IF EXISTS profiles         CASCADE;

DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS set_created_by() CASCADE;
DROP FUNCTION IF EXISTS set_updated_by() CASCADE;
DROP FUNCTION IF EXISTS set_audit_fields() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS blog_tag_slugs(UUID) CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;

-- -----------------------------------------------------------------------------
-- profiles — extends auth.users with portfolio identity & CMS role
-- -----------------------------------------------------------------------------

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  headline    TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  resume_url  TEXT,
  location    TEXT,
  website     TEXT,
  github      TEXT,
  linkedin    TEXT,
  twitter     TEXT,
  role        TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'Portfolio owner identity and CMS access role';

-- -----------------------------------------------------------------------------
-- experiences — work history timeline entries
-- -----------------------------------------------------------------------------

CREATE TABLE experiences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name  TEXT NOT NULL,
  company_logo  TEXT,
  role          TEXT NOT NULL,
  location      TEXT,
  start_date    DATE NOT NULL,
  end_date      DATE,
  current       BOOLEAN NOT NULL DEFAULT FALSE,
  description   TEXT,
  achievements  TEXT[] NOT NULL DEFAULT '{}',
  technologies  TEXT[] NOT NULL DEFAULT '{}',
  metrics       JSONB NOT NULL DEFAULT '[]',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  published     BOOLEAN NOT NULL DEFAULT TRUE,
  created_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT experiences_dates_valid CHECK (
    end_date IS NULL OR end_date >= start_date
  ),
  CONSTRAINT experiences_current_no_end CHECK (
    NOT current OR end_date IS NULL
  )
);

COMMENT ON TABLE experiences IS 'Professional experience entries for the portfolio timeline';

-- -----------------------------------------------------------------------------
-- projects — portfolio project showcase
-- -----------------------------------------------------------------------------

CREATE TABLE projects (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT NOT NULL,
  long_description TEXT,
  tech_stack       TEXT[] NOT NULL DEFAULT '{}',
  live_url         TEXT,
  repo_url         TEXT,
  cover_image      TEXT,
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  published        BOOLEAN NOT NULL DEFAULT TRUE,
  created_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE projects IS 'Portfolio projects with optional featured flag and ordering';

-- -----------------------------------------------------------------------------
-- blogs — markdown blog posts
-- -----------------------------------------------------------------------------

CREATE TABLE blogs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  excerpt          TEXT,
  content          TEXT NOT NULL,
  cover_image      TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  og_image         TEXT,
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  published_at     TIMESTAMPTZ,
  reading_time     INTEGER CHECK (reading_time IS NULL OR reading_time > 0),
  created_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE blogs IS 'Blog posts with SEO metadata; tags linked via blog_tags';

-- -----------------------------------------------------------------------------
-- tags — normalized tag vocabulary
-- -----------------------------------------------------------------------------

CREATE TABLE tags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT tags_slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

COMMENT ON TABLE tags IS 'Reusable tags for blog categorization and filtering';

-- -----------------------------------------------------------------------------
-- blog_tags — many-to-many blogs ↔ tags
-- -----------------------------------------------------------------------------

CREATE TABLE blog_tags (
  blog_id    UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  PRIMARY KEY (blog_id, tag_id)
);

COMMENT ON TABLE blog_tags IS 'Junction table linking blogs to tags';

-- -----------------------------------------------------------------------------
-- settings — key/value site configuration
-- -----------------------------------------------------------------------------

CREATE TABLE settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT NOT NULL UNIQUE,
  value       JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT settings_key_format CHECK (key ~ '^[a-z][a-z0-9_]*$')
);

COMMENT ON TABLE settings IS 'Site-wide CMS settings stored as JSON documents';

-- -----------------------------------------------------------------------------
-- contact_messages — contact form inbox (supporting table)
-- -----------------------------------------------------------------------------

CREATE TABLE contact_messages (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE contact_messages IS 'Inbound contact form submissions';

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

-- profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role  ON profiles(role);

-- experiences
CREATE INDEX idx_experiences_published_sort ON experiences(published, sort_order);
CREATE INDEX idx_experiences_created_by     ON experiences(created_by);
CREATE INDEX idx_experiences_dates          ON experiences(start_date DESC, end_date DESC NULLS FIRST);

-- projects
CREATE INDEX idx_projects_slug              ON projects(slug);
CREATE INDEX idx_projects_published_sort    ON projects(published, sort_order);
CREATE INDEX idx_projects_featured          ON projects(featured) WHERE featured = TRUE;
CREATE INDEX idx_projects_created_by        ON projects(created_by);
CREATE INDEX idx_projects_title_trgm        ON projects USING gin (title gin_trgm_ops);

-- blogs
CREATE INDEX idx_blogs_slug                 ON blogs(slug);
CREATE INDEX idx_blogs_published_feed       ON blogs(published, published_at DESC NULLS LAST);
CREATE INDEX idx_blogs_author               ON blogs(author_id);
CREATE INDEX idx_blogs_created_by           ON blogs(created_by);
CREATE INDEX idx_blogs_search               ON blogs
  USING gin (to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(excerpt, '') || ' ' ||
    coalesce(content, '')
  ));
CREATE INDEX idx_blogs_title_trgm           ON blogs USING gin (title gin_trgm_ops);

-- tags
CREATE INDEX idx_tags_slug                  ON tags(slug);
CREATE INDEX idx_tags_name_trgm             ON tags USING gin (name gin_trgm_ops);

-- blog_tags
CREATE INDEX idx_blog_tags_tag_id           ON blog_tags(tag_id);
CREATE INDEX idx_blog_tags_blog_id          ON blog_tags(blog_id);

-- settings
CREATE INDEX idx_settings_key               ON settings(key);

-- contact_messages
CREATE INDEX idx_contact_messages_inbox     ON contact_messages(read, created_at DESC);

-- -----------------------------------------------------------------------------
-- Functions
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION set_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = COALESCE(NEW.created_by, auth.uid());
    NEW.updated_by = COALESCE(NEW.updated_by, auth.uid());
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION set_updated_by()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    NEW.updated_by = COALESCE(auth.uid(), NEW.updated_by);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION set_created_by()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = COALESCE(NEW.created_by, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.blog_tag_slugs(p_blog_id UUID)
RETURNS TEXT[]
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(array_agg(t.slug ORDER BY t.slug), '{}')
  FROM blog_tags bt
  JOIN tags t ON t.id = bt.tag_id
  WHERE bt.blog_id = p_blog_id;
$$;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT ON public.profiles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

-- -----------------------------------------------------------------------------
-- Triggers — audit timestamps
-- -----------------------------------------------------------------------------

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------------------------
-- Triggers — audit actors (created_by / updated_by)
-- -----------------------------------------------------------------------------

CREATE TRIGGER experiences_audit
  BEFORE INSERT OR UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER projects_audit
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER blogs_audit
  BEFORE INSERT OR UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER tags_audit
  BEFORE INSERT OR UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER settings_audit
  BEFORE INSERT OR UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_by();

CREATE TRIGGER blog_tags_audit
  BEFORE INSERT ON blog_tags
  FOR EACH ROW EXECUTE FUNCTION set_created_by();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- -----------------------------------------------------------------------------
-- Compatibility view — exposes blogs with tags[] for legacy clients
-- -----------------------------------------------------------------------------

CREATE VIEW blog_posts
WITH (security_invoker = true)
AS
SELECT
  b.id,
  b.author_id,
  b.title,
  b.slug,
  b.excerpt,
  b.content,
  b.cover_image,
  blog_tag_slugs(b.id) AS tags,
  b.meta_title,
  b.meta_description,
  b.og_image,
  b.published,
  b.published_at,
  b.reading_time,
  b.created_by,
  b.updated_by,
  b.created_at,
  b.updated_at
FROM blogs b;

COMMENT ON VIEW blog_posts IS 'Read-only compatibility view: blogs + aggregated tag slugs';

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags             ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "public_read_profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "users_insert_own_profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_or_admin_profile"
  ON profiles FOR UPDATE
  USING (is_admin() OR auth.uid() = id)
  WITH CHECK (is_admin() OR auth.uid() = id);

-- experiences (public read published)
CREATE POLICY "public_read_published_experiences"
  ON experiences FOR SELECT
  USING (published = true);

CREATE POLICY "admin_manage_experiences"
  ON experiences FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- projects (public read published)
CREATE POLICY "public_read_published_projects"
  ON projects FOR SELECT
  USING (published = true);

CREATE POLICY "admin_manage_projects"
  ON projects FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- blogs (public read published)
CREATE POLICY "public_read_published_blogs"
  ON blogs FOR SELECT
  USING (published = true);

CREATE POLICY "admin_manage_blogs"
  ON blogs FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- tags (public read all tags used for filtering)
CREATE POLICY "public_read_tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_tags"
  ON tags FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- blog_tags (public read when parent blog is published)
CREATE POLICY "public_read_published_blog_tags"
  ON blog_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blogs
      WHERE blogs.id = blog_tags.blog_id
        AND blogs.published = true
    )
  );

CREATE POLICY "admin_manage_blog_tags"
  ON blog_tags FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- settings (public read non-sensitive keys; admin write)
CREATE POLICY "public_read_settings"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "admin_manage_settings"
  ON settings FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- contact_messages
CREATE POLICY "public_submit_contact"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_read_messages"
  ON contact_messages FOR SELECT
  USING (is_admin());

CREATE POLICY "admin_update_messages"
  ON contact_messages FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "admin_delete_messages"
  ON contact_messages FOR DELETE
  USING (is_admin());

-- -----------------------------------------------------------------------------
-- Storage: blog cover images
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-covers', 'blog-covers', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "admin_upload_blog_covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-covers' AND is_admin());

CREATE POLICY "admin_update_blog_covers"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-covers' AND is_admin());

CREATE POLICY "admin_delete_blog_covers"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-covers' AND is_admin());

CREATE POLICY "public_read_blog_covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-covers');

-- -----------------------------------------------------------------------------
-- Storage: profile avatar & resume
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-assets', 'profile-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "admin_upload_profile_assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-assets' AND is_admin());

CREATE POLICY "admin_update_profile_assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-assets' AND is_admin());

CREATE POLICY "admin_delete_profile_assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profile-assets' AND is_admin());

CREATE POLICY "public_read_profile_assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-assets');

-- -----------------------------------------------------------------------------
-- Seed — default settings
-- -----------------------------------------------------------------------------

INSERT INTO settings (key, value, description) VALUES
  ('site', '{"name": "Portfolio", "tagline": "Full Stack Engineer"}', 'Site identity'),
  ('seo', '{"title_suffix": " | Portfolio", "default_description": ""}', 'Default SEO metadata'),
  ('social', '{"github": "", "linkedin": "", "twitter": ""}', 'Social profile URLs'),
  ('features', '{"blog_enabled": true, "contact_enabled": true}', 'Feature flags')
ON CONFLICT (key) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Optional: backfill profiles for existing auth users
-- -----------------------------------------------------------------------------
-- INSERT INTO profiles (id, email, role)
-- SELECT id, email, 'viewer' FROM auth.users
-- ON CONFLICT (id) DO NOTHING;
--
-- UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
