"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Code2, GraduationCap, Play, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/courses/catalog";

export default function CoursesPage() {
  const [completed, setCompleted] = React.useState<Record<string, number>>({});
  React.useEffect(() => {
    let active = true;
    fetch("/api/course-progress")
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!active || !data) return;
        const counts: Record<string, number> = {};
        for (const row of data.progress ?? []) counts[row.course_slug] = (counts[row.course_slug] ?? 0) + 1;
        setCompleted(counts);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/15 via-zinc-900 to-zinc-950 p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative max-w-3xl space-y-4">
            <Badge className="border border-indigo-300/20 bg-indigo-400/10 text-indigo-200"><GraduationCap className="mr-1.5 h-3.5 w-3.5" />Structured learning paths</Badge>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Courses for builders.</h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">Learn one chapter at a time. Each chapter teaches the theory, walks through an example, then checks your understanding with five multiple-choice questions and a coding test. Pass both to unlock the next chapter.</p>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-400"><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">{COURSES.length} courses</span><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">Lessons and tests in every chapter</span><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">Certificates on completion</span></div>
          </div>
        </header>

        <section aria-labelledby="course-list-heading" className="space-y-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Choose a path</p><h2 id="course-list-heading" className="mt-1 text-xl font-bold text-white">Programming courses</h2></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {COURSES.map((course) => {
              const done = Math.min(completed[course.slug] ?? 0, course.modules.length);
              const href = `/courses/${course.slug}`;
              return (
                <article key={course.slug} className={`flex flex-col rounded-2xl border bg-gradient-to-br p-5 ${course.accent} border-white/[0.08]`}>
                  <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-zinc-950/60 text-indigo-200"><Code2 className="h-5 w-5" /></span><Badge variant="outline" className="border-white/10 bg-zinc-950/30 text-zinc-300">{course.badge}</Badge></div>
                  <h3 className="mt-4 text-lg font-bold text-white">{course.title}</h3><p className="mt-1 text-xs text-indigo-200/80">{course.level}</p><p className="mt-3 min-h-10 flex-1 text-sm leading-5 text-zinc-300">{course.summary}</p>
                  <div className="mt-5 flex items-center justify-between text-xs text-zinc-400"><span><BookOpen className="mr-1 inline h-3.5 w-3.5" />{course.modules.length} chapters · 5 MCQs + code test each</span><span>{done}/{course.modules.length}</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/30"><div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${(done / course.modules.length) * 100}%` }} /></div>
                  <Button asChild className="mt-5 w-full bg-indigo-600 text-white hover:bg-indigo-500"><Link href={href}><Play className="mr-2 h-4 w-4 fill-current" />{done ? "Continue course" : "Start course"}</Link></Button>
                </article>
              );
            })}
          </div>
        </section>

        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.05] p-5 sm:flex-row sm:items-center"><div><p className="flex items-center gap-2 font-semibold text-white"><Sparkles className="h-4 w-4 text-emerald-300" />Your achievements</p><p className="mt-1 text-sm text-zinc-400">Certificates are issued to your account after you pass every chapter and are saved with your profile details.</p></div><Link href="/settings" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 hover:text-emerald-100"><CheckCircle2 className="h-4 w-4" />View profile certificates</Link></div>
      </main>
      <Footer />
    </div>
  );
}
