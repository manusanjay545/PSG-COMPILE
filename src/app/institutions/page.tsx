"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Trophy,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_INSTITUTIONS,
  MOCK_DEPARTMENTS,
  MOCK_LEADERBOARD,
} from "@/lib/data/mock-data";

export default function InstitutionsExplorerPage() {
  // Institutional competition ranking
  const institutionalRankings = [
    {
      rank: 1,
      institution: MOCK_INSTITUTIONS[0], // PSG Tech
      totalCoders: 2450,
      totalSolved: 64200,
      avgRating: 1680,
      championshipScore: 9850,
      topCoder: "Manu Sanjay (@manu)",
    },
    {
      rank: 2,
      institution: MOCK_INSTITUTIONS[2], // PSG CAS
      totalCoders: 1320,
      totalSolved: 31400,
      avgRating: 1540,
      championshipScore: 7420,
      topCoder: "Kavitha Raman (@kavitha_r)",
    },
    {
      rank: 3,
      institution: MOCK_INSTITUTIONS[1], // PSG Poly
      totalCoders: 780,
      totalSolved: 18200,
      avgRating: 1480,
      championshipScore: 5900,
      topCoder: "Arun Kumar (@arun_kumar)",
    },
    {
      rank: 4,
      institution: MOCK_INSTITUTIONS[3], // PSG iTech
      totalCoders: 560,
      totalSolved: 11900,
      avgRating: 1460,
      championshipScore: 4800,
      topCoder: "Deepa S (@deepa_s)",
    },
    {
      rank: 5,
      institution: MOCK_INSTITUTIONS[4], // PSG IM
      totalCoders: 320,
      totalSolved: 6800,
      avgRating: 1420,
      championshipScore: 3200,
      topCoder: "Vikram V (@vikram_v)",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Building2 className="h-7 w-7 text-indigo-400" />
              <span>PSG Institutions Explorer</span>
            </h1>
            <p className="text-sm text-zinc-400">
              Discover participating campuses, inter-college championship standings, and department faculty directories.
            </p>
          </div>
          <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs px-3 py-1">
            5 Campuses Connected
          </Badge>
        </div>

        {/* Inter-College Championship Standings */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                Inter-Institutional Championship Standings
              </h2>
              <p className="text-xs text-zinc-400">
                Score dynamically calculated from active coders, problems solved, and contest participation.
              </p>
            </div>
            <Badge variant="outline" className="text-amber-400 border-amber-500/30 self-start sm:self-auto text-xs">
              Annual Cup 2026
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3 px-4 font-semibold w-16">Rank</th>
                  <th className="py-3 px-4 font-semibold">Institution</th>
                  <th className="py-3 px-4 font-semibold text-right">Coders</th>
                  <th className="py-3 px-4 font-semibold text-right">Solved</th>
                  <th className="py-3 px-4 font-semibold text-right">Avg Rating</th>
                  <th className="py-3 px-4 font-semibold text-right">Cup Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {institutionalRankings.map((row) => (
                  <tr key={row.institution.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-base font-bold">
                        {row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : `#${row.rank}`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/institutions/${row.institution.slug}`}
                        className="font-semibold text-white hover:text-indigo-400 transition-colors"
                      >
                        {row.institution.name}
                      </Link>
                      <div className="text-[11px] text-zinc-500">
                        Top Coder: {row.topCoder}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {row.totalCoders.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {row.totalSolved.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-indigo-400 font-bold">
                      {row.avgRating}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-400 font-extrabold">
                      {row.championshipScore.toLocaleString()} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Institutions Detailed Cards Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">PSG Institution Directory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_INSTITUTIONS.map((inst) => {
              const depts = MOCK_DEPARTMENTS.filter(
                (d) => d.institution_id === inst.id
              );
              return (
                <div
                  key={inst.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-colors group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-800">
                        {inst.short_name}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {inst.description}
                    </p>

                    <div className="pt-2 text-xs text-zinc-400 space-y-1">
                      <div className="text-[11px] font-semibold text-zinc-300 uppercase">
                        Participating Departments ({depts.length}):
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {depts.map((d) => (
                          <Badge key={d.id} variant="outline" className="text-[10px] bg-zinc-950 border-zinc-800 text-zinc-400">
                            {d.short_name || d.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80">
                    <Button asChild variant="outline" className="w-full text-xs border-zinc-800 text-zinc-200 group-hover:border-indigo-500/50">
                      <Link href={`/institutions/${inst.slug}`} className="flex items-center justify-center gap-1.5">
                        <span>Explore Campus Leaderboard</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

