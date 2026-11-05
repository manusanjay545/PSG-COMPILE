import { CompilerWorkspace } from "@/components/compiler/compiler-workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Code Compiler - Run 60+ Programming Languages",
  description: "Write and run code online in 60+ languages with PSGCompile. Use the browser compiler before solving problems or learning a programming course.",
  alternates: { canonical: "/" },
};

export default function CompilerPage() {
  return <CompilerWorkspace />;
}
