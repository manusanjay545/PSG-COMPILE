"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  MOCK_INSTITUTIONS,
  MOCK_DEPARTMENTS,
  MOCK_PROGRAMS,
  MOCK_BATCHES,
} from "@/lib/data/mock-data";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedInst, setSelectedInst] = React.useState("inst-1");
  const [selectedDept, setSelectedDept] = React.useState("dept-2");
  const [selectedProg, setSelectedProg] = React.useState("prog-1");
  const [selectedBatch, setSelectedBatch] = React.useState("batch-1");
  const [section, setSection] = React.useState("A");
  const [rollNumber, setRollNumber] = React.useState("23IT042");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Filter departments for selected institution
  const availableDepts = MOCK_DEPARTMENTS.filter(
    (d) => d.institution_id === selectedInst
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    toast.success("Academic Profile Configured!", {
      description: "Welcome to the PSGCompile community! Loading your dashboard...",
    });

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Academic Onboarding</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Complete your PSG Profile
          </h1>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            PSGCompile links your profile to your campus hierarchy so you can represent your institution, department, and batch on the leaderboards.
          </p>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/90 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-lg text-white">Institutional Alignment</CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Supports all PSG engineering, polytechnic, arts, science, and management programs.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Institution Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                  Select PSG Institution
                </Label>
                <Select value={selectedInst} onValueChange={(val) => setSelectedInst(val)}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-200">
                    <SelectValue placeholder="Choose institution" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                    {MOCK_INSTITUTIONS.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name} ({inst.short_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                  Department / Faculty
                </Label>
                <Select value={selectedDept} onValueChange={(val) => setSelectedDept(val)}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-200">
                    <SelectValue placeholder="Choose department" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                    {availableDepts.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.short_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Program & Degree */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                    Degree / Program
                  </Label>
                  <Select value={selectedProg} onValueChange={(val) => setSelectedProg(val)}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-200">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                      {MOCK_PROGRAMS.map((prog) => (
                        <SelectItem key={prog.id} value={prog.id}>
                          {prog.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                    Academic Batch
                  </Label>
                  <Select value={selectedBatch} onValueChange={(val) => setSelectedBatch(val)}>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-200">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                      {MOCK_BATCHES.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Section & Roll Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-400" />
                    Section / Class
                  </Label>
                  <Input
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. A, B, C"
                    className="bg-zinc-950 border-zinc-800 text-zinc-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-300">
                    Roll Number / Student ID
                  </Label>
                  <Input
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 23IT042"
                    className="bg-zinc-950 border-zinc-800 text-zinc-200 font-mono uppercase"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center border-t border-zinc-800 pt-4">
              <span className="text-xs text-zinc-500">
                You can change these anytime in Profile Settings.
              </span>
              <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                <span>Save & Enter Platform</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

