"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Check, ChevronDown, Clock3, Code2, LoaderCircle, Play, RotateCcw, Terminal, Trophy, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CompilerAd, CompilerBannerAd } from "@/components/compiler/compiler-ad";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false, loading: () => <div role="status" className="flex h-[390px] items-center justify-center gap-2 bg-[#101216] text-sm text-zinc-400"><LoaderCircle className="h-4 w-4 animate-spin text-indigo-400" />Loading editor…</div> });

type Language = { id: number; name: string };
type ActivityDay = { date: string; count: number };
type RunRecord = { date: string; language: string; status: string };
type RunResult = { status?: string; output?: string; error?: string; runtime?: string | null; memory?: string | null; errorMessage?: string };
const ACTIVITY_KEY = "psgcompile.compiler.activity.v1";
const RECENT_KEY = "psgcompile.compiler.recent.v1";

function editorLanguage(name: string) {
  const value = name.toLowerCase();
  if (value.includes("c++") || value.includes("cpp")) return "cpp";
  if (/\bc\s*\(/.test(value)) return "c";
  if (value.includes("python")) return "python";
  if (value.includes("java")) return "java";
  if (value.includes("typescript")) return "typescript";
  if (value.includes("javascript")) return "javascript";
  if (value.includes("c#")) return "csharp";
  if (value.includes("go (")) return "go";
  if (value.includes("rust")) return "rust";
  if (value.includes("ruby")) return "ruby";
  if (value.includes("php")) return "php";
  if (value.includes("sql")) return "sql";
  if (value.includes("html")) return "html";
  if (value.includes("json")) return "json";
  if (value.includes("bash")) return "shell";
  if (value.includes("kotlin")) return "kotlin";
  if (value.includes("swift")) return "swift";
  if (value.includes("dart")) return "dart";
  if (value.includes("r (")) return "r";
  if (value.includes("lua")) return "lua";
  return "plaintext";
}

function starterCode(name: string) {
  const language = editorLanguage(name);
  if (language === "python") return 'name = input()\nprint(f"Hello, {name}!")\n';
  if (language === "cpp") return '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    getline(cin, name);\n    cout << "Hello, " << name << "!\\n";\n    return 0;\n}\n';
  if (language === "c") return '#include <stdio.h>\n\nint main(void) {\n    char name[100];\n    fgets(name, sizeof(name), stdin);\n    printf("Hello, %s!", name);\n    return 0;\n}\n';
  if (language === "javascript") return 'const name = require("fs").readFileSync(0, "utf8").trim();\nconsole.log(`Hello, ${name}!`);\n';
  if (language === "typescript") return 'import * as fs from "fs";\nconst name = fs.readFileSync(0, "utf8").trim();\nconsole.log(`Hello, ${name}!`);\n';
  if (language === "java") return 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner input = new Scanner(System.in);\n        String name = input.nextLine();\n        System.out.println("Hello, " + name + "!");\n    }\n}\n';
  if (language === "go") return 'package main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n    "strings"\n)\n\nfunc main() {\n    name, _ := bufio.NewReader(os.Stdin).ReadString(\'\\n\')\n    fmt.Println("Hello, " + strings.TrimSpace(name) + "!")\n}\n';
  if (language === "rust") return 'use std::io;\n\nfn main() {\n    let mut name = String::new();\n    io::stdin().read_line(&mut name).unwrap();\n    println!("Hello, {}!", name.trim());\n}\n';
  if (language === "ruby") return 'name = STDIN.gets&.chomp || "world"\nputs "Hello, #{name}!"\n';
  if (language === "php") return '<?php\n$name = trim(stream_get_contents(STDIN));\necho "Hello, {$name}!\\n";\n';
  if (language === "csharp") return 'using System;\n\nclass Program {\n    static void Main() {\n        var name = Console.ReadLine();\n        Console.WriteLine($"Hello, {name}!");\n    }\n}\n';
  return "// Write your program here\n";
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ActivityPanel({ activity, recent }: { activity: ActivityDay[]; recent: RunRecord[] }) {
  const total = activity.reduce((sum, day) => sum + day.count, 0);
  const best = Math.max(...activity.map((day) => day.count), 0);
  const currentStreak = useMemo(() => {
    const active = new Set(activity.filter((day) => day.count > 0).map((day) => day.date));
    const cursor = new Date();
    if (!active.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (active.has(localDateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
    return streak;
  }, [activity]);
  return <aside className="grid gap-4 xl:grid-cols-3">
    <section className="rounded-2xl border border-white/[0.07] bg-[#101216] p-5 shadow-xl shadow-black/10">
      <div className="flex items-center justify-between">
        <div><p className="text-sm font-semibold text-zinc-100">Your activity</p><p className="mt-1 text-xs text-zinc-500">Runs saved on this device</p></div>
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"><Activity className="h-4 w-4" /></div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3"><p className="text-2xl font-semibold tracking-tight text-white">{total}</p><p className="mt-1 text-[11px] text-zinc-500">runs this year</p></div>
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3"><p className="flex items-center gap-1.5 text-2xl font-semibold tracking-tight text-white"><Zap className="h-4 w-4 text-amber-300" />{currentStreak}</p><p className="mt-1 text-[11px] text-zinc-500">day streak</p></div>
      </div>
      <div className="mt-5 grid grid-cols-12 gap-1" aria-label="Compiler activity over the last twelve weeks">
        {activity.slice(-84).map((day) => <span key={day.date} title={`${day.date}: ${day.count} runs`} className={`aspect-square rounded-[3px] ${day.count === 0 ? "bg-white/[0.055]" : day.count === 1 ? "bg-emerald-900" : day.count < 4 ? "bg-emerald-600" : "bg-emerald-400"}`} />)}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-zinc-600"><span>12 weeks ago</span><span>Today</span><span>Peak {best}</span></div>
      <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">Activity is stored in this browser. Sign in to keep your streak across devices.</p>
    </section>
    <section className="rounded-2xl border border-white/[0.07] bg-[#101216] p-5">
      <div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-zinc-100">Recent runs</p><p className="mt-1 text-xs text-zinc-500">Your latest compiler sessions</p></div><Clock3 className="h-4 w-4 text-zinc-500" /></div>
      {recent.length ? <ul className="space-y-3">{recent.slice(0, 4).map((run, index) => <li key={`${run.date}-${index}`} className="flex items-center justify-between gap-3 text-xs"><span className="min-w-0 truncate text-zinc-300">{run.language}</span><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] ${run.status.toLowerCase().includes("accept") || run.status === "Finished" ? "bg-emerald-400/10 text-emerald-300" : "bg-zinc-800 text-zinc-400"}`}>{run.status}</span></li>)}</ul> : <p className="rounded-lg border border-dashed border-white/[0.08] px-3 py-5 text-center text-xs text-zinc-600">Your runs will show up here.</p>}
    </section>
    <section className="rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.09] to-violet-500/[0.025] p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100"><Trophy className="h-4 w-4 text-indigo-300" />Ready for a challenge?</div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400">Take your new skills into a curated problem or a live contest.</p>
      <div className="mt-4 flex gap-2"><Link href="/problems" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-xs font-medium text-zinc-200 hover:bg-white/[0.05]">Problems <ArrowUpRight className="h-3.5 w-3.5" /></Link><Link href="/contests" className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-xs font-medium text-zinc-200 hover:bg-white/[0.05]">Contests <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
    </section>
  </aside>;
}

export function CompilerWorkspace() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageId, setLanguageId] = useState(0);
  const [code, setCode] = useState("print(\"Hello, world!\")\n");
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState<RunResult | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadingLanguages, setLoadingLanguages] = useState(true);
  const [languageError, setLanguageError] = useState("");
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [recent, setRecent] = useState<RunRecord[]>([]);
  const [activePane, setActivePane] = useState<"input" | "output">("input");
  const language = languages.find((item) => item.id === languageId);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]") as ActivityDay[];
        const normalized = Array.from({ length: 84 }, (_, index) => {
          const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (83 - index));
          const key = localDateKey(date);
          return { date: key, count: stored.find((item) => item.date === key)?.count || 0 };
        });
        setActivity(normalized);
        setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") as RunRecord[]);
      } catch { setActivity([]); setRecent([]); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/languages").then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not connect to the language catalog.");
      const sorted = (payload as Language[]).sort((a, b) => a.name.localeCompare(b.name));
      if (!active) return;
      setLanguages(sorted);
      const python = sorted.find((item) => item.name.toLowerCase().startsWith("python (3.12")) || sorted.find((item) => item.name.toLowerCase().startsWith("python (3."));
      const defaultLanguage = python || sorted.find((item) => item.name.toLowerCase().startsWith("python")) || sorted[0];
      if (defaultLanguage) { setLanguageId(defaultLanguage.id); setCode(starterCode(defaultLanguage.name)); }
    }).catch((error: unknown) => setLanguageError(error instanceof Error ? error.message : "Compiler language catalog is unavailable."))
      .finally(() => { if (active) setLoadingLanguages(false); });
    return () => { active = false; };
  }, []);

  const recordActivity = useCallback((status: string, languageName: string) => {
    const today = localDateKey();
    setActivity((previous) => {
      const next = previous.length ? previous.map((day) => day.date === today ? { ...day, count: day.count + 1 } : day) : [{ date: today, count: 1 }];
      try { localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next)); } catch { /* activity is a convenience, not required for compiling */ }
      return next;
    });
    setRecent((previous) => {
      const next = [{ date: new Date().toISOString(), language: languageName, status }, ...previous].slice(0, 24);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* local history is optional */ }
      return next;
    });
  }, []);

  const run = useCallback(async () => {
    if (!language) return;
    setHasRun(true); setBusy(true); setResult(null); setActivePane("output");
    try {
      const response = await fetch("/api/compile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ languageId, code, stdin }) });
      const payload = await response.json() as RunResult;
      if (!response.ok) throw new Error(payload.error || "Compiler service is unavailable.");
      setResult(payload);
      recordActivity(payload.status || (payload.error ? "Error" : "Finished"), language.name);
    } catch (error) {
      const failure = { errorMessage: error instanceof Error ? error.message : "Could not run this code." };
      setResult(failure); recordActivity("Error", language.name);
    } finally { setBusy(false); }
  }, [language, languageId, code, stdin, recordActivity]);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void run();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, [run]);

  const selectedLanguage = useMemo(() => languages.find((item) => item.id === languageId)?.name || "Python", [languages, languageId]);
  const outputText = result?.output || "";
  const errorText = result?.error || result?.errorMessage || "";

  return <div className="min-h-screen bg-[#0b0c0f] text-zinc-100">
    <Navbar />
    <main className="mx-auto w-full max-w-[1500px] px-3 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-9">
      <div className="mb-6 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,728px)]">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Online compiler <span className="text-emerald-200/35">/</span> 60+ languages</div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-[2.6rem]">PSGCompile: <span className="text-zinc-500">online coding and practice.</span></h1>
        </div>
        <div className="flex w-full flex-col items-start gap-3 sm:items-end">
          <CompilerBannerAd />
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500"><span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2"><Zap className="h-3.5 w-3.5 text-amber-300" />Fast isolated runtime</span><span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2"><Check className="h-3.5 w-3.5 text-emerald-300" />No setup needed</span></div>
        </div>
        <p className="col-span-full max-w-none text-sm leading-6 text-zinc-400">Compile code in 60+ languages, solve programming problems, and learn through guided courses. An independent coding platform for PSG College of Technology and the wider PSG student community.</p>
      </div>

      <div className={`grid min-w-0 gap-4 ${hasRun ? "xl:grid-cols-[160px_minmax(0,1fr)_minmax(320px,0.76fr)]" : "xl:grid-cols-[160px_minmax(0,1fr)]"}`}>
        <CompilerAd />
        <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101216] shadow-2xl shadow-black/25">
          <div className="flex min-h-[58px] flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#14161a] px-3 py-2.5 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-indigo-300/10 bg-indigo-400/[0.08] text-indigo-200"><Code2 className="h-4 w-4" /></div>
              <div className="relative min-w-0">
              <select aria-label="Programming language" value={languageId || ""} disabled={loadingLanguages || !languages.length} onChange={(event) => { const next = languages.find((item) => item.id === Number(event.target.value)); if (next) { setLanguageId(next.id); setCode(starterCode(next.name)); setResult(null); setHasRun(false); } }} className="h-9 max-w-[min(65vw,340px)] appearance-none rounded-lg border border-white/[0.08] bg-[#1a1c21] py-1 pl-3 pr-9 text-xs font-medium text-zinc-200 outline-none transition focus:border-indigo-400/40 disabled:opacity-60">
                  {loadingLanguages ? <option value="">Loading languages…</option> : languages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              </div>
              <span className="hidden rounded-md border border-white/[0.06] px-2 py-1 font-mono text-[10px] text-zinc-600 sm:inline">main</span>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => { setCode(starterCode(selectedLanguage)); setResult(null); setHasRun(false); }} className="h-9 gap-1.5 px-2.5 text-xs text-zinc-400 hover:bg-white/[0.05] hover:text-white"><RotateCcw className="h-3.5 w-3.5" /><span className="hidden sm:inline">Reset</span></Button>
              <Button type="button" onClick={run} disabled={busy || loadingLanguages || !language} className="h-9 min-w-[98px] gap-2 rounded-lg bg-emerald-400 px-4 text-xs font-semibold text-[#092113] shadow-lg shadow-emerald-400/10 hover:bg-emerald-300 disabled:bg-zinc-700 disabled:text-zinc-400">{busy ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-900/20 border-t-zinc-900" /> : <Play className="h-3.5 w-3.5 fill-current" />}{busy ? "Running" : "Run code"}<kbd className="hidden rounded border border-emerald-950/20 px-1 py-0.5 text-[9px] sm:inline">⌘↵</kbd></Button>
            </div>
          </div>
          {languageError && <div role="alert" className="border-b border-amber-300/10 bg-amber-300/[0.04] px-4 py-2 text-xs text-amber-200">{languageError} Set a working JUDGE0_API_URL to enable the compiler.</div>}
          <div className="overflow-hidden bg-[#101216]">
            <Editor height="min(58vh, 620px)" language={editorLanguage(selectedLanguage)} value={code} onChange={(value) => setCode(value || "")} theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 14, lineHeight: 23, padding: { top: 18, bottom: 18 }, scrollBeyondLastLine: false, smoothScrolling: true, wordWrap: "on", automaticLayout: true, tabSize: 4, renderLineHighlight: "gutter", fontFamily: "'SF Mono', 'Cascadia Code', Consolas, monospace", fontLigatures: true, scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 } }} />
          </div>
          {!hasRun && <div className="border-t border-white/[0.05] p-3 sm:p-4"><label htmlFor="initial-stdin" className="mb-2 block text-xs font-medium text-zinc-400">Standard input <span className="font-normal text-zinc-600">(optional)</span></label><textarea id="initial-stdin" aria-label="Standard input before first run" value={stdin} onChange={(event) => setStdin(event.target.value)} placeholder="Enter input for your program, if needed…" rows={3} className="w-full resize-y rounded-lg border border-white/[0.06] bg-[#0c0e11] p-3 font-mono text-xs leading-5 text-zinc-300 outline-none placeholder:text-zinc-700 focus:border-indigo-300/30" /></div>}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.05] px-3 py-2.5 text-[10px] text-zinc-600 sm:px-4"><span>Runs in a secure, isolated environment</span><span>Code is limited to 50 KB</span></div>
        </section>

        {hasRun && <section className="flex min-h-[380px] min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101216] shadow-2xl shadow-black/25 xl:min-h-[620px]">
          <div className="flex min-h-[58px] items-center justify-between border-b border-white/[0.06] bg-[#14161a] px-3 sm:px-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200"><Terminal className="h-4 w-4 text-emerald-300" />Run panel</div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setActivePane("input")} className={`rounded-md px-3 py-2 text-xs font-medium ${activePane === "input" ? "bg-white/[0.07] text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Input</button>
              <button type="button" onClick={() => setActivePane("output")} className={`rounded-md px-3 py-2 text-xs font-medium ${activePane === "output" ? "bg-white/[0.07] text-white" : "text-zinc-500 hover:text-zinc-300"}`}>Output</button>
            </div>
          </div>
          {activePane === "input" ? <div className="flex flex-1 flex-col p-3 sm:p-4"><textarea aria-label="Standard input" value={stdin} onChange={(event) => setStdin(event.target.value)} placeholder="Type program input here…" className="min-h-[240px] w-full flex-1 resize-y rounded-lg border border-white/[0.06] bg-[#0c0e11] p-3 font-mono text-xs leading-5 text-zinc-300 outline-none placeholder:text-zinc-700 focus:border-indigo-300/30" /><p className="mt-2 text-[10px] text-zinc-600">Standard input is passed to your program when it runs.</p></div> : <div aria-live="polite" className="min-h-[300px] flex-1 overflow-y-auto p-3 sm:p-4">
            {result ? <><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${errorText ? "bg-rose-400/10 text-rose-300" : "bg-emerald-400/10 text-emerald-300"}`}><span className={`h-1.5 w-1.5 rounded-full ${errorText ? "bg-rose-300" : "bg-emerald-300"}`} />{result.status || (errorText ? "Error" : "Finished")}</span><span className="flex gap-3 text-[10px] text-zinc-600">{result.runtime && <span>Time {result.runtime}</span>}{result.memory && <span>Memory {result.memory}</span>}</span></div><pre className="max-h-[min(52vh,620px)] overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-zinc-300">{outputText || (errorText ? <span className="text-rose-300">{errorText}</span> : <span className="text-zinc-600">Program finished with no output.</span>)}</pre>{outputText && errorText && <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-xs leading-5 text-rose-300">{errorText}</pre>}</> : <div className="grid min-h-[280px] place-items-center text-center text-xs text-zinc-600">{busy ? <span className="inline-flex items-center gap-2"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-300" />Preparing a secure run…</span> : "Run your code to see the output here."}</div>}
          </div>}
          <div className="border-t border-white/[0.05] px-3 py-2.5 text-[10px] text-zinc-600 sm:px-4">Runs in a secure, isolated environment</div>
        </section>}
      </div>

      <div className="mt-4"><ActivityPanel activity={activity} recent={recent} /></div>

      <section aria-labelledby="psg-resources-heading" className="mt-5 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5 sm:p-6">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">For the PSG student community</p>
          <h2 id="psg-resources-heading" className="mt-2 text-lg font-semibold text-white">Coding practice alongside campus resources</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">PSGCompile is an independent learning and coding platform. Use the official PSG ECampus for academic services, and PSG Bunker for its attendance tools.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a href="https://ecampus.psgtech.ac.in/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/[0.08] px-3 py-2 text-zinc-300 hover:border-indigo-400/40 hover:text-white">Official PSG ECampus <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></a>
            <a href="https://www.psgbunker.in.net/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/[0.08] px-3 py-2 text-zinc-300 hover:border-indigo-400/40 hover:text-white">PSG Bunker attendance tools <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></a>
          </div>
        </div>
      </section>

      <div className="mt-5 flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.018] px-4 py-4 sm:flex-row sm:items-center sm:px-5"><div><p className="text-sm font-medium text-zinc-200">Your next step: solve something real.</p><p className="mt-1 text-xs text-zinc-500">Use the same editor inside every problem and contest.</p></div><div className="flex flex-wrap gap-2"><Link href="/problems" className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-400 px-3.5 text-xs font-semibold text-[#111321] hover:bg-indigo-300">Explore problems <ArrowUpRight className="h-3.5 w-3.5" /></Link><Link href="/leaderboard" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] px-3.5 text-xs font-medium text-zinc-300 hover:bg-white/[0.04]">Scoreboard <ArrowUpRight className="h-3.5 w-3.5" /></Link></div></div>
    </main>
    <Footer />
  </div>;
}
