-- =============================================================================
-- Migration: legacy blog_posts / site_settings → blogs / tags / settings
-- =============================================================================
-- Run ONLY on an existing database that still has blog_posts and site_settings.
-- For fresh installs, use schema.sql instead.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Rename site_settings → settings (if not already done)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'site_settings'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'settings'
  ) THEN
    ALTER TABLE site_settings RENAME TO settings;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create tags + blog_tags if missing
CREATE TABLE IF NOT EXISTS tags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_tags (
  blog_id    UUID NOT NULL,
  tag_id     UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  PRIMARY KEY (blog_id, tag_id)
);

-- Migrate blog_posts → blogs
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'blog_posts'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'blogs'
  ) THEN
    ALTER TABLE blog_posts RENAME TO blogs;
    ALTER TABLE blogs DROP COLUMN IF EXISTS tags;
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
    ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

    ALTER TABLE blog_tags
      ADD CONSTRAINT blog_tags_blog_id_fkey
      FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Backfill tags from legacy array column if a temp backup exists
-- (Manual step: export tags[] before dropping column, then run tag upsert)

CREATE OR REPLACE FUNCTION public.blog_tag_slugs(p_blog_id UUID)
RETURNS TEXT[]
LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT COALESCE(array_agg(t.slug ORDER BY t.slug), '{}')
  FROM blog_tags bt JOIN tags t ON t.id = bt.tag_id
  WHERE bt.blog_id = p_blog_id;
$$;

DROP VIEW IF EXISTS blog_posts;
CREATE VIEW blog_posts WITH (security_invoker = true) AS
SELECT
  b.id, b.author_id, b.title, b.slug, b.excerpt, b.content, b.cover_image,
  blog_tag_slugs(b.id) AS tags,
  b.meta_title, b.meta_description, b.og_image,
  b.published, b.published_at, b.reading_time,
  b.created_by, b.updated_by, b.created_at, b.updated_at
FROM blogs b;
