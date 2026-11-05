"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Code2,
  Sparkles,
  Layers,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function RoadmapsPage() {
  const roadmaps = [
    {
      id: "beginner",
      title: "Beginner Track",
      level: "Introductory",
      color: "border-emerald-500/30",
      description: "Foundational programming logic, basic data types, conditionals, loops, functions, and elementary data structures.",
      progress: 85,
      steps: [
        { name: "Programming Basics & I/O", status: "completed" },
        { name: "Arrays & 2D Matrices", status: "completed" },
        { name: "String Manipulation", status: "completed" },
        { name: "Linear & Binary Searching", status: "completed" },
        { name: "Elementary Sorting (Merge & Quick)", status: "current" },
        { name: "Hash Maps & Sets", status: "locked" },
        { name: "Basic Recursion", status: "locked" },
      ],
    },
    {
      id: "dsa",
      title: "Core Data Structures & Algorithms",
      level: "Intermediate",
      color: "border-cyan-500/30",
      description: "Master standard interview and academic syllabus data structures with rigorous complexity analysis.",
      progress: 60,
      steps: [
        { name: "Arrays & Two Pointers", status: "completed" },
        { name: "Singly & Doubly Linked Lists", status: "completed" },
        { name: "Stacks & Queues (Monotonic)", status: "completed" },
        { name: "Binary Trees & BST", status: "current" },
        { name: "Graph Traversals (BFS / DFS)", status: "locked" },
        { name: "Dynamic Programming (1D & 2D)", status: "locked" },
        { name: "Trie & Advanced Trees", status: "locked" },
      ],
    },
    {
      id: "placement",
      title: "Campus Placement Preparation",
      level: "Job Ready",
      color: "border-indigo-500/30",
      description: "Comprehensive technical roadmap covering high-yield coding questions, SQL, DBMS, OS, and System Design basics.",
      progress: 40,
      steps: [
        { name: "Core Programming & Syntax", status: "completed" },
        { name: "High-Frequency LeetCode 150", status: "completed" },
        { name: "PostgreSQL Queries & Aggregations", status: "current" },
        { name: "Object Oriented Programming (OOP)", status: "locked" },
        { name: "Database Management Systems (DBMS)", status: "locked" },
        { name: "Operating Systems & Concurrency", status: "locked" },
        { name: "Computer Networks & System Design", status: "locked" },
      ],
    },
    {
      id: "competitive",
      title: "Competitive Programming",
      level: "Advanced",
      color: "border-purple-500/30",
      description: "Advanced mathematical and algorithmic techniques for high ratings on Codeforces, CodeChef, and PSGCompile contests.",
      progress: 25,
      steps: [
        { name: "Number Theory & Modular Arithmetic", status: "completed" },
        { name: "Greedy Strategies & Exchange Arguments", status: "current" },
        { name: "Shortest Paths (Dijkstra, Bellman)", status: "locked" },
        { name: "DP with Bitmasking & Digits", status: "locked" },
        { name: "Disjoint Set Union (DSU) & MST", status: "locked" },
        { name: "Segment Trees & Fenwick Trees", status: "locked" },
        { name: "Game Theory & Combinatorics", status: "locked" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* Header */}
        <div className="space-y-2 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-500/30 text-xs">
              Curriculum Roadmap
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Compass className="h-7 w-7 text-indigo-400" />
            <span>Learning Roadmaps</span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Curated progressive tracks engineered to take you from hello-world fundamentals to contest mastery and campus placements.
          </p>
        </div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {roadmaps.map((track) => (
            <div
              key={track.id}
              className={`rounded-2xl border ${track.color} bg-zinc-900/60 p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-zinc-300 border-zinc-700 text-xs">
                    {track.level}
                  </Badge>
                  <span className="text-xs font-mono text-zinc-400">
                    {track.progress}% Complete
                  </span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">{track.title}</h2>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <Progress value={track.progress} indicatorClassName="bg-indigo-600" />

                {/* Steps List */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                    Milestones & Topics
                  </div>
                  <div className="space-y-2">
                    {track.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                          step.status === "completed"
                            ? "bg-zinc-950/80 border-emerald-900/40 text-zinc-300"
                            : step.status === "current"
                            ? "bg-indigo-950/30 border-indigo-500/40 text-white font-semibold"
                            : "bg-zinc-950/40 border-zinc-800/60 text-zinc-500"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {step.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : step.status === "current" ? (
                            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping shrink-0" />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                          )}
                          <span>
                            {idx + 1}. {step.name}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-mono text-zinc-500">
                          {step.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-10">
                  <Link href="/problems">Continue Learning &rarr;</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

