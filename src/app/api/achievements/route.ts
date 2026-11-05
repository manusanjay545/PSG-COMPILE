import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const auth = await createClient();
  const { data: { user: signedInUser } } = await auth.auth.getUser();
  const requestedUsername = request.nextUrl.searchParams.get("username");
  if (!requestedUsername && !signedInUser) return NextResponse.json({ error: "Sign in to view your achievements." }, { status: 401 });

  const db = await createServiceClient();
  let userId = signedInUser?.id;
  if (requestedUsername) {
    let query = db.from("users").select("id");
    query = /^[0-9a-f-]{36}$/i.test(requestedUsername) ? query.eq("id", requestedUsername) : query.eq("username", requestedUsername);
    const { data: account, error } = await query.maybeSingle();
    if (error) return NextResponse.json({ error: "Could not load this profile." }, { status: 500 });
    if (!account) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    userId = account.id;
  }
  if (!userId) return NextResponse.json({ error: "Sign in to view your achievements." }, { status: 401 });

  const [{ data: profile, error: profileError }, { data: account, error: accountError }, { data: badgeRows, error: badgeError }, { data: awards, error: awardsError }] = await Promise.all([
    db.from("profiles").select("id,full_name,avatar_url,bio,college_name,department_name,academic_year,batch_start_year,batch_end_year,problems_solved,easy_solved,medium_solved,hard_solved,total_submissions,accepted_submissions,current_streak,longest_streak,rating,rating_tier").eq("id", userId).maybeSingle(),
    db.from("users").select("username").eq("id", userId).maybeSingle(),
    db.from("badges").select("id,name,slug,description,icon,category,rule_type,rule_value,rule_config,sort_order").eq("is_active", true).order("sort_order", { ascending: true }),
    db.from("user_badges").select("id,badge_id,awarded_at").eq("user_id", userId).order("awarded_at", { ascending: false }),
  ]);
  if (profileError || accountError || badgeError || awardsError) return NextResponse.json({ error: "Could not load achievements." }, { status: 500 });
  if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  const today = new Date();
  const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const startDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() - 11, 1));
  const dateKey = (date: Date) => date.toISOString().slice(0, 10);
  const startKey = dateKey(startDate);
  const endKey = dateKey(endDate);
  const { data: activityRows, error: activityError } = await db.from("user_activity")
    .select("activity_date,activity_count")
    .eq("user_id", userId)
    .gte("activity_date", startKey)
    .lte("activity_date", endKey);
  if (activityError) return NextResponse.json({ error: "Could not load activity history." }, { status: 500 });

  const dailyTotals = new Map<string, number>();
  for (const row of activityRows ?? []) dailyTotals.set(row.activity_date, (dailyTotals.get(row.activity_date) ?? 0) + (row.activity_count ?? 0));
  const months = Array.from({ length: 12 }, (_, index) => {
    const month = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + index, 1));
    const daysInMonth = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
    const days = Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const date = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), dayIndex + 1));
      const key = dateKey(date);
      return { date: key, count: key > endKey ? 0 : dailyTotals.get(key) ?? 0 };
    });
    return { key: `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, "0")}`, label: month.toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" }), days };
  });
  const awardIds = new Set((awards ?? []).map((award) => award.badge_id));
  const awardedBadges = new Map((awards ?? []).map((award) => [award.badge_id, { id: award.id, awarded_at: award.awarded_at }]));
  const badges = (badgeRows ?? []).map((badge) => ({ ...badge, earned: awardIds.has(badge.id), award: awardedBadges.get(badge.id) ?? null }));

  return NextResponse.json({ profile: { ...profile, username: account?.username ?? null }, badges, activity: { start: startKey, end: endKey, months } });
}
