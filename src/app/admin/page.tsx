"use client";

import * as React from "react";
import Link from "next/link";
import {
  Shield,
  Building2,
  Users,
  Code2,
  Trophy,
  BarChart3,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Edit,
  Activity,
  Layers,
  GraduationCap,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MOCK_INSTITUTIONS,
  MOCK_DEPARTMENTS,
  MOCK_PROBLEMS,
  MOCK_CONTESTS,
  MOCK_LEADERBOARD,
} from "@/lib/data/mock-data";

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = React.useState("institutions");
  const [institutions, setInstitutions] = React.useState(MOCK_INSTITUTIONS);
  const [problems, setProblems] = React.useState(MOCK_PROBLEMS);

  // New Institution Modal state
  const [isAddInstOpen, setIsAddInstOpen] = React.useState(false);
  const [newInstName, setNewInstName] = React.useState("");
  const [newInstShortName, setNewInstShortName] = React.useState("");
  const [newInstDesc, setNewInstDesc] = React.useState("");

  // New Problem Modal state
  const [isAddProbOpen, setIsAddProbOpen] = React.useState(false);
  const [newProbTitle, setNewProbTitle] = React.useState("");
  const [newProbDifficulty, setNewProbDifficulty] = React.useState("easy");
  const [newProbDesc, setNewProbDesc] = React.useState("");

  const handleAddInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim()) {
      toast.error("Institution name is required.");
      return;
    }

    const newInst = {
      id: "inst-" + Date.now().toString(36),
      name: newInstName,
      slug: newInstName.toLowerCase().replace(/\s+/g, "-"),
      short_name: newInstShortName || "PSG Campus",
      description: newInstDesc || "New educational institution in the PSG ecosystem.",
      logo_url: null,
      website: null,
      is_active: true,
      sort_order: institutions.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setInstitutions([...institutions, newInst]);
    setIsAddInstOpen(false);
    setNewInstName("");
    setNewInstShortName("");
    setNewInstDesc("");
    toast.success("Institution successfully created in PSG hierarchy!");
  };

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProbTitle.trim()) {
      toast.error("Problem title is required.");
      return;
    }

    const newProb = {
      id: "prob-" + Date.now().toString(36),
      problem_number: problems.length + 1,
      title: newProbTitle,
      slug: newProbTitle.toLowerCase().replace(/\s+/g, "-"),
      difficulty: newProbDifficulty as any,
      description: newProbDesc || "Problem statement description.",
      constraints: "1 <= N <= 10^5",
      input_format: "Input line format",
      output_format: "Output format",
      examples: [{ input: "1 2", output: "3" }],
      hints: ["Consider using dynamic programming or two pointers."],
      editorial: "Editorial explanation.",
      starter_code: { python: "# Starter template" },
      submission_count: 0,
      accepted_count: 0,
      acceptance_rate: 0,
      is_published: true,
      is_premium: false,
      author_id: "admin-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
    };

    setProblems([...problems, newProb]);
    setIsAddProbOpen(false);
    setNewProbTitle("");
    setNewProbDesc("");
    toast.success("Problem published to PSGCompile archive!");
  };

  const handleRecalculateLeaderboards = () => {
    toast.info("Recalculating institutional leaderboards...", {
      description: "Evaluating submission scores, penalties, and rating updates.",
    });
    setTimeout(() => {
      toast.success("Leaderboards updated successfully!");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs gap-1.5">
                <Shield className="h-3 w-3" />
                Super Admin Access
              </Badge>
              <span className="text-xs text-zinc-500 font-mono">RBAC Authorization Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              PSGCompile Administration Portal
            </h1>
            <p className="text-sm text-zinc-400">
              Manage institution hierarchy, departments, academic batches, problems, contests, and system security.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecalculateLeaderboards}
              className="border-zinc-800 text-xs text-zinc-300 gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Recalculate Leaderboards
            </Button>
          </div>
        </div>

        {/* Global Platform Analytics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
              Total Coders
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">5,420</div>
            <p className="text-[10px] text-emerald-400">+14% month-over-month</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
              Submissions
            </div>
            <div className="text-2xl font-extrabold text-indigo-400 font-mono">128,490</div>
            <p className="text-[10px] text-zinc-500">Avg execution time: 18ms</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
              Active Problems
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">{problems.length}</div>
            <p className="text-[10px] text-zinc-500">Easy: 45% · Med: 40% · Hard: 15%</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
              Connected Campuses
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">{institutions.length}</div>
            <p className="text-[10px] text-zinc-500">Across PSG ecosystem</p>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger value="institutions" className="text-xs gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Institutions & Hierarchy
            </TabsTrigger>
            <TabsTrigger value="problems" className="text-xs gap-1.5">
              <Code2 className="h-3.5 w-3.5" />
              Problem Management
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs gap-1.5">
              <Users className="h-3.5 w-3.5" />
              User Roles & RBAC
            </TabsTrigger>
            <TabsTrigger value="contests" className="text-xs gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              Contests & Events
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              Allowed Domains & Security
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Institutions & Hierarchy */}
          <TabsContent value="institutions" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">PSG Institutions Hierarchy</h3>
                <p className="text-xs text-zinc-400">
                  Manage institutions, departments, degree programs, batches, and sections.
                </p>
              </div>

              {/* Add Institution Dialog */}
              <Dialog open={isAddInstOpen} onOpenChange={setIsAddInstOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Add Institution
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle className="text-lg text-white">Add New PSG Institution</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddInstitution} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Full Institution Name</Label>
                      <Input
                        placeholder="e.g. PSG Institute of Advanced Studies"
                        value={newInstName}
                        onChange={(e) => setNewInstName(e.target.value)}
                        className="bg-zinc-950 border-zinc-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Short Display Name / Acronym</Label>
                      <Input
                        placeholder="e.g. PSG IAS"
                        value={newInstShortName}
                        onChange={(e) => setNewInstShortName(e.target.value)}
                        className="bg-zinc-950 border-zinc-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Description</Label>
                      <Input
                        placeholder="Campus focus, programs, autonomy..."
                        value={newInstDesc}
                        onChange={(e) => setNewInstDesc(e.target.value)}
                        className="bg-zinc-950 border-zinc-800"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Create Institution
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Institution Name</th>
                    <th className="py-3 px-4 font-semibold">Short Name</th>
                    <th className="py-3 px-4 font-semibold">Slug Identifier</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {institutions.map((inst) => (
                    <tr key={inst.id} className="hover:bg-zinc-800/40">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {inst.name}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-zinc-400 font-mono">
                        {inst.short_name}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-zinc-500 font-mono">
                        {inst.slug}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
                          Active
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          Configure Hierarchy
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 2: Problems Management */}
          <TabsContent value="problems" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Problem Repository</h3>
                <p className="text-xs text-zinc-400">
                  Add new problems, define test cases, and manage publication states.
                </p>
              </div>

              {/* Add Problem Dialog */}
              <Dialog open={isAddProbOpen} onOpenChange={setIsAddProbOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    Create Problem
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg text-white">Create New Problem</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProblem} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Problem Title</Label>
                      <Input
                        placeholder="e.g. Graph Cycle Detection"
                        value={newProbTitle}
                        onChange={(e) => setNewProbTitle(e.target.value)}
                        className="bg-zinc-950 border-zinc-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Difficulty</Label>
                      <select
                        value={newProbDifficulty}
                        onChange={(e) => setNewProbDifficulty(e.target.value)}
                        className="w-full h-9 rounded-md bg-zinc-950 border border-zinc-800 px-3 text-xs text-zinc-200"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Problem Description (Markdown)</Label>
                      <Input
                        placeholder="Given an undirected graph, return true if..."
                        value={newProbDesc}
                        onChange={(e) => setNewProbDesc(e.target.value)}
                        className="bg-zinc-950 border-zinc-800"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        Publish to Archive
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold w-16">#</th>
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold">Difficulty</th>
                    <th className="py-3 px-4 font-semibold text-right">Submissions</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {problems.map((prob) => (
                    <tr key={prob.id} className="hover:bg-zinc-800/40">
                      <td className="py-3.5 px-4 font-mono text-zinc-500">#{prob.problem_number}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <Link href={`/problems/${prob.slug}`} className="hover:text-indigo-400">
                          {prob.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            prob.difficulty === "easy"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : prob.difficulty === "medium"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-zinc-400">
                        {prob.submission_count}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 3: User Management & Roles */}
          <TabsContent value="users" className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">User Accounts & Roles</h3>
              <p className="text-xs text-zinc-400">
                Grant moderator, problem setter, institution admin, or super admin privileges.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Institution</th>
                    <th className="py-3 px-4 font-semibold">Current Role</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {MOCK_LEADERBOARD.slice(0, 5).map((user, idx) => (
                    <tr key={user.user_id} className="hover:bg-zinc-800/40">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{user.full_name}</div>
                        <div className="text-xs text-zinc-500">@{user.username}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-zinc-400">{user.institution_name}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-300">
                          {idx === 0 ? "Super Admin" : idx === 1 ? "Problem Setter" : "Student"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.success(`Permissions updated for @${user.username}`)}
                          className="text-xs text-indigo-400"
                        >
                          Modify Role
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* TAB 4: Allowed Domains & Security */}
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Configurable Email Domains</h3>
              <p className="text-xs text-zinc-400">
                Restrict new account registration to verified PSG email domain patterns.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Allowed Domains List (JSON)</Label>
                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400 space-y-1">
                  <div>&quot;psgtech.ac.in&quot;</div>
                  <div>&quot;psgpolytech.ac.in&quot;</div>
                  <div>&quot;psgcas.ac.in&quot;</div>
                  <div>&quot;psgitech.ac.in&quot;</div>
                  <div>&quot;psgim.ac.in&quot;</div>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => toast.success("Domain configuration persisted!")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
              >
                Save Security Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

