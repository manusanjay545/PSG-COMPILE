import { NextRequest, NextResponse } from "next/server";
import { executeCodeInSandbox } from "@/lib/judge/executor";
import { MOCK_PROBLEMS } from "@/lib/data/mock-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { problemId, language, code, customInput } = body;

    if (!problemId || !code) {
      return NextResponse.json(
        { error: "Problem ID and code are required." },
        { status: 400 }
      );
    }

    const problem = MOCK_PROBLEMS.find(
      (p) => p.id === problemId || p.slug === problemId
    );

    // If custom input provided, run against that
    let testCasesToRun = [];
    if (customInput !== undefined && customInput !== null && customInput.trim() !== "") {
      testCasesToRun = [
        {
          input: customInput,
          expected_output: "Custom run completed",
          is_sample: true,
        },
      ];
    } else if (problem && problem.examples.length > 0) {
      testCasesToRun = problem.examples.map((ex) => ({
        input: ex.input,
        expected_output: ex.output,
        is_sample: true,
      }));
    } else {
      testCasesToRun = [
        {
          input: "4\n2 7 11 15\n9",
          expected_output: "0 1",
          is_sample: true,
        },
      ];
    }

    const result = await executeCodeInSandbox(
      problemId,
      language || "python",
      code,
      testCasesToRun
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Execution engine failure" },
      { status: 500 }
    );
  }
}

