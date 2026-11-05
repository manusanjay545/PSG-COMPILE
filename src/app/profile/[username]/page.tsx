"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Code2,
  Trophy,
  Flame,
  Award,
  BarChart3,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
  Link2,
  Globe,
  Share2,
  UserPlus,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  MOCK_CURRENT_USER,
  MOCK_BADGES,
  MOCK_PROBLEMS,
} from "@/lib/data/mock-data";

function UserProfilePageContent() {
  const params = useParams();
  const username = (params?.username as string) || "manu";

  const user = MOCK_CURRENT_USER;
  const [isFollowing, setIsFollowing] = React.useState(false);

  // Generate 90-day activity heatmap
  const activityDays = React.useMemo(() => {
    const days = [];
    for (let i = 0; i < 90; i++) {
      days.push(Math.random() > 0.35 ? Math.floor(Math.random() * 4) + 1 : 0);
    }
    return days;
  }, []);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? `Unfollowed @${username}` : `Following @${username}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Profile Header Hero Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-indigo-500/50 shadow-lg">
                <AvatarFallback className="bg-indigo-600 text-2xl font-extrabold text-white">
                  {user.full_name?.split(" ").map((n) => n[0]).join("") || "MS"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                    {user.full_name}
                  </h1>
                  <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
                    {user.rating_tier.toUpperCase()} ({user.rating})
                  </Badge>
                </div>
                <div className="text-sm text-zinc-400 font-mono">@{username}</div>

                {/* Institutional Identity Callout */}
                <div className="pt-1 flex flex-col gap-0.5 text-xs text-zinc-300 font-medium">
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                    {user.institution?.name}
                  </span>
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                    {user.program?.name} · {user.batch?.label} · Section {user.section_id?.slice(-1) || "A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Follow & Share */}
            <div className="flex items-center gap-3 self-stretch md:self-auto">
              <Button
                variant={isFollowing ? "outline" : "default"}
                onClick={handleFollowToggle}
                className={`flex-1 md:flex-initial text-xs gap-1.5 ${
                  isFollowing
                    ? "border-zinc-700 text-zinc-300"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" />
                    Follow Coder
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Profile URL copied to clipboard!");
                }}
                className="border-zinc-800 text-zinc-400 hover:text-white"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl pt-2 border-t border-zinc-800/80">
            {user.bio}
          </p>

          {/* Institutional Rank Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800 text-center">
            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Overall PSG Rank</div>
              <div className="text-xl font-extrabold text-amber-400 font-mono">#{user.psg_rank}</div>
            </div>
            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">College Rank</div>
              <div className="text-xl font-extrabold text-indigo-400 font-mono">#{user.institution_rank}</div>
            </div>
            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Department Rank</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">#{user.department_rank}</div>
            </div>
            <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Batch Rank</div>
              <div className="text-xl font-extrabold text-cyan-400 font-mono">#{user.batch_rank}</div>
            </div>
          </div>
        </div>

        {/* 2-Column Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress & Difficulty Breakdown */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Problem Solved Progress</h3>
                <span className="text-xs text-zinc-400 font-mono">{user.problems_solved} / 350 Solved</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-400 font-medium">Easy ({user.easy_solved}/150)</span>
                    <span className="text-zinc-500 font-mono">{Math.round((user.easy_solved / 150) * 100)}%</span>
                  </div>
                  <Progress value={(user.easy_solved / 150) * 100} indicatorClassName="bg-emerald-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-400 font-medium">Medium ({user.medium_solved}/150)</span>
                    <span className="text-zinc-500 font-mono">{Math.round((user.medium_solved / 150) * 100)}%</span>
                  </div>
                  <Progress value={(user.medium_solved / 150) * 100} indicatorClassName="bg-amber-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400 font-medium">Hard ({user.hard_solved}/50)</span>
                    <span className="text-zinc-500 font-mono">{Math.round((user.hard_solved / 50) * 100)}%</span>
                  </div>
                  <Progress value={(user.hard_solved / 50) * 100} indicatorClassName="bg-red-500" />
                </div>
              </div>
            </Card>

            {/* Activity Heatmap */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Contribution Heatmap</h3>
                <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  {user.current_streak} Day Streak
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {activityDays.map((val, idx) => (
                  <div
                    key={idx}
                    className={`h-3.5 w-3.5 rounded-xs ${
                      val === 0
                        ? "bg-zinc-800/80"
                        : val === 1
                        ? "bg-indigo-950 border border-indigo-800"
                        : val === 2
                        ? "bg-indigo-700"
                        : "bg-indigo-500"
                    }`}
                  />
                ))}
              </div>
            </Card>

            {/* Recent Submissions */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Recent Accepted Submissions</h3>
              <div className="divide-y divide-zinc-800/80">
                {MOCK_PROBLEMS.slice(0, 4).map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <Link href={`/problems/${p.slug}`} className="font-semibold text-white hover:text-indigo-400">
                        {p.title}
                      </Link>
                      <div className="text-[10px] text-zinc-500">Language: Python 3 · 24ms runtime</div>
                    </div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-[10px]">
                      ACCEPTED
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar (1 Col) */}
          <div className="space-y-8">
            {/* Badges Earned */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Badges Earned ({MOCK_BADGES.length})
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {MOCK_BADGES.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 text-center space-y-1"
                  >
                    <div className="text-2xl">{b.icon}</div>
                    <div className="text-xs font-semibold text-white">{b.name}</div>
                    <p className="text-[10px] text-zinc-500 line-clamp-1">{b.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills & Tags */}
            <Card className="border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Skills & Competencies</h3>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((skill, i) => (
                  <Badge key={i} variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-300 text-xs py-1">
                    {skill}
                  </Badge>
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

export default function UserProfilePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-xs text-zinc-500">Loading PSG Coder Profile...</div>}>
      <UserProfilePageContent />
    </React.Suspense>
  );
}
