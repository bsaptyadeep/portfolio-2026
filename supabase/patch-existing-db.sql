-- =============================================================================
-- SAFE patch for an EXISTING live Supabase project
-- =============================================================================
-- Use this when your app is already running with blog_posts, profiles, etc.
--
-- ✓ Additive only — no DROP TABLE, no renames
-- ✓ Safe to run multiple times (IF NOT EXISTS / ON CONFLICT)
--
-- Do NOT run schema.sql on a live DB (it wipes all data).
-- Do NOT run migrate-to-normalized-blogs.sql (breaks blog writes).
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- blog_posts — add SEO columns if your DB was created before they existed
-- -----------------------------------------------------------------------------

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title       TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_image         TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time     INTEGER;

-- Full-text search index (optional, improves search at scale)
CREATE INDEX IF NOT EXISTS idx_blog_posts_search ON blog_posts
  USING gin (to_tsvector('english',
    coalesce(title, '') || ' ' ||
    coalesce(excerpt, '') || ' ' ||
    coalesce(content, '')
  ));

-- -----------------------------------------------------------------------------
-- Storage — blog cover images
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-covers', 'blog-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Policies (skip if you already have them — drop old names first if re-running)
DROP POLICY IF EXISTS "admin_upload_blog_covers" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_blog_covers" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_blog_covers" ON storage.objects;
DROP POLICY IF EXISTS "public_read_blog_covers"  ON storage.objects;

CREATE POLICY "admin_upload_blog_covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-covers' AND public.is_admin());

CREATE POLICY "admin_update_blog_covers"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-covers' AND public.is_admin());

CREATE POLICY "admin_delete_blog_covers"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'blog-covers' AND public.is_admin());

CREATE POLICY "public_read_blog_covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-covers');

-- -----------------------------------------------------------------------------
-- profiles — resume URL for downloadable CV
-- -----------------------------------------------------------------------------

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- -----------------------------------------------------------------------------
-- Storage — profile avatar & resume
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-assets', 'profile-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "admin_upload_profile_assets" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_profile_assets" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_profile_assets" ON storage.objects;
DROP POLICY IF EXISTS "public_read_profile_assets"  ON storage.objects;

CREATE POLICY "admin_upload_profile_assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-assets' AND public.is_admin());

CREATE POLICY "admin_update_profile_assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-assets' AND public.is_admin());

CREATE POLICY "admin_delete_profile_assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profile-assets' AND public.is_admin());

CREATE POLICY "public_read_profile_assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-assets');

-- -----------------------------------------------------------------------------
-- Auth signup fix (only if new users fail with "Database error creating user")
-- -----------------------------------------------------------------------------

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

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT INSERT ON public.profiles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
CREATE POLICY "users_insert_own_profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- Verify admin access
-- -----------------------------------------------------------------------------
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
