-- Apply this migration to an existing Supabase project before deploying the auth UI.
-- It is safe to run more than once.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_source TEXT DEFAULT 'preset';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS college_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS academic_year TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS class_name TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_avatar_source_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_avatar_source_check
      CHECK (avatar_source IS NULL OR avatar_source IN ('google', 'preset', 'upload'));
  END IF;
END;
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read profile avatars" ON storage.objects;
CREATE POLICY "Public read profile avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
DROP POLICY IF EXISTS "Owners upload profile avatars" ON storage.objects;
CREATE POLICY "Owners upload profile avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);
DROP POLICY IF EXISTS "Owners update profile avatars" ON storage.objects;
CREATE POLICY "Owners update profile avatars" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
) WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Owners delete profile avatars" ON storage.objects;
CREATE POLICY "Owners delete profile avatars" ON storage.objects FOR DELETE USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_username TEXT;
  v_full_name TEXT;
  v_avatar_url TEXT;
  v_avatar_source TEXT;
  v_institution_id UUID;
  v_domain TEXT;
BEGIN
  v_domain := SPLIT_PART(NEW.email, '@', 2);
  v_username := LOWER(REGEXP_REPLACE(SPLIT_PART(COALESCE(NEW.email, ''), '@', 1), '[^a-z0-9_]+', '', 'g'));
  IF v_username = '' THEN
    v_username := 'student';
  END IF;
  IF EXISTS (SELECT 1 FROM public.users WHERE username = v_username AND id <> NEW.id) THEN
    v_username := v_username || '_' || SUBSTR(REPLACE(NEW.id::TEXT, '-', ''), 1, 8);
  END IF;

  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', v_username);
  v_avatar_url := COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '/avatars/avatar-01.svg');
  v_avatar_source := CASE
    WHEN NEW.raw_user_meta_data->>'avatar_source' IN ('google', 'preset', 'upload') THEN NEW.raw_user_meta_data->>'avatar_source'
    WHEN v_avatar_url LIKE 'http%' OR NEW.raw_app_meta_data->>'provider' = 'google' THEN 'google'
    ELSE 'preset'
  END;

  SELECT institution_id INTO v_institution_id
  FROM public.allowed_domains WHERE domain = v_domain LIMIT 1;
  IF v_institution_id IS NULL THEN
    SELECT id INTO v_institution_id
    FROM public.institutions WHERE slug = 'psg-college-of-technology' LIMIT 1;
  END IF;

  INSERT INTO public.users (id, email, username, role, is_verified)
  VALUES (NEW.id, NEW.email, v_username, 'student', NEW.email_confirmed_at IS NOT NULL)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW();

  INSERT INTO public.profiles (
    id, full_name, avatar_url, avatar_source, bio, roll_number,
    college_name, department_name, academic_year, class_name,
    institution_id, rating, peak_rating, rating_tier, onboarding_completed
  ) VALUES (
    NEW.id,
    v_full_name,
    v_avatar_url,
    v_avatar_source,
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'bio'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'roll_number'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'college_name'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'department_name'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'academic_year'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'class_name'), ''),
    v_institution_id,
    1200,
    1200,
    'newbie',
    NEW.raw_user_meta_data->>'onboarding_completed' = 'true'
      AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'roll_number'), '') IS NOT NULL
      AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'college_name'), '') IS NOT NULL
      AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'department_name'), '') IS NOT NULL
      AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'academic_year'), '') IS NOT NULL
      AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'class_name'), '') IS NOT NULL
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_user_email_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.users
  SET is_verified = NEW.email_confirmed_at IS NOT NULL,
      updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
EXECUTE FUNCTION public.sync_user_email_verification();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_user_email_verification() FROM PUBLIC, anon, authenticated;

