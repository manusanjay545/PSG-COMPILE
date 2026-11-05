"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AvatarPicker } from "@/components/profile/avatar-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_AVATARS, type AvatarSource } from "@/lib/profile/avatars";
import { createClient } from "@/lib/supabase/client";

type ProfileFields = {
  full_name: string;
  roll_number: string;
  college_name: string;
  department_name: string;
  academic_year: string;
  class_name: string;
  bio: string;
  avatar_url: string;
  avatar_source: AvatarSource;
};

const emptyProfile: ProfileFields = {
  full_name: "", roll_number: "", college_name: "", department_name: "", academic_year: "", class_name: "", bio: "", avatar_url: DEFAULT_AVATARS[0], avatar_source: "preset",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<ProfileFields>(emptyProfile);
  const [userId, setUserId] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.replace("/login");
          return;
        }
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, roll_number, college_name, department_name, academic_year, class_name, bio, avatar_url, avatar_source")
          .eq("id", user.id)
          .maybeSingle();
        if (profileError) throw profileError;
        if (!active) return;
        setUserId(user.id);
        setProfile({
          ...emptyProfile,
          ...(data || {}),
          full_name: data?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "",
          avatar_url: data?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || DEFAULT_AVATARS[0],
          avatar_source: data?.avatar_source || (user.user_metadata?.picture || user.user_metadata?.avatar_url ? "google" : "preset"),
        });
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load your profile.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadProfile();
    return () => { active = false; };
  }, [router]);

  const setField = (field: keyof ProfileFields, value: string) => setProfile((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: saveError } = await supabase.from("profiles").upsert({
        id: userId,
        full_name: profile.full_name.trim(),
        roll_number: profile.roll_number.trim(),
        college_name: profile.college_name.trim(),
        department_name: profile.department_name.trim(),
        academic_year: profile.academic_year.trim(),
        class_name: profile.class_name.trim(),
        bio: profile.bio.trim() || null,
        avatar_url: profile.avatar_url,
        avatar_source: profile.avatar_source,
        onboarding_completed: true,
      }, { onConflict: "id" });
      if (saveError) throw saveError;
      router.replace("/dashboard");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save your profile.");
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-600/10 px-3 py-1 text-xs font-semibold text-indigo-300"><CheckCircle2 className="h-3.5 w-3.5" />Student profile</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Complete your PSG profile</h1>
          <p className="mx-auto max-w-lg text-sm text-zinc-400">Add your college and class details so your profile is ready for the community.</p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/90 shadow-2xl">
          <form onSubmit={submit}>
            <CardHeader>
              <CardTitle className="text-lg text-white">Your details</CardTitle>
              <CardDescription className="text-zinc-400">You can update these later in settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {loading ? <p className="text-sm text-zinc-400">Loading your account…</p> : <>
                <AvatarPicker value={profile.avatar_url} source={profile.avatar_source} userId={userId} allowUpload onChange={(url, source) => setProfile((current) => ({ ...current, avatar_url: url, avatar_source: source }))} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="full_name" label="Full name"><Input id="full_name" required maxLength={100} value={profile.full_name} onChange={(event) => setField("full_name", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="roll_number" label="Roll number"><Input id="roll_number" required maxLength={40} value={profile.roll_number} onChange={(event) => setField("roll_number", event.target.value)} placeholder="e.g. 23IT042" className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="college_name" label="College name"><Input id="college_name" required maxLength={120} value={profile.college_name} onChange={(event) => setField("college_name", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="department_name" label="Department"><Input id="department_name" required maxLength={120} value={profile.department_name} onChange={(event) => setField("department_name", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="academic_year" label="Year"><Input id="academic_year" required maxLength={40} value={profile.academic_year} onChange={(event) => setField("academic_year", event.target.value)} placeholder="e.g. 2nd year" className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="class_name" label="Class"><Input id="class_name" required maxLength={60} value={profile.class_name} onChange={(event) => setField("class_name", event.target.value)} placeholder="e.g. IT-A" className="border-zinc-800 bg-zinc-950" /></Field>
                </div>
                <Field id="bio" label="Bio (optional)"><Textarea id="bio" rows={3} maxLength={280} value={profile.bio} onChange={(event) => setField("bio", event.target.value)} className="border-zinc-800 bg-zinc-950" placeholder="A little about you" /></Field>
              </>}
              {error && <p role="alert" className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
            </CardContent>
            <CardFooter className="flex justify-end border-t border-zinc-800 pt-4">
              <Button type="submit" disabled={loading || saving} className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">{saving ? "Saving…" : "Save and continue"}<ArrowRight className="h-4 w-4" /></Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label htmlFor={id} className="text-xs text-zinc-300">{label}</Label>{children}</div>;
}

