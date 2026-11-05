"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [ready, setReady] = React.useState<boolean | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const supabase = createClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (active) setReady(Boolean(session));
      } catch (sessionError) {
        if (active) {
          setReady(false);
          setError(sessionError instanceof Error ? sessionError.message : "This reset link is not valid.");
        }
      }
    };
    void checkSession();
    return () => { active = false; };
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("Use a password with at least 8 characters.");
    if (password !== confirmPassword) return setError("The passwords do not match.");
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      router.replace("/dashboard");
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Your password could not be updated.");
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-zinc-100">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/95 shadow-2xl">
        <CardHeader className="items-center text-center">
          <Link href="/" aria-label="PSGCompile home"><Logo size={48} /></Link>
          <CardTitle className="pt-2 text-xl text-white">Choose a new password</CardTitle>
          <CardDescription className="text-zinc-400">Your new password must be at least 8 characters long.</CardDescription>
        </CardHeader>
        <CardContent>
          {ready === null ? <p className="py-3 text-center text-sm text-zinc-400">Checking your secure reset link…</p> : ready ? (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5"><Label htmlFor="password" className="text-zinc-300">New password</Label><Input id="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="border-zinc-800 bg-zinc-950" /></div>
              <div className="space-y-1.5"><Label htmlFor="confirm-password" className="text-zinc-300">Confirm new password</Label><Input id="confirm-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="border-zinc-800 bg-zinc-950" /></div>
              {error && <p role="alert" className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
              <Button type="submit" disabled={busy} className="w-full bg-indigo-600 text-white hover:bg-indigo-700">{busy ? "Saving…" : "Update password"}</Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <p role="alert" className="text-sm text-zinc-300">{error || "This password reset link is invalid or expired."}</p>
              <Button asChild className="w-full bg-indigo-600 text-white hover:bg-indigo-700"><Link href="/forgot-password">Request another link</Link></Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

