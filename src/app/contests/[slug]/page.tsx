"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Trophy,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  BookOpen,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MOCK_CONTESTS,
  MOCK_PROBLEMS,
  MOCK_LEADERBOARD,
} from "@/lib/data/mock-data";

function ContestRoomPageContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const contest =
    MOCK_CONTESTS.find((c) => c.slug === slug) || MOCK_CONTESTS[0];

  const [activeTab, setActiveTab] = React.useState("problems");

  // Mock contest problems A, B, C, D
  const contestProblems = [
    { label: "A", points: 100, solved: 142, problem: MOCK_PROBLEMS[0] },
    { label: "B", points: 250, solved: 89, problem: MOCK_PROBLEMS[1] },
    { label: "C", points: 400, solved: 45, problem: MOCK_PROBLEMS[2] },
    { label: "D", points: 600, solved: 18, problem: MOCK_PROBLEMS[4] },
  ];

  // Contest leaderboard data
  const contestStandings = [
    {
      rank: 1,
      name: "Manu Sanjay",
      username: "manu",
      institution: "PSG College of Technology",
      department: "Information Technology",
      score: 1350,
      solved: 4,
      penalty: 148,
      ratingChange: "+68",
    },
    {
      rank: 2,
      name: "Kavitha Raman",
      username: "kavitha_r",
      institution: "PSG College of Arts & Science",
      department: "Computer Science",
      score: 1250,
      solved: 4,
      penalty: 192,
      ratingChange: "+54",
    },
    {
      rank: 3,
      name: "Arun Kumar",
      username: "arun_kumar",
      institution: "PSG Polytechnic College",
      department: "Computer Engineering",
      score: 750,
      solved: 3,
      penalty: 110,
      ratingChange: "+42",
    },
    {
      rank: 4,
      name: "Deepa Subramanian",
      username: "deepa_s",
      institution: "PSG Institute of Technology",
      department: "CSE",
      score: 750,
      solved: 3,
      penalty: 134,
      ratingChange: "+28",
    },
    {
      rank: 5,
      name: "Vikram Venkatesh",
      username: "vikram_v",
      institution: "PSG Institute of Management",
      department: "MBA",
      score: 350,
      solved: 2,
      penalty: 72,
      ratingChange: "+15",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        {/* Contest Header Banner */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {contest.status === "active" ? (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1.5 animate-pulse">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    LIVE CONTEST
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                    {contest.status.toUpperCase()}
                  </Badge>
                )}
                <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">
                  {contest.contest_type.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {contest.title}
              </h1>
              <p className="text-xs text-zinc-400">{contest.description}</p>
            </div>

            {/* Countdown Clock */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center shrink-0">
              <div className="text-[10px] uppercase font-bold text-zinc-500">
                Time Remaining
              </div>
              <div className="text-2xl font-mono font-extrabold text-amber-400">
                01:24:45
              </div>
              <div className="text-[10px] text-zinc-500">Duration: {contest.duration_minutes}m</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger value="problems" className="text-xs">
              Problems (4)
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-xs">
              Live Leaderboard
            </TabsTrigger>
            <TabsTrigger value="rules" className="text-xs">
              Rules & Scoring
            </TabsTrigger>
          </TabsList>

          {/* TAB: Contest Problems */}
          <TabsContent value="problems" className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold w-16 text-center">Label</th>
                    <th className="py-3.5 px-4 font-semibold">Title</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Points</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Solved By</th>
                    <th className="py-3.5 px-4 font-semibold text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {contestProblems.map((cp) => (
                    <tr key={cp.label} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-600/20 text-indigo-400 font-mono font-bold text-xs border border-indigo-500/30">
                          {cp.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <Link
                            href={`/problems/${cp.problem.slug}`}
                            className="font-semibold text-white hover:text-indigo-400 transition-colors"
                          >
                            {cp.problem.title}
                          </Link>
                          <div className="text-[11px] text-zinc-500">
                            Difficulty: {cp.problem.difficulty.toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-amber-400">
                        {cp.points} pts
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-zinc-400">
                        {cp.solved} coders
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7">
                          <Link href={`/problems/${cp.problem.slug}`}>Solve</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB: Live Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold w-16">Rank</th>
                    <th className="py-3.5 px-4 font-semibold">Competitor</th>
                    <th className="py-3.5 px-4 font-semibold">Institution</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Score</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Solved</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Penalty</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Δ Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {contestStandings.map((user) => (
                    <tr key={user.username} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="text-base">
                          {user.rank === 1
                            ? "🥇"
                            : user.rank === 2
                            ? "🥈"
                            : user.rank === 3
                            ? "🥉"
                            : `#${user.rank}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Link href={`/profile/${user.username}`} className="hover:text-indigo-400">
                          <div className="font-semibold text-white">{user.name}</div>
                          <div className="text-[10px] text-zinc-500">@{user.username}</div>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-zinc-300">
                        <div>{user.institution}</div>
                        <div className="text-[10px] text-zinc-500">{user.department}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                        {user.score}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-zinc-200">
                        {user.solved} / 4
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-zinc-500">
                        {user.penalty}m
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-bold">
                        {user.ratingChange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB: Rules & Regulations */}
          <TabsContent value="rules" className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 text-xs text-zinc-300 leading-relaxed">
              <h3 className="text-sm font-bold text-white">Official Contest Guidelines</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Scoring: Total points obtained from accepted problem test suites.
                </li>
                <li>
                  Penalty: +{contest.penalty_time_minutes} minutes for each incorrect submission prior to acceptance.
                </li>
                <li>
                  Freeze: Leaderboard freezes {contest.freeze_time_minutes || 30} minutes prior to completion to ensure competitive suspense.
                </li>
                <li>
                  Plagiarism Engine: All code is cross-compared across submitted solutions. Detected plagiarism leads to immediate disqualification.
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

export default function ContestRoomPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-xs text-zinc-500">Loading Contest Arena...</div>}>
      <ContestRoomPageContent />
    </React.Suspense>
  );
}
