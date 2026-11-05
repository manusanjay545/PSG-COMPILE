import { NextRequest, NextResponse } from "next/server";
import { executeCodeInSandbox } from "@/lib/judge/executor";
import { MOCK_PROBLEMS } from "@/lib/data/mock-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemId, language, code, contestId } = body;

    if (!problemId || !code) {
      return NextResponse.json(
        { error: "Problem ID and code are required." },
        { status: 400 }
      );
    }

    const problem = MOCK_PROBLEMS.find(
      (p) => p.id === problemId || p.slug === problemId
    );

    // Full suite of sample and hidden test cases
    const fullTestCases = [
      ...(problem?.examples.map((ex) => ({
        input: ex.input,
        expected_output: ex.output,
        is_sample: true,
      })) || []),
      {
        input: "5\n1 5 3 7 2\n9",
        expected_output: "1 3",
        is_sample: false,
      },
      {
        input: "4\n-1 -2 -3 -4\n-6",
        expected_output: "1 3",
        is_sample: false,
      },
      {
        input: "2\n100 200\n300",
        expected_output: "0 1",
        is_sample: false,
      },
    ];

    const result = await executeCodeInSandbox(
      problemId,
      language || "python",
      code,
      fullTestCases
    );

    const submissionRecord = {
      id: "sub-" + Date.now().toString(36),
      problem_id: problemId,
      language,
      code,
      verdict: result.verdict,
      runtime_ms: result.runtimeMs,
      memory_kb: result.memoryKb,
      test_cases_passed: result.passedCount,
      test_cases_total: result.totalCount,
      submitted_at: new Date().toISOString(),
      contest_id: contestId || null,
    };

    return NextResponse.json({
      submission: submissionRecord,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Submission processing error" },
      { status: 500 }
    );
  }
}

