"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Shield } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarPicker } from "@/components/profile/avatar-picker";
import { DEFAULT_AVATARS, type AvatarSource } from "@/lib/profile/avatars";
import { CURRENT_CALENDAR_YEAR, getAcademicStanding } from "@/lib/profile/academic";
import { createClient } from "@/lib/supabase/client";

type AuthPageProps = { mode: "login" | "signup" };

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [avatarUrl, setAvatarUrl] = React.useState(DEFAULT_AVATARS[0]);
  const [avatarSource, setAvatarSource] = React.useState<AvatarSource>("preset");
  const [batchStartYear, setBatchStartYear] = React.useState("");
  const [batchEndYear, setBatchEndYear] = React.useState("");

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) throw authError;
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Google sign-in could not be started.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    try {
      const supabase = createClient();
      if (isSignup) {
        if (password.length < 8) throw new Error("Use a password with at least 8 characters.");
        const startYear = Number(formData.get("batch_start_year"));
        const endYear = Number(formData.get("batch_end_year"));
        const academicYear = getAcademicStanding(startYear, endYear);
        if (academicYear.startsWith("Enter a valid")) throw new Error(academicYear);
        const profile = {
          full_name: String(formData.get("full_name") || "").trim(),
          roll_number: String(formData.get("roll_number") || "").trim(),
          college_name: String(formData.get("college_name") || "").trim(),
          department_name: String(formData.get("department_name") || "").trim(),
          batch_start_year: startYear,
          batch_end_year: endYear,
          graduation_year: endYear,
          academic_year: academicYear,
          bio: String(formData.get("bio") || "").trim(),
          avatar_url: avatarUrl,
          avatar_source: avatarSource,
          onboarding_completed: true,
        };
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: profile,
          },
        });
        if (authError) throw authError;
        if (!data.session) {
          setMessage("Check your inbox to confirm your email. Your profile has been saved and will be ready when you sign in.");
          setIsLoading(false);
          return;
        }
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.replace("/dashboard");
      router.refresh();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "We could not complete that request.");
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white">
          <Link href="/"><ArrowLeft className="h-4 w-4" />Back to Home</Link>
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-xl space-y-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Logo size={54} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{isSignup ? "Join PSGCompile" : <>Welcome to PSG<span className="text-indigo-500">Compile</span></>}</h1>
            <p className="mt-1 text-xs text-zinc-400">One PSG · One Coding Community</p>
          </div>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/95 shadow-2xl backdrop-blur-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg text-white">{isSignup ? "Create your account" : "Sign in to your account"}</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              {isSignup ? "Use Google or your email, then add your student profile details." : "Continue with your Google account or email and password."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="h-11 w-full gap-3 border-zinc-700 bg-zinc-800/80 font-medium text-zinc-100 hover:bg-zinc-700 hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wide"><span className="bg-zinc-900 px-2 text-zinc-500">or use email</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="full_name" label="Full name"><Input id="full_name" name="full_name" autoComplete="name" required maxLength={100} placeholder="Your name" className="border-zinc-800 bg-zinc-950" /></Field>
                    <Field id="roll_number" label="Roll number"><Input id="roll_number" name="roll_number" required maxLength={40} placeholder="e.g. 23IT042" className="border-zinc-800 bg-zinc-950" /></Field>
                    <Field id="college_name" label="College name"><Input id="college_name" name="college_name" required maxLength={120} placeholder="Your college" className="border-zinc-800 bg-zinc-950" /></Field>
                    <Field id="department_name" label="Department"><Input id="department_name" name="department_name" required maxLength={120} placeholder="e.g. Information Technology" className="border-zinc-800 bg-zinc-950" /></Field>
                    <Field id="batch_start_year" label="Batch start year"><Input id="batch_start_year" name="batch_start_year" type="number" required min={2000} max={CURRENT_CALENDAR_YEAR + 10} value={batchStartYear} onChange={(event) => setBatchStartYear(event.target.value)} placeholder="e.g. 2024" className="border-zinc-800 bg-zinc-950" /></Field>
                    <Field id="batch_end_year" label="Batch end year"><Input id="batch_end_year" name="batch_end_year" type="number" required min={2000} max={CURRENT_CALENDAR_YEAR + 10} value={batchEndYear} onChange={(event) => setBatchEndYear(event.target.value)} placeholder="e.g. 2027" className="border-zinc-800 bg-zinc-950" /></Field>
                  </div>
                  <p className="-mt-2 text-xs text-indigo-200" aria-live="polite">{batchStartYear && batchEndYear ? getAcademicStanding(Number(batchStartYear), Number(batchEndYear)) : "Enter your batch start and end years; we’ll calculate your current year or passed-out status."}</p>
                  <Field id="bio" label="Bio (optional)"><textarea id="bio" name="bio" maxLength={280} rows={3} placeholder="A little about you" className="flex w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" /></Field>
                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">Choose a profile avatar</Label>
                    <AvatarPicker value={avatarUrl} source={avatarSource} onChange={(url, nextSource) => { setAvatarUrl(url); setAvatarSource(nextSource); }} />
                  </div>
                </>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="email" label="Email"><Input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@gmail.com" className="border-zinc-800 bg-zinc-950" /></Field>
                <Field id="password" label="Password"><Input id="password" name="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} required minLength={8} placeholder={isSignup ? "At least 8 characters" : "Your password"} className="border-zinc-800 bg-zinc-950" /></Field>
              </div>

              {!isSignup && <div className="text-right"><Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link></div>}
              {error && <p role="alert" className="rounded-md border border-red-900/70 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
              {message && <p role="status" className="rounded-md border border-emerald-900/70 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-300">{message}</p>}
              <Button type="submit" disabled={isLoading} className="h-10 w-full bg-indigo-600 text-white hover:bg-indigo-700">
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                {isLoading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 border-t border-zinc-800/80 pt-4 text-center">
            <p className="text-sm text-zinc-400">
              {isSignup ? "Already have an account? " : "New to PSGCompile? "}
              <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-indigo-400 hover:text-indigo-300">{isSignup ? "Sign in" : "Create an account"}</Link>
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500"><Shield className="h-3.5 w-3.5 text-indigo-400" /><span>Your password is securely managed by Supabase Auth.</span></div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label htmlFor={id} className="text-xs text-zinc-300">{label}</Label>{children}</div>;
}

