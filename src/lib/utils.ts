import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "text-emerald-500";
    case "medium":
      return "text-amber-500";
    case "hard":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

export function getDifficultyBg(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "hard":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case "accepted":
      return "text-emerald-500";
    case "wrong_answer":
      return "text-red-500";
    case "time_limit_exceeded":
      return "text-amber-500";
    case "memory_limit_exceeded":
      return "text-amber-500";
    case "runtime_error":
      return "text-red-400";
    case "compilation_error":
      return "text-red-400";
    case "pending":
      return "text-blue-400";
    default:
      return "text-gray-500";
  }
}

export function getVerdictLabel(verdict: string): string {
  switch (verdict) {
    case "accepted":
      return "Accepted";
    case "wrong_answer":
      return "Wrong Answer";
    case "time_limit_exceeded":
      return "Time Limit Exceeded";
    case "memory_limit_exceeded":
      return "Memory Limit Exceeded";
    case "runtime_error":
      return "Runtime Error";
    case "compilation_error":
      return "Compilation Error";
    case "internal_error":
      return "Internal Error";
    case "pending":
      return "Pending";
    default:
      return verdict;
  }
}

export function getRatingTierColor(tier: string): string {
  switch (tier) {
    case "newbie":
      return "text-gray-400";
    case "beginner":
      return "text-green-500";
    case "intermediate":
      return "text-cyan-500";
    case "advanced":
      return "text-blue-500";
    case "expert":
      return "text-violet-500";
    case "master":
      return "text-amber-500";
    case "grandmaster":
      return "text-red-500";
    default:
      return "text-gray-400";
  }
}

export function getRatingTier(rating: number): string {
  if (rating >= 2400) return "grandmaster";
  if (rating >= 2100) return "master";
  if (rating >= 1900) return "expert";
  if (rating >= 1600) return "advanced";
  if (rating >= 1400) return "intermediate";
  if (rating >= 1200) return "beginner";
  return "newbie";
}

export function generateBatchLabel(startYear: number, endYear: number): string {
  return `${startYear}–${endYear}`;
}

export function getAcceptanceRate(accepted: number, total: number): string {
  if (total === 0) return "0.0%";
  return ((accepted / total) * 100).toFixed(1) + "%";
}

