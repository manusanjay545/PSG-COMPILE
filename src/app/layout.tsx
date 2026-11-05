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
    default: "PSGCompile | Online Compiler & Coding Practice for PSG Students",
    template: "%s | PSGCompile",
  },
  description: "PSGCompile is an independent online compiler and coding practice platform for the PSG student community. Run code, solve programming problems, and learn through guided courses.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "PSGCompile",
    title: "PSGCompile | Online Compiler & Coding Practice for PSG Students",
    description: "Compile code, solve programming problems, and learn with guided courses in the PSG student community.",
    url: "/",
    images: [{ url: "/favicon.png", width: 512, height: 512, alt: "PSGCompile logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PSGCompile | Online Compiler & Coding Practice",
    description: "Compile code, solve programming problems, and learn with guided courses for the PSG student community.",
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
                  description: "An independent online compiler and coding practice platform for the PSG student community.",
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
                  description: "Write and run code, practise programming problems, and study step-by-step courses.",
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
