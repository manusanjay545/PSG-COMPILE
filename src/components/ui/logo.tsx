import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className, size = 36, showText = false }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-md shadow-indigo-500/20"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="PSGCompile Logo"
          width={size}
          height={size}
          className="object-contain w-full h-full"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-white leading-none">
            PSG<span className="text-indigo-500">Compile</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
            One PSG · One Community
          </span>
        </div>
      )}
    </div>
  );
}
