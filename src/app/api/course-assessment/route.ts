import { NextRequest, NextResponse } from "next/server";
import { getCourseAssessment } from "@/lib/courses/assessments";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const courseSlug = request.nextUrl.searchParams.get("course") || "";
  const chapterIndex = Number(request.nextUrl.searchParams.get("chapter"));
  if (!Number.isInteger(chapterIndex) || chapterIndex < 0) return NextResponse.json({ error: "Choose a valid chapter." }, { status: 400 });
  const assessment = getCourseAssessment(courseSlug, chapterIndex);
  if (!assessment) return NextResponse.json({ error: "Course or chapter not found." }, { status: 404 });

  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to take chapter tests and save your course progress." }, { status: 401 });

  const db = await createServiceClient();
  const { data: rows, error } = await db.from("course_chapter_progress").select("chapter_index").eq("user_id", user.id).eq("course_slug", courseSlug);
  if (error) return NextResponse.json({ error: "Could not load your course progress." }, { status: 500 });
  const completed = new Set((rows ?? []).map((row) => row.chapter_index));
  const nextChapter = assessment.course.modules.findIndex((_, index) => !completed.has(index));
  const unlockedChapter = nextChapter === -1 ? assessment.course.modules.length - 1 : nextChapter;
  if (chapterIndex > unlockedChapter) return NextResponse.json({ error: "Complete the previous chapter test first." }, { status: 403 });

  const reveal = request.nextUrl.searchParams.get("reveal");
  if (reveal === "mcq") {
    const questionIndex = Number(request.nextUrl.searchParams.get("question"));
    const question = assessment.questions[questionIndex];
    if (!Number.isInteger(questionIndex) || !question) return NextResponse.json({ error: "Choose a valid question." }, { status: 400 });
    return NextResponse.json({ answer: question.answer, correctAnswer: question.options[question.answer], explanation: question.explanation });
  }
  if (reveal === "code") return NextResponse.json({ solution: assessment.solution });

  return NextResponse.json({
    questions: assessment.questions.map(({ question, options }) => ({ question, options })),
    codingTest: { prompt: assessment.codingTest.prompt, inputFormat: assessment.codingTest.inputFormat, outputFormat: assessment.codingTest.outputFormat, starterCode: assessment.codingTest.starterCode },
  });
}
