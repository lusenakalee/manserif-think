import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import CookieConsent from "@/components/general/CookieConsent";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://manserifthink.com";
const siteName = "Manserif.Think";
const siteTitle = "Manserif.Think | Conceptual Art, Prints & Installations by Warren Kamau";
const siteDescription =
  "Manserif.Think is the art studio and creative archive of Warren Kamau — original conceptual paintings, fine art prints, collages, sculptures, and large-scale art installations. Shop and commission artwork from Nairobi, Kenya.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Manserif.Think",
  },
  description: siteDescription,
  keywords: [
    "Manserif.Think",
    "Warren Kamau",
    "Warren Kamau artist",
    "conceptual art",
    "contemporary art Kenya",
    "Nairobi artist",
    "Nairobi art studio",
    "art installations",
    "fine art prints",
    "limited edition prints",
    "collage art",
    "sculpture art",
    "fashion art",
    "creative studio",
    "original artwork for sale",
    "African contemporary art",
    "buy art online Kenya",
  ],
  authors: [{ name: "Warren Kamau", url: siteUrl }],
  creator: "Warren Kamau",
  publisher: siteName,
  category: "Art & Design",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    // images intentionally omitted — app/opengraph-image.tsx generates this automatically
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    // images intentionally omitted — app/opengraph-image.tsx covers Twitter too (Twitter falls back to og:image)
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Warren Kamau",
  alternateName: siteName,
  url: siteUrl,
  image: `${siteUrl}/og-image.jpg`,
  jobTitle: "Visual Artist",
  description: siteDescription,
  sameAs: [
    "https://www.instagram.com/manserif.think/",
    "https://www.instagram.com/warren_kamau/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-mono",
        jetbrainsMono.variable,
      )}
    >
        <body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <TooltipProvider>
          {children}
                  <CookieConsent />
 {/* no wrapper divs with positioning */}
      </TooltipProvider>
        </body>
    </html>
  );
}