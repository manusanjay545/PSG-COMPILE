"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Award, CheckCircle2, Flame } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ActivityHeatmap } from "@/components/profile/activity-heatmap";

type ProfileData = {
  profile: {
    id: string; username: string | null; full_name: string | null; avatar_url: string | null; bio: string | null;
    college_name: string | null; department_name: string | null; academic_year: string | null;
    batch_start_year: number | null; batch_end_year: number | null; problems_solved: number | null;
    current_streak: number | null; longest_streak: number | null;
  };
  badges: Array<{ id: string; name: string; description: string; icon: string; earned: boolean; award: { awarded_at: string } | null }>;
  activity: { months: Array<{ key: string; label: string; days: Array<{ date: string; count: number }> }> };
};

export default function UserProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;
  const [data, setData] = React.useState<ProfileData | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!username) return;
    let active = true;
    fetch(`/api/achievements?username=${encodeURIComponent(username)}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Could not load this profile.");
        return body as ProfileData;
      })
      .then((body) => { if (active) setData(body); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load this profile."); });
    return () => { active = false; };
  }, [username]);

  const profile = data?.profile;
  const yearLabel = profile?.batch_start_year && profile.batch_end_year
    ? profile.academic_year || ""
    : null;

  return <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100"><Navbar /><main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    {error ? <div role="alert" className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-300">{error}</div> : !data ? <div className="animate-pulse rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">Loading profile…</div> : <>
      <header className="flex flex-col gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 border border-emerald-700"><AvatarImage src={profile?.avatar_url || undefined} alt="" /><AvatarFallback className="bg-emerald-900 text-xl text-white">{profile?.full_name?.split(/\s+/).map((part) => part[0]).join("").slice(0, 2) || "?"}</AvatarFallback></Avatar>
        <div className="min-w-0 flex-1"><h1 className="text-2xl font-bold text-white">{profile?.full_name || "Student"}</h1><p className="text-sm text-zinc-400">@{profile?.username || username}</p>{profile?.bio && <p className="mt-2 max-w-2xl text-sm text-zinc-300">{profile.bio}</p>}<p className="mt-2 text-sm text-zinc-400">{[profile?.college_name, profile?.department_name, yearLabel, profile?.batch_start_year && profile?.batch_end_year ? `${profile.batch_start_year}–${profile.batch_end_year}` : null].filter(Boolean).join(" · ")}</p></div>
      </header>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3"><Metric icon={<CheckCircle2 className="h-4 w-4 text-emerald-400" />} label="Problems solved" value={profile?.problems_solved ?? 0} /><Metric icon={<Flame className="h-4 w-4 text-amber-400" />} label="Current streak" value={`${profile?.current_streak ?? 0} days`} /><Metric icon={<Award className="h-4 w-4 text-violet-400" />} label="Badges earned" value={data.badges.filter((badge) => badge.earned).length} /></section>
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5"><div><h2 className="text-lg font-semibold text-white">Activity by month</h2><p className="text-sm text-zinc-400">Daily submissions over the last 12 months.</p></div><ActivityHeatmap months={data.activity.months} /></section>
      <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5"><h2 className="text-lg font-semibold text-white">Achievements</h2>{data.badges.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{data.badges.map((badge) => <article key={badge.id} className={`flex gap-3 rounded-xl border p-4 ${badge.earned ? "border-emerald-800/70 bg-emerald-950/20" : "border-zinc-800 bg-zinc-950/50 opacity-60"}`}><span className="text-2xl" aria-hidden="true">{badge.icon}</span><div><h3 className="font-medium text-white">{badge.name}</h3><p className="mt-1 text-xs text-zinc-400">{badge.description}</p>{badge.award && <time className="mt-2 block text-xs text-emerald-400" dateTime={badge.award.awarded_at}>Earned {new Date(badge.award.awarded_at).toLocaleDateString()}</time>}</div></article>)}</div> : <p className="text-sm text-zinc-400">No active badges yet.</p>}</section>
    </>}
  </main><Footer /></div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"><div className="flex items-center justify-between text-xs text-zinc-400">{label}{icon}</div><div className="mt-2 text-xl font-bold text-white">{value}</div></div>;
}
