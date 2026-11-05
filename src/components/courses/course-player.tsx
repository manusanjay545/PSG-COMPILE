"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Check, CheckCircle2, ClipboardCheck, Code2, Download, ExternalLink, Lightbulb, LoaderCircle, LockKeyhole, PartyPopper, Share2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading-state";
import { Textarea } from "@/components/ui/textarea";
import { COURSES } from "@/lib/courses/catalog";

type Question = { question: string; options: string[] };
type Assessment = { questions: Question[]; codingTest: { prompt: string; inputFormat: string; outputFormat: string; starterCode: string } };
type RevealedAnswer = { answer: number; correctAnswer: string; explanation: string };
type Certificate = { course_slug: string; course_title: string; certificate_code: string; learner_name: string; roll_number: string | null; college_name: string | null; department_name: string | null; academic_year: string | null; issued_at: string };

function certificateText(certificate: Certificate) {
  return ["PSGCompile Course Certificate", certificate.course_title, `Awarded to ${certificate.learner_name}`, certificate.roll_number && `Roll No. ${certificate.roll_number}`, certificate.college_name, certificate.department_name, certificate.academic_year && `Academic year ${certificate.academic_year}`, `Certificate ID ${certificate.certificate_code}`].filter(Boolean).join(" · ");
}

async function certificatePng(certificate: Certificate) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600; canvas.height = 1100;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create the certificate image.");
  const gradient = ctx.createLinearGradient(0, 0, 1600, 1100);
  gradient.addColorStop(0, "#101127"); gradient.addColorStop(1, "#1d1640");
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1600, 1100);
  ctx.strokeStyle = "#a5b4fc"; ctx.lineWidth = 8; ctx.strokeRect(42, 42, 1516, 1016);
  ctx.strokeStyle = "rgba(165,180,252,.32)"; ctx.lineWidth = 2; ctx.strokeRect(62, 62, 1476, 976);
  try {
    const logo = new window.Image(); logo.src = "/favicon.png"; await logo.decode(); ctx.drawImage(logo, 130, 116, 110, 110);
  } catch { /* Keep the certificate legible if the logo image is unavailable. */ }
  ctx.textAlign = "left"; ctx.fillStyle = "#c7d2fe"; ctx.font = "600 35px Arial"; ctx.fillText("PSGCompile  ·  CODE. COMPETE. CLIMB.", 270, 180);
  ctx.textAlign = "center"; ctx.fillStyle = "#f8fafc"; ctx.font = "700 70px Georgia"; ctx.fillText("CERTIFICATE OF COMPLETION", 800, 360);
  ctx.fillStyle = "#a5b4fc"; ctx.font = "32px Arial"; ctx.fillText("This certifies that", 800, 450);
  ctx.fillStyle = "#ffffff"; ctx.font = "italic 68px Georgia"; ctx.fillText(certificate.learner_name || "PSGCompile Learner", 800, 555);
  ctx.fillStyle = "#cbd5e1"; ctx.font = "30px Arial"; ctx.fillText("has successfully completed the full course", 800, 635);
  ctx.fillStyle = "#c4b5fd"; ctx.font = "700 54px Arial"; ctx.fillText(certificate.course_title, 800, 720);
  ctx.fillStyle = "#cbd5e1"; ctx.font = "24px Arial";
  const details = [certificate.roll_number && `Roll No. ${certificate.roll_number}`, certificate.college_name, certificate.department_name, certificate.academic_year && `Academic year ${certificate.academic_year}`].filter(Boolean).join("   ·   ");
  if (details) ctx.fillText(details, 800, 800, 1300);
  ctx.fillStyle = "#94a3b8"; ctx.font = "20px Arial"; ctx.fillText(`Issued ${new Date(certificate.issued_at).toLocaleDateString()}   ·   Certificate ${certificate.certificate_code}`, 800, 930);
  ctx.fillStyle = "#a5b4fc"; ctx.font = "24px Arial"; ctx.fillText("PSGCompile Learning Academy", 800, 990);
  return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Could not export certificate.")), "image/png"));
}

export function CoursePlayer({ slug }: { slug: string }) {
  const course = COURSES.find((item) => item.slug === slug);
  const [completed, setCompleted] = React.useState<number[]>([]);
  const [chapter, setChapter] = React.useState(0);
  const [assessment, setAssessment] = React.useState<Assessment | null>(null);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [revealedAnswers, setRevealedAnswers] = React.useState<Record<number, RevealedAnswer>>({});
  const [codeSolution, setCodeSolution] = React.useState<string | null>(null);
  const [revealing, setRevealing] = React.useState("");
  const [code, setCode] = React.useState("");
  const [certificate, setCertificate] = React.useState<Certificate | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [showCertificate, setShowCertificate] = React.useState(false);
  const [assessmentRetry, setAssessmentRetry] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    fetch(`/api/course-progress?course=${encodeURIComponent(slug)}`)
      .then(async (response) => {
        const data = await response.json();
        if (response.status === 401) throw new Error("Sign in to take tests, save progress, and earn a certificate.");
        if (!response.ok) throw new Error(data.error || "Could not load course progress.");
        return data;
      })
      .then((data) => {
        if (!active) return;
        const indexes = (data.progress ?? []).map((row: { chapter_index: number }) => row.chapter_index).sort((a: number, b: number) => a - b);
        setCompleted(indexes); setCertificate(data.certificates?.[0] ?? null); setIsSignedIn(true);
        setChapter(indexes.length === course?.modules.length ? Math.max(0, indexes.length - 1) : indexes.length);
      })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : "Could not load course progress."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug, course?.modules.length]);

  React.useEffect(() => {
    if (!course || !isSignedIn || chapter >= course.modules.length || completed.includes(chapter)) return;
    let active = true;
    fetch(`/api/course-assessment?course=${encodeURIComponent(slug)}&chapter=${chapter}`)
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not load the chapter test."); return data; })
      .then((data) => { if (active) { setAssessment(data); setCode(data.codingTest.starterCode); } })
      .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : "Could not load the chapter test."); });
    return () => { active = false; };
  }, [course, slug, chapter, completed, isSignedIn, assessmentRetry]);

  if (!course) return <main className="grid min-h-screen place-items-center bg-zinc-950 text-zinc-100"><div className="text-center"><p className="text-xl font-bold">Course not found</p><Button asChild className="mt-4"><Link href="/courses">Browse courses</Link></Button></div></main>;

  const chapterModule = course.modules[chapter];
  const courseComplete = completed.length === course.modules.length;
  const assessmentPending = isSignedIn && !assessment && !error && !completed.includes(chapter);
  const onAnswer = (question: number, option: number) => setAnswers((current) => { const next = [...current]; next[question] = option; return next; });
  const selectChapter = (index: number) => { setChapter(index); setAssessment(null); setAnswers([]); setRevealedAnswers({}); setCodeSolution(null); setError(""); setNotice(""); };

  const revealMcq = async (questionIndex: number) => {
    const key = `mcq-${questionIndex}`;
    setRevealing(key); setError("");
    try {
      const response = await fetch(`/api/course-assessment?course=${encodeURIComponent(slug)}&chapter=${chapter}&reveal=mcq&question=${questionIndex}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not show the answer.");
      setRevealedAnswers((current) => ({ ...current, [questionIndex]: data }));
    } catch (revealError) { setError(revealError instanceof Error ? revealError.message : "Could not show the answer."); }
    finally { setRevealing(""); }
  };

  const revealCodingSolution = async () => {
    setRevealing("code"); setError("");
    try {
      const response = await fetch(`/api/course-assessment?course=${encodeURIComponent(slug)}&chapter=${chapter}&reveal=code`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not show the coding solution.");
      setCodeSolution(data.solution);
    } catch (revealError) { setError(revealError instanceof Error ? revealError.message : "Could not show the coding solution."); }
    finally { setRevealing(""); }
  };

  const submitTest = async () => {
    setSubmitting(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/course-progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseSlug: slug, chapterIndex: chapter, answers, code }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit your chapter test.");
      if (!data.passed) {
        const result = data.codingResult as { verdict?: string; passedCount?: number; totalCount?: number; compileError?: string } | undefined;
        const details = result ? ` Code check: ${result.passedCount ?? 0}/${result.totalCount ?? 0} passed (${result.verdict ?? "not accepted"}).${result.compileError ? ` ${String(result.compileError).slice(0, 500)}` : ""}` : "";
        setError(`${data.error || "The test did not pass. Review and retry."}${details}`);
        return;
      }
      setCompleted(data.completedChapters ?? [...completed, chapter]);
      if (data.certificate) { setCertificate(data.certificate); setShowCertificate(true); }
      else { setNotice("Chapter passed! The next chapter is now unlocked."); setAssessment(null); setAnswers([]); setRevealedAnswers({}); setCodeSolution(null); setChapter((value) => Math.min(value + 1, course.modules.length - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Could not submit your chapter test."); }
    finally { setSubmitting(false); }
  };

  const saveCertificate = async () => {
    if (!certificate) return;
    const blob = await certificatePng(certificate);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `PSGCompile-${course.slug}-certificate.png`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const shareCertificate = async () => {
    if (!certificate) return;
    const text = certificateText(certificate);
    try {
      const blob = await certificatePng(certificate);
      const file = new File([blob], `PSGCompile-${course.slug}-certificate.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] }) && navigator.share) await navigator.share({ title: `${course.title} certificate`, text, files: [file] });
      else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    } catch { window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer"); }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3"><Button asChild variant="ghost" className="text-zinc-400 hover:text-white"><Link href="/courses"><ArrowLeft className="mr-2 h-4 w-4" />All courses</Link></Button><Badge className="border border-indigo-400/20 bg-indigo-400/10 text-indigo-200">{completed.length} / {course.modules.length} chapters passed</Badge></div>
        <header className={`rounded-3xl border border-white/10 bg-gradient-to-br ${course.accent} p-6 sm:p-8`}><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">{course.level}</p><h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">{course.title} course</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">{course.summary} Complete every chapter&apos;s theory and example, then pass all five MCQs and the coding checkpoint to continue.</p></header>
        {!isSignedIn && !loading && <div className="flex flex-col gap-3 rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-amber-100">{error}</p><Button asChild className="bg-indigo-600 text-white"><Link href="/login">Sign in to start</Link></Button></div>}
        {loading ? <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-10"><LoadingIndicator label="Loading your course…" /></div> : isSignedIn && (
          <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="h-fit rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-3 lg:sticky lg:top-20">
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">Chapters · complete in order</p>
              <nav className="max-h-[62vh] space-y-1 overflow-y-auto" aria-label={`${course.title} chapters`}>
                {course.modules.map((item, index) => {
                  const locked = index > completed.length;
                  const passed = completed.includes(index);
                  return <button key={item.title} type="button" disabled={locked} onClick={() => selectChapter(index)} aria-current={chapter === index ? "step" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${chapter === index ? "bg-indigo-500/15 text-white" : locked ? "cursor-not-allowed text-zinc-600" : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] ${passed ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : chapter === index ? "border-indigo-300/40 bg-indigo-400/15 text-indigo-200" : "border-zinc-700"}`}>{passed ? <Check className="h-4 w-4" /> : locked ? <LockKeyhole className="h-3.5 w-3.5" /> : index + 1}</span><span className="min-w-0"><span className="block text-xs font-semibold">{item.title}</span><span className="mt-1 block text-[10px] text-zinc-500">{item.topics.length} steps · 5 MCQs + code</span></span></button>;
                })}
              </nav>
            </aside>

            <section className="min-w-0 space-y-5">
              {courseComplete ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-6"><div className="flex items-start gap-3"><Award className="mt-1 h-6 w-6 text-emerald-300" /><div><h2 className="text-xl font-bold text-white">Course completed</h2><p className="mt-1 text-sm text-zinc-300">You passed every chapter. Your certificate is saved with your profile.</p>{certificate && <Button type="button" onClick={() => setShowCertificate(true)} className="mt-4 bg-emerald-600 text-white hover:bg-emerald-500">View certificate</Button>}</div></div></div> : <>
                <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-5 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Chapter {chapter + 1} · step-by-step lesson</p><h2 className="mt-2 text-2xl font-bold text-white">{chapterModule.title}</h2></div><Badge variant="outline" className="border-white/10 text-zinc-400">{chapterModule.topics.length} learning steps</Badge></div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">{chapterModule.topics.map((topic, index) => <div key={topic} className="flex gap-3 rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-indigo-400/10 text-xs font-bold text-indigo-200">{index + 1}</span><span className="text-sm font-medium text-zinc-200">{topic}</span></div>)}</div>
                  <div className="mt-5 rounded-xl border border-indigo-400/10 bg-indigo-500/[0.05] p-4"><h3 className="text-sm font-bold text-white">Theory</h3><p className="mt-2 text-sm leading-7 text-zinc-300">{chapterModule.lesson}</p><p className="mt-3 text-sm leading-7 text-zinc-400">Work through the steps above in order. For each concept, describe what it does, identify when you would use it, and check its behavior with both typical and edge-case input.</p></div>
                  <div className="mt-4 grid gap-4 xl:grid-cols-2"><div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0f12]"><div className="border-b border-white/[0.07] px-4 py-3 text-xs font-semibold text-zinc-300">Guided example</div><pre className="max-h-80 overflow-auto p-4 text-xs leading-6 text-emerald-200"><code>{chapterModule.example}</code></pre></div><div className="rounded-xl border border-amber-400/10 bg-amber-500/[0.04] p-4"><h3 className="text-sm font-bold text-white">Try it yourself</h3><p className="mt-2 text-sm leading-6 text-zinc-300">{chapterModule.exercise}</p><p className="mt-4 text-xs leading-5 text-zinc-500">Run your code, check the result, then change one input and predict what should happen.</p></div></div>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-zinc-900/50 p-5 sm:p-7">
                  <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/15 text-indigo-200"><ClipboardCheck className="h-4 w-4" /></span><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Chapter checkpoint</p><h2 className="text-xl font-bold text-white">Pass the test to unlock the next chapter</h2></div></div>
                  {assessmentPending ? <div className="mt-6"><LoadingIndicator label="Preparing your chapter test…" /></div> : completed.includes(chapter) ? <p className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-500/[0.06] p-4 text-sm text-emerald-200"><CheckCircle2 className="h-5 w-5" />This chapter is passed. Select the next unlocked chapter to continue.</p> : error && !assessment ? <div role="alert" className="mt-5 rounded-xl border border-rose-400/15 bg-rose-500/[0.06] p-4"><p className="text-sm text-rose-200">{error}</p><Button type="button" variant="outline" onClick={() => { setError(""); setAssessmentRetry((value) => value + 1); }} className="mt-3 border-white/15 text-zinc-100">Retry loading test</Button></div> : assessment && <>
                    <div className="mt-6 space-y-5">{assessment.questions.map((question, questionIndex) => { const revealed = revealedAnswers[questionIndex]; return <fieldset key={question.question} className="rounded-xl border border-white/[0.07] bg-zinc-950/50 p-4"><legend className="max-w-full px-1 text-sm font-semibold leading-6 text-white"><span className="mr-2 text-indigo-300">{questionIndex + 1}.</span>{question.question}</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option, optionIndex) => <label key={option} className={`flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-xs leading-5 transition ${revealed?.answer === optionIndex ? "border-emerald-400/35 bg-emerald-500/[0.08] text-emerald-100" : answers[questionIndex] === optionIndex ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-100" : "border-white/[0.06] text-zinc-400 hover:border-white/15"}`}><input type="radio" name={`question-${questionIndex}`} className="mt-1 accent-indigo-400" checked={answers[questionIndex] === optionIndex} onChange={() => onAnswer(questionIndex, optionIndex)} /><span>{option}</span></label>)}</div><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><Button type="button" size="sm" variant="outline" onClick={() => void revealMcq(questionIndex)} disabled={revealing === `mcq-${questionIndex}`} className="border-indigo-300/20 text-indigo-200 hover:bg-indigo-500/10">{revealed ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : <Lightbulb className="mr-1.5 h-3.5 w-3.5" />}{revealed ? "Answer shown" : revealing === `mcq-${questionIndex}` ? "Loading answer…" : "Show correct answer"}</Button>{revealed && <p className="text-xs leading-5 text-emerald-200">{revealed.explanation}</p>}</div></fieldset>; })}</div>
                    <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#0d0f12] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-bold text-white">Coding test</h3><p className="mt-1 text-sm text-zinc-300">{assessment.codingTest.prompt}</p></div><div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-white/10 text-zinc-400">{course.title}</Badge><Button type="button" size="sm" variant="outline" onClick={() => void revealCodingSolution()} disabled={revealing === "code"} className="border-indigo-300/20 text-indigo-200 hover:bg-indigo-500/10">{codeSolution ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : <Code2 className="mr-1.5 h-3.5 w-3.5" />}{codeSolution ? "Solution shown" : revealing === "code" ? "Loading solution…" : "Show code solution"}</Button></div></div><div className="mt-3 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2"><p><strong className="text-zinc-300">Input:</strong> {assessment.codingTest.inputFormat}</p><p><strong className="text-zinc-300">Output:</strong> {assessment.codingTest.outputFormat}</p></div>{codeSolution && <div className="mt-4 overflow-hidden rounded-lg border border-emerald-300/15 bg-emerald-500/[0.04]"><p className="border-b border-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-200">Reference solution · {course.title}</p><pre className="max-h-80 overflow-auto p-4 text-xs leading-5 text-emerald-100"><code>{codeSolution}</code></pre></div>}<Textarea aria-label="Your coding test solution" value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} className="mt-4 min-h-64 resize-y border-white/[0.08] bg-black/40 font-mono text-xs leading-5 text-emerald-100" />
                      {error && <p role="alert" className="mt-3 rounded-lg border border-rose-400/15 bg-rose-500/[0.06] p-3 text-sm text-rose-200">{error}</p>}{notice && <p role="status" className="mt-3 rounded-lg border border-emerald-400/15 bg-emerald-500/[0.06] p-3 text-sm text-emerald-200">{notice}</p>}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-zinc-500">Answer all five questions and pass every hidden code check.</p><Button type="button" onClick={submitTest} disabled={submitting || assessmentPending || Array.from({ length: 5 }, (_, index) => answers[index]).some((answer) => !Number.isInteger(answer))} className="bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50">{submitting ? <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Checking your test…</> : <><CheckCircle2 className="mr-2 h-4 w-4" />Submit chapter test</>}</Button></div>
                    </div>
                  </>}
                </div>
              </>}
              {courseComplete && !certificate && <p className="text-sm text-amber-200">Your certificate is being prepared. Refresh this page in a moment.</p>}
            </section>
          </div>
        )}
      </main>
      <Footer />

      {showCertificate && certificate && <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="certificate-title"><div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-indigo-300/25 bg-gradient-to-br from-[#13142b] via-[#1c1738] to-[#151126] p-5 shadow-2xl shadow-indigo-950/60 sm:p-9"><div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">{Array.from({ length: 20 }, (_, index) => <span key={index} className="absolute h-2 w-2 animate-bounce rounded-sm" style={{ left: `${(index * 37) % 100}%`, top: `${(index * 23) % 86}%`, backgroundColor: ["#fbbf24", "#a5b4fc", "#34d399", "#f472b6"][index % 4], animationDelay: `${(index % 7) * 120}ms`, animationDuration: `${1.4 + (index % 5) * 0.2}s`, opacity: 0.75 }} />)}</div><div className="relative text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-300/20"><PartyPopper className="h-7 w-7 animate-pulse" /></div><p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-indigo-200">Course completed</p><h2 id="certificate-title" className="mt-2 text-2xl font-black text-white sm:text-4xl">Congratulations, {certificate.learner_name}!</h2><p className="mt-2 text-sm text-zinc-300">You passed every chapter and earned your certificate.</p><div className="mt-6 rounded-2xl border border-indigo-200/25 bg-white/[0.04] p-5 sm:p-8"><div className="flex items-center justify-center gap-3"><Image src="/favicon.png" alt="PSGCompile logo" width={40} height={40} className="rounded-lg bg-white object-contain p-0.5" /><p className="text-xs font-bold tracking-[0.18em] text-indigo-100">PSGCompile · LEARNING ACADEMY</p></div><p className="mt-6 text-[10px] font-bold tracking-[0.35em] text-indigo-200">CERTIFICATE OF COMPLETION</p><h3 className="mt-5 text-xl font-semibold text-zinc-300">This certificate is awarded to</h3><p className="mt-2 text-3xl font-black text-white sm:text-4xl">{certificate.learner_name}</p><p className="mt-4 text-sm text-zinc-300">for successfully completing the full course</p><p className="mt-1 text-2xl font-bold text-violet-200">{certificate.course_title}</p><p className="mt-4 text-xs leading-6 text-zinc-400">{[certificate.roll_number && `Roll No. ${certificate.roll_number}`, certificate.college_name, certificate.department_name, certificate.academic_year && `Year ${certificate.academic_year}`].filter(Boolean).join(" · ")}</p><p className="mt-4 text-[10px] text-zinc-500">Issued {new Date(certificate.issued_at).toLocaleDateString()} · ID {certificate.certificate_code}</p></div><div className="mt-5 flex flex-wrap justify-center gap-2"><Button onClick={shareCertificate} className="bg-indigo-600 text-white hover:bg-indigo-500"><Share2 className="mr-2 h-4 w-4" />Share</Button><Button onClick={() => void saveCertificate()} variant="outline" className="border-white/15 text-zinc-200"><Download className="mr-2 h-4 w-4" />Save PNG</Button><Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(certificateText(certificate))}`, "_blank", "noopener,noreferrer")} variant="outline" className="border-white/15 text-zinc-200"><ExternalLink className="mr-2 h-4 w-4" />WhatsApp</Button><Button onClick={() => setShowCertificate(false)} variant="ghost" className="text-zinc-400">Close</Button></div><p className="mt-3 text-center text-[10px] text-zinc-500">Share opens your device&apos;s share sheet for apps such as Instagram and WhatsApp.</p></div></div></div>}
    </div>
  );
}
