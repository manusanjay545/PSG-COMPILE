"use client";

import * as React from "react";
import Link from "next/link";
import {
  Code2,
  Trophy,
  Flame,
  Award,
  BarChart3,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  MOCK_CURRENT_USER,
  MOCK_PROBLEMS,
  MOCK_CONTESTS,
  MOCK_LEADERBOARD,
  MOCK_BADGES,
} from "@/lib/data/mock-data";

export default function DashboardPage() {
  const user = MOCK_CURRENT_USER;
  const dailyProblem = MOCK_PROBLEMS[0]; // Two Sum

  // Mock activity heatmap: 52 weeks x 7 days
  const activityDays = React.useMemo(() => {
    const days = [];
    for (let i = 0; i < 90; i++) {
      const level = Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0;
      days.push(level);
    }
    return days;
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>Welcome back, {user.full_name}</span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              {user.institution?.name} · {user.program?.name} · Batch {user.batch?.label}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Link href={`/problems/${dailyProblem.slug}`}>
                <Sparkles className="h-4 w-4" />
                Daily Challenge
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-zinc-800 text-zinc-300">
              <Link href={`/profile/${user.id}`}>
                View Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* PSG Rank */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
              <span>PSG Rank</span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              #{user.psg_rank}
            </div>
            <p className="text-[10px] text-zinc-500">Across all 5 PSG institutions</p>
          </Card>

          {/* Campus Rank */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
              <span>Campus Rank</span>
              <BarChart3 className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-400 font-mono">
              #{user.institution_rank}
            </div>
            <p className="text-[10px] text-zinc-500">PSG Tech Top Coder</p>
          </Card>

          {/* Contest Rating */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
              <span>Contest Rating</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {user.rating}
            </div>
            <p className="text-[10px] text-emerald-400/80 font-semibold capitalize">
              {user.rating_tier} Tier
            </p>
          </Card>

          {/* Problems Solved */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
              <span>Solved</span>
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">
              {user.problems_solved}
            </div>
            <p className="text-[10px] text-zinc-500">{user.accepted_submissions} Accepted</p>
          </Card>

          {/* Current Streak */}
          <Card className="border-zinc-800 bg-zinc-900/60 p-4 space-y-1 col-span-2 lg:col-span-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between">
              <span>Coding Streak</span>
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {user.current_streak} Days
            </div>
            <p className="text-[10px] text-zinc-500">Peak: {user.longest_streak} days</p>
          </Card>
        </div>

        {/* Dashboard 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Recommended Challenge */}
            <Card className="border-indigo-500/40 bg-gradient-to-r from-indigo-950/30 via-zinc-900 to-zinc-900 p-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                      Today&apos;s PSG Challenge
                    </Badge>
                    <span className="text-xs text-zinc-500 font-mono">+10 Streak Pts</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{dailyProblem.title}</h3>
                  <p className="text-xs text-zinc-400 max-w-lg">
                    {dailyProblem.description.slice(0, 140)}...
                  </p>
                </div>

                <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
                  <Link href={`/problems/${dailyProblem.slug}`}>
                    Solve Challenge &rarr;
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Problem Solving Breakdown */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Difficulty Breakdown</h3>
                <span className="text-xs text-zinc-400">Total Solved: {user.problems_solved}/350</span>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {/* Easy */}
                <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">Easy</span>
                    <span className="text-zinc-300 font-mono">{user.easy_solved}/150</span>
                  </div>
                  <Progress value={(user.easy_solved / 150) * 100} indicatorClassName="bg-emerald-500" />
                </div>

                {/* Medium */}
                <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-400 font-semibold">Medium</span>
                    <span className="text-zinc-300 font-mono">{user.medium_solved}/150</span>
                  </div>
                  <Progress value={(user.medium_solved / 150) * 100} indicatorClassName="bg-amber-500" />
                </div>

                {/* Hard */}
                <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400 font-semibold">Hard</span>
                    <span className="text-zinc-300 font-mono">{user.hard_solved}/50</span>
                  </div>
                  <Progress value={(user.hard_solved / 50) * 100} indicatorClassName="bg-red-500" />
                </div>
              </div>
            </Card>

            {/* Activity Heatmap */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Submission Activity</h3>
                  <p className="text-xs text-zinc-400">Active coding days across recent months</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <span>Less</span>
                  <div className="h-2.5 w-2.5 rounded-sm bg-zinc-800" />
                  <div className="h-2.5 w-2.5 rounded-sm bg-indigo-950 border border-indigo-800" />
                  <div className="h-2.5 w-2.5 rounded-sm bg-indigo-700" />
                  <div className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
                  <span>More</span>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {activityDays.map((val, idx) => (
                  <div
                    key={idx}
                    title={`Activity day ${idx + 1}`}
                    className={`h-3 w-3 rounded-xs ${
                      val === 0
                        ? "bg-zinc-800/70"
                        : val === 1
                        ? "bg-indigo-950 border border-indigo-800"
                        : val === 2
                        ? "bg-indigo-700"
                        : "bg-indigo-500 shadow-xs shadow-indigo-500/50"
                    }`}
                  />
                ))}
              </div>
            </Card>

            {/* Continue Coding (Recently Attempted) */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Continue Coding</h3>
                <Link href="/problems" className="text-xs text-indigo-400 hover:underline">
                  View all problems
                </Link>
              </div>

              <div className="divide-y divide-zinc-800/80">
                {MOCK_PROBLEMS.slice(1, 4).map((prob) => (
                  <div key={prob.id} className="py-3 flex items-center justify-between">
                    <div className="space-y-1">
                      <Link href={`/problems/${prob.slug}`} className="text-sm font-semibold text-white hover:text-indigo-400">
                        {prob.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span
                          className={`text-[10px] uppercase font-bold ${
                            prob.difficulty === "easy"
                              ? "text-emerald-400"
                              : prob.difficulty === "medium"
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                        <span>·</span>
                        <span>{prob.acceptance_rate}% Acceptance</span>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="border-zinc-800 text-xs">
                      <Link href={`/problems/${prob.slug}`}>Resume Code</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar Area (1 Col) */}
          <div className="space-y-8">
            {/* Live & Upcoming Contests */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Upcoming Contests
                </h3>
              </div>

              <div className="space-y-4">
                {MOCK_CONTESTS.slice(0, 3).map((contest) => (
                  <div
                    key={contest.id}
                    className="p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white line-clamp-1">
                        {contest.title}
                      </span>
                      {contest.status === "active" && (
                        <span className="text-[10px] font-bold text-red-400 animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>{contest.duration_minutes} mins</span>
                      <Link href={`/contests/${contest.slug}`} className="text-indigo-400 hover:underline">
                        Register &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Badges Preview */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-400" />
                  Recent Badges
                </h3>
                <Link href={`/profile/${user.id}`} className="text-xs text-indigo-400 hover:underline">
                  All ({MOCK_BADGES.length})
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {MOCK_BADGES.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 text-center space-y-1"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="text-xs font-semibold text-zinc-200">{badge.name}</div>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard Glimpse */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  Top PSG Coders
                </h3>
                <Link href="/leaderboard" className="text-xs text-indigo-400 hover:underline">
                  Full Board
                </Link>
              </div>

              <div className="space-y-3">
                {MOCK_LEADERBOARD.slice(0, 4).map((entry) => (
                  <div key={entry.user_id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-500 w-4">#{entry.rank}</span>
                      <div>
                        <div className="font-semibold text-zinc-200">{entry.full_name}</div>
                        <div className="text-[10px] text-zinc-500">{entry.institution_name}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-indigo-400">{entry.rating}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

