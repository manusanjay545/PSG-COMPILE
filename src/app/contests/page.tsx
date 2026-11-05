"use client";

import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_CONTESTS, MOCK_INSTITUTIONS } from "@/lib/data/mock-data";

export default function ContestsPage() {
  const [filterType, setFilterType] = React.useState("all");

  const filteredContests = MOCK_CONTESTS.filter((c) => {
    if (filterType === "all") return true;
    return c.contest_type === filterType;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Trophy className="h-7 w-7 text-amber-400" />
              <span>Contest Arena</span>
            </h1>
            <p className="text-sm text-zinc-400">
              Institution-wide tournaments, weekly Elo rounds, department invitationals, and college championships.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-44 bg-zinc-900 border-zinc-800 text-xs text-zinc-200">
                <SelectValue placeholder="Contest Scope" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                <SelectItem value="all">All Scopes</SelectItem>
                <SelectItem value="psg_wide">PSG-Wide</SelectItem>
                <SelectItem value="institution">Institution Specific</SelectItem>
                <SelectItem value="department">Departmental</SelectItem>
                <SelectItem value="weekly">Weekly Elo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Live Banner */}
        {MOCK_CONTESTS.some((c) => c.status === "active") && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 gap-1.5 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  HAPPENING NOW
                </Badge>
                <span className="text-xs text-zinc-400 font-mono">PSG Championship</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                PSG Coding Championship 2026
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl">
                4 Problems. 2 Hours. Students from PSG College of Tech, Poly, CAS, iTech, and IM competing head-to-head for the institutional trophy.
              </p>
            </div>

            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white shrink-0 font-semibold gap-2 shadow-lg shadow-red-600/20">
              <Link href="/contests/psg-coding-championship-2026">
                Enter Live Arena &rarr;
              </Link>
            </Button>
          </div>
        )}

        {/* Contests Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Scheduled & Past Contests
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest) => (
              <div
                key={contest.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase font-bold ${
                        contest.status === "active"
                          ? "text-red-400 border-red-500/30 bg-red-500/10"
                          : contest.status === "scheduled"
                          ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
                          : "text-zinc-400 border-zinc-800 bg-zinc-950"
                      }`}
                    >
                      {contest.status === "active" ? "Live" : contest.status}
                    </Badge>
                    <span className="text-xs font-mono text-zinc-500">
                      {contest.duration_minutes} mins
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white leading-snug">
                    {contest.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {contest.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-500" />
                      Penalty: +{contest.penalty_time_minutes}m
                    </span>
                    <Badge variant="outline" className="text-[10px] border-zinc-800 text-zinc-400">
                      {contest.contest_type.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>

                  <Button asChild className="w-full bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs">
                    <Link href={`/contests/${contest.slug}`}>
                      {contest.status === "active"
                        ? "Join Contest"
                        : contest.status === "scheduled"
                        ? "Register & Details"
                        : "View Results & Leaderboard"}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

