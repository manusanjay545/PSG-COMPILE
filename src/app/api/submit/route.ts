import { NextRequest, NextResponse } from "next/server";
import { runTestCases } from "@/lib/judge/run-code";
import { getProblemTestCases } from "@/lib/problems/testcases";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const problemId = typeof body.problemId === "string" ? body.problemId : "";
    const language = typeof body.language === "string" ? body.language : "python";
    const code = typeof body.code === "string" ? body.code : "";
    const contestId = typeof body.contestId === "string" ? body.contestId : null;
    if (!problemId || !code.trim()) return NextResponse.json({ error: "Problem and code are required." }, { status: 400 });
    if (code.length > 50_000) return NextResponse.json({ error: "Code is limited to 50 KB." }, { status: 413 });

    const testCases = await getProblemTestCases(problemId, true);
    if (!testCases.length) return NextResponse.json({ error: "No test cases are available for this problem." }, { status: 404 });
    const result = await runTestCases(language, code, testCases);
    const safeResult = {
      ...result,
      results: result.results.map((test) => test.isSample ? test : {
        ...test,
        input: "",
        expectedOutput: "",
        actualOutput: "",
        errorMessage: undefined,
      }),
    };
    const submission = {
      id: `sub-${Date.now().toString(36)}`,
      problem_id: problemId,
      language,
      code,
      verdict: result.verdict,
      runtime_ms: result.runtimeMs,
      memory_kb: result.memoryKb,
      test_cases_passed: result.passedCount,
      test_cases_total: result.totalCount,
      submitted_at: new Date().toISOString(),
      contest_id: contestId,
    };
    return NextResponse.json({ submission, result: safeResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission processing failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
