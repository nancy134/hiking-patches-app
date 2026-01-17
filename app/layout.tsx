import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AmplifyClientConfig from "@/components/AmplifyClientConfig";
import "@aws-amplify/ui-react/styles.css";
import { AuthProvider } from "@/context/auth-context";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hiking-patches.com";

const isStaging =
  (process.env.NEXT_PUBLIC_ENV ?? "").toLowerCase().includes("staging") ||
  siteUrl.includes("staging");

const siteName = "Hiking Patches";

const description =
  "Find hiking patches by state, difficulty, and season—then track your progress as you complete them.";

export const metadata: Metadata = {
  // ✅ Makes all relative URLs in metadata (OG images, canonical, etc.) resolve correctly
  metadataBase: new URL(siteUrl),

  // ✅ Better title handling across pages
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },

  description,

  icons: {
    icon: "/favicon.svg",
  },

  // ✅ Canonical handling (page-level canonicals can override)
  alternates: {
    canonical: "/",
  },

  // ✅ Open Graph for social sharing
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteName,
    description,
    siteName,
    images: [
      {
        url: "/og/home.png", // create this file in /public/og/home.png
        width: 1200,
        height: 630,
        alt: "Hiking Patches",
      },
    ],
  },

  // ✅ Twitter cards
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/og/home.png"],
  },

  // ✅ Staging should never be indexed
  robots: isStaging
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-GY7ZJX0E4M";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AmplifyClientConfig />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

