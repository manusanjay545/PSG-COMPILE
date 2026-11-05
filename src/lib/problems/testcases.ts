import { MOCK_PROBLEMS } from "@/lib/data/mock-data";
import { getProblemBank } from "@/lib/problems/catalog.mjs";
import { createServiceClient } from "@/lib/supabase/server";

export type ProblemTestCase = {
  input: string;
  expected_output: string;
  is_sample: boolean;
};

export async function getProblemTestCases(identifier: string, includeHidden: boolean): Promise<ProblemTestCase[]> {
  try {
    const service = await createServiceClient();
    const isId = /^[0-9a-f-]{36}$/i.test(identifier);
    let query = service.from("problems").select("id");
    query = isId ? query.eq("id", identifier) : query.eq("slug", identifier);
    const { data: problem } = await query.maybeSingle();
    if (problem) {
      let tests = service.from("test_cases").select("input,expected_output,is_sample,is_hidden").eq("problem_id", problem.id).order("sort_order", { ascending: true });
      if (!includeHidden) tests = tests.eq("is_sample", true);
      const { data } = await tests;
      if (data?.length) return data.map((test) => ({ input: test.input, expected_output: test.expected_output, is_sample: test.is_sample ?? false }));
    }
  } catch {
    // Fall back to the deterministic local catalog when server-side database access is not configured.
  }

  const generated = getProblemBank().find((problem) => problem.id === identifier || problem.slug === identifier);
  if (generated) return generated.test_cases.filter((test) => includeHidden || test.is_sample).map((test) => ({ input: test.input, expected_output: test.expected_output, is_sample: test.is_sample }));
  const mock = MOCK_PROBLEMS.find((problem) => problem.id === identifier || problem.slug === identifier);
  if (mock) return mock.examples.map((test) => ({ input: test.input, expected_output: test.output, is_sample: true }));
  return [];
}
