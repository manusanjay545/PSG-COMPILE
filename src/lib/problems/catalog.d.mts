export type GeneratedTestCase = {
  id: string;
  input: string;
  expected_output: string;
  is_sample: boolean;
  is_hidden: boolean;
  explanation: string | null;
  sort_order: number;
  time_limit_ms: number;
  memory_limit_mb: number;
};

export type GeneratedProblem = {
  id: string;
  problem_number: number;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard" | "very_hard";
  topic: string;
  description: string;
  constraints: string;
  input_format: string;
  output_format: string;
  examples: Array<{ input: string; output: string; explanation: string }>;
  hints: string[];
  editorial: string;
  starter_code: Record<string, string>;
  solution_code: Record<string, string>;
  diagram: string;
  tags: Array<{ id: string; name: string; slug: string }>;
  submission_count: number;
  accepted_count: number;
  acceptance_rate: number;
  is_published: boolean;
  is_premium: boolean;
  test_cases: GeneratedTestCase[];
};

export function buildProblemBank(): GeneratedProblem[];
export function getProblemBank(): GeneratedProblem[];
export const PROBLEM_TOPICS: string[];
