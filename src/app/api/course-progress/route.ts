import { NextRequest, NextResponse } from "next/server";
import { getCourseAssessment } from "@/lib/courses/assessments";
import { COURSES } from "@/lib/courses/catalog";
import { runTestCases } from "@/lib/judge/run-code";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 45;

export async function GET(request: NextRequest) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to load saved course progress." }, { status: 401 });
  const courseSlug = request.nextUrl.searchParams.get("course");
  const db = await createServiceClient();
  let progressQuery = db.from("course_chapter_progress").select("course_slug,chapter_index,mcq_score,coding_passed,completed_at").eq("user_id", user.id);
  let certificateQuery = db.from("course_certificates").select("course_slug,course_title,certificate_code,learner_name,roll_number,college_name,department_name,academic_year,issued_at").eq("user_id", user.id).order("issued_at", { ascending: false });
  if (courseSlug) { progressQuery = progressQuery.eq("course_slug", courseSlug); certificateQuery = certificateQuery.eq("course_slug", courseSlug); }
  const [progress, certificates] = await Promise.all([progressQuery, certificateQuery]);
  if (progress.error || certificates.error) return NextResponse.json({ error: "Could not load course progress." }, { status: 500 });
  return NextResponse.json({ progress: progress.data ?? [], certificates: certificates.data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to save course progress and earn certificates." }, { status: 401 });

  try {
    const body = await request.json();
    const courseSlug = typeof body.courseSlug === "string" ? body.courseSlug : "";
    const chapterIndex = Number(body.chapterIndex);
    const answers = Array.isArray(body.answers) ? body.answers : [];
    const code = typeof body.code === "string" ? body.code : "";
    const course = COURSES.find((item) => item.slug === courseSlug);
    const assessment = getCourseAssessment(courseSlug, chapterIndex);
    if (!course || !assessment || !Number.isInteger(chapterIndex)) return NextResponse.json({ error: "Course or chapter not found." }, { status: 404 });
    if (code.length > 50_000) return NextResponse.json({ error: "Code must be under 50 KB." }, { status: 413 });

    const db = await createServiceClient();
    const { data: completedRows, error: readError } = await db.from("course_chapter_progress").select("chapter_index").eq("user_id", user.id).eq("course_slug", courseSlug);
    if (readError) return NextResponse.json({ error: "Could not validate course progress." }, { status: 500 });
    const completed = new Set((completedRows ?? []).map((row) => row.chapter_index));
    if (completed.has(chapterIndex)) return NextResponse.json({ passed: true, alreadyCompleted: true, completedChapters: [...completed], certificate: await findCertificate(db, user.id, courseSlug) });
    const nextChapter = course.modules.findIndex((_, index) => !completed.has(index));
    if (chapterIndex !== nextChapter) return NextResponse.json({ error: "Complete chapters in order. Pass the previous test to unlock this one." }, { status: 409 });

    const mcqPassed = assessment.questions.length === 5 && answers.length === 5 && assessment.questions.every((question, index) => Number(answers[index]) === question.answer);
    if (!mcqPassed) return NextResponse.json({ passed: false, mcqPassed: false, error: "Answer all five questions correctly before the coding checkpoint." }, { status: 200 });
    if (!code.trim()) return NextResponse.json({ passed: false, mcqPassed: true, error: "Write and submit your coding solution to finish this chapter." }, { status: 200 });

    const result = await runTestCases(course.language, code, assessment.codingTest.cases);
    const codingPassed = result.verdict === "accepted" && result.passedCount === result.totalCount;
    if (!codingPassed) return NextResponse.json({ passed: false, mcqPassed: true, codingPassed: false, codingResult: { verdict: result.verdict, passedCount: result.passedCount, totalCount: result.totalCount, compileError: result.compileError }, error: "The coding checks did not all pass. Review your output and try again." }, { status: 200 });

    const { error: insertError } = await db.from("course_chapter_progress").insert({ user_id: user.id, course_slug: courseSlug, chapter_index: chapterIndex, mcq_score: 5, coding_passed: true });
    if (insertError) return NextResponse.json({ error: "Your chapter passed, but we could not save progress. Please retry." }, { status: 500 });
    completed.add(chapterIndex);

    let certificate = null;
    if (completed.size === course.modules.length) {
      certificate = await findCertificate(db, user.id, courseSlug);
      if (!certificate) {
        const { data: profile } = await db.from("profiles").select("full_name,roll_number,college_name,department_name,academic_year").eq("id", user.id).maybeSingle();
        const learnerName = profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "PSGCompile Learner";
        const { data: issued, error: issueError } = await db.from("course_certificates").insert({
          user_id: user.id, course_slug: course.slug, course_title: course.title, learner_name: learnerName,
          roll_number: profile?.roll_number ?? null, college_name: profile?.college_name ?? null,
          department_name: profile?.department_name ?? null, academic_year: profile?.academic_year ?? null,
        }).select("course_slug,course_title,certificate_code,learner_name,roll_number,college_name,department_name,academic_year,issued_at").single();
        if (issueError) return NextResponse.json({ error: "Course completed, but certificate issuance failed. Contact support with your profile." }, { status: 500 });
        certificate = issued;
      }
    }
    return NextResponse.json({ passed: true, mcqScore: 5, codingPassed: true, completedChapters: [...completed].sort((a, b) => a - b), courseComplete: completed.size === course.modules.length, certificate });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Course test could not be checked.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

async function findCertificate(db: Awaited<ReturnType<typeof createServiceClient>>, userId: string, courseSlug: string) {
  const { data } = await db.from("course_certificates").select("course_slug,course_title,certificate_code,learner_name,roll_number,college_name,department_name,academic_year,issued_at").eq("user_id", userId).eq("course_slug", courseSlug).maybeSingle();
  return data ?? null;
}
