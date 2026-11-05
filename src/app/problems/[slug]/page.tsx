"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Code2,
  LoaderCircle,
  Play,
  Send,
  RotateCcw,
  Save,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Terminal,
  FileText,
  BookOpen,
  MessageSquare,
  Sparkles,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  MOCK_PROBLEMS,
  MOCK_LANGUAGES,
  MOCK_CURRENT_USER,
} from "@/lib/data/mock-data";
import { ExecutionResponse, TestCaseResult } from "@/lib/judge/executor";
import type { Problem } from "@/types";

// Dynamically import Monaco Editor to prevent SSR window issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div role="status" className="h-full w-full flex items-center justify-center gap-2 bg-zinc-950 text-zinc-400 font-mono text-xs">
      <LoaderCircle className="h-4 w-4 animate-spin text-indigo-400" />
      Loading Monaco Code Engine...
    </div>
  ),
});

function ProblemDetailPageContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [loadedProblem, setLoadedProblem] = React.useState<Problem | null>(
    () => MOCK_PROBLEMS.find((item) => item.slug === slug) ?? null
  );
  const problem = loadedProblem ?? MOCK_PROBLEMS[0];

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/problems/${encodeURIComponent(slug)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Problem not found");
        return response.json();
      })
      .then(({ problem: remoteProblem }) => {
        if (!cancelled && remoteProblem) setLoadedProblem(remoteProblem as Problem);
      })
      .catch(() => {
        if (!cancelled && !MOCK_PROBLEMS.some((item) => item.slug === slug)) {
          window.location.assign("/problems");
        }
      });
    return () => { cancelled = true; };
  }, [slug]);

  const [activeTab, setActiveTab] = React.useState("description");
  const [selectedLanguage, setSelectedLanguage] = React.useState("python");
  const [code, setCode] = React.useState(
    problem.starter_code?.python || `# Solution for ${problem.title}\n`
  );
  const [isRunning, setIsRunning] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [customInput, setCustomInput] = React.useState("");
  const [activeConsoleTab, setActiveConsoleTab] = React.useState<"testcases" | "result">("testcases");
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = React.useState(0);
  const [executionResult, setExecutionResult] = React.useState<ExecutionResponse | null>(null);

  // Restore saved code after hydration so server and initial browser markup match.
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem(`psg_code_${problem.id}_${selectedLanguage}`);
      if (saved) {
        setCode(saved);
      } else if (problem.starter_code?.[selectedLanguage]) {
        setCode(problem.starter_code[selectedLanguage]);
      } else {
        const langObj = MOCK_LANGUAGES.find((l) => l.slug === selectedLanguage);
        setCode(langObj?.template_code || "");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedLanguage, problem.id, problem.starter_code]);

  // Language change handler
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    const saved = localStorage.getItem(`psg_code_${problem.id}_${lang}`);
    if (saved) {
      setCode(saved);
    } else if (problem.starter_code?.[lang]) {
      setCode(problem.starter_code[lang]);
    } else {
      const langObj = MOCK_LANGUAGES.find((l) => l.slug === lang);
      setCode(langObj?.template_code || "");
    }
  };

  // Run Code against sample test cases
  const handleRun = async () => {
    setIsRunning(true);
    setActiveConsoleTab("result");
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          language: selectedLanguage,
          code,
          customInput: customInput.trim() ? customInput : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not run the sample cases.");
      setExecutionResult(data);

      if (data.verdict === "accepted") {
        toast.success("Sample Test Cases Passed!");
      } else {
        toast.error(`Run finished with verdict: ${data.verdict.toUpperCase()}`);
      }
    } catch (err: unknown) {
      toast.error("Execution failed: " + (err instanceof Error ? err.message : "Please try again."));
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code against all test cases
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setActiveConsoleTab("result");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          language: selectedLanguage,
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.result) throw new Error(data.error || "Could not submit this solution.");
      setExecutionResult(data.result);

      if (data.result.verdict === "accepted") {
        toast.success("Accepted! All test cases passed.", {
          description: `Runtime: ${data.result.runtimeMs}ms · Memory: ${Math.round(data.result.memoryKb / 1024)}MB`,
        });
      } else {
        toast.error(`Verdict: ${data.result.verdict.toUpperCase()}`, {
          description: `${data.result.passedCount}/${data.result.totalCount} test cases passed.`,
        });
      }
    } catch (err: unknown) {
      toast.error("Submission failed: " + (err instanceof Error ? err.message : "Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save code to localStorage
  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`psg_code_${problem.id}_${selectedLanguage}`, code);
      toast.success("Code saved to local browser storage!");
    }
  };

  // Reset code to default starter
  const handleReset = () => {
    const starter = problem.starter_code?.[selectedLanguage] || "";
    setCode(starter);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`psg_code_${problem.id}_${selectedLanguage}`);
    }
    toast.info("Reset to default starter template.");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col h-screen overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Workspace: Left Tabs Panel & Right Monaco Editor */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden border-t border-zinc-800">
        {/* ============================================================ */}
        {/* LEFT COLUMN: Problem Details / Editorial / Solutions / Submissions */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 border-r border-zinc-800 flex flex-col h-full bg-zinc-900/30 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Tab navigation headers */}
            <div className="flex items-center justify-between px-3 border-b border-zinc-800 bg-zinc-950/60 shrink-0">
              <TabsList className="bg-transparent border-0 gap-1 h-10 p-0">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-xs h-8 px-3 rounded-md text-zinc-400 gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="editorial"
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-xs h-8 px-3 rounded-md text-zinc-400 gap-1.5"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Editorial
                </TabsTrigger>
                <TabsTrigger
                  value="solutions"
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-xs h-8 px-3 rounded-md text-zinc-400 gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Solutions
                </TabsTrigger>
                <TabsTrigger
                  value="discussions"
                  className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-xs h-8 px-3 rounded-md text-zinc-400 gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Discussions
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsBookmarked(!isBookmarked);
                    toast.success(isBookmarked ? "Removed bookmark" : "Bookmarked problem");
                  }}
                  className={`h-7 w-7 ${isBookmarked ? "text-amber-400" : "text-zinc-500"}`}
                >
                  <Bookmark className="h-3.5 w-3.5 fill-current" />
                </Button>
              </div>
            </div>

            {/* TAB 1: Problem Description */}
            <TabsContent value="description" className="flex-1 overflow-y-auto p-6 space-y-6 m-0">
              {/* Problem Title & Meta Header */}
              <div className="space-y-3 pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-zinc-500 font-mono text-base">{problem.problem_number}.</span>
                    {problem.title}
                  </h1>
                  <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      problem.difficulty === "easy"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : problem.difficulty === "medium"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : problem.difficulty === "very_hard"
                          ? "bg-violet-500/10 text-violet-300 border border-violet-500/25"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {problem.difficulty === "very_hard" ? "Very hard" : problem.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span className="font-mono">Acceptance: {problem.acceptance_rate}%</span>
                  <span>·</span>
                  <span>{problem.submission_count} Submissions</span>
                  <span>·</span>
                  <div className="flex gap-1">
                    {problem.tags?.map((t) => (
                      <Badge key={t.id} variant="outline" className="text-[10px] bg-zinc-900 border-zinc-800">
                        {t.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statement Markdown */}
              <div className="prose prose-invert prose-xs max-w-none text-zinc-300 leading-relaxed space-y-4">
                <p className="whitespace-pre-line text-sm">{problem.description}</p>
              </div>

              {problem.diagram && (
                <section className="space-y-2">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400">Diagram</h3>
                  <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs leading-relaxed text-cyan-100 font-mono whitespace-pre">{problem.diagram}</pre>
                </section>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {problem.input_format && (
                  <section className="space-y-2">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400">Input format</h3>
                    <pre className="h-full whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 text-xs leading-relaxed text-zinc-300 font-mono">{problem.input_format}</pre>
                  </section>
                )}
                {problem.output_format && (
                  <section className="space-y-2">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400">Output format</h3>
                    <pre className="h-full whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-950/70 p-3 text-xs leading-relaxed text-zinc-300 font-mono">{problem.output_format}</pre>
                  </section>
                )}
              </div>

              {/* Examples */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                  Examples
                </h3>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="rounded-lg bg-zinc-950/80 border border-zinc-800 p-3 space-y-2 text-xs font-mono">
                    <div className="font-sans font-semibold text-zinc-300">
                      Example {idx + 1}:
                    </div>
                    <div>
                      <span className="text-zinc-500">Input:</span>{" "}
                      <span className="text-zinc-200">{ex.input}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Output:</span>{" "}
                      <span className="text-emerald-400">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-zinc-400 font-sans text-[11px] pt-1">
                        <span className="text-zinc-500">Explanation:</span> {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              {problem.constraints && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                    Constraints
                  </h3>
                  <div className="rounded-lg bg-zinc-950/60 border border-zinc-800 p-3 font-mono text-xs text-zinc-300 whitespace-pre-line">
                    {problem.constraints}
                  </div>
                </div>
              )}

              {/* Hints */}
              {problem.hints && problem.hints.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400">
                    Hints
                  </h3>
                  <div className="space-y-2">
                    {problem.hints.map((hint, i) => (
                      <details key={i} className="group rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs">
                        <summary className="cursor-pointer font-medium text-zinc-400 hover:text-zinc-200 flex items-center justify-between">
                          <span>Hint {i + 1}</span>
                          <span className="text-indigo-400 text-[10px]">Show</span>
                        </summary>
                        <p className="pt-2 text-zinc-300 leading-relaxed border-t border-zinc-800 mt-2">
                          {hint}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: Editorial */}
            <TabsContent value="editorial" className="flex-1 overflow-y-auto p-6 space-y-4 m-0">
              <div className="space-y-2 pb-3 border-b border-zinc-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  Official PSGCompile Editorial
                </h2>
                <p className="text-xs text-zinc-400">
                  Detailed theoretical proof, time and space complexity analysis.
                </p>
              </div>

              <div className="prose prose-invert prose-xs max-w-none text-zinc-300 leading-relaxed font-mono text-xs whitespace-pre-line bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                {problem.editorial || "Editorial will be revealed after contest end."}
              </div>
            </TabsContent>

            {/* TAB 3: Solutions */}
            <TabsContent value="solutions" className="flex-1 overflow-y-auto p-6 space-y-4 m-0">
              <div className="space-y-2 pb-3 border-b border-zinc-800">
                  <h2 className="text-lg font-bold text-white">Verified Reference Solution</h2>
                  <p className="text-xs text-zinc-400">Python 3 implementation checked against all five problem test cases.</p>
              </div>

              {problem.solution_code?.python ? (
                <div className="space-y-3">
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white">Python 3 · Official solution</span>
                      <div className="text-[10px] text-zinc-500">Reference implementation</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                      Verified
                    </Badge>
                  </div>
                  <pre className="p-3 bg-zinc-900 rounded text-xs font-mono text-zinc-300 overflow-x-auto">
{problem.solution_code.python}
                  </pre>
                </div>
                </div>
              ) : (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">A reference solution has not been added yet.</div>
              )}
            </TabsContent>

            {/* TAB 4: Discussions */}
            <TabsContent value="discussions" className="flex-1 overflow-y-auto p-6 space-y-4 m-0">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Problem Discussions</h2>
                  <p className="text-xs text-zinc-400">Ask questions, share hints, or report issues.</p>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white">
                  New Thread
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-200">
                      Edge case when array contains negative targets?
                    </span>
                    <span className="text-[10px] text-zinc-500">3h ago</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    The hash map handles negatives seamlessly because complement = target - num preserves algebraic signs.
                  </p>
                  <div className="text-[10px] text-indigo-400 font-semibold">
                    12 replies · 8 upvotes
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: Monaco Editor & Bottom Execution Console */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 flex flex-col h-full bg-zinc-950 overflow-hidden">
          {/* Editor Header: Language selector & Actions */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-36 h-8 bg-zinc-950 border-zinc-800 text-xs text-zinc-200">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                  {MOCK_LANGUAGES.filter((language) => language.slug !== "sql").map((l) => (
                    <SelectItem key={l.slug} value={l.slug} className="text-xs">
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                title="Reset code"
                className="h-8 text-xs text-zinc-400 hover:text-zinc-200 gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                title="Save code"
                className="h-8 text-xs text-zinc-400 hover:text-zinc-200 gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </Button>
            </div>

            {/* Run & Submit Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="h-8 text-xs border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white gap-1.5"
              >
                {isRunning ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Play className="h-3.5 w-3.5 text-zinc-400" />}
                {isRunning ? "Running..." : "Run"}
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-sm shadow-indigo-600/30"
              >
                {isSubmitting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Send className="h-3.5 w-3.5" />}
                {isSubmitting ? "Judging..." : "Submit"}
              </Button>
            </div>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language={
                selectedLanguage === "c" || selectedLanguage === "cpp"
                  ? "cpp"
                  : selectedLanguage === "python"
                  ? "python"
                  : selectedLanguage === "java"
                  ? "java"
                  : selectedLanguage === "javascript"
                  ? "javascript"
                  : "plaintext"
              }
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "var(--font-mono), monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: "on",
              }}
            />
          </div>

          {/* ============================================================ */}
          {/* BOTTOM CONSOLE & TEST RESULTS TRAY */}
          {/* ============================================================ */}
          <div className="h-56 border-t border-zinc-800 bg-zinc-950 flex flex-col shrink-0">
            {/* Console Tabs */}
            <div className="flex items-center justify-between px-4 h-9 border-b border-zinc-800 bg-zinc-900/40">
              <div className="flex items-center gap-4 text-xs font-medium">
                <button
                  onClick={() => setActiveConsoleTab("testcases")}
                  className={`flex items-center gap-1.5 py-1 ${
                    activeConsoleTab === "testcases"
                      ? "text-indigo-400 border-b-2 border-indigo-500 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  Testcase
                </button>
                <button
                  onClick={() => setActiveConsoleTab("result")}
                  className={`flex items-center gap-1.5 py-1 ${
                    activeConsoleTab === "result"
                      ? "text-indigo-400 border-b-2 border-indigo-500 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Result
                </button>
              </div>

              {executionResult && (
                <div className="flex items-center gap-3 text-xs">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold uppercase ${
                      executionResult.verdict === "accepted"
                        ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                        : "text-red-400 border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    {executionResult.verdict.replace("_", " ")}
                  </Badge>
                  <span className="font-mono text-zinc-500 text-[11px]">
                    {executionResult.runtimeMs}ms
                  </span>
                </div>
              )}
            </div>

            {/* Console Content */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-zinc-300">
              {activeConsoleTab === "testcases" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {problem.examples.map((_, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={selectedTestCaseIdx === i ? "default" : "outline"}
                        onClick={() => setSelectedTestCaseIdx(i)}
                        className={`h-6 px-2.5 text-[11px] ${
                          selectedTestCaseIdx === i
                            ? "bg-zinc-800 text-white"
                            : "border-zinc-800 text-zinc-400"
                        }`}
                      >
                        Case {i + 1}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="text-zinc-500 text-[10px] uppercase font-bold">Input</div>
                    <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 overflow-x-auto">
                      {problem.examples[selectedTestCaseIdx]?.input}
                    </pre>
                  </div>
                </div>
              ) : (
                /* Execution Result Output */
                <div className="space-y-3">
                  {!executionResult ? (
                    <div className="text-zinc-500 text-xs italic">
                      Run or submit your solution to view online judge verdict and testcase execution traces.
                    </div>
                  ) : executionResult.compileError ? (
                    <div className="p-3 bg-red-950/40 border border-red-800 rounded text-red-300 space-y-1">
                      <div className="font-bold uppercase text-[11px]">Compilation / Security Error</div>
                      <pre className="text-xs">{executionResult.compileError}</pre>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span
                          className={
                            executionResult.verdict === "accepted"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {executionResult.verdict === "accepted"
                            ? "✓ Accepted"
                            : "✗ " + executionResult.verdict.toUpperCase()}
                        </span>
                        <span className="text-zinc-400">
                          Passed: {executionResult.passedCount} / {executionResult.totalCount} Testcases
                        </span>
                        <span className="text-zinc-500 font-mono">
                          Runtime: {executionResult.runtimeMs} ms
                        </span>
                      </div>

                      {/* Display testcase results */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {executionResult.results.map((res) => (
                          <div
                            key={res.testCaseIndex}
                            className={`p-2 rounded border text-[11px] ${
                              res.verdict === "accepted"
                                ? "bg-emerald-950/20 border-emerald-900/50 text-emerald-300"
                                : "bg-red-950/20 border-red-900/50 text-red-300"
                            }`}
                          >
                            <div className="flex justify-between font-bold">
                              <span>
                                {res.isSample ? "Sample" : "Hidden"} Case #{res.testCaseIndex}
                              </span>
                              <span>{res.verdict.toUpperCase()} ({res.runtimeMs}ms)</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-1">
                              Expected: {res.expectedOutput} | Output: {res.actualOutput}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProblemDetailPage() {
  return (
    <React.Suspense fallback={<div role="status" className="min-h-screen bg-zinc-950 flex items-center justify-center gap-2 text-sm text-zinc-400"><LoaderCircle className="h-4 w-4 animate-spin text-indigo-400" />Loading Problem Workspace…</div>}>
      <ProblemDetailPageContent />
    </React.Suspense>
  );
}
