import type { MetadataRoute } from "next";

const siteUrl = "https://psgcompile.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/dashboard",
        "/settings",
        "/onboarding",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/auth/",
        "/profile/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
