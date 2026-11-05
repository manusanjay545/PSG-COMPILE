import { NextRequest, NextResponse } from "next/server";
import { judge0BaseUrl, judge0Headers } from "@/lib/judge/judge0";

export const maxDuration = 30;

type JudgeResult = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  time?: string | null;
  memory?: number | null;
  status?: { id?: number; description?: string };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const languageId = Number(body.languageId);
    const code = typeof body.code === "string" ? body.code : "";
    const stdin = typeof body.stdin === "string" ? body.stdin : "";

    if (!Number.isInteger(languageId) || languageId < 1) return NextResponse.json({ error: "Choose a supported language." }, { status: 400 });
    if (!code.trim()) return NextResponse.json({ error: "Add some code before running it." }, { status: 400 });
    if (code.length > 50_000 || stdin.length > 20_000) return NextResponse.json({ error: "Code is limited to 50 KB and input to 20 KB." }, { status: 413 });

    const baseUrl = judge0BaseUrl();
    const headers = judge0Headers();
    const created = await fetch(`${baseUrl}/submissions?base64_encoded=false&wait=false`, {
      method: "POST",
      headers,
      body: JSON.stringify({ source_code: code, language_id: languageId, stdin }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!created.ok) {
      const detail = await created.text();
      return NextResponse.json({ error: `Compiler could not accept the run (${created.status}). ${detail.slice(0, 300)}` }, { status: 502 });
    }
    const { token } = await created.json();
    if (typeof token !== "string") return NextResponse.json({ error: "Compiler did not return a run token." }, { status: 502 });

    let result: JudgeResult | undefined;
    for (let attempt = 0; attempt < 22; attempt += 1) {
      if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 700));
      const response = await fetch(`${baseUrl}/submissions/${encodeURIComponent(token)}?base64_encoded=false&fields=stdout,stderr,compile_output,message,time,memory,status`, {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) return NextResponse.json({ error: `Could not retrieve compiler output (${response.status}).` }, { status: 502 });
      const polledResult = await response.json() as JudgeResult;
      result = polledResult;
      if ((polledResult.status?.id ?? 0) > 2) break;
    }
    if (!result || (result.status?.id ?? 0) <= 2) return NextResponse.json({ status: "Processing limit reached", output: "Your code is still queued. Try running it again in a moment." });

    const detail = result.compile_output || result.stderr || result.message || "";
    return NextResponse.json({
      status: result.status?.description || "Finished",
      output: result.stdout || "",
      error: detail,
      runtime: result.time ? `${result.time}s` : null,
      memory: typeof result.memory === "number" ? `${result.memory} KB` : null,
    });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError"
      ? "The compiler timed out. Please try again."
      : error instanceof Error ? error.message : "Compiler service is unavailable.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
