"use client";

import Link from "next/link";
import {
  Code2,
  Trophy,
  BarChart3,
  Building2,
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Award,
  Sparkles,
  Terminal,
  Laptop,
  GraduationCap,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  MOCK_PROBLEMS,
  MOCK_CONTESTS,
  MOCK_INSTITUTIONS,
  MOCK_LEADERBOARD,
  MOCK_BADGES,
} from "@/lib/data/mock-data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 border-b border-zinc-800/80">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-600/20 to-violet-600/20 blur-[120px] pointer-events-none rounded-full" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-sm text-xs text-zinc-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-white">PSGCompile v2.0</span>
              <span className="text-zinc-500">|</span>
              <span className="text-indigo-400">One PSG. One Coding Community.</span>
            </div>

            {/* Main Title */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
                Code. Compete.{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Climb.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                The unified institution-wide competitive programming platform for all
                PSG institutions, colleges, schools, and academic levels.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-600/20 h-12 px-6">
                <Link href="/problems">
                  <Play className="h-4 w-4 fill-white" />
                  Start Coding
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-zinc-800 hover:bg-zinc-900 text-zinc-200 gap-2 h-12 px-6">
                <Link href="/contests">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Explore Contests
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="hover:bg-zinc-900 text-zinc-300 gap-2 h-12 px-6">
                <Link href="/leaderboard">
                  <BarChart3 className="h-4 w-4 text-indigo-400" />
                  View Leaderboard
                </Link>
              </Button>
            </div>

            {/* Interactive Code Mockup Hero Card */}
            <div className="pt-10 max-w-4xl mx-auto">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-2xl overflow-hidden text-left font-mono text-xs">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/80 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-zinc-400">solution.cpp — PSG Coding Sandbox</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-zinc-700 text-emerald-400 bg-emerald-500/10">
                    Judge Verdict: Accepted (12ms)
                  </Badge>
                </div>
                {/* Editor Code Body */}
                <div className="p-4 sm:p-6 text-zinc-300 space-y-1 overflow-x-auto bg-zinc-950">
                  <div className="text-zinc-500">// PSGCompile Sandbox Online Judge</div>
                  <div><span className="text-indigo-400">#include</span> <span className="text-amber-300">&lt;bits/stdc++.h&gt;</span></div>
                  <div><span className="text-indigo-400">using namespace</span> std;</div>
                  <div className="pt-2"><span className="text-indigo-400">int</span> <span className="text-violet-400">main</span>() &#123;</div>
                  <div className="pl-4 text-zinc-400">// Unified institutional coding for PSG ecosystem coders</div>
                  <div className="pl-4">ios_base::<span className="text-cyan-400">sync_with_stdio</span>(<span className="text-indigo-400">false</span>);</div>
                  <div className="pl-4">cin.<span className="text-cyan-400">tie</span>(<span className="text-indigo-400">NULL</span>);</div>
                  <div className="pl-4"><span className="text-emerald-400">cout</span> &lt;&lt; <span className="text-amber-300">&quot;PSGCompile: Code. Compete. Climb.\\n&quot;</span>;</div>
                  <div className="pl-4"><span className="text-indigo-400">return</span> <span className="text-purple-400">0</span>;</div>
                  <div>&#125;</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PLATFORM STATISTICS */}
        {/* ============================================================ */}
        <section className="py-12 border-b border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white">5,400+</div>
                <div className="text-xs sm:text-sm text-zinc-400 font-medium">Active PSG Coders</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">350+</div>
                <div className="text-xs sm:text-sm text-zinc-400 font-medium">Curated Problems</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">128,000+</div>
                <div className="text-xs sm:text-sm text-zinc-400 font-medium">Submissions Judged</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">85+</div>
                <div className="text-xs sm:text-sm text-zinc-400 font-medium">Inter-College Contests</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CURATED PROBLEMS SHOWCASE */}
        {/* ============================================================ */}
        <section className="py-20 border-b border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <Badge variant="outline" className="mb-2 text-indigo-400 border-indigo-500/30">
                  Problem Solving
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Hand-crafted DSA & Systems Problems
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  From basic math and two-pointers to dynamic programming and graph algorithms.
                </p>
              </div>
              <Button asChild variant="outline" className="border-zinc-800 text-zinc-300 self-start md:self-auto">
                <Link href="/problems" className="flex items-center gap-1.5">
                  Browse All 350+ Problems <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_PROBLEMS.slice(0, 3).map((problem) => (
                <Link
                  key={problem.id}
                  href={`/problems/${problem.slug}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-500">#{problem.problem_number}</span>
                      <span
                        className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          problem.difficulty === "easy"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : problem.difficulty === "medium"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {problem.description.replace(/#/g, "").slice(0, 110)}...
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{problem.acceptance_rate}% Acceptance</span>
                    </div>
                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Solve &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* LIVE CONTESTS & TOURNAMENTS */}
        {/* ============================================================ */}
        <section className="py-20 border-b border-zinc-800 bg-zinc-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <Badge variant="outline" className="mb-2 text-amber-400 border-amber-500/30">
                  Competitive Programming
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  Contests Scoped for Every Level
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  PSG-wide championships, college vs college derbies, department invitationals, and weekly rounds.
                </p>
              </div>
              <Button asChild variant="outline" className="border-zinc-800 text-zinc-300 self-start md:self-auto">
                <Link href="/contests" className="flex items-center gap-1.5">
                  View Contest Schedule <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_CONTESTS.slice(0, 2).map((contest) => (
                <div
                  key={contest.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {contest.status === "active" ? (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                            LIVE CONTEST
                          </Badge>
                        ) : (
                          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                            Upcoming
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-zinc-400 border-zinc-700 text-xs">
                          {contest.contest_type.replace("_", " ").toUpperCase()}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-white pt-2">{contest.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {contest.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold">Duration</div>
                      <div className="text-sm font-semibold text-zinc-200">{contest.duration_minutes}m</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold">Penalty</div>
                      <div className="text-sm font-semibold text-zinc-200">+{contest.penalty_time_minutes}m</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500 uppercase font-bold">Freeze</div>
                      <div className="text-sm font-semibold text-zinc-200">{contest.freeze_time_minutes || 0}m</div>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Link href={`/contests/${contest.slug}`}>
                      Enter Contest Room &rarr;
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* PSG-WIDE LEADERBOARD PREVIEW */}
        {/* ============================================================ */}
        <section className="py-20 border-b border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">
                Institutional Standings
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                One Single PSG Leaderboard
              </h2>
              <p className="text-sm text-zinc-400">
                Top coders across PSG College of Tech, Polytechnic, Arts & Science, iTech, and Institute of Management.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Rank</th>
                      <th className="py-3.5 px-4 font-semibold">Student</th>
                      <th className="py-3.5 px-4 font-semibold">Institution</th>
                      <th className="py-3.5 px-4 font-semibold">Department</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Rating</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Solved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium">
                    {MOCK_LEADERBOARD.slice(0, 5).map((entry) => (
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
                                : "text-zinc-400"
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <Link href={`/profile/${entry.username}`} className="hover:text-indigo-400 transition-colors">
                            <span className="font-semibold text-white">{entry.full_name}</span>{" "}
                            <span className="text-xs text-zinc-500">@{entry.username}</span>
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-zinc-300">{entry.institution_name}</td>
                        <td className="py-3.5 px-4 text-xs text-zinc-400">{entry.department_name}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-bold text-indigo-400 font-mono">{entry.rating}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-zinc-200">
                          {entry.problems_solved}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-zinc-950/70 border-t border-zinc-800 text-center">
                <Button asChild variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300">
                  <Link href="/leaderboard">
                    Explore Full Leaderboard & Filtering by Department & Batch &rarr;
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* INSTITUTIONS EXPLORER PREVIEW */}
        {/* ============================================================ */}
        <section className="py-20 border-b border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                Campus Ecosystem
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Participating PSG Institutions
              </h2>
              <p className="text-sm text-zinc-400">
                Explore coder statistics, top department rankings, and faculty programs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_INSTITUTIONS.map((inst) => (
                <Link
                  key={inst.id}
                  href={`/institutions/${inst.slug}`}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-indigo-500/40 hover:bg-zinc-900 transition-all space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-800">
                        {inst.short_name}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {inst.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-indigo-400 font-medium">
                    <span>View Campus Leaderboard</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* LEARNING ROADMAPS */}
        {/* ============================================================ */}
        <section className="py-20 border-b border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge variant="outline" className="text-cyan-400 border-cyan-500/30">
                Curriculum Tracks
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Structured Coding Roadmaps
              </h2>
              <p className="text-sm text-zinc-400">
                Designed for absolute beginners, engineering DSA coursework, placement prep, and competitive programmers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Beginner Track", desc: "Programming basics, loops, arrays, strings, and recursion.", level: "Introductory", color: "border-emerald-500/30" },
                { title: "Core DSA", desc: "Linked Lists, Stacks, Queues, Binary Trees, and Graphs.", level: "Intermediate", color: "border-cyan-500/30" },
                { title: "Campus Placement", desc: "High-frequency interview questions, SQL, and OOP revision.", level: "Job Ready", color: "border-indigo-500/30" },
                { title: "Competitive Pro", desc: "Advanced Dynamic Programming, Segment Trees, Bitmasking.", level: "Advanced", color: "border-purple-500/30" },
              ].map((track, i) => (
                <div key={i} className={`rounded-xl border ${track.color} bg-zinc-900/60 p-6 space-y-3 flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[10px] text-zinc-300">
                      {track.level}
                    </Badge>
                    <h3 className="text-base font-bold text-white">{track.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{track.desc}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full border-zinc-800 text-zinc-200 mt-4">
                    <Link href="/roadmaps">View Roadmap</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* CALL TO ACTION */}
        {/* ============================================================ */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-zinc-950 via-indigo-950/20 to-zinc-950">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              Ready to climb the PSG leaderboard?
            </h2>
            <p className="text-base text-zinc-400 max-w-xl mx-auto">
              Join thousands of fellow students across PSG Tech, CAS, Poly, iTech, and IM. Practice problems, win contests, and prove your coding mastery.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 shadow-lg shadow-indigo-600/25">
                <Link href="/login">Get Started with Google</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-zinc-800 text-zinc-300 px-8 h-12">
                <Link href="/problems">Explore Problems</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
