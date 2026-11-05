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
    const customInput = typeof body.customInput === "string" ? body.customInput : "";
    if (!problemId || !code.trim()) return NextResponse.json({ error: "Problem and code are required." }, { status: 400 });
    if (customInput.length > 20_000) return NextResponse.json({ error: "Custom input is limited to 20 KB." }, { status: 413 });

    const testCases = customInput.trim()
      ? [{ input: customInput, expected_output: "", is_sample: true }]
      : await getProblemTestCases(problemId, false);
    if (!testCases.length) return NextResponse.json({ error: "No sample test cases are available for this problem." }, { status: 404 });

    return NextResponse.json(await runTestCases(language, code, testCases, !customInput.trim()));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Compiler execution failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
