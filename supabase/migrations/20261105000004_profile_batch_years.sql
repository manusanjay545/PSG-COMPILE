ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS batch_start_year integer,
  ADD COLUMN IF NOT EXISTS batch_end_year integer;

UPDATE public.profiles
SET batch_end_year = graduation_year
WHERE batch_end_year IS NULL AND graduation_year IS NOT NULL;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_batch_years_ordered,
  ADD CONSTRAINT profiles_batch_years_ordered
    CHECK (batch_start_year IS NULL OR batch_end_year IS NULL OR batch_end_year >= batch_start_year);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
  IF v_username = '' THEN v_username := 'student'; END IF;
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

  SELECT institution_id INTO v_institution_id FROM public.allowed_domains WHERE domain = v_domain LIMIT 1;
  IF v_institution_id IS NULL THEN
    SELECT id INTO v_institution_id FROM public.institutions WHERE slug = 'psg-college-of-technology' LIMIT 1;
  END IF;

  INSERT INTO public.users (id, email, username, role, is_verified)
  VALUES (NEW.id, NEW.email, v_username, 'student', NEW.email_confirmed_at IS NOT NULL)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW();

  INSERT INTO public.profiles (
    id, full_name, avatar_url, avatar_source, bio, roll_number, college_name,
    department_name, academic_year, batch_start_year, batch_end_year, graduation_year,
    institution_id, rating, peak_rating, rating_tier, onboarding_completed
  ) VALUES (
    NEW.id, v_full_name, v_avatar_url, v_avatar_source,
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'bio'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'roll_number'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'college_name'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'department_name'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data->>'academic_year'), ''),
    CASE WHEN NEW.raw_user_meta_data->>'batch_start_year' ~ '^[0-9]{4}$'
      AND NEW.raw_user_meta_data->>'batch_end_year' ~ '^[0-9]{4}$'
      AND (NEW.raw_user_meta_data->>'batch_end_year')::INTEGER >= (NEW.raw_user_meta_data->>'batch_start_year')::INTEGER
      THEN (NEW.raw_user_meta_data->>'batch_start_year')::INTEGER END,
    CASE WHEN NEW.raw_user_meta_data->>'batch_start_year' ~ '^[0-9]{4}$'
      AND NEW.raw_user_meta_data->>'batch_end_year' ~ '^[0-9]{4}$'
      AND (NEW.raw_user_meta_data->>'batch_end_year')::INTEGER >= (NEW.raw_user_meta_data->>'batch_start_year')::INTEGER
      THEN (NEW.raw_user_meta_data->>'batch_end_year')::INTEGER END,
    CASE WHEN NEW.raw_user_meta_data->>'batch_start_year' ~ '^[0-9]{4}$'
      AND NEW.raw_user_meta_data->>'batch_end_year' ~ '^[0-9]{4}$'
      AND (NEW.raw_user_meta_data->>'batch_end_year')::INTEGER >= (NEW.raw_user_meta_data->>'batch_start_year')::INTEGER
      THEN (NEW.raw_user_meta_data->>'batch_end_year')::INTEGER END,
    v_institution_id, 1200, 1200, 'newbie',
    CASE WHEN NEW.raw_user_meta_data->>'onboarding_completed' = 'true'
      AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'roll_number'), '') IS NOT NULL
      AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'college_name'), '') IS NOT NULL
      AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'department_name'), '') IS NOT NULL
      AND NEW.raw_user_meta_data->>'batch_start_year' ~ '^[0-9]{4}$'
      AND NEW.raw_user_meta_data->>'batch_end_year' ~ '^[0-9]{4}$'
      AND (NEW.raw_user_meta_data->>'batch_end_year')::INTEGER >= (NEW.raw_user_meta_data->>'batch_start_year')::INTEGER
      THEN TRUE ELSE FALSE END
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

ALTER TABLE public.profiles DROP COLUMN IF EXISTS class_name;
