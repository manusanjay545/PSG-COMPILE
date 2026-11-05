"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Code2,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  MOCK_PROBLEMS,
  MOCK_CONTESTS,
  MOCK_LEADERBOARD,
} from "@/lib/data/mock-data";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();

  const handleSelect = (url: string) => {
    onOpenChange(false);
    router.push(url);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search problems, contests, coders..." />
      <CommandList className="max-h-96">
        <CommandEmpty>No results found for your query.</CommandEmpty>

        <CommandGroup heading="Problems">
          {MOCK_PROBLEMS.map((prob) => (
            <CommandItem
              key={prob.id}
              value={`problem ${prob.title} ${prob.difficulty}`}
              onSelect={() => handleSelect(`/problems/${prob.slug}`)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-indigo-400" />
                <span className="font-medium text-zinc-200">{prob.title}</span>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    prob.difficulty === "easy"
                      ? "text-emerald-400 bg-emerald-500/10"
                      : prob.difficulty === "medium"
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {prob.difficulty}
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Contests">
          {MOCK_CONTESTS.map((contest) => (
            <CommandItem
              key={contest.id}
              value={`contest ${contest.title}`}
              onSelect={() => handleSelect(`/contests/${contest.slug}`)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="font-medium text-zinc-200">{contest.title}</span>
                <span className="text-xs text-zinc-500">
                  {contest.status === "active" ? "🟢 Live" : "Scheduled"}
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="PSG Coders">
          {MOCK_LEADERBOARD.slice(0, 4).map((entry) => (
            <CommandItem
              key={entry.user_id}
              value={`coder ${entry.full_name} ${entry.username} ${entry.institution_name}`}
              onSelect={() => handleSelect(`/profile/${entry.username}`)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <div>
                  <span className="font-medium text-zinc-200">{entry.full_name}</span>{" "}
                  <span className="text-xs text-zinc-500">@{entry.username}</span>
                </div>
              </div>
              <span className="text-xs text-zinc-400">{entry.institution_name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

      </CommandList>
    </CommandDialog>
  );
}

