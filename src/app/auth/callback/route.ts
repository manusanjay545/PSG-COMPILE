import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safePath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/dashboard";
  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safePath(requestUrl.searchParams.get("next"));

  if (!code) return NextResponse.redirect(new URL("/login", requestUrl.origin));

  try {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) return NextResponse.redirect(new URL("/login", requestUrl.origin));

    if (next !== "/dashboard") {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/login", requestUrl.origin));

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", user.id)
      .maybeSingle();
    const destination = profile?.onboarding_completed ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(new URL(destination, requestUrl.origin));
  } catch {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }
}

