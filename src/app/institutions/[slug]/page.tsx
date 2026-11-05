"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Building2,
  Users,
  Trophy,
  BookOpen,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_INSTITUTIONS,
  MOCK_DEPARTMENTS,
  MOCK_PROGRAMS,
  MOCK_LEADERBOARD,
  MOCK_CONTESTS,
} from "@/lib/data/mock-data";

function InstitutionDetailPageContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const inst =
    MOCK_INSTITUTIONS.find((i) => i.slug === slug) || MOCK_INSTITUTIONS[0];

  const depts = MOCK_DEPARTMENTS.filter((d) => d.institution_id === inst.id);
  const campusCoders = MOCK_LEADERBOARD.filter((u) =>
    u.institution_name.toLowerCase().includes(inst.short_name?.toLowerCase() || "")
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Campus Header Banner */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30">
                  {inst.short_name}
                </Badge>
                <span className="text-xs text-zinc-500">Autonomous PSG Campus</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">{inst.name}</h1>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                {inst.description}
              </p>
            </div>

            {inst.website && (
              <Button asChild variant="outline" size="sm" className="border-zinc-800 text-zinc-300 gap-1.5 self-start md:self-auto">
                <a href={inst.website} target="_blank" rel="noreferrer">
                  <span>Visit Website</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800 text-center text-xs">
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Departments</div>
              <div className="text-lg font-bold text-white font-mono">{depts.length || 4}</div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Registered Coders</div>
              <div className="text-lg font-bold text-indigo-400 font-mono">1,850+</div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Solved Problems</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">42,500+</div>
            </div>
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Peak Campus Rating</div>
              <div className="text-lg font-bold text-amber-400 font-mono">2,420</div>
            </div>
          </div>
        </div>

        {/* 2-Column Campus Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area: Campus Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                {inst.short_name} Top Coders
              </h2>
              <Link href="/leaderboard" className="text-xs text-indigo-400 hover:underline">
                View PSG-wide Board
              </Link>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold w-16">Rank</th>
                    <th className="py-3 px-4 font-semibold">Student</th>
                    <th className="py-3 px-4 font-semibold">Department</th>
                    <th className="py-3 px-4 font-semibold text-right">Rating</th>
                    <th className="py-3 px-4 font-semibold text-right">Solved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {campusCoders.length > 0 ? (
                    campusCoders.map((entry, idx) => (
                      <tr key={entry.user_id} className="hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-mono text-zinc-400">#{idx + 1}</td>
                        <td className="py-3 px-4">
                          <Link href={`/profile/${entry.username}`} className="font-semibold text-white hover:text-indigo-400">
                            {entry.full_name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-xs text-zinc-400">{entry.department_name}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-indigo-400">{entry.rating}</td>
                        <td className="py-3 px-4 text-right font-mono text-zinc-300">{entry.problems_solved}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-500 text-xs">
                        Coders from {inst.short_name} appear here dynamically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar: Departments & Programs */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              Departments & Faculties
            </h2>

            <div className="space-y-3">
              {depts.map((d) => (
                <div key={d.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-1">
                  <div className="font-semibold text-sm text-white">{d.name}</div>
                  <div className="text-xs text-zinc-400">Short Code: {d.short_name || d.slug.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function InstitutionDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-xs text-zinc-500">Loading Campus Standings...</div>}>
      <InstitutionDetailPageContent />
    </React.Suspense>
  );
}
