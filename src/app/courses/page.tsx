"use client";

import * as React from "react";
import { BookOpen, Check, ChevronLeft, ChevronRight, Code2, GraduationCap, Play, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading-state";
import { COURSES } from "@/lib/courses/catalog";

const PROGRESS_KEY = "psgcompile.course-progress.v1";

export default function CoursesPage() {
  const [courseSlug, setCourseSlug] = React.useState(COURSES[0].slug);
  const [moduleIndex, setModuleIndex] = React.useState(0);
  const [lessonIndex, setLessonIndex] = React.useState(0);
  const [completed, setCompleted] = React.useState<string[]>([]);
  const [progressReady, setProgressReady] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "[]");
        if (Array.isArray(saved)) setCompleted(saved.filter((item): item is string => typeof item === "string"));
      } catch {
        setCompleted([]);
      }
      setProgressReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const course = COURSES.find((item) => item.slug === courseSlug) ?? COURSES[0];
  const currentModule = course.modules[moduleIndex] ?? course.modules[0];
  const topic = currentModule.topics[lessonIndex] ?? currentModule.topics[0];
  const lessons = course.modules.flatMap((item, chapter) => item.topics.map((name, step) => ({ key: `${course.slug}:${chapter}:${step}`, name, chapter, step })));
  const activeKey = `${course.slug}:${moduleIndex}:${lessonIndex}`;
  const completedCount = lessons.filter((item) => completed.includes(item.key)).length;
  const progressPercent = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  const chooseCourse = (slug: string) => {
    setCourseSlug(slug);
    setModuleIndex(0);
    setLessonIndex(0);
    window.history.replaceState(null, "", `/courses?course=${slug}`);
  };

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      const slug = new URLSearchParams(window.location.search).get("course");
      if (slug && COURSES.some((item) => item.slug === slug)) setCourseSlug(slug);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const selectLesson = (chapter: number, step: number) => {
    setModuleIndex(chapter);
    setLessonIndex(step);
  };

  const moveLesson = (direction: -1 | 1) => {
    const index = lessons.findIndex((item) => item.key === activeKey);
    const next = lessons[index + direction];
    if (next) selectLesson(next.chapter, next.step);
  };

  const toggleComplete = () => {
    const next = completed.includes(activeKey) ? completed.filter((item) => item !== activeKey) : [...completed, activeKey];
    setCompleted(next);
    try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch { /* Progress remains available until this page closes. */ }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-3xl border border-indigo-400/15 bg-gradient-to-br from-indigo-500/15 via-zinc-900 to-zinc-950 p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative max-w-3xl space-y-4">
            <Badge className="border border-indigo-300/20 bg-indigo-400/10 text-indigo-200"><GraduationCap className="mr-1.5 h-3.5 w-3.5" />Learn step by step</Badge>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Courses for builders.</h1>
            <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">Follow complete language paths from your first program to production-ready skills. Every course is split into small lessons, guided examples, and practice challenges.</p>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-400"><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">{COURSES.length} full courses</span><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">Beginner to advanced</span><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">Progress saved on this device</span></div>
          </div>
        </header>

        <section aria-labelledby="course-list-heading" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">Choose a path</p><h2 id="course-list-heading" className="mt-1 text-xl font-bold text-white">Programming courses</h2></div><span className="text-xs text-zinc-500">Python · C · C++ · Java · SQL · JavaScript · TypeScript · Go · Rust</span></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {COURSES.map((item) => {
              const count = item.modules.reduce((total, mod, chapter) => total + mod.topics.filter((_, step) => completed.includes(`${item.slug}:${chapter}:${step}`)).length, 0);
              const total = item.modules.reduce((sum, mod) => sum + mod.topics.length, 0);
              const active = item.slug === course.slug;
              return (
                <button key={item.slug} type="button" onClick={() => chooseCourse(item.slug)} aria-pressed={active} className={`group rounded-2xl border bg-gradient-to-br p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-400/40 ${item.accent} ${active ? "border-indigo-400/50 ring-1 ring-indigo-400/20" : "border-white/[0.08]"}`}>
                  <div className="flex items-start justify-between gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-zinc-950/60 text-indigo-200"><Code2 className="h-5 w-5" /></span><Badge variant="outline" className="border-white/10 bg-zinc-950/30 text-zinc-300">{item.badge}</Badge></div>
                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3><p className="mt-1 text-xs text-indigo-200/80">{item.level}</p><p className="mt-3 min-h-10 text-sm leading-5 text-zinc-300">{item.summary}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-400"><span>{item.modules.length} modules · {total} lessons</span><span>{count}/{total} complete</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/30"><div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${total ? (count / total) * 100 : 0}%` }} /></div>
                </button>
              );
            })}
          </div>
        </section>

        <section id="course" className="overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-900/55">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] bg-zinc-900/80 p-5 sm:p-7">
            <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-indigo-300/15 bg-indigo-400/10 text-indigo-200"><BookOpen className="h-6 w-6" /></span><div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-300">{course.level}</p><h2 className="mt-1 text-2xl font-black text-white">{course.title} full course</h2><p className="mt-1 text-sm text-zinc-400">{completedCount} of {lessons.length} lessons complete · {progressPercent}%</p></div></div>
            <div className="w-full max-w-xs"><div className="mb-2 flex justify-between text-[11px] text-zinc-500"><span>Your course progress</span><span>{progressPercent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all" style={{ width: `${progressPercent}%` }} /></div></div>
          </div>

          {!progressReady ? <div className="p-8"><LoadingIndicator label="Loading your learning progress…" /></div> : (
            <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
              <aside className="max-h-[70vh] overflow-y-auto border-b border-white/[0.07] p-3 lg:border-b-0 lg:border-r">
                <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">Course contents</p>
                <div className="space-y-2">
                  {course.modules.map((mod, chapter) => (
                    <section key={mod.title} className="rounded-xl border border-white/[0.06] bg-black/10 p-2">
                      <h3 className="px-2 py-2 text-xs font-semibold text-zinc-300"><span className="mr-2 text-indigo-300">{String(chapter + 1).padStart(2, "0")}</span>{mod.title}</h3>
                      <div className="space-y-0.5">{mod.topics.map((name, step) => {
                        const key = `${course.slug}:${chapter}:${step}`;
                        const selected = moduleIndex === chapter && lessonIndex === step;
                        return <button key={name} type="button" onClick={() => selectLesson(chapter, step)} aria-current={selected ? "step" : undefined} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${selected ? "bg-indigo-500/15 text-indigo-100" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"}`}><span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${completed.includes(key) ? "border-emerald-400 bg-emerald-400 text-zinc-950" : "border-zinc-700"}`}>{completed.includes(key) && <Check className="h-3 w-3" />}</span><span>{name}</span></button>;
                      })}</div>
                    </section>
                  ))}
                </div>
              </aside>

              <article className="min-w-0 p-5 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500"><span>Module {moduleIndex + 1}</span><ChevronRight className="h-3 w-3" /><span>{currentModule.title}</span><ChevronRight className="h-3 w-3" /><span className="text-indigo-300">Lesson {lessonIndex + 1}</span></div>
                <div className="mt-5 flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-300"><Play className="h-4 w-4 fill-current" /></span><div><h3 className="text-2xl font-bold text-white">{topic}</h3><p className="mt-1 text-xs text-zinc-500">{course.title} · {currentModule.title}</p></div></div>
                <div className="mt-6 rounded-2xl border border-white/[0.08] bg-zinc-950/70 p-5"><h4 className="flex items-center gap-2 text-sm font-bold text-white"><Sparkles className="h-4 w-4 text-amber-300" />Learn the concept</h4><p className="mt-3 text-sm leading-7 text-zinc-300">{currentModule.lesson}</p><p className="mt-3 text-sm leading-7 text-zinc-400">For this lesson, focus on <strong className="text-indigo-200">{topic}</strong>. Read the example, run it in the compiler, then change the input and predict the result before executing it again.</p></div>
                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0f12]"><div className="border-b border-white/[0.07] px-4 py-3 text-xs font-semibold text-zinc-300">Guided example</div><pre className="overflow-x-auto p-4 text-xs leading-6 text-emerald-200"><code>{currentModule.example}</code></pre><a href="/compiler" className="inline-flex items-center gap-1 px-4 pb-4 text-xs font-semibold text-indigo-300 hover:text-indigo-200">Try this in the compiler <ChevronRight className="h-3 w-3" /></a></div>
                  <div className="rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.06] p-4"><h4 className="text-sm font-bold text-white">Practice challenge</h4><p className="mt-2 text-sm leading-6 text-zinc-300">{currentModule.exercise}</p><p className="mt-4 text-xs leading-5 text-zinc-500">Work through the problem yourself. Test a normal case, an edge case, and invalid input where appropriate.</p></div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5">
                  <Button type="button" variant="outline" onClick={() => moveLesson(-1)} disabled={lessons.findIndex((item) => item.key === activeKey) === 0} className="border-zinc-700 text-zinc-300"><ChevronLeft className="mr-1 h-4 w-4" />Previous lesson</Button>
                  <Button type="button" onClick={toggleComplete} className={completed.includes(activeKey) ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-indigo-600 text-white hover:bg-indigo-500"}>{completed.includes(activeKey) ? <><Check className="mr-2 h-4 w-4" />Completed</> : "Mark complete"}</Button>
                  <Button type="button" variant="outline" onClick={() => moveLesson(1)} disabled={lessons.findIndex((item) => item.key === activeKey) === lessons.length - 1} className="border-zinc-700 text-zinc-300">Next lesson<ChevronRight className="ml-1 h-4 w-4" /></Button>
                </div>
              </article>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
