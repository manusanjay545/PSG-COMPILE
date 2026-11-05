-- PSGCompile Database Schema
-- Supabase / PostgreSQL
-- Run this in Supabase SQL Editor

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('student', 'moderator', 'problem_setter', 'institution_admin', 'super_admin');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE submission_verdict AS ENUM ('accepted', 'wrong_answer', 'time_limit_exceeded', 'memory_limit_exceeded', 'runtime_error', 'compilation_error', 'internal_error', 'pending');
CREATE TYPE contest_status AS ENUM ('draft', 'scheduled', 'active', 'ended', 'cancelled');
CREATE TYPE contest_type AS ENUM ('psg_wide', 'institution', 'department', 'batch', 'club', 'weekly', 'monthly', 'placement', 'hackathon', 'special');
CREATE TYPE notification_type AS ENUM ('contest_starting', 'contest_results', 'badge_unlocked', 'new_follower', 'discussion_reply', 'ranking_change', 'new_problem', 'system');
CREATE TYPE discussion_category AS ENUM ('hint', 'approach', 'optimization', 'bug', 'general');
CREATE TYPE rating_tier AS ENUM ('newbie', 'beginner', 'intermediate', 'advanced', 'expert', 'master', 'grandmaster');

-- ============================================================
-- INSTITUTIONS HIERARCHY
-- ============================================================

CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  short_name TEXT,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  short_name TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(institution_id, slug)
);

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  degree_type TEXT, -- B.Tech, B.Sc, MBA, MCA, Diploma, etc.
  duration_years INT DEFAULT 4,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(department_id, slug)
);

CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  start_year INT NOT NULL,
  end_year INT NOT NULL,
  label TEXT, -- e.g., "2023-2027"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, start_year, end_year)
);

CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "A", "B", "C"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(batch_id, name)
);

-- ============================================================
-- USERS & PROFILES
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  role user_role DEFAULT 'student',
  is_verified BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  suspension_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  institution_id UUID REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  program_id UUID REFERENCES programs(id),
  batch_id UUID REFERENCES batches(id),
  section_id UUID REFERENCES sections(id),
  roll_number TEXT,
  graduation_year INT,
  -- Stats (denormalized for performance)
  problems_solved INT DEFAULT 0,
  easy_solved INT DEFAULT 0,
  medium_solved INT DEFAULT 0,
  hard_solved INT DEFAULT 0,
  total_submissions INT DEFAULT 0,
  accepted_submissions INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_date DATE,
  -- Rating
  rating INT DEFAULT 1200,
  peak_rating INT DEFAULT 1200,
  rating_tier rating_tier DEFAULT 'newbie',
  contest_count INT DEFAULT 0,
  -- Ranks (updated periodically)
  psg_rank INT,
  institution_rank INT,
  department_rank INT,
  batch_rank INT,
  -- Profile
  github_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  skills TEXT[], -- array of skill tags
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LANGUAGES
-- ============================================================

CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  monaco_id TEXT NOT NULL, -- Monaco editor language id
  judge_id TEXT NOT NULL, -- Code execution engine language id
  version TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  file_extension TEXT,
  template_code TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROBLEMS
-- ============================================================

CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_number SERIAL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  difficulty difficulty_level NOT NULL DEFAULT 'easy',
  description TEXT NOT NULL, -- Markdown
  constraints TEXT,
  input_format TEXT,
  output_format TEXT,
  examples JSONB DEFAULT '[]'::jsonb, -- [{input, output, explanation}]
  hints JSONB DEFAULT '[]'::jsonb,
  editorial TEXT, -- Markdown
  starter_code JSONB DEFAULT '{}'::jsonb, -- {language_slug: code}
  -- Stats
  submission_count INT DEFAULT 0,
  accepted_count INT DEFAULT 0,
  acceptance_rate DECIMAL(5,2) DEFAULT 0,
  -- Meta
  is_published BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT, -- 'topic', 'company', 'concept'
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE problem_tags (
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (problem_id, tag_id)
);

CREATE TABLE test_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_sample BOOLEAN DEFAULT false, -- visible to user
  is_hidden BOOLEAN DEFAULT true,
  explanation TEXT,
  sort_order INT DEFAULT 0,
  time_limit_ms INT DEFAULT 2000,
  memory_limit_mb INT DEFAULT 256,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBMISSIONS
-- ============================================================

CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES languages(id),
  code TEXT NOT NULL,
  verdict submission_verdict DEFAULT 'pending',
  runtime_ms INT,
  memory_kb INT,
  test_cases_passed INT DEFAULT 0,
  test_cases_total INT DEFAULT 0,
  error_message TEXT,
  -- Contest context
  contest_id UUID,
  is_contest_submission BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submission_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  test_case_id UUID REFERENCES test_cases(id),
  test_case_index INT,
  verdict submission_verdict NOT NULL,
  actual_output TEXT,
  runtime_ms INT,
  memory_kb INT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTESTS
-- ============================================================

CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  rules TEXT, -- Markdown
  contest_type contest_type NOT NULL DEFAULT 'psg_wide',
  status contest_status DEFAULT 'draft',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 120,
  -- Visibility / scope
  is_public BOOLEAN DEFAULT true,
  institution_id UUID REFERENCES institutions(id), -- null = PSG-wide
  department_id UUID REFERENCES departments(id),
  program_id UUID REFERENCES programs(id),
  batch_id UUID REFERENCES batches(id),
  -- Settings
  penalty_time_minutes INT DEFAULT 20,
  freeze_time_minutes INT, -- freeze leaderboard N min before end
  max_participants INT,
  registration_required BOOLEAN DEFAULT false,
  show_editorial_after BOOLEAN DEFAULT true,
  -- Creator
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contest_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  points INT DEFAULT 100,
  label TEXT, -- "A", "B", "C"
  UNIQUE(contest_id, problem_id)
);

CREATE TABLE contest_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  -- Results
  rank INT,
  score INT DEFAULT 0,
  problems_solved INT DEFAULT 0,
  penalty_time INT DEFAULT 0,
  rating_before INT,
  rating_after INT,
  rating_change INT,
  UNIQUE(contest_id, user_id)
);

-- ============================================================
-- RATINGS
-- ============================================================

CREATE TABLE rating_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contest_id UUID REFERENCES contests(id),
  rating_before INT NOT NULL,
  rating_after INT NOT NULL,
  rating_change INT NOT NULL,
  rank_in_contest INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BADGES
-- ============================================================

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL, -- emoji or icon name
  category TEXT, -- 'streak', 'problems', 'contests', 'special'
  -- Rule (evaluated programmatically)
  rule_type TEXT NOT NULL, -- 'problems_solved', 'streak', 'contests', 'rating', 'custom'
  rule_value INT, -- threshold
  rule_config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================================
-- DISCUSSIONS
-- ============================================================

CREATE TABLE discussions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown
  category discussion_category DEFAULT 'general',
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE discussion_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES discussion_comments(id), -- nested replies
  content TEXT NOT NULL,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'discussion', 'comment', 'solution'
  target_id UUID NOT NULL,
  value INT NOT NULL CHECK (value IN (-1, 1)), -- -1 = downvote, 1 = upvote
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- ============================================================
-- SOLUTIONS
-- ============================================================

CREATE TABLE solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES languages(id),
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  explanation TEXT, -- Markdown
  time_complexity TEXT,
  space_complexity TEXT,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  is_official BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FOLLOWS
-- ============================================================

CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================================
-- PLAYLISTS
-- ============================================================

CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  problem_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE playlist_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(playlist_id, problem_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}'::jsonb, -- extra context
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY & STREAKS
-- ============================================================

CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL, -- 'submission', 'contest', 'problem_solved'
  activity_count INT DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_date, activity_type)
);

-- ============================================================
-- USER PROBLEM STATUS (tracks solved problems per user)
-- ============================================================

CREATE TABLE user_problem_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  is_solved BOOLEAN DEFAULT false,
  is_attempted BOOLEAN DEFAULT false,
  is_bookmarked BOOLEAN DEFAULT false,
  best_runtime_ms INT,
  best_memory_kb INT,
  solve_count INT DEFAULT 0,
  last_submission_id UUID REFERENCES submissions(id),
  first_solved_at TIMESTAMPTZ,
  last_attempted_at TIMESTAMPTZ,
  -- Saved code per language
  saved_code JSONB DEFAULT '{}'::jsonb, -- {language_slug: code}
  UNIQUE(user_id, problem_id)
);

-- ============================================================
-- ADMIN
-- ============================================================

CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE allowed_domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  domain TEXT NOT NULL UNIQUE, -- e.g. 'psgtech.ac.in'
  institution_id UUID REFERENCES institutions(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CODER OF THE MONTH
-- ============================================================

CREATE TABLE coder_of_month (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INT NOT NULL,
  problems_solved INT DEFAULT 0,
  contests_participated INT DEFAULT 0,
  rating_gain INT DEFAULT 0,
  score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(month, year)
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Profiles
CREATE INDEX idx_profiles_institution ON profiles(institution_id);
CREATE INDEX idx_profiles_department ON profiles(department_id);
CREATE INDEX idx_profiles_program ON profiles(program_id);
CREATE INDEX idx_profiles_batch ON profiles(batch_id);
CREATE INDEX idx_profiles_rating ON profiles(rating DESC);
CREATE INDEX idx_profiles_psg_rank ON profiles(psg_rank);
CREATE INDEX idx_profiles_problems_solved ON profiles(problems_solved DESC);
CREATE INDEX idx_profiles_current_streak ON profiles(current_streak DESC);

-- Problems
CREATE INDEX idx_problems_slug ON problems(slug);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_published ON problems(is_published);
CREATE INDEX idx_problems_number ON problems(problem_number);

-- Submissions
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_submissions_verdict ON submissions(verdict);
CREATE INDEX idx_submissions_user_problem ON submissions(user_id, problem_id);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX idx_submissions_contest ON submissions(contest_id) WHERE contest_id IS NOT NULL;

-- Contests
CREATE INDEX idx_contests_status ON contests(status);
CREATE INDEX idx_contests_start ON contests(start_time);
CREATE INDEX idx_contests_type ON contests(contest_type);

-- Activity
CREATE INDEX idx_user_activity_user_date ON user_activity(user_id, activity_date);
CREATE INDEX idx_user_activity_date ON user_activity(activity_date);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- Follows
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- Discussions
CREATE INDEX idx_discussions_problem ON discussions(problem_id);
CREATE INDEX idx_discussions_author ON discussions(author_id);

-- Rating history
CREATE INDEX idx_rating_history_user ON rating_history(user_id, created_at DESC);

-- User problem status
CREATE INDEX idx_user_problem_status_user ON user_problem_status(user_id);
CREATE INDEX idx_user_problem_status_solved ON user_problem_status(user_id) WHERE is_solved = true;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON institutions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON problems FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON discussion_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON solutions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON playlists FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate rating tier
CREATE OR REPLACE FUNCTION get_rating_tier(r INT)
RETURNS rating_tier AS $$
BEGIN
  IF r >= 2400 THEN RETURN 'grandmaster';
  ELSIF r >= 2100 THEN RETURN 'master';
  ELSIF r >= 1900 THEN RETURN 'expert';
  ELSIF r >= 1600 THEN RETURN 'advanced';
  ELSIF r >= 1400 THEN RETURN 'intermediate';
  ELSIF r >= 1200 THEN RETURN 'beginner';
  ELSE RETURN 'newbie';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update profile stats after submission
CREATE OR REPLACE FUNCTION update_submission_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update problem stats
  UPDATE problems SET
    submission_count = submission_count + 1,
    accepted_count = CASE WHEN NEW.verdict = 'accepted' THEN accepted_count + 1 ELSE accepted_count END,
    acceptance_rate = CASE 
      WHEN submission_count + 1 > 0 
      THEN ROUND(((CASE WHEN NEW.verdict = 'accepted' THEN accepted_count + 1 ELSE accepted_count END)::DECIMAL / (submission_count + 1)) * 100, 2)
      ELSE 0 
    END
  WHERE id = NEW.problem_id;

  -- Update user profile stats
  UPDATE profiles SET
    total_submissions = total_submissions + 1,
    accepted_submissions = CASE WHEN NEW.verdict = 'accepted' THEN accepted_submissions + 1 ELSE accepted_submissions END
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_submission_insert
AFTER INSERT ON submissions
FOR EACH ROW EXECUTE FUNCTION update_submission_stats();

-- Handle new user problem solve
CREATE OR REPLACE FUNCTION handle_problem_solved()
RETURNS TRIGGER AS $$
DECLARE
  p_difficulty difficulty_level;
BEGIN
  IF NEW.is_solved = true AND (OLD IS NULL OR OLD.is_solved = false) THEN
    SELECT difficulty INTO p_difficulty FROM problems WHERE id = NEW.problem_id;
    
    UPDATE profiles SET
      problems_solved = problems_solved + 1,
      easy_solved = CASE WHEN p_difficulty = 'easy' THEN easy_solved + 1 ELSE easy_solved END,
      medium_solved = CASE WHEN p_difficulty = 'medium' THEN medium_solved + 1 ELSE medium_solved END,
      hard_solved = CASE WHEN p_difficulty = 'hard' THEN hard_solved + 1 ELSE hard_solved END
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_problem_solved
AFTER INSERT OR UPDATE ON user_problem_status
FOR EACH ROW EXECUTE FUNCTION handle_problem_solved();

