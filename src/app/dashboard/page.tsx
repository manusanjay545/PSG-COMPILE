"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, Award, BookOpen, CheckCircle2, Flame, UserRound } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ActivityHeatmap } from "@/components/profile/activity-heatmap";

type DashboardData = {
  profile: {
    id: string; username: string | null; full_name: string | null; avatar_url: string | null;
    college_name: string | null; department_name: string | null; academic_year: string | null;
    batch_start_year: number | null; batch_end_year: number | null; problems_solved: number | null;
    total_submissions: number | null; accepted_submissions: number | null;
    current_streak: number | null; longest_streak: number | null;
  };
  badges: Array<{ id: string; name: string; description: string; icon: string; earned: boolean; award: { awarded_at: string } | null }>;
  activity: { months: Array<{ key: string; label: string; days: Array<{ date: string; count: number }> }> };
};

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    let active = true;
    fetch("/api/achievements", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Could not load your dashboard.");
        return body as DashboardData;
      })
      .then((body) => { if (active) setData(body); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load your dashboard."); });
    return () => { active = false; };
  }, []);

  const profile = data?.profile;
  const earned = data?.badges.filter((badge) => badge.earned) ?? [];
  const yearLabel = profile?.batch_start_year && profile.batch_end_year
    ? profile.academic_year || ""
    : "Add your college batch in profile settings";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{profile ? `Welcome back, ${profile.full_name || "coder"}` : "Your coding activity"}</h1>
            <p className="mt-1 text-sm text-zinc-400">{[profile?.college_name, profile?.department_name, yearLabel].filter(Boolean).join(" · ")}</p>
          </div>
          {profile && <Link className="inline-flex items-center gap-2 self-start rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900" href={`/profile/${profile.username || profile.id}`}><UserRound className="h-4 w-4" />View profile</Link>}
        </header>

        {error ? <div role="alert" className="rounded-xl border border-amber-800 bg-amber-950/30 p-4 text-sm text-amber-200">{error} <Link href="/login" className="ml-2 underline">Sign in</Link></div> : !data ? <div className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-sm text-zinc-400">Loading your real activity…</div> : <>
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Problems solved", value: profile?.problems_solved ?? 0, icon: CheckCircle2 },
              { label: "Submissions", value: profile?.total_submissions ?? 0, icon: Activity },
              { label: "Current streak", value: `${profile?.current_streak ?? 0} days`, icon: Flame },
              { label: "Badges earned", value: earned.length, icon: Award },
            ].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="flex items-center justify-between text-xs text-zinc-400"><span>{label}</span><Icon className="h-4 w-4 text-emerald-400" /></div><div className="mt-2 text-2xl font-bold text-white">{value}</div></div>)}
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <section className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div><h2 className="text-lg font-semibold text-white">Activity by month</h2><p className="text-sm text-zinc-400">Every square is one calendar day. Color intensity reflects recorded submissions.</p></div>
              <ActivityHeatmap months={data.activity.months} />
            </section>
            <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
              <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-white">Achievements</h2><span className="text-xs text-zinc-400">{earned.length} earned</span></div>
              {data.badges.length ? <div className="space-y-2">{data.badges.map((badge) => <div key={badge.id} className={`flex gap-3 rounded-lg border p-3 ${badge.earned ? "border-emerald-800/70 bg-emerald-950/20" : "border-zinc-800 bg-zinc-950/60 opacity-60"}`}><span className="text-xl" aria-hidden="true">{badge.icon}</span><div className="min-w-0"><div className="text-sm font-medium text-white">{badge.name}</div><p className="text-xs text-zinc-400">{badge.description}</p>{badge.award && <time className="mt-1 block text-[11px] text-emerald-400" dateTime={badge.award.awarded_at}>Earned {new Date(badge.award.awarded_at).toLocaleDateString()}</time>}</div></div>)}</div> : <p className="text-sm text-zinc-400">No active badge definitions are configured yet.</p>}
            </section>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2"><Link className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-emerald-700" href="/problems"><CheckCircle2 className="h-5 w-5 text-emerald-400"/><span><strong className="block">Solve a problem</strong><span className="text-xs text-zinc-400">Practice with the problem library</span></span></Link><Link className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-emerald-700" href="/courses"><BookOpen className="h-5 w-5 text-emerald-400"/><span><strong className="block">Continue learning</strong><span className="text-xs text-zinc-400">Explore guided courses</span></span></Link></nav>
        </>}
      </main>
      <Footer />
    </div>
  );
}
