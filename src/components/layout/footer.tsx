import Link from "next/link";
import { Code2, Heart, Shield, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                PSG<span className="text-indigo-500">Compile</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Institution-wide competitive programming and online judge platform unifying coders across all PSG colleges, schools, and departments.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <Terminal className="h-3.5 w-3.5 text-indigo-400" />
              <span>Code. Compete. Climb.</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/problems" className="hover:text-indigo-400 transition-colors">
                  Problem Archive
                </Link>
              </li>
              <li>
                <Link href="/contests" className="hover:text-indigo-400 transition-colors">
                  Live & Upcoming Contests
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-indigo-400 transition-colors">
                  PSG-Wide Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="hover:text-indigo-400 transition-colors">
                  Learning Roadmaps
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Institutions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/institutions/psg-college-of-technology" className="hover:text-indigo-400 transition-colors">
                  PSG College of Technology
                </Link>
              </li>
              <li>
                <Link href="/institutions/psg-polytechnic" className="hover:text-indigo-400 transition-colors">
                  PSG Polytechnic College
                </Link>
              </li>
              <li>
                <Link href="/institutions/psg-college-of-arts-science" className="hover:text-indigo-400 transition-colors">
                  PSG College of Arts & Science
                </Link>
              </li>
              <li>
                <Link href="/institutions/psg-institute-of-technology" className="hover:text-indigo-400 transition-colors">
                  PSG iTech
                </Link>
              </li>
              <li>
                <Link href="/institutions/psg-institute-of-management" className="hover:text-indigo-400 transition-colors">
                  PSG Institute of Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & System */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Governance & Security
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Isolated Sandbox Workers</span>
              </li>
              <li className="text-xs text-zinc-500">
                Role-Based Access Control (RBAC)
              </li>
              <li className="text-xs text-zinc-500">
                Plagiarism & Similarity Engine
              </li>
              <li>
                <Link href="/admin" className="text-xs text-indigo-400 hover:underline">
                  Administration Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 PSGCompile. All rights reserved across the PSG Ecosystem.</p>
          <div className="flex items-center gap-2">
            <span>Crafted for competitive coders</span>
            <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
            <span>across all PSG institutions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
