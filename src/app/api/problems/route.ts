import { NextRequest, NextResponse } from "next/server";
import { getProblemBank } from "@/lib/problems/catalog.mjs";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const difficulties = new Set(["easy", "medium", "hard", "very_hard"]);
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize")) || 50));
  const difficulty = searchParams.get("difficulty") || "all";
  const topic = searchParams.get("topic") || "all";
  const search = (searchParams.get("search") || "").trim().slice(0, 80);

  try {
    const supabase = await createClient();
    let query = supabase
      .from("problems")
      .select("id,problem_number,title,slug,difficulty,topic,acceptance_rate,submission_count", { count: "exact" })
      .eq("is_published", true);
    if (difficulties.has(difficulty)) query = query.eq("difficulty", difficulty);
    if (topic !== "all") query = query.eq("topic", topic);
    if (search) query = query.ilike("title", `%${search.replace(/[%_]/g, "\\$&")}%`);
    const { data, count, error } = await query
      .order("problem_number", { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (error) throw error;
    if ((count ?? 0) > 0) {
      return NextResponse.json({
        data: (data ?? []).map((problem) => ({
          ...problem,
          acceptance_rate: Number(problem.acceptance_rate ?? 0),
          tags: [{ id: `topic-${slugify(problem.topic)}`, name: problem.topic, slug: slugify(problem.topic) }],
        })),
        total: count,
        page,
        per_page: pageSize,
        total_pages: Math.ceil((count ?? 0) / pageSize),
      });
    }
  } catch {
    // The generated bank remains available if Supabase is not configured locally.
  }

  const generated = getProblemBank();
  const filtered = generated.filter((problem) =>
    (difficulty === "all" || problem.difficulty === difficulty) &&
    (topic === "all" || problem.topic === topic || problem.tags?.some((tag) => tag.name === topic)) &&
    (!search || problem.title.toLowerCase().includes(search.toLowerCase()))
  );
  const start = (page - 1) * pageSize;
  return NextResponse.json({
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    per_page: pageSize,
    total_pages: Math.ceil(filtered.length / pageSize),
  });
}
