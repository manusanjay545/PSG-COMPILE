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
  metadataBase: new URL("https://psgcompile.vercel.app"),
  applicationName: "PSGCompile",
  verification: {
    google: "-GWpEfcI045WZzB6J1N9C3zyJySzN6DEfwbnDMMi15k",
  },
  title: {
    default: "Online Compiler for PSG Students | PSGCompile",
    template: "%s | PSGCompile",
  },
  description: "Online compiler for PSG students at PSG College of Technology. Run code in 60+ languages, solve problems, and learn with guided courses.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "PSGCompile",
    title: "Online Compiler for PSG Students | PSGCompile",
    description: "Online compiler for PSG students at PSG College of Technology. Run code in 60+ languages, solve problems, and learn with guided courses.",
    url: "/",
    images: [{ url: "/favicon.png", width: 512, height: 512, alt: "PSGCompile logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Compiler for PSG Students | PSGCompile",
    description: "Online compiler for PSG students at PSG College of Technology. Run code in 60+ languages, solve problems, and learn with guided courses.",
    images: ["/favicon.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3461138816173364"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://psgcompile.vercel.app/#website",
                  url: "https://psgcompile.vercel.app/",
                  name: "PSGCompile",
                  alternateName: ["PSG Compile", "PSGCompiler"],
                  description: "Online compiler for PSG students at PSG College of Technology, with 60+ programming languages, coding problems, and guided courses.",
                  inLanguage: "en-IN",
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://psgcompile.vercel.app/#webapp",
                  name: "PSGCompile Online Compiler",
                  url: "https://psgcompile.vercel.app/",
                  applicationCategory: "DeveloperApplication",
                  operatingSystem: "Any",
                  browserRequirements: "Requires a modern web browser and internet access.",
                  description: "Run code in 60+ languages, solve programming problems, and learn step by step with PSGCompile, an online compiler for PSG students.",
                  isPartOf: { "@id": "https://psgcompile.vercel.app/#website" },
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
