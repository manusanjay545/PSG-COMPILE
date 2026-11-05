import { CompilerWorkspace } from "@/components/compiler/compiler-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Compiler for PSG Students | PSGCompile",
  description: "Online compiler for PSG students at PSG College of Technology. Run code in 60+ languages, solve problems, and learn with guided courses.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <CompilerWorkspace />;
}
