"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Code2, LoaderCircle, Trophy, Users } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_PROBLEMS, MOCK_CONTESTS } from "@/lib/data/mock-data";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PublicProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  college_name: string | null;
  department_name: string | null;
  academic_year: string | null;
  batch_start_year: number | null;
  batch_end_year: number | null;
};

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [profiles, setProfiles] = React.useState<PublicProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = React.useState(false);
  const [profilesUnavailable, setProfilesUnavailable] = React.useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setQuery("");
      setProfiles([]);
      setProfilesLoading(false);
      setProfilesUnavailable(false);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setProfiles([]);
    setProfilesUnavailable(false);
    setProfilesLoading(value.trim().length >= 2);
  };

  const handleSelect = (url: string) => {
    handleOpenChange(false);
    router.push(url);
  };

  React.useEffect(() => {
    const searchTerm = query.trim();
    if (!open || searchTerm.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search unavailable");
        const result = await response.json() as { profiles?: PublicProfile[] };
        setProfiles(result.profiles ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProfiles([]);
        setProfilesUnavailable(true);
      } finally {
        if (!controller.signal.aborted) setProfilesLoading(false);
      }
    }, 220);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        value={query}
        onValueChange={handleQueryChange}
        placeholder="Search problems, contests, people, college, department..."
      />
      <CommandList className="max-h-[min(70vh,32rem)]">
        <CommandEmpty>
          {profilesLoading ? "Searching public profiles…" : profilesUnavailable ? "Profile search is temporarily unavailable." : "No results found for your query."}
        </CommandEmpty>

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
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                  prob.difficulty === "easy" ? "bg-emerald-500/10 text-emerald-400" :
                  prob.difficulty === "medium" ? "bg-amber-500/10 text-amber-400" :
                  "bg-red-500/10 text-red-400"
                }`}>
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
                <span className="text-xs text-zinc-500">{contest.status === "active" ? "🟢 Live" : "Scheduled"}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
            </CommandItem>
          ))}
        </CommandGroup>

        {(profiles.length > 0 || profilesLoading) && <CommandSeparator />}

        <CommandGroup heading="People">
          {profiles.map((profile) => {
            const name = profile.full_name?.trim() || "PSG student";
            const details = [profile.college_name, profile.department_name, profile.academic_year]
              .filter(Boolean)
              .join(" · ");
            const batch = profile.batch_start_year && profile.batch_end_year
              ? `${profile.batch_start_year}–${profile.batch_end_year}`
              : "";
            const value = [query.trim(), name, profile.username, profile.college_name,
              profile.department_name, profile.academic_year, batch, profile.bio]
              .filter(Boolean)
              .join(" ");

            return (
              <CommandItem
                key={profile.id}
                value={`person ${value}`}
                onSelect={() => handleSelect(`/profile/${encodeURIComponent(profile.username || profile.id)}`)}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-9 w-9 border border-zinc-700">
                    <AvatarImage src={profile.avatar_url || ""} alt="" />
                    <AvatarFallback className="bg-indigo-500/15 text-xs font-semibold text-indigo-200">
                      {initials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                      <span className="truncate font-medium text-zinc-100">{name}</span>
                      {profile.username && <span className="truncate text-xs text-zinc-500">@{profile.username}</span>}
                    </div>
                    <p className="truncate text-xs text-zinc-400">
                      {[details, batch].filter(Boolean).join(" · ") || profile.bio || "View public profile"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              </CommandItem>
            );
          })}
          {profilesLoading && <div className="flex items-center justify-center gap-2 py-3 text-xs text-zinc-500"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />Searching profiles</div>}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
