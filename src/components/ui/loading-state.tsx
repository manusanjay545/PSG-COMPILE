import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

export function LoadingIndicator({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 text-sm text-zinc-400", className)}>
      <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-indigo-400" />
      <span>{label}</span>
    </span>
  );
}

export function LoadingScreen({ label = "Loading your workspace…" }: { label?: string }) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-zinc-950 px-6 text-zinc-100" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 rounded-[26px] bg-indigo-500/15 blur-xl" />
          <span className="absolute inset-1 rounded-[22px] border-2 border-indigo-400/20 border-t-indigo-400 animate-spin" />
          <Logo size={48} className="relative animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="font-medium text-zinc-200">{label}</p>
          <div className="flex justify-center gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: `${dot * 140}ms` }} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
