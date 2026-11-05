import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coding Problems & Online Judge for PSG Students",
  description: "Practise programming with PSGCompile coding problems. Filter by difficulty and topic, write solutions in the online editor, and check your results.",
  openGraph: {
    title: "Coding Problems | PSGCompile",
    description: "Browse programming practice problems by topic and difficulty, then submit code to the online judge.",
    url: "/problems",
  },
};

export default function ProblemsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
