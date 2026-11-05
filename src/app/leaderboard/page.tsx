"use client";

import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  BarChart3,
  Flame,
  Award,
  Building2,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Star,
  GraduationCap,
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
import {
  MOCK_LEADERBOARD,
  MOCK_INSTITUTIONS,
  MOCK_DEPARTMENTS,
  MOCK_BATCHES,
} from "@/lib/data/mock-data";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = React.useState("overall");
  const [search, setSearch] = React.useState("");
  const [institutionFilter, setInstitutionFilter] = React.useState("all");
  const [departmentFilter, setDepartmentFilter] = React.useState("all");
  const [batchFilter, setBatchFilter] = React.useState("all");

  const filteredLeaderboard = MOCK_LEADERBOARD.filter((entry) => {
    const matchesSearch =
      entry.full_name.toLowerCase().includes(search.toLowerCase()) ||
      entry.username.toLowerCase().includes(search.toLowerCase());
    const matchesInst =
      institutionFilter === "all" ||
      entry.institution_name.toLowerCase().includes(institutionFilter.toLowerCase());
    const matchesDept =
      departmentFilter === "all" ||
      entry.department_name.toLowerCase().includes(departmentFilter.toLowerCase());
    return matchesSearch && matchesInst && matchesDept;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Trophy className="h-7 w-7 text-amber-400" />
              <span>PSG-Wide Leaderboard</span>
            </h1>
            <p className="text-sm text-zinc-400">
              One unified competitive ranking across all PSG institutions, departments, and batches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs py-1 px-3">
              Institutional Championship Active
            </Badge>
          </div>
        </div>

        {/* Podium Top 3 Coders Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Rank 2 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col items-center text-center space-y-3 relative order-2 md:order-1 mt-0 md:mt-6">
            <span className="text-3xl">🥈</span>
            <div className="space-y-1">
              <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-[10px]">
                Rank 2
              </Badge>
              <h3 className="text-lg font-bold text-white">
                <Link href={`/profile/${MOCK_LEADERBOARD[1].username}`} className="hover:text-indigo-400">
                  {MOCK_LEADERBOARD[1].full_name}
                </Link>
              </h3>
              <p className="text-xs text-zinc-400">{MOCK_LEADERBOARD[1].institution_name}</p>
            </div>
            <div className="pt-2 font-mono text-xs">
              <span className="text-indigo-400 font-bold text-base">{MOCK_LEADERBOARD[1].rating}</span> Rating · {MOCK_LEADERBOARD[1].problems_solved} Solved
            </div>
          </div>

          {/* Rank 1 (Champion) */}
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-900 p-6 flex flex-col items-center text-center space-y-3 relative order-1 md:order-2 shadow-xl shadow-amber-500/5">
            <span className="text-4xl">🥇</span>
            <div className="space-y-1">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                PSG Topper
              </Badge>
              <h3 className="text-xl font-extrabold text-white">
                <Link href={`/profile/${MOCK_LEADERBOARD[0].username}`} className="hover:text-indigo-400">
                  {MOCK_LEADERBOARD[0].full_name}
                </Link>
              </h3>
              <p className="text-xs text-amber-300/80 font-medium">{MOCK_LEADERBOARD[0].institution_name}</p>
              <p className="text-[11px] text-zinc-400">{MOCK_LEADERBOARD[0].department_name}</p>
            </div>
            <div className="pt-2 font-mono text-sm">
              <span className="text-amber-400 font-bold text-xl">{MOCK_LEADERBOARD[0].rating}</span> Rating · {MOCK_LEADERBOARD[0].problems_solved} Solved
            </div>
          </div>

          {/* Rank 3 */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col items-center text-center space-y-3 relative order-3 mt-0 md:mt-8">
            <span className="text-3xl">🥉</span>
            <div className="space-y-1">
              <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-[10px]">
                Rank 3
              </Badge>
              <h3 className="text-lg font-bold text-white">
                <Link href={`/profile/${MOCK_LEADERBOARD[2].username}`} className="hover:text-indigo-400">
                  {MOCK_LEADERBOARD[2].full_name}
                </Link>
              </h3>
              <p className="text-xs text-zinc-400">{MOCK_LEADERBOARD[2].institution_name}</p>
            </div>
            <div className="pt-2 font-mono text-xs">
              <span className="text-indigo-400 font-bold text-base">{MOCK_LEADERBOARD[2].rating}</span> Rating · {MOCK_LEADERBOARD[2].problems_solved} Solved
            </div>
          </div>
        </div>

        {/* Tab Scopes: Overall, Today, Week, Month, Contest Rating, Solved, Streak */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
          {[
            { id: "overall", label: "Overall PSG" },
            { id: "rating", label: "Contest Rating" },
            { id: "solved", label: "Problems Solved" },
            { id: "streak", label: "Active Streak" },
            { id: "month", label: "This Month" },
          ].map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`h-8 text-xs ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          {/* Search by student name/handle */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-zinc-950 border-zinc-800 text-xs text-zinc-200 h-9"
            />
          </div>

          {/* Institution Filter */}
          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-xs text-zinc-200 h-9">
              <SelectValue placeholder="All Institutions" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs">
              <SelectItem value="all">All PSG Institutions</SelectItem>
              {MOCK_INSTITUTIONS.map((inst) => (
                <SelectItem key={inst.id} value={inst.name}>
                  {inst.short_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-xs text-zinc-200 h-9">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs">
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Engineering">Computer Engineering</SelectItem>
              <SelectItem value="Management">Management (MBA)</SelectItem>
              <SelectItem value="Applications">Computer Applications (MCA)</SelectItem>
            </SelectContent>
          </Select>

          {/* Batch Filter */}
          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="bg-zinc-950 border-zinc-800 text-xs text-zinc-200 h-9">
              <SelectValue placeholder="All Batches" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs">
              <SelectItem value="all">All Academic Batches</SelectItem>
              <SelectItem value="2023-2027">2023–2027</SelectItem>
              <SelectItem value="2024-2028">2024–2028</SelectItem>
              <SelectItem value="2024-2027">2024–2027</SelectItem>
              <SelectItem value="2025-2027">2025–2027</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Leaderboard Table */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold w-16">Rank</th>
                <th className="py-3.5 px-4 font-semibold">Student</th>
                <th className="py-3.5 px-4 font-semibold">Institution</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold text-right">Rating</th>
                <th className="py-3.5 px-4 font-semibold text-right">Solved</th>
                <th className="py-3.5 px-4 font-semibold text-right">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-medium">
              {filteredLeaderboard.map((entry) => (
                <tr key={entry.user_id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                        entry.rank === 1
                          ? "bg-amber-400 text-zinc-950"
                          : entry.rank === 2
                          ? "bg-zinc-300 text-zinc-950"
                          : entry.rank === 3
                          ? "bg-amber-600 text-white"
                          : "text-zinc-500 font-mono"
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <Link
                      href={`/profile/${entry.username}`}
                      className="font-semibold text-white hover:text-indigo-400 transition-colors"
                    >
                      {entry.full_name}{" "}
                      <span className="text-xs text-zinc-500 font-normal">
                        @{entry.username}
                      </span>
                    </Link>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-zinc-300">
                    {entry.institution_name}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-zinc-400">
                    {entry.department_name}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-indigo-400 font-mono">
                      {entry.rating}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-zinc-200">
                    {entry.problems_solved}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                    {entry.current_streak}d 🔥
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeaderboard.length === 0 && (
            <div className="p-12 text-center text-zinc-400 text-xs">
              No students found for this filter criteria.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

