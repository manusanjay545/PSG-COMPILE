import type { Metadata } from "next";
import { COURSES } from "@/lib/courses/catalog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = COURSES.find((item) => item.slug === slug);
  if (!course) return { title: "Programming Course", robots: { index: false, follow: false } };
  const title = `${course.title} Course for Beginners and Beyond`;
  const description = `${course.summary} Study ${course.language} with lessons, worked examples, MCQs, and coding challenges on PSGCompile.`;
  return {
    title,
    description,
    alternates: { canonical: `/courses/${encodeURIComponent(course.slug)}` },
    openGraph: { title: `${title} | PSGCompile`, description, url: `/courses/${encodeURIComponent(course.slug)}` },
  };
}

export default function CourseSlugLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
