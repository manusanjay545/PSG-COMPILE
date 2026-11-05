import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

const humanizeSlug = (slug: string) => slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let title = humanizeSlug(slug);
  let summary = "Practise this programming challenge with PSGCompile's online judge. Review the problem statement, write a solution, and check it against test cases.";
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("problems").select("title,description,difficulty").eq("slug", slug).eq("is_published", true).maybeSingle();
    if (data) {
      title = data.title;
      summary = `${data.description.slice(0, 145)} Solve this ${data.difficulty} coding problem on PSGCompile.`;
    }
  } catch {
    // Keep useful route-specific metadata available in local/offline development.
  }
  const description = summary.replace(/\s+/g, " ").trim().slice(0, 300);
  const url = `/problems/${encodeURIComponent(slug)}`;
  return {
    title: `${title} - Coding Problem`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | PSGCompile`, description, url },
  };
}

export default function ProblemSlugLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
