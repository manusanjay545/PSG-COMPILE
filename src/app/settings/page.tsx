"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Building2,
  GraduationCap,
  Link2,
  Globe,
  Bell,
  Shield,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { MOCK_CURRENT_USER, MOCK_INSTITUTIONS } from "@/lib/data/mock-data";

export default function SettingsPage() {
  const user = MOCK_CURRENT_USER;
  const [fullName, setFullName] = React.useState(user.full_name || "");
  const [bio, setBio] = React.useState(user.bio || "");
  const [github, setGithub] = React.useState(user.github_url || "");
  const [linkedin, setLinkedin] = React.useState(user.linkedin_url || "");
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [contestReminders, setContestReminders] = React.useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings and Profile preferences saved successfully!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Header */}
        <div className="space-y-1 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-sm text-zinc-400">
            Manage your personal profile, institutional affiliations, social presence, and notification preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Basic Profile */}
          <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Username / Handle</Label>
                  <Input
                    value={user.id}
                    disabled
                    className="bg-zinc-950 border-zinc-800 text-zinc-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Biography</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="bg-zinc-950 border-zinc-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5" /> GitHub Profile URL
                  </Label>
                  <Input
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="bg-zinc-950 border-zinc-800 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> LinkedIn Profile URL
                  </Label>
                  <Input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-zinc-950 border-zinc-800 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Institutional Affiliation */}
          <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">PSG Institution Alignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Current Campus</Label>
                  <Input
                    value={user.institution?.name || "PSG College of Technology"}
                    disabled
                    className="bg-zinc-950 border-zinc-800 text-zinc-400 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Department</Label>
                  <Input
                    value={user.department?.name || "Information Technology"}
                    disabled
                    className="bg-zinc-950 border-zinc-800 text-zinc-400 text-xs"
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-500">
                To request an official campus or departmental transfer, please contact your department administrator.
              </p>
            </CardContent>
          </Card>

          {/* Section 3: Notification Preferences */}
          <Card className="border-zinc-800 bg-zinc-900/60 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-white">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Contest Reminders</div>
                  <div className="text-xs text-zinc-400">Receive alerts 30 minutes before registered contests start</div>
                </div>
                <Switch checked={contestReminders} onCheckedChange={setContestReminders} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div>
                  <div className="text-sm font-semibold text-white">Leaderboard Updates</div>
                  <div className="text-xs text-zinc-400">Get notified when you advance in PSG rank or departmental standings</div>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-800 pt-4 flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>

      <Footer />
    </div>
  );
}
