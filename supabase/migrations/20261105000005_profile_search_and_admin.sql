CREATE OR REPLACE FUNCTION public.search_public_profiles(search_term text)
RETURNS TABLE (
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  college_name text,
  department_name text,
  academic_year text,
  batch_start_year integer,
  batch_end_year integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT
    profile.id,
    account.username,
    profile.full_name,
    profile.avatar_url,
    profile.bio,
    profile.college_name,
    profile.department_name,
    profile.academic_year,
    profile.batch_start_year,
    profile.batch_end_year
  FROM public.profiles AS profile
  LEFT JOIN public.users AS account ON account.id = profile.id
  WHERE search_term IS NOT NULL
    AND length(btrim(search_term)) >= 2
    AND (
      COALESCE(profile.full_name, '') ILIKE '%' || btrim(search_term) || '%'
      OR COALESCE(account.username, '') ILIKE '%' || btrim(search_term) || '%'
      OR COALESCE(profile.bio, '') ILIKE '%' || btrim(search_term) || '%'
      OR COALESCE(profile.college_name, '') ILIKE '%' || btrim(search_term) || '%'
      OR COALESCE(profile.department_name, '') ILIKE '%' || btrim(search_term) || '%'
      OR COALESCE(profile.academic_year, '') ILIKE '%' || btrim(search_term) || '%'
      OR COALESCE(profile.roll_number, '') ILIKE '%' || btrim(search_term) || '%'
      OR COALESCE(profile.batch_start_year::text, '') ILIKE '%' || btrim(search_term) || '%'
      OR COALESCE(profile.batch_end_year::text, '') ILIKE '%' || btrim(search_term) || '%'
    )
  ORDER BY
    CASE
      WHEN COALESCE(profile.full_name, '') ILIKE btrim(search_term) THEN 0
      WHEN COALESCE(account.username, '') ILIKE btrim(search_term) THEN 1
      ELSE 2
    END,
    profile.full_name NULLS LAST
  LIMIT 20;
$function$;

REVOKE ALL ON FUNCTION public.search_public_profiles(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.search_public_profiles(text) TO service_role;

CREATE OR REPLACE FUNCTION public.sync_bootstrap_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF lower(COALESCE(NEW.email, '')) = 'manusanjay545@gmail.com' THEN
    UPDATE public.users
    SET role = 'super_admin'::public.user_role, updated_at = now()
    WHERE id = NEW.id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF lower(COALESCE(OLD.email, '')) = 'manusanjay545@gmail.com' THEN
      UPDATE public.users
      SET role = 'student'::public.user_role, updated_at = now()
      WHERE id = NEW.id AND role = 'super_admin'::public.user_role;
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.sync_bootstrap_admin_role() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS zz_sync_bootstrap_admin_role_insert ON auth.users;
CREATE TRIGGER zz_sync_bootstrap_admin_role_insert
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_bootstrap_admin_role();

DROP TRIGGER IF EXISTS zz_sync_bootstrap_admin_role_email ON auth.users;
CREATE TRIGGER zz_sync_bootstrap_admin_role_email
AFTER UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_bootstrap_admin_role();

UPDATE public.users
SET role = 'super_admin'::public.user_role, updated_at = now()
WHERE lower(email) = 'manusanjay545@gmail.com'
  AND role <> 'super_admin'::public.user_role;
