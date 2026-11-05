INSERT INTO public.badges (name, slug, description, icon, category, rule_type, rule_value, sort_order)
VALUES
  ('First Solve', 'first-solve', 'Solve your first coding problem.', '🏆', 'problems', 'problems_solved', 1, 1),
  ('10 Solves', '10-solves', 'Solve 10 different coding problems.', '🧩', 'problems', 'problems_solved', 10, 2),
  ('100 Solves', '100-solves', 'Solve 100 different coding problems.', '💯', 'problems', 'problems_solved', 100, 3),
  ('7-Day Streak', '7-day-streak', 'Code on seven consecutive days.', '🔥', 'streak', 'streak', 7, 4),
  ('30-Day Streak', '30-day-streak', 'Code on 30 consecutive days.', '⚡', 'streak', 'streak', 30, 5),
  ('Contestant', 'contestant', 'Register for your first contest.', '🥇', 'contests', 'contests', 1, 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  rule_type = EXCLUDED.rule_type,
  rule_value = EXCLUDED.rule_value,
  is_active = TRUE,
  sort_order = EXCLUDED.sort_order;

CREATE OR REPLACE FUNCTION public.sync_user_badges(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  solved_total INTEGER;
  streak_total INTEGER;
  contests_total INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO solved_total
  FROM public.user_problem_status WHERE user_id = target_user_id AND is_solved = TRUE;
  SELECT current_streak INTO streak_total FROM public.profiles WHERE id = target_user_id;
  SELECT COUNT(*)::INTEGER INTO contests_total
  FROM public.contest_participants WHERE user_id = target_user_id;

  INSERT INTO public.user_badges (user_id, badge_id)
  SELECT target_user_id, b.id
  FROM public.badges b
  WHERE b.is_active AND (
    (b.rule_type = 'problems_solved' AND solved_total >= COALESCE(b.rule_value, 1)) OR
    (b.rule_type = 'streak' AND COALESCE(streak_total, 0) >= COALESCE(b.rule_value, 1)) OR
    (b.rule_type = 'contests' AND contests_total >= COALESCE(b.rule_value, 1))
  )
  ON CONFLICT (user_id, badge_id) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_user_badges(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_user_badges(UUID) TO service_role;

CREATE OR REPLACE FUNCTION public.record_submission_activity_and_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  activity_anchor DATE;
  streak_length INTEGER := 0;
  active_day DATE;
  expected_day DATE;
BEGIN
  INSERT INTO public.user_activity AS current_activity (user_id, activity_date, activity_type, activity_count, metadata)
  VALUES (NEW.user_id, (NEW.submitted_at AT TIME ZONE 'UTC')::DATE, 'submissions', 1,
    jsonb_build_object('runtime_ms', COALESCE(NEW.runtime_ms, 0)))
  ON CONFLICT (user_id, activity_date, activity_type) DO UPDATE SET
    activity_count = current_activity.activity_count + 1,
    metadata = jsonb_set(
      COALESCE(current_activity.metadata, '{}'::JSONB),
      '{runtime_ms}',
      to_jsonb(COALESCE((current_activity.metadata->>'runtime_ms')::BIGINT, 0) + COALESCE(NEW.runtime_ms, 0)),
      TRUE
    );

  INSERT INTO public.user_problem_status AS existing_status (
    user_id, problem_id, is_solved, is_attempted, best_runtime_ms, best_memory_kb,
    solve_count, last_submission_id, first_solved_at, last_attempted_at
  ) VALUES (
    NEW.user_id, NEW.problem_id, NEW.verdict = 'accepted', TRUE, NEW.runtime_ms,
    NEW.memory_kb, CASE WHEN NEW.verdict = 'accepted' THEN 1 ELSE 0 END,
    NEW.id, CASE WHEN NEW.verdict = 'accepted' THEN NEW.submitted_at END, NEW.submitted_at
  ) ON CONFLICT (user_id, problem_id) DO UPDATE SET
    is_solved = existing_status.is_solved OR EXCLUDED.is_solved,
    is_attempted = TRUE,
    best_runtime_ms = CASE WHEN EXCLUDED.best_runtime_ms IS NULL THEN existing_status.best_runtime_ms
      WHEN existing_status.best_runtime_ms IS NULL THEN EXCLUDED.best_runtime_ms
      ELSE LEAST(existing_status.best_runtime_ms, EXCLUDED.best_runtime_ms) END,
    best_memory_kb = CASE WHEN EXCLUDED.best_memory_kb IS NULL THEN existing_status.best_memory_kb
      WHEN existing_status.best_memory_kb IS NULL THEN EXCLUDED.best_memory_kb
      ELSE LEAST(existing_status.best_memory_kb, EXCLUDED.best_memory_kb) END,
    solve_count = existing_status.solve_count + CASE WHEN EXCLUDED.is_solved AND NOT existing_status.is_solved THEN 1 ELSE 0 END,
    last_submission_id = EXCLUDED.last_submission_id,
    first_solved_at = COALESCE(existing_status.first_solved_at, EXCLUDED.first_solved_at),
    last_attempted_at = EXCLUDED.last_attempted_at;

  activity_anchor := (NEW.submitted_at AT TIME ZONE 'UTC')::DATE;
  expected_day := activity_anchor;
  FOR active_day IN
    SELECT DISTINCT activity_date FROM public.user_activity
    WHERE user_id = NEW.user_id AND activity_count > 0 AND activity_date <= activity_anchor
    ORDER BY activity_date DESC
  LOOP
    IF active_day <> expected_day THEN EXIT; END IF;
    streak_length := streak_length + 1;
    expected_day := expected_day - 1;
  END LOOP;
  UPDATE public.profiles SET current_streak = streak_length,
    longest_streak = GREATEST(COALESCE(longest_streak, 0), streak_length),
    last_active_date = (NEW.submitted_at AT TIME ZONE 'UTC')::DATE
  WHERE id = NEW.user_id;

  PERFORM public.sync_user_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS record_submission_activity_and_badges ON public.submissions;
CREATE TRIGGER record_submission_activity_and_badges
AFTER INSERT ON public.submissions
FOR EACH ROW EXECUTE FUNCTION public.record_submission_activity_and_badges();

CREATE OR REPLACE FUNCTION public.award_contest_badges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  PERFORM public.sync_user_badges(NEW.user_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS award_contest_badges ON public.contest_participants;
CREATE TRIGGER award_contest_badges
AFTER INSERT ON public.contest_participants
FOR EACH ROW EXECUTE FUNCTION public.award_contest_badges();

INSERT INTO public.user_activity (user_id, activity_date, activity_type, activity_count, metadata)
SELECT user_id, (submitted_at AT TIME ZONE 'UTC')::DATE, 'submissions', COUNT(*)::INTEGER,
  jsonb_build_object('runtime_ms', COALESCE(SUM(runtime_ms), 0))
FROM public.submissions
GROUP BY user_id, (submitted_at AT TIME ZONE 'UTC')::DATE
ON CONFLICT (user_id, activity_date, activity_type) DO NOTHING;

INSERT INTO public.user_problem_status (
  user_id, problem_id, is_solved, is_attempted, best_runtime_ms, best_memory_kb,
  solve_count, last_submission_id, first_solved_at, last_attempted_at
)
SELECT user_id, problem_id, BOOL_OR(verdict = 'accepted'), TRUE,
  MIN(runtime_ms), MIN(memory_kb), COUNT(*) FILTER (WHERE verdict = 'accepted')::INTEGER,
  (ARRAY_AGG(id ORDER BY submitted_at DESC))[1],
  MIN(submitted_at) FILTER (WHERE verdict = 'accepted'), MAX(submitted_at)
FROM public.submissions
GROUP BY user_id, problem_id
ON CONFLICT (user_id, problem_id) DO NOTHING;

UPDATE public.profiles p SET
  problems_solved = counts.solved,
  easy_solved = counts.easy,
  medium_solved = counts.medium,
  hard_solved = counts.hard
FROM (
  SELECT ups.user_id, COUNT(*) FILTER (WHERE ups.is_solved)::INTEGER AS solved,
    COUNT(*) FILTER (WHERE ups.is_solved AND pr.difficulty = 'easy')::INTEGER AS easy,
    COUNT(*) FILTER (WHERE ups.is_solved AND pr.difficulty = 'medium')::INTEGER AS medium,
    COUNT(*) FILTER (WHERE ups.is_solved AND pr.difficulty IN ('hard', 'very_hard'))::INTEGER AS hard
  FROM public.user_problem_status ups JOIN public.problems pr ON pr.id = ups.problem_id
  GROUP BY ups.user_id
) counts
WHERE p.id = counts.user_id;

DO $$
DECLARE account RECORD;
BEGIN
  FOR account IN SELECT id FROM public.users LOOP
    PERFORM public.sync_user_badges(account.id);
  END LOOP;
END;
$$;
