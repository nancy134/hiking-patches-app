import type { NextConfig } from "next";

// Amplify Hosting sets AWS_BRANCH during a branch build; it is absent locally.
// Only the prod branch should ever be indexable.
const isProd = process.env.AWS_BRANCH === "prod";

const nextConfig: NextConfig = {
  async headers() {
    if (isProd) return [];
    // X-Robots-Tag rather than a robots.txt Disallow: a disallow stops the
    // crawl, which means Google never sees a noindex and can still list the URL
    // from an external link. This header is honoured on every response and also
    // removes anything already indexed.
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
