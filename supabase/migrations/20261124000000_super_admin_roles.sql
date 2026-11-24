-- ==============================================================================
-- Chinese Learning Journey — Incremental Migration: Super Admin & Role Management
-- Migration: 20261124000000_super_admin_roles.sql
-- Safe to run on top of 20261110000000_init_schema.sql without dropping data.
-- ==============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

-- Expand role constraint to include super_admin
DO $$
DECLARE
  v_constraint_name TEXT;
BEGIN
  SELECT c.conname INTO v_constraint_name
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE n.nspname = 'public'
    AND t.relname = 'profiles'
    AND c.contype = 'c'
    AND pg_get_constraintdef(c.oid) LIKE '%role%';

  IF v_constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || quote_ident(v_constraint_name);
  END IF;

  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('student', 'admin', 'super_admin', 'guardian'));
END $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.check_profile_role_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF auth.uid() IS NOT NULL AND NOT public.is_super_admin() THEN
      RAISE EXCEPTION 'Only super administrators can update user roles';
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_assigned_role TEXT := 'student';
BEGIN
  IF lower(COALESCE(NEW.email, '')) = 'xuantam91@gmail.com' THEN
    v_assigned_role := 'super_admin';
  END IF;

  INSERT INTO public.profiles (id, email, display_name, age_group, timezone, role)
  VALUES (
    NEW.id,
    lower(NEW.email),
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1),
      'Học viên'
    ),
    COALESCE(NEW.raw_user_meta_data->>'age_group', 'adult'),
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'Asia/Ho_Chi_Minh'),
    v_assigned_role
  )
  ON CONFLICT (id) DO UPDATE
  SET email = COALESCE(public.profiles.email, EXCLUDED.email),
      role = CASE
        WHEN lower(COALESCE(NEW.email, '')) = 'xuantam91@gmail.com' THEN 'super_admin'
        ELSE public.profiles.role
      END;
  RETURN NEW;
END;
$$;

-- Sync existing auth.users into profiles & promote xuantam91@gmail.com to super_admin
INSERT INTO public.profiles (id, email, display_name, age_group, timezone, role)
SELECT
  u.id,
  lower(u.email),
  COALESCE(
    u.raw_user_meta_data->>'display_name',
    u.raw_user_meta_data->>'full_name',
    split_part(u.email, '@', 1),
    'Học viên'
  ),
  COALESCE(u.raw_user_meta_data->>'age_group', 'adult'),
  COALESCE(u.raw_user_meta_data->>'timezone', 'Asia/Ho_Chi_Minh'),
  CASE WHEN lower(u.email) = 'xuantam91@gmail.com' THEN 'super_admin' ELSE 'student' END
FROM auth.users u
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    role = CASE
      WHEN lower(EXCLUDED.email) = 'xuantam91@gmail.com' THEN 'super_admin'
      ELSE public.profiles.role
    END;
