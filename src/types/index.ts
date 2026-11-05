// ============================================================
// PSGCompile Type Definitions
// ============================================================

// Enums
export type UserRole = "student" | "moderator" | "problem_setter" | "institution_admin" | "super_admin";
export type Difficulty = "easy" | "medium" | "hard" | "very_hard";
export type SubmissionVerdict = "accepted" | "wrong_answer" | "time_limit_exceeded" | "memory_limit_exceeded" | "runtime_error" | "compilation_error" | "internal_error" | "pending";
export type ContestStatus = "draft" | "scheduled" | "active" | "ended" | "cancelled";
export type ContestType = "psg_wide" | "institution" | "department" | "batch" | "club" | "weekly" | "monthly" | "placement" | "hackathon" | "special";
export type NotificationType = "contest_starting" | "contest_results" | "badge_unlocked" | "new_follower" | "discussion_reply" | "ranking_change" | "new_problem" | "system";
export type DiscussionCategory = "hint" | "approach" | "optimization" | "bug" | "general";
export type RatingTier = "newbie" | "beginner" | "intermediate" | "advanced" | "expert" | "master" | "grandmaster";

// Institution Hierarchy
export interface Institution {
  id: string;
  name: string;
  slug: string;
  short_name: string | null;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  institution_id: string;
  name: string;
  slug: string;
  short_name: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  institution?: Institution;
}

export interface Program {
  id: string;
  department_id: string;
  name: string;
  slug: string;
  degree_type: string | null;
  duration_years: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Batch {
  id: string;
  program_id: string;
  start_year: number;
  end_year: number;
  label: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  program?: Program;
}

export interface Section {
  id: string;
  batch_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// User
export interface User {
  id: string;
  email: string;
  username: string | null;
  role: UserRole;
  is_verified: boolean;
  is_suspended: boolean;
  suspension_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  avatar_source: "google" | "preset" | "upload" | null;
  bio: string | null;
  college_name: string | null;
  department_name: string | null;
  academic_year: string | null;
  class_name: string | null;
  institution_id: string | null;
  department_id: string | null;
  program_id: string | null;
  batch_id: string | null;
  section_id: string | null;
  roll_number: string | null;
  graduation_year: number | null;
  problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  total_submissions: number;
  accepted_submissions: number;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  rating: number;
  peak_rating: number;
  rating_tier: RatingTier;
  contest_count: number;
  psg_rank: number | null;
  institution_rank: number | null;
  department_rank: number | null;
  batch_rank: number | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  skills: string[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  institution?: Institution;
  department?: Department;
  program?: Program;
  batch?: Batch;
  section?: Section;
  user?: User;
}

// Problems
export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  problem_number: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic?: string;
  description: string;
  constraints: string | null;
  input_format: string | null;
  output_format: string | null;
  examples: ProblemExample[];
  hints: string[];
  editorial: string | null;
  starter_code: Record<string, string>;
  diagram?: string | null;
  solution_code?: Record<string, string>;
  submission_count: number;
  accepted_count: number;
  acceptance_rate: number;
  is_published: boolean;
  is_premium: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  user_status?: UserProblemStatus;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  color: string;
  created_at: string;
}

export interface TestCase {
  id: string;
  problem_id: string;
  input: string;
  expected_output: string;
  is_sample: boolean;
  is_hidden: boolean;
  explanation: string | null;
  sort_order: number;
  time_limit_ms: number;
  memory_limit_mb: number;
  created_at: string;
}

export interface UserProblemStatus {
  id: string;
  user_id: string;
  problem_id: string;
  is_solved: boolean;
  is_attempted: boolean;
  is_bookmarked: boolean;
  best_runtime_ms: number | null;
  best_memory_kb: number | null;
  solve_count: number;
  last_submission_id: string | null;
  first_solved_at: string | null;
  last_attempted_at: string | null;
  saved_code: Record<string, string>;
}

// Languages
export interface Language {
  id: string;
  name: string;
  slug: string;
  monaco_id: string;
  judge_id: string;
  version: string | null;
  is_active: boolean;
  sort_order: number;
  file_extension: string | null;
  template_code: string;
  created_at: string;
}

// Submissions
export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  language_id: string;
  code: string;
  verdict: SubmissionVerdict;
  runtime_ms: number | null;
  memory_kb: number | null;
  test_cases_passed: number;
  test_cases_total: number;
  error_message: string | null;
  contest_id: string | null;
  is_contest_submission: boolean;
  submitted_at: string;
  // Joined
  problem?: Problem;
  language?: Language;
  user?: User;
  profile?: Profile;
}

export interface SubmissionResult {
  id: string;
  submission_id: string;
  test_case_id: string | null;
  test_case_index: number | null;
  verdict: SubmissionVerdict;
  actual_output: string | null;
  runtime_ms: number | null;
  memory_kb: number | null;
  error_message: string | null;
  created_at: string;
}

// Contests
export interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  rules: string | null;
  contest_type: ContestType;
  status: ContestStatus;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  is_public: boolean;
  institution_id: string | null;
  department_id: string | null;
  program_id: string | null;
  batch_id: string | null;
  penalty_time_minutes: number;
  freeze_time_minutes: number | null;
  max_participants: number | null;
  registration_required: boolean;
  show_editorial_after: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  problems?: ContestProblem[];
  institution?: Institution;
}

export interface ContestProblem {
  id: string;
  contest_id: string;
  problem_id: string;
  sort_order: number;
  points: number;
  label: string | null;
  problem?: Problem;
}

export interface ContestParticipant {
  id: string;
  contest_id: string;
  user_id: string;
  registered_at: string;
  rank: number | null;
  score: number;
  problems_solved: number;
  penalty_time: number;
  rating_before: number | null;
  rating_after: number | null;
  rating_change: number | null;
  user?: User;
  profile?: Profile;
}

// Rating
export interface RatingHistory {
  id: string;
  user_id: string;
  contest_id: string | null;
  rating_before: number;
  rating_after: number;
  rating_change: number;
  rank_in_contest: number | null;
  created_at: string;
  contest?: Contest;
}

// Badges
export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  category: string | null;
  rule_type: string;
  rule_value: number | null;
  rule_config: Record<string, unknown>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
  badge?: Badge;
}

// Discussions
export interface Discussion {
  id: string;
  problem_id: string;
  author_id: string;
  title: string;
  content: string;
  category: DiscussionCategory;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  is_pinned: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface DiscussionComment {
  id: string;
  discussion_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  upvotes: number;
  downvotes: number;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
  replies?: DiscussionComment[];
}

// Solutions
export interface Solution {
  id: string;
  problem_id: string;
  author_id: string;
  language_id: string;
  title: string;
  code: string;
  explanation: string | null;
  time_complexity: string | null;
  space_complexity: string | null;
  upvotes: number;
  downvotes: number;
  is_official: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  author?: Profile;
  language?: Language;
}

// Follows
export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

// Playlists
export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  problem_count: number;
  created_at: string;
  updated_at: string;
  problems?: Problem[];
}

// Notifications
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// Activity
export interface UserActivity {
  id: string;
  user_id: string;
  activity_date: string;
  activity_type: string;
  activity_count: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  institution_name: string;
  department_name: string;
  rating: number;
  problems_solved: number;
  current_streak: number;
  rating_tier: RatingTier;
}

// Admin
export interface AdminSetting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

// Coder of the Month
export interface CoderOfMonth {
  id: string;
  user_id: string;
  month: number;
  year: number;
  problems_solved: number;
  contests_participated: number;
  rating_gain: number;
  score: number;
  created_at: string;
  profile?: Profile;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}


