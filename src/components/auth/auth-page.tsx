"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, Shield } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

type AuthPageProps = { mode: "login" | "signup" };

export function AuthPage({ mode }: AuthPageProps) {
  const isSignup = mode === "signup";
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

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

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
        <Button asChild variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-white">
          <Link href="/"><ArrowLeft className="h-4 w-4" />Back to Home</Link>
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Logo size={54} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{isSignup ? "Join PSGCompile" : <>Welcome to PSG<span className="text-indigo-500">Compile</span></>}</h1>
            <p className="mt-1 text-xs text-zinc-400">One PSG · One Coding Community</p>
          </div>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/95 shadow-2xl backdrop-blur-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg text-white">{isSignup ? "Create your account" : "Sign in to PSGCompile"}</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              {isSignup ? "Continue with Google, then complete your student profile." : "Continue securely with your Google account."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={isLoading} className="h-11 w-full gap-3 border-zinc-700 bg-zinc-800/80 font-medium text-zinc-100 hover:bg-zinc-700 hover:text-white">
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <GoogleMark />}
              {isLoading ? "Redirecting to Google…" : "Continue with Google"}
            </Button>
            {error && <p role="alert" className="rounded-md border border-red-900/70 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500"><Shield className="h-3.5 w-3.5 text-indigo-400" /><span>Sign-in is handled securely by Google and Supabase.</span></div>
          </CardContent>
          <CardFooter className="justify-center border-t border-zinc-800/80 pt-4 text-center">
            <p className="text-sm text-zinc-400">
              {isSignup ? "Already have an account? " : "New to PSGCompile? "}
              <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-indigo-400 hover:text-indigo-300">{isSignup ? "Sign in" : "Create an account"}</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}
