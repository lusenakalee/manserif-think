import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Manserif.Think",
  description:
    "Manserif.Think is a digital sanctuary where art and design converge. Explore a curated collection of projects that reflect a unique blend of creativity and thoughtfulness. From captivating visuals to innovative concepts, each piece invites you to experience the world through a lens of artistic expression. Join us on this journey of inspiration and discovery at Manserif.Think.",
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
      <TooltipProvider>
          {children}
                  <CookieConsent />
 {/* no wrapper divs with positioning */}
      </TooltipProvider>
        </body>
    </html>
  );
}
