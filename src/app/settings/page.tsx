"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AvatarPicker } from "@/components/profile/avatar-picker";
import { LoadingIndicator } from "@/components/ui/loading-state";
import { ProfileCertificates } from "@/components/courses/profile-certificates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_AVATARS, type AvatarSource } from "@/lib/profile/avatars";
import { createClient } from "@/lib/supabase/client";

type EditableProfile = {
  full_name: string;
  roll_number: string;
  college_name: string;
  department_name: string;
  academic_year: string;
  class_name: string;
  bio: string;
  avatar_url: string;
  avatar_source: AvatarSource;
  github_url: string;
  linkedin_url: string;
};

const emptyProfile: EditableProfile = {
  full_name: "", roll_number: "", college_name: "", department_name: "", academic_year: "", class_name: "", bio: "", avatar_url: DEFAULT_AVATARS[0], avatar_source: "preset", github_url: "", linkedin_url: "",
};

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = React.useState<EditableProfile>(emptyProfile);
  const [userId, setUserId] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.replace("/login");
          return;
        }
        const { data, error: profileError } = await supabase.from("profiles")
          .select("full_name, roll_number, college_name, department_name, academic_year, class_name, bio, avatar_url, avatar_source, github_url, linkedin_url")
          .eq("id", user.id).maybeSingle();
        if (profileError) throw profileError;
        if (!active) return;
        setUserId(user.id);
        setEmail(user.email || "");
        setProfile({ ...emptyProfile, ...(data || {}) });
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load your profile.");
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [router]);

  const setField = (field: keyof EditableProfile, value: string) => setProfile((current) => ({ ...current, [field]: value }));

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
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
        github_url: profile.github_url.trim() || null,
        linkedin_url: profile.linkedin_url.trim() || null,
      }, { onConflict: "id" });
      if (saveError) throw saveError;
      setNotice("Your profile changes have been saved.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-1 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Account & Profile Settings</h1>
          <p className="text-sm text-zinc-400">Update the information shown on your PSGCompile profile.</p>
        </div>

        {loading ? <LoadingIndicator label="Loading your account…" className="py-6" /> : (
          <form onSubmit={save} className="space-y-6">
            <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl">
              <CardHeader><CardTitle className="text-lg text-white">Student profile</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <AvatarPicker value={profile.avatar_url} source={profile.avatar_source} userId={userId} allowUpload onChange={(url, source) => setProfile((current) => ({ ...current, avatar_url: url, avatar_source: source }))} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="full_name" label="Full name"><Input id="full_name" required maxLength={100} value={profile.full_name} onChange={(event) => setField("full_name", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="email" label="Account email"><Input id="email" value={email} readOnly className="border-zinc-800 bg-zinc-950 text-zinc-500" /></Field>
                  <Field id="roll_number" label="Roll number"><Input id="roll_number" required maxLength={40} value={profile.roll_number} onChange={(event) => setField("roll_number", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="college_name" label="College name"><Input id="college_name" required maxLength={120} value={profile.college_name} onChange={(event) => setField("college_name", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="department_name" label="Department"><Input id="department_name" required maxLength={120} value={profile.department_name} onChange={(event) => setField("department_name", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="academic_year" label="Year"><Input id="academic_year" required maxLength={40} value={profile.academic_year} onChange={(event) => setField("academic_year", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                  <Field id="class_name" label="Class"><Input id="class_name" required maxLength={60} value={profile.class_name} onChange={(event) => setField("class_name", event.target.value)} className="border-zinc-800 bg-zinc-950" /></Field>
                </div>
                <Field id="bio" label="Bio"><Textarea id="bio" rows={4} maxLength={280} value={profile.bio} onChange={(event) => setField("bio", event.target.value)} className="border-zinc-800 bg-zinc-950" placeholder="A little about you" /></Field>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl">
              <CardHeader><CardTitle className="text-lg text-white">Social profiles</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field id="github_url" label="GitHub URL"><Input id="github_url" type="url" value={profile.github_url} onChange={(event) => setField("github_url", event.target.value)} placeholder="https://github.com/username" className="border-zinc-800 bg-zinc-950" /></Field>
                <Field id="linkedin_url" label="LinkedIn URL"><Input id="linkedin_url" type="url" value={profile.linkedin_url} onChange={(event) => setField("linkedin_url", event.target.value)} placeholder="https://linkedin.com/in/username" className="border-zinc-800 bg-zinc-950" /></Field>
              </CardContent>
            </Card>
            {error && <p role="alert" className="rounded-md border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-300">{error}</p>}
            {notice && <p role="status" className="rounded-md border border-emerald-900 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-300">{notice}</p>}
            <div className="flex justify-end"><Button type="submit" disabled={saving} className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" />}{saving ? "Saving…" : "Save changes"}</Button></div>
          </form>
        )}
        <ProfileCertificates />
      </main>
      <Footer />
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label htmlFor={id} className="text-xs text-zinc-300">{label}</Label>{children}</div>;
}

