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
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard', 'very_hard');
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
  avatar_source TEXT DEFAULT 'preset' CHECK (avatar_source IN ('google', 'preset', 'upload')),
  bio TEXT,
  college_name TEXT,
  department_name TEXT,
  academic_year TEXT,
  class_name TEXT,
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
  topic TEXT NOT NULL DEFAULT 'arrays',
  description TEXT NOT NULL, -- Markdown
  constraints TEXT,
  input_format TEXT,
  output_format TEXT,
  examples JSONB DEFAULT '[]'::jsonb, -- [{input, output, explanation}]
  hints JSONB DEFAULT '[]'::jsonb,
  editorial TEXT, -- Markdown
  starter_code JSONB DEFAULT '{}'::jsonb, -- {language_slug: code}
  solution_code JSONB NOT NULL DEFAULT '{}'::jsonb, -- Official runnable reference solutions
  diagram TEXT, -- Accessible text diagram for the problem statement
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



-- ============================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE rating_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_problem_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowed_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE coder_of_month ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies for Catalog & Educational Metadata
CREATE POLICY "Public read institutions" ON institutions FOR SELECT USING (true);
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Public read programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Public read batches" ON batches FOR SELECT USING (true);
CREATE POLICY "Public read sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Public read languages" ON languages FOR SELECT USING (true);
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read problem_tags" ON problem_tags FOR SELECT USING (true);
CREATE POLICY "Public read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Public read coder_of_month" ON coder_of_month FOR SELECT USING (true);
CREATE POLICY "Public read allowed_domains" ON allowed_domains FOR SELECT USING (true);

-- 2. Problem Visibility
CREATE POLICY "Read published problems" ON problems FOR SELECT USING (is_published = true OR auth.role() = 'service_role');
CREATE POLICY "Read sample test cases only" ON test_cases FOR SELECT USING (is_sample = true OR auth.role() = 'service_role');

-- 3. Profiles & Users
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Public profile pictures and private per-user upload paths.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Public read profile avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Owners upload profile avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);
CREATE POLICY "Owners update profile avatars" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
) WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Owners delete profile avatars" ON storage.objects FOR DELETE USING (
  bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users read own user record" ON users FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');
CREATE POLICY "Users update own user record" ON users FOR UPDATE USING (auth.uid() = id);

-- 4. Submissions & Results
CREATE POLICY "Users read own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY "Users create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own submission results" ON submission_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM submissions WHERE id = submission_results.submission_id AND user_id = auth.uid())
  OR auth.role() = 'service_role'
);

-- 5. Contests
CREATE POLICY "Public read public contests" ON contests FOR SELECT USING (is_public = true OR auth.role() = 'service_role');
CREATE POLICY "Public read contest problems" ON contest_problems FOR SELECT USING (true);
CREATE POLICY "Public read contest participants" ON contest_participants FOR SELECT USING (true);
CREATE POLICY "Users can register for contest" ON contest_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Social & Discussions
CREATE POLICY "Public read discussions" ON discussions FOR SELECT USING (is_hidden = false);
CREATE POLICY "Users create discussions" ON discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users update own discussions" ON discussions FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Public read comments" ON discussion_comments FOR SELECT USING (is_hidden = false);
CREATE POLICY "Users create comments" ON discussion_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users update own comments" ON discussion_comments FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Public read solutions" ON solutions FOR SELECT USING (is_hidden = false);
CREATE POLICY "Users create solutions" ON solutions FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Public read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Users manage own votes" ON votes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Users manage follows" ON follows FOR ALL USING (auth.uid() = follower_id);

-- 7. Notifications & Problem Status
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users manage own problem status" ON user_problem_status FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public read rating history" ON rating_history FOR SELECT USING (true);
CREATE POLICY "Public read user badges" ON user_badges FOR SELECT USING (true);

-- 8. Admin Management Policies (Super Admin & Service Role)
CREATE POLICY "Admin write institutions" ON institutions FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('institution_admin', 'super_admin')));
CREATE POLICY "Admin write departments" ON departments FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('institution_admin', 'super_admin')));
CREATE POLICY "Admin write problems" ON problems FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('problem_setter', 'super_admin')));
CREATE POLICY "Admin write contests" ON contests FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('problem_setter', 'institution_admin', 'super_admin')));
CREATE POLICY "Admin read audit_logs" ON audit_logs FOR SELECT USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Admin settings management" ON admin_settings FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'));

-- ============================================================
-- AUTOMATED USER CREATION ON GOOGLE OAUTH SIGNUP
-- ============================================================

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
  -- Extract domain from user email
  v_domain := SPLIT_PART(NEW.email, '@', 2);

  -- Derive username from email prefix or generate unique fallback
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

  -- Find matching PSG institution by allowed domain
  SELECT institution_id INTO v_institution_id FROM public.allowed_domains WHERE domain = v_domain LIMIT 1;
  IF v_institution_id IS NULL THEN
    -- Fallback to PSG Tech default if matching
    SELECT id INTO v_institution_id FROM public.institutions WHERE slug = 'psg-college-of-technology' LIMIT 1;
  END IF;

  -- Insert into public.users
  INSERT INTO public.users (id, email, username, role, is_verified)
  VALUES (NEW.id, NEW.email, v_username, 'student', NEW.email_confirmed_at IS NOT NULL)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  -- Insert into public.profiles
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    avatar_source,
    bio,
    roll_number,
    college_name,
    department_name,
    academic_year,
    class_name,
    institution_id,
    rating,
    peak_rating,
    rating_tier,
    onboarding_completed
  )
  VALUES (
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
    CASE
      WHEN NEW.raw_user_meta_data->>'onboarding_completed' = 'true'
        AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'roll_number'), '') IS NOT NULL
        AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'college_name'), '') IS NOT NULL
        AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'department_name'), '') IS NOT NULL
        AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'academic_year'), '') IS NOT NULL
        AND NULLIF(BTRIM(NEW.raw_user_meta_data->>'class_name'), '') IS NOT NULL
      THEN true ELSE false
    END
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.sync_user_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET is_verified = NEW.email_confirmed_at IS NOT NULL,
      updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
EXECUTE FUNCTION public.sync_user_email_verification();

-- These trigger functions must not be callable through PostgREST RPC endpoints.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_user_email_verification() FROM PUBLIC, anon, authenticated;

-- Course progression and issued certificates. Writes are performed by authenticated API routes using the service role.
CREATE TABLE IF NOT EXISTS public.course_chapter_progress (
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  chapter_index INTEGER NOT NULL CHECK (chapter_index >= 0),
  mcq_score SMALLINT NOT NULL CHECK (mcq_score = 5),
  coding_passed BOOLEAN NOT NULL DEFAULT TRUE CHECK (coding_passed),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_slug, chapter_index)
);

CREATE TABLE IF NOT EXISTS public.course_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  course_slug TEXT NOT NULL,
  course_title TEXT NOT NULL,
  certificate_code UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  learner_name TEXT,
  roll_number TEXT,
  college_name TEXT,
  department_name TEXT,
  academic_year TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_slug)
);

CREATE INDEX IF NOT EXISTS course_chapter_progress_user_course_idx ON public.course_chapter_progress (user_id, course_slug, chapter_index);
CREATE INDEX IF NOT EXISTS course_certificates_user_issued_idx ON public.course_certificates (user_id, issued_at DESC);

ALTER TABLE public.course_chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own course progress" ON public.course_chapter_progress;
CREATE POLICY "Users can view their own course progress"
  ON public.course_chapter_progress FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own course certificates" ON public.course_certificates;
CREATE POLICY "Users can view their own course certificates"
  ON public.course_certificates FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

REVOKE ALL ON public.course_chapter_progress FROM anon, authenticated;
GRANT SELECT ON public.course_chapter_progress TO authenticated;
GRANT ALL ON public.course_chapter_progress TO service_role;
REVOKE ALL ON public.course_certificates FROM anon, authenticated;
GRANT SELECT ON public.course_certificates TO authenticated;
GRANT ALL ON public.course_certificates TO service_role;

