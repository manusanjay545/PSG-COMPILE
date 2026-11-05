import { CoursePlayer } from "@/components/courses/course-player";

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CoursePlayer slug={slug} />;
}
