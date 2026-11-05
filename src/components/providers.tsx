"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";

function ThemeAwareToaster() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Toaster
      theme={isLight ? "light" : "dark"}
      position="top-right"
      toastOptions={{
        style: isLight
          ? { background: "#fff", border: "1px solid #d4d9e2", color: "#18181b" }
          : { background: "#18181b", border: "1px solid #27272a", color: "#fafafa" },
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <ThemeAwareToaster />
    </NextThemesProvider>
  );
}

