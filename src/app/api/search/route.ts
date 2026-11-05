import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const normalizeSearch = (value: string) =>
  value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N} _-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

export async function GET(request: NextRequest) {
  const searchTerm = normalizeSearch(request.nextUrl.searchParams.get("q") ?? "");
  if (searchTerm.length < 2) return NextResponse.json({ profiles: [] });

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc("search_public_profiles", { search_term: searchTerm });
    if (error) {
      console.error("Profile search failed:", error.message);
      return NextResponse.json({ error: "Profile search is temporarily unavailable." }, { status: 503 });
    }

    return NextResponse.json(
      { profiles: data ?? [] },
      { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=60" } },
    );
  } catch {
    return NextResponse.json({ error: "Profile search is temporarily unavailable." }, { status: 503 });
  }
}
