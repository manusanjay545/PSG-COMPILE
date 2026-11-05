"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const redirectTo = new URL("/auth/callback", window.location.origin);
      redirectTo.searchParams.set("next", "/reset-password");
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: redirectTo.toString() });
      if (resetError) throw resetError;
      setSent(true);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "We could not send a reset email.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-zinc-100">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/95 shadow-2xl">
        <CardHeader className="items-center text-center">
          <Link href="/" aria-label="PSGCompile home"><Logo size={48} /></Link>
          <CardTitle className="pt-2 text-xl text-white">Reset your password</CardTitle>
          <CardDescription className="text-zinc-400">Enter your account email and we’ll send a secure reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div role="status" className="space-y-4 text-center">
              <MailCheck className="mx-auto h-10 w-10 text-emerald-400" />
              <p className="text-sm text-zinc-300">If an account exists for <strong>{email}</strong>, a password reset link is on its way.</p>
              <p className="text-xs text-zinc-500">Check your inbox and spam folder. The link will let you choose a new password.</p>
              <Button asChild variant="outline" className="border-zinc-700 text-zinc-200"><Link href="/login">Back to sign in</Link></Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5"><Label htmlFor="email" className="text-zinc-300">Email</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@gmail.com" className="border-zinc-800 bg-zinc-950" /></div>
              {error && <p role="alert" className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
              <Button type="submit" disabled={busy} className="w-full bg-indigo-600 text-white hover:bg-indigo-700">{busy ? "Sending…" : "Send reset link"}</Button>
              <Button asChild type="button" variant="ghost" className="w-full text-zinc-400"><Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to sign in</Link></Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

