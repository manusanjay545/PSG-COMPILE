import type { SubmissionVerdict } from "@/types";
import type { ExecutionResponse } from "@/lib/judge/executor";
import { judge0BaseUrl, judge0Headers } from "@/lib/judge/judge0";

type JudgeLanguage = { id: number; name: string };
type JudgeResponse = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  time?: string | null;
  memory?: number | null;
  status?: { id?: number; description?: string };
};
type Case = { input: string; expected_output: string; is_sample: boolean };

let languageList: Promise<JudgeLanguage[]> | undefined;

function getLanguages() {
  languageList ??= fetch(`${judge0BaseUrl()}/languages`, {
    headers: judge0Headers(),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  }).then(async (response) => {
    if (!response.ok) throw new Error("Compiler language list is unavailable.");
    const languages: unknown = await response.json();
    if (!Array.isArray(languages)) throw new Error("Compiler returned an invalid language list.");
    return languages.filter((item): item is JudgeLanguage => Number.isInteger(item?.id) && typeof item?.name === "string");
  }).catch((error) => {
    languageList = undefined;
    throw error;
  });
  return languageList;
}

async function languageIdFor(language: string) {
  const requested = language.toLowerCase();
  const matchers: Record<string, RegExp> = {
    python: /^Python\s*\(3\./i,
    python3: /^Python\s*\(3\./i,
    cpp: /^C\+\+.*GCC/i,
    c: /^C\s.*GCC/i,
    java: /^Java\s/i,
    javascript: /(JavaScript.*Node|Node\.js)/i,
  };
  const matcher = matchers[requested];
  if (!matcher) throw new Error("Choose one of the supported compiled languages.");
  const found = (await getLanguages()).find((item) => matcher.test(item.name));
  if (!found) throw new Error(`The compiler does not currently provide ${language}.`);
  return found.id;
}

function normalize(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").map((line) => line.trimEnd()).join("\n").trim();
}

function verdictFor(statusId: number): SubmissionVerdict {
  if (statusId === 3) return "accepted";
  if (statusId === 4) return "wrong_answer";
  if (statusId === 5) return "time_limit_exceeded";
  if (statusId === 6) return "compilation_error";
  if (statusId >= 7 && statusId <= 14) return "runtime_error";
  return "internal_error";
}

async function runOne(languageId: number, code: string, input: string) {
  const base = judge0BaseUrl();
  const headers = judge0Headers();
  const created = await fetch(`${base}/submissions?base64_encoded=false&wait=false`, {
    method: "POST",
    headers,
    body: JSON.stringify({ source_code: code, language_id: languageId, stdin: input }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!created.ok) throw new Error(`Compiler could not accept this run (${created.status}).`);
  const { token } = await created.json() as { token?: string };
  if (!token) throw new Error("Compiler did not return a run token.");

  let result: JudgeResponse | undefined;
  for (let attempt = 0; attempt < 16; attempt++) {
    if (attempt) await new Promise((resolve) => setTimeout(resolve, 350));
    const response = await fetch(`${base}/submissions/${encodeURIComponent(token)}?base64_encoded=false&fields=stdout,stderr,compile_output,message,time,memory,status`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`Compiler could not return this run (${response.status}).`);
    result = await response.json() as JudgeResponse;
    if ((result.status?.id ?? 0) > 2) break;
  }
  if (!result || (result.status?.id ?? 0) <= 2) return { verdict: "time_limit_exceeded" as const, output: result?.stdout ?? "", error: "The run exceeded its processing time.", runtime: 0, memory: 0 };
  return {
    verdict: verdictFor(result.status?.id ?? 13),
    output: result.stdout ?? "",
    error: result.compile_output || result.stderr || result.message || "",
    runtime: Math.round(Number(result.time ?? 0) * 1000),
    memory: result.memory ?? 0,
  };
}

export async function runTestCases(language: string, code: string, cases: Case[], compareExpected = true): Promise<ExecutionResponse> {
  if (!code.trim()) return { verdict: "compilation_error", runtimeMs: 0, memoryKb: 0, passedCount: 0, totalCount: cases.length, results: [], compileError: "Add some code before running it." };
  if (code.length > 50_000 || cases.some((test) => test.input.length > 20_000)) {
    return { verdict: "internal_error", runtimeMs: 0, memoryKb: 0, passedCount: 0, totalCount: cases.length, results: [], compileError: "Code is limited to 50 KB and each input to 20 KB." };
  }

  const languageId = await languageIdFor(language);
  const runs = await Promise.all(cases.map((test) => runOne(languageId, code, test.input)));
  const results = runs.map((run, index) => ({
    testCaseIndex: index + 1,
    isSample: cases[index].is_sample,
    verdict: compareExpected && run.verdict === "accepted" && normalize(run.output) !== normalize(cases[index].expected_output) ? "wrong_answer" as const : run.verdict,
    input: cases[index].input,
    expectedOutput: cases[index].expected_output,
    actualOutput: run.output,
    runtimeMs: run.runtime,
    memoryKb: run.memory,
    errorMessage: run.error || undefined,
  }));
  const failed = results.find((result) => result.verdict !== "accepted");
  const passedCount = results.filter((result) => result.verdict === "accepted").length;
  return {
    verdict: failed?.verdict ?? "accepted",
    runtimeMs: Math.max(0, ...results.map((result) => result.runtimeMs)),
    memoryKb: Math.max(0, ...results.map((result) => result.memoryKb)),
    passedCount,
    totalCount: cases.length,
    results,
    compileError: failed?.errorMessage,
  };
}
