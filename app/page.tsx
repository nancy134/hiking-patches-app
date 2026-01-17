// app/page.tsx
import type { Metadata } from "next";
import PatchesScreen from "@/components/PatchesScreen";

export const metadata: Metadata = {
  title: "Find & Track Hiking Patches",
  description:
    "Search hiking patches by state, difficulty, and season. Wishlist patches, track progress, and record completions as you hike.",
};

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hiking-patches.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hiking Patches",
    url: siteUrl,
    description:
      "Search hiking patches and track your progress as you complete them.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero / Banner */}
      <section className="relative overflow-hidden rounded-xl">
        {/* Background image */}
        <div
          className="h-[260px] sm:h-[320px] md:h-[380px] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/landingpageimage.png')" }}
          aria-hidden="true"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Find hiking patches and track your progress
              </h1>
              <p className="mt-3 text-base sm:text-lg text-white/90">
                Search patches by state, difficulty, and season. Wishlist the ones you want,
                mark them in progress, and celebrate completions as you hike.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <PatchesScreen variant="home" />
      </section>
    </main>
  );
}

