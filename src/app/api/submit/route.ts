import { NextRequest, NextResponse } from "next/server";
import { runTestCases } from "@/lib/judge/run-code";
import { getProblemTestCases } from "@/lib/problems/testcases";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const auth = await createClient();
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in to save submissions and earn badges." }, { status: 401 });

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
    const db = await createServiceClient();
    const [{ data: problem }, { data: languageRow }] = await Promise.all([
      db.from("problems").select("id").eq("id", problemId).maybeSingle(),
      db.from("languages").select("id").eq("name", language).maybeSingle(),
    ]);
    if (!problem || !languageRow) return NextResponse.json({ error: "Choose a published problem and a supported language to record this submission." }, { status: 404 });
    const { data: savedSubmission, error: saveError } = await db.from("submissions").insert({
      user_id: user.id,
      problem_id: problem.id,
      language_id: languageRow.id,
      code,
      verdict: result.verdict,
      runtime_ms: result.runtimeMs,
      memory_kb: result.memoryKb,
      test_cases_passed: result.passedCount,
      test_cases_total: result.totalCount,
      error_message: result.compileError ?? null,
    }).select("id,submitted_at,verdict").single();
    if (saveError || !savedSubmission) return NextResponse.json({ error: "Your result was checked, but could not be saved. Please retry." }, { status: 500 });
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
      id: savedSubmission.id,
      problem_id: problemId,
      language,
      code,
      verdict: result.verdict,
      runtime_ms: result.runtimeMs,
      memory_kb: result.memoryKb,
      test_cases_passed: result.passedCount,
      test_cases_total: result.totalCount,
      submitted_at: savedSubmission.submitted_at,
      contest_id: contestId,
    };
    return NextResponse.json({ submission, result: safeResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission processing failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
