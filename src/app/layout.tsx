import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PSGCompile - Code. Compete. Climb.",
    template: "%s | PSGCompile",
  },
  description:
    "An institution-wide competitive programming and online judge platform for the PSG educational community. One PSG. One Coding Community.",
  keywords: [
    "PSG",
    "PSGCompile",
    "Competitive Programming",
    "LeetCode",
    "Online Judge",
    "PSG College of Technology",
    "PSG Polytechnic",
    "PSG CAS",
    "PSG iTech",
    "PSG IM",
  ],
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
