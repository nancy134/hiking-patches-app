import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hiking-patches.com";
  const isStaging =
    (process.env.NEXT_PUBLIC_ENV ?? "").includes("staging") || siteUrl.includes("staging");

  if (isStaging) return [];

  return [
    { url: `${siteUrl}/`, lastModified: new Date() },
    { url: `${siteUrl}/mine`, lastModified: new Date() },
  ];
}

