import type { MetadataRoute } from "next";
import { COURSES } from "@/lib/courses/catalog";

const siteUrl = "https://psgcompile.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/problems`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/courses`, changeFrequency: "monthly", priority: 0.9 },
  ];

  const coursePages: MetadataRoute.Sitemap = COURSES.map((course) => ({
    url: `${siteUrl}/courses/${encodeURIComponent(course.slug)}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...publicPages, ...coursePages];
}
