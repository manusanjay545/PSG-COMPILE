import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programming Courses for PSG Students",
  description: "Learn Python, C, C++, Java, SQL, and more with structured PSGCompile courses. Study theory, examples, and coding challenges chapter by chapter.",
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "Programming Courses | PSGCompile",
    description: "Step-by-step coding courses with lessons, examples, and chapter tests.",
    url: "/courses",
  },
};

export default function CoursesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
