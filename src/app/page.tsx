import { CompilerWorkspace } from "@/components/compiler/compiler-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PSGCompile | Free Online Compiler & Coding Practice",
  description: "Use PSGCompile to compile code online, practise programming problems, and learn with step-by-step courses. An independent coding platform for PSG College of Technology and PSG community students.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <CompilerWorkspace />;
}
