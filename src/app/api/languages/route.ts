import { NextResponse } from "next/server";
import { judge0BaseUrl, judge0Headers } from "@/lib/judge/judge0";

export const revalidate = 3600;

export async function GET() {
  try {
    const response = await fetch(`${judge0BaseUrl()}/languages`, {
      headers: judge0Headers(),
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Language service returned ${response.status}.`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error("Language service returned an invalid list.");
    const languages = data
      .filter((item): item is { id: number; name: string } => Number.isInteger(item?.id) && typeof item?.name === "string")
      .map(({ id, name }) => ({ id, name }));
    return NextResponse.json(languages, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not load languages." }, { status: 502 });
  }
}
