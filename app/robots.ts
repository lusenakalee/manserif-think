import type { MetadataRoute } from "next";

const siteUrl = "https://www.manserifthink.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Adjust this list to match whatever private/non-content routes
        // actually exist on the site (Sanity Studio, Clerk-protected
        // account pages, cart/checkout, API routes, etc.) — none of these
        // need to be, or should be, indexed.
        disallow: ["/api/", "/studio/", "/account/", "/checkout/", "/cart/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}