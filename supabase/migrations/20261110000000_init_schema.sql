-- ==============================================================================
-- Chinese Learning Journey — Initial Schema Migration
-- Migration: 20261110000000_init_schema.sql
-- Description: Core schema, tables, constraints, triggers, and RLS policies
-- ==============================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  age_group TEXT NOT NULL DEFAULT 'adult' CHECK (age_group IN ('adult', 'teen', 'kid', 'all')),
  timezone TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'super_admin', 'guardian')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper to check if current user is an admin or super_admin
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

-- Helper to check if current user is super_admin
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

-- Trigger to prevent non-super-admins from changing roles
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

DROP TRIGGER IF EXISTS trg_check_profile_role_update ON public.profiles;
CREATE TRIGGER trg_check_profile_role_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_role_update();

-- Automatic profile creation on auth.users insert
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. PROGRAMS & VERSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  target_age_group TEXT NOT NULL DEFAULT 'all' CHECK (target_age_group IN ('adult', 'teen', 'kid', 'all')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_programs_status ON public.programs(status);

CREATE TABLE IF NOT EXISTS public.program_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  source_url TEXT,
  content_checksum TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_program_version_number UNIQUE (program_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_program_versions_status ON public.program_versions(status);
CREATE INDEX IF NOT EXISTS idx_program_versions_program_id ON public.program_versions(program_id);

-- ------------------------------------------------------------------------------
-- 3. CURRICULUM HIERARCHY: MONTHS, WEEKS, DAYS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.curriculum_months (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_version_id UUID NOT NULL REFERENCES public.program_versions(id) ON DELETE CASCADE,
  month_index INTEGER NOT NULL CHECK (month_index >= 1 AND month_index <= 12),
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_curriculum_month UNIQUE (program_version_id, month_index)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_months_version ON public.curriculum_months(program_version_id);

CREATE TABLE IF NOT EXISTS public.curriculum_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_month_id UUID NOT NULL REFERENCES public.curriculum_months(id) ON DELETE CASCADE,
  week_index INTEGER NOT NULL CHECK (week_index >= 1 AND week_index <= 52),
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_curriculum_week UNIQUE (curriculum_month_id, week_index)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_weeks_month ON public.curriculum_weeks(curriculum_month_id);

CREATE TABLE IF NOT EXISTS public.curriculum_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_week_id UUID NOT NULL REFERENCES public.curriculum_weeks(id) ON DELETE CASCADE,
  program_version_id UUID NOT NULL REFERENCES public.program_versions(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL CHECK (day_index >= 1 AND day_index <= 366),
  day_type TEXT NOT NULL DEFAULT 'learning' CHECK (day_type IN ('learning', 'review', 'quiz', 'rest', 'checkpoint')),
  title TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 15 CHECK (estimated_minutes >= 0),
  unlock_offset_days INTEGER NOT NULL DEFAULT 0 CHECK (unlock_offset_days >= 0),
  is_required BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_curriculum_day_version_index UNIQUE (program_version_id, day_index)
);

CREATE INDEX IF NOT EXISTS idx_curriculum_days_version ON public.curriculum_days(program_version_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_days_week ON public.curriculum_days(curriculum_week_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_days_offset ON public.curriculum_days(unlock_offset_days);

-- ------------------------------------------------------------------------------
-- 4. LESSONS & LESSON BLOCKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_day_id UUID NOT NULL REFERENCES public.curriculum_days(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 1,
  estimated_minutes INTEGER NOT NULL DEFAULT 15 CHECK (estimated_minutes >= 0),
  is_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_day ON public.lessons(curriculum_day_id);

CREATE TABLE IF NOT EXISTS public.lesson_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'rich_text', 'video', 'audio', 'pdf', 'image',
    'vocabulary', 'flashcard_set', 'instructions', 'quiz', 'external_resource'
  )),
  payload_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_required BOOLEAN NOT NULL DEFAULT true,
  estimated_minutes INTEGER NOT NULL DEFAULT 5 CHECK (estimated_minutes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_blocks_lesson ON public.lesson_blocks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_blocks_type ON public.lesson_blocks(type);

-- ------------------------------------------------------------------------------
-- 5. ASSETS & LESSON ASSET ASSOCIATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'google_drive',
  drive_file_id TEXT,
  name TEXT NOT NULL,
  mime_type TEXT,
  web_view_link TEXT,
  resource_key TEXT,
  access_mode TEXT NOT NULL DEFAULT 'embed' CHECK (access_mode IN ('direct', 'embed', 'fallback_link')),
  status TEXT NOT NULL DEFAULT 'pending_check' CHECK (status IN ('valid', 'broken', 'restricted', 'pending_check')),
  last_checked_at TIMESTAMPTZ,
  source_url TEXT,
  metadata_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_drive_file_id ON public.assets(drive_file_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON public.assets(status);

CREATE TABLE IF NOT EXISTS public.lesson_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_block_id UUID NOT NULL REFERENCES public.lesson_blocks(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_lesson_block_asset UNIQUE (lesson_block_id, asset_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_assets_block ON public.lesson_assets(lesson_block_id);
CREATE INDEX IF NOT EXISTS idx_lesson_assets_asset ON public.lesson_assets(asset_id);

-- ------------------------------------------------------------------------------
-- 6. ENROLLMENTS & SCHEDULE ADJUSTMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_version_id UUID NOT NULL REFERENCES public.program_versions(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  paused_at TIMESTAMPTZ,
  pause_total_days INTEGER NOT NULL DEFAULT 0 CHECK (pause_total_days >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_active_program_version
  ON public.enrollments(user_id, program_version_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_version ON public.enrollments(program_version_id);

CREATE TABLE IF NOT EXISTS public.enrollment_schedule_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  days_adjusted INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enrollment_adjustments_enrollment ON public.enrollment_schedule_adjustments(enrollment_id);

-- ------------------------------------------------------------------------------
-- 7. PROGRESS TRACKING: LESSONS & BLOCKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_required_blocks INTEGER NOT NULL DEFAULT 0 CHECK (completed_required_blocks >= 0),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  score NUMERIC CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_enrollment_lesson_progress UNIQUE (enrollment_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment ON public.lesson_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);

CREATE TABLE IF NOT EXISTS public.block_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  lesson_block_id UUID NOT NULL REFERENCES public.lesson_blocks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_enrollment_block_progress UNIQUE (enrollment_id, lesson_block_id)
);

CREATE INDEX IF NOT EXISTS idx_block_progress_enrollment ON public.block_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_block_progress_block ON public.block_progress(lesson_block_id);

-- ------------------------------------------------------------------------------
-- 8. QUIZZES, QUESTIONS, ATTEMPTS & ANSWERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  passing_score INTEGER NOT NULL DEFAULT 80 CHECK (passing_score >= 0 AND passing_score <= 100),
  attempt_limit INTEGER CHECK (attempt_limit IS NULL OR attempt_limit > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quizzes_lesson ON public.quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON public.quizzes(status);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('single_choice', 'multiple_choice', 'true_false', 'fill_blank')),
  prompt_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  correct_answer_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  explanation_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  points INTEGER NOT NULL DEFAULT 10 CHECK (points >= 0),
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON public.quiz_questions(quiz_id);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  attempt_no INTEGER NOT NULL CHECK (attempt_no >= 1),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
  passed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_enrollment_quiz_attempt_no UNIQUE (enrollment_id, quiz_id, attempt_no)
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_enrollment ON public.quiz_attempts(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);

CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  awarded_points NUMERIC NOT NULL DEFAULT 0 CHECK (awarded_points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_attempt_question_answer UNIQUE (attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt ON public.quiz_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_question ON public.quiz_answers(question_id);

-- ------------------------------------------------------------------------------
-- 9. IMPORT JOBS, SOURCE MAPPINGS & AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source_kind TEXT NOT NULL CHECK (source_kind IN ('notion_api', 'notion_export', 'google_drive', 'manual_seed')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  summary_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.import_jobs(status);

CREATE TABLE IF NOT EXISTS public.source_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  source_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_source_target_mapping UNIQUE (source_type, source_id, target_type)
);

CREATE INDEX IF NOT EXISTS idx_source_mappings_target ON public.source_mappings(target_type, target_id);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  summary_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ------------------------------------------------------------------------------
-- 10. HELPER FUNCTIONS & UNLOCK LOGIC
-- ------------------------------------------------------------------------------

-- Strict Timezone Day Unlock Calculation
-- Checks if a curriculum day is unlocked for a user based on their active enrollment start_date,
-- cumulative pause days, and the user's local timezone (default Asia/Ho_Chi_Minh).
CREATE OR REPLACE FUNCTION public.is_day_unlocked(p_user_id UUID, p_day_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.curriculum_days cd
    JOIN public.enrollments e ON e.program_version_id = cd.program_version_id
    WHERE cd.id = p_day_id
      AND e.user_id = p_user_id
      AND e.status = 'active'
      -- Determine user local calendar date:
      AND (timezone(COALESCE(e.timezone, 'Asia/Ho_Chi_Minh'), now()))::date >= 
          (e.start_date + (cd.unlock_offset_days + COALESCE(e.pause_total_days, 0)))
  );
$$;

-- View for students to inspect quiz questions WITHOUT exposing correct answers
CREATE OR REPLACE VIEW public.student_quiz_questions AS
SELECT
  id,
  quiz_id,
  type,
  prompt_jsonb,
  points,
  sort_order,
  created_at
FROM public.quiz_questions;

-- Restrict direct column access to quiz_questions.correct_answer_jsonb
REVOKE SELECT ON public.quiz_questions FROM authenticated, anon;
GRANT SELECT (id, quiz_id, type, prompt_jsonb, points, sort_order, created_at) ON public.quiz_questions TO authenticated, anon;

-- Server RPC for atomic quiz submission & grading
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
  p_enrollment_id UUID,
  p_quiz_id UUID,
  p_answers JSONB -- Array of { question_id: UUID, answer: any }
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_quiz RECORD;
  v_attempt_no INTEGER;
  v_total_points NUMERIC := 0;
  v_earned_points NUMERIC := 0;
  v_score NUMERIC := 0;
  v_passed BOOLEAN := false;
  v_attempt_id UUID;
  v_item RECORD;
  v_question RECORD;
  v_is_correct BOOLEAN;
  v_awarded NUMERIC;
  v_results JSONB := '[]'::jsonb;
BEGIN
  -- 1. Identify and authorize user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- 2. Validate enrollment ownership
  IF NOT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE id = p_enrollment_id AND user_id = v_user_id AND status = 'active'
  ) AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Enrollment not found or unauthorized';
  END IF;

  -- 3. Retrieve quiz metadata
  SELECT * INTO v_quiz FROM public.quizzes WHERE id = p_quiz_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quiz not found';
  END IF;

  -- 4. Check attempt limits
  SELECT COALESCE(MAX(attempt_no), 0) + 1 INTO v_attempt_no
  FROM public.quiz_attempts
  WHERE enrollment_id = p_enrollment_id AND quiz_id = p_quiz_id;

  IF v_quiz.attempt_limit IS NOT NULL AND v_attempt_no > v_quiz.attempt_limit THEN
    RAISE EXCEPTION 'Attempt limit reached for this quiz';
  END IF;

  -- 5. Create attempt record shell
  INSERT INTO public.quiz_attempts (enrollment_id, quiz_id, attempt_no, score, passed)
  VALUES (p_enrollment_id, p_quiz_id, v_attempt_no, 0, false)
  RETURNING id INTO v_attempt_id;

  -- 6. Evaluate each submitted answer
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_answers) AS (question_id UUID, answer JSONB)
  LOOP
    SELECT * INTO v_question
    FROM public.quiz_questions
    WHERE id = v_item.question_id AND quiz_id = p_quiz_id;

    IF FOUND THEN
      v_total_points := v_total_points + v_question.points;

      -- Check answer equality (normalized json comparison)
      IF v_item.answer = v_question.correct_answer_jsonb THEN
        v_is_correct := true;
        v_awarded := v_question.points;
        v_earned_points := v_earned_points + v_question.points;
      ELSE
        v_is_correct := false;
        v_awarded := 0;
      END IF;

      INSERT INTO public.quiz_answers (attempt_id, question_id, answer_jsonb, is_correct, awarded_points)
      VALUES (v_attempt_id, v_question.id, v_item.answer, v_is_correct, v_awarded);

      v_results := v_results || jsonb_build_object(
        'question_id', v_question.id,
        'is_correct', v_is_correct,
        'awarded_points', v_awarded,
        'correct_answer', v_question.correct_answer_jsonb,
        'explanation', v_question.explanation_jsonb
      );
    END IF;
  END LOOP;

  -- 7. Calculate percentage score
  IF v_total_points > 0 THEN
    v_score := ROUND((v_earned_points / v_total_points) * 100, 2);
  ELSE
    v_score := 100;
  END IF;

  v_passed := (v_score >= v_quiz.passing_score);

  -- 8. Finalize attempt
  UPDATE public.quiz_attempts
  SET score = v_score, passed = v_passed, submitted_at = now()
  WHERE id = v_attempt_id;

  -- 9. If quiz belongs to a lesson, update lesson progress score
  IF v_quiz.lesson_id IS NOT NULL THEN
    INSERT INTO public.lesson_progress (enrollment_id, lesson_id, status, score, updated_at)
    VALUES (
      p_enrollment_id,
      v_quiz.lesson_id,
      CASE WHEN v_passed THEN 'completed' ELSE 'in_progress' END,
      v_score,
      now()
    )
    ON CONFLICT (enrollment_id, lesson_id) DO UPDATE
    SET score = GREATEST(public.lesson_progress.score, EXCLUDED.score),
        status = CASE WHEN v_passed THEN 'completed' ELSE public.lesson_progress.status END,
        completed_at = CASE WHEN v_passed AND public.lesson_progress.completed_at IS NULL THEN now() ELSE public.lesson_progress.completed_at END,
        updated_at = now();
  END IF;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'attempt_no', v_attempt_no,
    'score', v_score,
    'passed', v_passed,
    'passing_score', v_quiz.passing_score,
    'answers', v_results
  );
END;
$$;

-- ------------------------------------------------------------------------------
-- 11. ROW-LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all 21 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_schedule_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.block_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 11.1 PROFILES POLICIES
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin());

-- 11.2 PROGRAMS POLICIES
DROP POLICY IF EXISTS "programs_select_published_or_admin" ON public.programs;
CREATE POLICY "programs_select_published_or_admin" ON public.programs
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "programs_admin_write" ON public.programs;
CREATE POLICY "programs_admin_write" ON public.programs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.3 PROGRAM VERSIONS POLICIES
DROP POLICY IF EXISTS "program_versions_select_published_or_admin" ON public.program_versions;
CREATE POLICY "program_versions_select_published_or_admin" ON public.program_versions
  FOR SELECT TO anon, authenticated
  USING (status = 'published' OR public.is_admin());

DROP POLICY IF EXISTS "program_versions_admin_write" ON public.program_versions;
CREATE POLICY "program_versions_admin_write" ON public.program_versions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.4 CURRICULUM MONTHS POLICIES
DROP POLICY IF EXISTS "curriculum_months_select" ON public.curriculum_months;
CREATE POLICY "curriculum_months_select" ON public.curriculum_months
  FOR SELECT TO anon, authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.program_versions pv
      WHERE pv.id = curriculum_months.program_version_id AND pv.status = 'published'
    )
  );

DROP POLICY IF EXISTS "curriculum_months_admin_write" ON public.curriculum_months;
CREATE POLICY "curriculum_months_admin_write" ON public.curriculum_months
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.5 CURRICULUM WEEKS POLICIES
DROP POLICY IF EXISTS "curriculum_weeks_select" ON public.curriculum_weeks;
CREATE POLICY "curriculum_weeks_select" ON public.curriculum_weeks
  FOR SELECT TO anon, authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.curriculum_months cm
      JOIN public.program_versions pv ON pv.id = cm.program_version_id
      WHERE cm.id = curriculum_weeks.curriculum_month_id AND pv.status = 'published'
    )
  );

DROP POLICY IF EXISTS "curriculum_weeks_admin_write" ON public.curriculum_weeks;
CREATE POLICY "curriculum_weeks_admin_write" ON public.curriculum_weeks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.6 CURRICULUM DAYS POLICIES (Visible in roadmap/overview if published)
DROP POLICY IF EXISTS "curriculum_days_select" ON public.curriculum_days;
CREATE POLICY "curriculum_days_select" ON public.curriculum_days
  FOR SELECT TO anon, authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.program_versions pv
      WHERE pv.id = curriculum_days.program_version_id AND pv.status = 'published'
    )
  );

DROP POLICY IF EXISTS "curriculum_days_admin_write" ON public.curriculum_days;
CREATE POLICY "curriculum_days_admin_write" ON public.curriculum_days
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.7 LESSONS POLICIES
DROP POLICY IF EXISTS "lessons_select" ON public.lessons;
CREATE POLICY "lessons_select" ON public.lessons
  FOR SELECT TO anon, authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.curriculum_days cd
      JOIN public.program_versions pv ON pv.id = cd.program_version_id
      WHERE cd.id = lessons.curriculum_day_id AND pv.status = 'published'
    )
  );

DROP POLICY IF EXISTS "lessons_admin_write" ON public.lessons;
CREATE POLICY "lessons_admin_write" ON public.lessons
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.8 LESSON BLOCKS POLICIES (Unlocked days only for students; Admin full access)
DROP POLICY IF EXISTS "lesson_blocks_select_unlocked_or_admin" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_select_unlocked_or_admin" ON public.lesson_blocks
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.curriculum_days cd ON cd.id = l.curriculum_day_id
      WHERE l.id = lesson_blocks.lesson_id
        AND (
          -- Day 1 demo preview (unlock_offset_days = 0) in published version
          (cd.unlock_offset_days = 0 AND EXISTS (SELECT 1 FROM public.program_versions pv WHERE pv.id = cd.program_version_id AND pv.status = 'published'))
          OR
          -- Or day is currently unlocked for user's active enrollment
          public.is_day_unlocked(auth.uid(), cd.id)
        )
    )
  );

DROP POLICY IF EXISTS "lesson_blocks_admin_write" ON public.lesson_blocks;
CREATE POLICY "lesson_blocks_admin_write" ON public.lesson_blocks
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.9 ASSETS & LESSON ASSETS POLICIES
DROP POLICY IF EXISTS "assets_select_unlocked_or_admin" ON public.assets;
CREATE POLICY "assets_select_unlocked_or_admin" ON public.assets
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.lesson_assets la
      JOIN public.lesson_blocks lb ON lb.id = la.lesson_block_id
      JOIN public.lessons l ON l.id = lb.lesson_id
      WHERE la.asset_id = assets.id
        AND (
          public.is_admin() OR
          public.is_day_unlocked(auth.uid(), l.curriculum_day_id)
        )
    )
  );

DROP POLICY IF EXISTS "assets_admin_write" ON public.assets;
CREATE POLICY "assets_admin_write" ON public.assets
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "lesson_assets_select_unlocked_or_admin" ON public.lesson_assets;
CREATE POLICY "lesson_assets_select_unlocked_or_admin" ON public.lesson_assets
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.lesson_blocks lb
      JOIN public.lessons l ON l.id = lb.lesson_id
      WHERE lb.id = lesson_assets.lesson_block_id
        AND (
          public.is_admin() OR
          public.is_day_unlocked(auth.uid(), l.curriculum_day_id)
        )
    )
  );

DROP POLICY IF EXISTS "lesson_assets_admin_write" ON public.lesson_assets;
CREATE POLICY "lesson_assets_admin_write" ON public.lesson_assets
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.10 ENROLLMENTS POLICIES
DROP POLICY IF EXISTS "enrollments_select_own_or_admin" ON public.enrollments;
CREATE POLICY "enrollments_select_own_or_admin" ON public.enrollments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "enrollments_insert_own_or_admin" ON public.enrollments;
CREATE POLICY "enrollments_insert_own_or_admin" ON public.enrollments
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "enrollments_update_own_or_admin" ON public.enrollments;
CREATE POLICY "enrollments_update_own_or_admin" ON public.enrollments
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "enrollments_admin_delete" ON public.enrollments;
CREATE POLICY "enrollments_admin_delete" ON public.enrollments
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 11.11 ENROLLMENT SCHEDULE ADJUSTMENTS
DROP POLICY IF EXISTS "enrollment_adjustments_select_own_or_admin" ON public.enrollment_schedule_adjustments;
CREATE POLICY "enrollment_adjustments_select_own_or_admin" ON public.enrollment_schedule_adjustments
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = enrollment_schedule_adjustments.enrollment_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "enrollment_adjustments_insert_own_or_admin" ON public.enrollment_schedule_adjustments;
CREATE POLICY "enrollment_adjustments_insert_own_or_admin" ON public.enrollment_schedule_adjustments
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = enrollment_schedule_adjustments.enrollment_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "enrollment_adjustments_admin_modify" ON public.enrollment_schedule_adjustments;
CREATE POLICY "enrollment_adjustments_admin_modify" ON public.enrollment_schedule_adjustments
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.12 LESSON PROGRESS & BLOCK PROGRESS
DROP POLICY IF EXISTS "lesson_progress_select_own_or_admin" ON public.lesson_progress;
CREATE POLICY "lesson_progress_select_own_or_admin" ON public.lesson_progress
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = lesson_progress.enrollment_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "lesson_progress_upsert_own_or_admin" ON public.lesson_progress;
CREATE POLICY "lesson_progress_upsert_own_or_admin" ON public.lesson_progress
  FOR ALL TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = lesson_progress.enrollment_id AND e.user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = lesson_progress.enrollment_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "block_progress_select_own_or_admin" ON public.block_progress;
CREATE POLICY "block_progress_select_own_or_admin" ON public.block_progress
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = block_progress.enrollment_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "block_progress_upsert_own_or_admin" ON public.block_progress;
CREATE POLICY "block_progress_upsert_own_or_admin" ON public.block_progress
  FOR ALL TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = block_progress.enrollment_id AND e.user_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = block_progress.enrollment_id AND e.user_id = auth.uid()
    )
  );

-- 11.13 QUIZZES POLICIES
DROP POLICY IF EXISTS "quizzes_select_unlocked_or_admin" ON public.quizzes;
CREATE POLICY "quizzes_select_unlocked_or_admin" ON public.quizzes
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    (
      status = 'published' AND
      EXISTS (
        SELECT 1 FROM public.lessons l
        WHERE l.id = quizzes.lesson_id AND public.is_day_unlocked(auth.uid(), l.curriculum_day_id)
      )
    )
  );

DROP POLICY IF EXISTS "quizzes_admin_write" ON public.quizzes;
CREATE POLICY "quizzes_admin_write" ON public.quizzes
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.14 QUIZ QUESTIONS POLICIES
DROP POLICY IF EXISTS "quiz_questions_select_unlocked_or_admin" ON public.quiz_questions;
CREATE POLICY "quiz_questions_select_unlocked_or_admin" ON public.quiz_questions
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.lessons l ON l.id = q.lesson_id
      WHERE q.id = quiz_questions.quiz_id
        AND q.status = 'published'
        AND public.is_day_unlocked(auth.uid(), l.curriculum_day_id)
    )
  );

DROP POLICY IF EXISTS "quiz_questions_admin_write" ON public.quiz_questions;
CREATE POLICY "quiz_questions_admin_write" ON public.quiz_questions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.15 QUIZ ATTEMPTS POLICIES
DROP POLICY IF EXISTS "quiz_attempts_select_own_or_admin" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_select_own_or_admin" ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = quiz_attempts.enrollment_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "quiz_attempts_insert_own_or_admin" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_insert_own_or_admin" ON public.quiz_attempts
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = quiz_attempts.enrollment_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "quiz_attempts_admin_modify" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_admin_modify" ON public.quiz_attempts
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "quiz_attempts_admin_delete" ON public.quiz_attempts;
CREATE POLICY "quiz_attempts_admin_delete" ON public.quiz_attempts
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 11.16 QUIZ ANSWERS POLICIES
DROP POLICY IF EXISTS "quiz_answers_select_own_or_admin" ON public.quiz_answers;
CREATE POLICY "quiz_answers_select_own_or_admin" ON public.quiz_answers
  FOR SELECT TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.enrollments e ON e.id = qa.enrollment_id
      WHERE qa.id = quiz_answers.attempt_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "quiz_answers_insert_own_or_admin" ON public.quiz_answers;
CREATE POLICY "quiz_answers_insert_own_or_admin" ON public.quiz_answers
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.quiz_attempts qa
      JOIN public.enrollments e ON e.id = qa.enrollment_id
      WHERE qa.id = quiz_answers.attempt_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "quiz_answers_admin_modify" ON public.quiz_answers;
CREATE POLICY "quiz_answers_admin_modify" ON public.quiz_answers
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11.17 IMPORT JOBS, SOURCE MAPPINGS & AUDIT LOGS POLICIES
DROP POLICY IF EXISTS "import_jobs_admin_only" ON public.import_jobs;
CREATE POLICY "import_jobs_admin_only" ON public.import_jobs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "source_mappings_admin_only" ON public.source_mappings;
CREATE POLICY "source_mappings_admin_only" ON public.source_mappings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "audit_logs_admin_modify" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_modify" ON public.audit_logs
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "audit_logs_admin_delete" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_delete" ON public.audit_logs
  FOR DELETE TO authenticated
  USING (public.is_admin());
