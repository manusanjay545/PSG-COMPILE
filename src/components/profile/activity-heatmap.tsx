"use client";

import * as React from "react";

type ActivityDay = { date: string; count: number };
type ActivityMonth = { key: string; label: string; days: ActivityDay[] };

export function ActivityHeatmap({ months }: { months: ActivityMonth[] }) {
  const maxCount = Math.max(1, ...months.flatMap((month) => month.days.map((day) => day.count)));
  const shade = (count: number) => {
    if (!count) return "bg-zinc-800";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-emerald-400";
    if (ratio <= 0.5) return "bg-emerald-600";
    if (ratio <= 0.75) return "bg-emerald-800";
    return "bg-emerald-950 ring-1 ring-emerald-800";
  };

  return (
    <section aria-label="Submission activity by day" className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-xs text-zinc-400">
        <span>Daily submissions · darker green means more activity</span>
        <div className="flex shrink-0 items-center gap-1" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((level) => <span key={level} className={`h-3 w-3 rounded-sm ${["bg-zinc-800", "bg-emerald-400", "bg-emerald-600", "bg-emerald-800", "bg-emerald-950 ring-1 ring-emerald-800"][level]}`} />)}
        </div>
      </div>
      <div className="max-h-[430px] space-y-2 overflow-auto pr-1">
        {months.map((month) => (
          <div key={month.key} className="grid min-w-[410px] grid-cols-[76px_minmax(0,1fr)] items-start gap-3">
            <span className="pt-0.5 text-xs text-zinc-400">{month.label}</span>
            <div className="grid grid-cols-[repeat(31,minmax(8px,1fr))] gap-1">
              {month.days.map((day) => (
                <span key={day.date} title={`${day.date}: ${day.count} submission${day.count === 1 ? "" : "s"}`} aria-label={`${day.date}: ${day.count} submissions`} className={`aspect-square min-w-2 rounded-[3px] ${shade(day.count)}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
