"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Circle, Code2, Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingIndicator } from "@/components/ui/loading-state";

type ArchiveProblem = {
  id: string;
  problem_number: number;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard" | "very_hard";
  topic?: string;
  acceptance_rate: number;
  tags?: Array<{ id: string; name: string; slug: string }>;
};

type ArchiveResponse = {
  data: ArchiveProblem[];
  total: number;
  page: number;
  total_pages: number;
};

const TOPICS = [
  "arrays", "backtracking", "bipartite matching", "binary search", "Dijkstra",
  "dynamic programming", "hash maps", "max flow", "minimum spanning tree",
  "monotonic stack", "number theory", "prefix and suffix products", "prefix sums",
  "sliding window", "sorting", "stacks", "strongly connected components",
];

const difficultyStyle: Record<ArchiveProblem["difficulty"], string> = {
  easy: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  very_hard: "bg-violet-500/10 text-violet-300 border border-violet-500/25",
};

const difficultyLabel = (difficulty: ArchiveProblem["difficulty"]) =>
  difficulty === "very_hard" ? "Very hard" : difficulty[0].toUpperCase() + difficulty.slice(1);

export default function ProblemsPage() {
  const [search, setSearch] = React.useState("");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");
  const [selectedTopic, setSelectedTopic] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [archive, setArchive] = React.useState<ArchiveResponse>({ data: [], total: 0, page: 1, total_pages: 1 });
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");

  React.useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      setLoadError("");
      const params = new URLSearchParams({ page: String(page), pageSize: "50", search });
      if (difficultyFilter !== "all") params.set("difficulty", difficultyFilter);
      if (selectedTopic !== "all") params.set("topic", selectedTopic);
      try {
        const response = await fetch(`/api/problems?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("The problem list could not be loaded.");
        setArchive(await response.json());
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(error instanceof Error ? error.message : "Please try again.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 180);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [difficultyFilter, page, search, selectedTopic]);

  const resetPage = (change: () => void) => {
    change();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Coding problems for practice</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400">Explore programming challenges by topic and difficulty. Write a solution, run it against test cases, and build your problem-solving skills.</p>
            <p className="text-sm text-zinc-400">Practice with a verified bank of algorithm and data structure challenges.</p>
          </div>
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 px-3 py-1 text-xs w-fit">
            {archive.total.toLocaleString()} Problems
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              aria-label="Search problem titles"
              placeholder="Search all problems..."
              value={search}
              onChange={(event) => resetPage(() => setSearch(event.target.value))}
              className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-200 h-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select value={difficultyFilter} onValueChange={(value) => resetPage(() => setDifficultyFilter(value))}>
              <SelectTrigger aria-label="Filter by difficulty" className="w-36 bg-zinc-950 border-zinc-800 text-zinc-200 h-9 text-xs">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="all">All difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="very_hard">Very hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTopic} onValueChange={(value) => resetPage(() => setSelectedTopic(value))}>
              <SelectTrigger aria-label="Filter by topic" className="w-48 bg-zinc-950 border-zinc-800 text-zinc-200 h-9 text-xs">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="all">All topics</SelectItem>
                {TOPICS.map((topic) => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          {isLoading ? <LoadingIndicator label="Loading problems…" className="text-xs" /> : <span>{`Showing ${archive.total === 0 ? 0 : (page - 1) * 50 + 1}–${Math.min(page * 50, archive.total)} of ${archive.total.toLocaleString()}`}</span>}
          <span>2 sample cases + 3 hidden checks per problem</span>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold w-12 text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Title</th>
                  <th className="py-3.5 px-4 font-semibold w-32">Difficulty</th>
                  <th className="py-3.5 px-4 font-semibold w-32 text-right">Acceptance</th>
                  <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Topic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {archive.data.map((problem) => (
                  <tr key={problem.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-center"><Circle className="h-4 w-4 text-zinc-600 inline-block" aria-label="Unsolved" /></td>
                    <td className="py-3.5 px-4">
                      <Link href={`/problems/${problem.slug}`} className="font-semibold text-white hover:text-indigo-400 transition-colors flex items-center gap-2">
                        <span className="text-xs text-zinc-500 font-mono">{problem.problem_number}.</span>
                        <span>{problem.title}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4"><span className={`text-[11px] font-bold px-2 py-0.5 rounded ${difficultyStyle[problem.difficulty]}`}>{difficultyLabel(problem.difficulty)}</span></td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-zinc-400">{problem.acceptance_rate}%</td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <Badge variant="outline" className="text-[10px] bg-zinc-950 border-zinc-800 text-zinc-400 font-normal">{problem.topic ?? problem.tags?.[0]?.name ?? "Algorithms"}</Badge>
                    </td>
                  </tr>
                ))}
                {!isLoading && !loadError && archive.data.length === 0 && (
                  <tr><td colSpan={5} className="p-12 text-center text-zinc-400"><Code2 className="h-8 w-8 mx-auto mb-2 text-zinc-600" />No problems match those filters.</td></tr>
                )}
                {isLoading && archive.data.length === 0 && (
                  <tr><td colSpan={5} className="p-12 text-center"><LoadingIndicator label="Loading verified problems…" /></td></tr>
                )}
                {loadError && <tr><td colSpan={5} className="p-12 text-center text-rose-300">{loadError}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1 || isLoading} onClick={() => setPage((value) => value - 1)} className="border-zinc-700 text-zinc-300">
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-xs text-zinc-500">Page {page} of {Math.max(1, archive.total_pages)}</span>
          <Button variant="outline" size="sm" disabled={page >= archive.total_pages || isLoading} onClick={() => setPage((value) => value + 1)} className="border-zinc-700 text-zinc-300">
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
