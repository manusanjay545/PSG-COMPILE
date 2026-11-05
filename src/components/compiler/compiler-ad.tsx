import type { CSSProperties } from "react";

function AdSpace({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-label="Ad space reserved"
      role="note"
      style={style}
      className={`grid place-items-center rounded-xl border border-dashed border-zinc-700/70 bg-zinc-900/40 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600 ${className}`}
    >
      Ad space
    </div>
  );
}

export function ProblemListAd() {
  return <aside className="hidden w-40 shrink-0 flex-col items-center gap-3 xl:flex" aria-label="Reserved ad space beside problem list">
    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Ad space</span>
    <AdSpace className="h-[600px] w-40" />
  </aside>;
}

export function CourseSideAd() {
  return <aside className="hidden w-40 shrink-0 flex-col items-center gap-3 xl:flex" aria-label="Reserved ad space beside courses">
    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Ad space</span>
    <AdSpace className="h-[600px] w-40" />
  </aside>;
}

export function InlineProblemAd() {
  return <aside className="my-2 flex justify-center" aria-label="Reserved 320 by 50 ad space in problem statement">
    <AdSpace className="h-[50px] w-[320px] max-w-full rounded-lg" />
  </aside>;
}

export function CompilerBannerAd() {
  return (
    <aside className="w-full max-w-[728px]" aria-label="Reserved banner ad space">
      <span className="mb-1 block text-right text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-600">Ad space</span>
      <AdSpace className="h-[90px] w-full" />
    </aside>
  );
}

export function CompilerAd() {
  return (
    <aside className="hidden w-40 shrink-0 flex-col items-center gap-3 xl:flex" aria-label="Reserved ad space">
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600">Ad space</span>
      <AdSpace className="h-[600px] w-40" />
    </aside>
  );
}

