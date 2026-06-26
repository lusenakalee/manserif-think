import type { MetadataRoute } from "next";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const siteUrl = "https://www.manserifthink.com";

// Pulls just what the sitemap needs — slug, last-updated timestamp, and
// resolved image URLs (so product pages can show up in Google Image search
// via the sitemap "images" extension).
const ALL_PRODUCTS_FOR_SITEMAP_QUERY = defineQuery(`*[
  _type == "product"
  && defined(slug.current)
]{
  "slug": slug.current,
  _updatedAt,
  "images": images[].asset->url
}`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const { data: products } = await sanityFetch({
    query: ALL_PRODUCTS_FOR_SITEMAP_QUERY,
  });

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map(
    (product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product._updatedAt ? new Date(product._updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      ...(product.images?.length
        ? { images: product.images.filter(Boolean) as string[] }
        : {}),
    })
  );

  return [...staticRoutes, ...productRoutes];
}