"use client";

import * as React from "react";
import Link from "next/link";
import {
  Code2,
  Search,
  Filter,
  CheckCircle2,
  CheckCircle,
  Circle,
  ArrowUpDown,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_PROBLEMS, MOCK_TAGS } from "@/lib/data/mock-data";

export default function ProblemsPage() {
  const [search, setSearch] = React.useState("");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");
  const [selectedTag, setSelectedTag] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredProblems = MOCK_PROBLEMS.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(search.toLowerCase()) ||
      prob.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || prob.difficulty === difficultyFilter;
    const matchesTag =
      selectedTag === "all" ||
      prob.tags?.some((t) => t.slug === selectedTag);
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Problem Archive
            </h1>
            <p className="text-sm text-zinc-400">
              Practice algorithm, data structure, and system challenges verified by PSG online judge.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 px-3 py-1 text-xs">
              {filteredProblems.length} Problems Available
            </Badge>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search problems by name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-200 h-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Difficulty Filter */}
            <Select value={difficultyFilter} onValueChange={(val) => setDifficultyFilter(val)}>
              <SelectTrigger className="w-32 bg-zinc-950 border-zinc-800 text-zinc-200 h-9 text-xs">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            {/* Topic Filter */}
            <Select value={selectedTag} onValueChange={(val) => setSelectedTag(val)}>
              <SelectTrigger className="w-40 bg-zinc-950 border-zinc-800 text-zinc-200 h-9 text-xs">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="all">All Topics</SelectItem>
                {MOCK_TAGS.map((t) => (
                  <SelectItem key={t.id} value={t.slug}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
              <SelectTrigger className="w-32 bg-zinc-950 border-zinc-800 text-zinc-200 h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="unsolved">Unsolved</SelectItem>
                <SelectItem value="attempted">Attempted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Topic Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-2">
          <Button
            size="sm"
            variant={selectedTag === "all" ? "default" : "outline"}
            onClick={() => setSelectedTag("all")}
            className={`h-7 text-xs rounded-full ${
              selectedTag === "all" ? "bg-indigo-600 text-white" : "border-zinc-800 text-zinc-400"
            }`}
          >
            All
          </Button>
          {MOCK_TAGS.slice(0, 10).map((tag) => (
            <Button
              key={tag.id}
              size="sm"
              variant={selectedTag === tag.slug ? "default" : "outline"}
              onClick={() => setSelectedTag(tag.slug)}
              className={`h-7 text-xs rounded-full ${
                selectedTag === tag.slug
                  ? "bg-indigo-600 text-white"
                  : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tag.name}
            </Button>
          ))}
        </div>

        {/* Problems Table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold w-12 text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold">Title</th>
                <th className="py-3.5 px-4 font-semibold w-28">Difficulty</th>
                <th className="py-3.5 px-4 font-semibold w-32 text-right">Acceptance</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Topics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {filteredProblems.map((prob) => {
                const isSolved = prob.problem_number === 1; // Demo: prob 1 solved
                return (
                  <tr key={prob.id} className="hover:bg-zinc-800/40 transition-colors">
                    {/* Solved Status */}
                    <td className="py-3.5 px-4 text-center">
                      {isSolved ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500 inline-block" />
                      ) : (
                        <Circle className="h-4 w-4 text-zinc-600 inline-block" />
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/problems/${prob.slug}`}
                        className="font-semibold text-white hover:text-indigo-400 transition-colors flex items-center gap-2"
                      >
                        <span className="text-xs text-zinc-500 font-mono">
                          {prob.problem_number}.
                        </span>
                        <span>{prob.title}</span>
                      </Link>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                          prob.difficulty === "easy"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : prob.difficulty === "medium"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Acceptance */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-zinc-400">
                      {prob.acceptance_rate}%
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {prob.tags?.map((t) => (
                          <Badge
                            key={t.id}
                            variant="outline"
                            className="text-[10px] bg-zinc-950 border-zinc-800 text-zinc-400 font-normal"
                          >
                            {t.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProblems.length === 0 && (
            <div className="p-12 text-center space-y-2 text-zinc-400">
              <Code2 className="h-8 w-8 mx-auto text-zinc-600" />
              <p className="text-sm font-semibold text-zinc-300">No problems found</p>
              <p className="text-xs text-zinc-500">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

