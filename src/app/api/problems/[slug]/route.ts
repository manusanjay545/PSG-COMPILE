import { NextResponse } from "next/server";
import { MOCK_PROBLEMS } from "@/lib/data/mock-data";
import { getProblemBank } from "@/lib/problems/catalog.mjs";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("problems")
      .select("id,problem_number,title,slug,difficulty,topic,description,constraints,input_format,output_format,examples,hints,editorial,starter_code,solution_code,diagram,submission_count,accepted_count,acceptance_rate,is_published,is_premium")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      const { data: samples } = await supabase
        .from("test_cases")
        .select("input,expected_output,explanation,sort_order")
        .eq("problem_id", data.id)
        .eq("is_sample", true)
        .order("sort_order", { ascending: true });
      return NextResponse.json({ problem: {
        ...data,
        acceptance_rate: Number(data.acceptance_rate ?? 0),
        examples: data.examples?.length ? data.examples : (samples ?? []).map((test) => ({ input: test.input, output: test.expected_output, explanation: test.explanation })),
        tags: [{ id: `topic-${slugify(data.topic)}`, name: data.topic, slug: slugify(data.topic) }],
      } });
    }
  } catch {
    // Fall through to the bundled problem bank for local or disconnected development.
  }

  const problem = getProblemBank().find((item) => item.slug === slug) ?? MOCK_PROBLEMS.find((item) => item.slug === slug);
  if (!problem) return NextResponse.json({ error: "Problem not found." }, { status: 404 });
  return NextResponse.json({ problem });
}
