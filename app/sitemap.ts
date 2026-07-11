import type { MetadataRoute } from "next";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const siteUrl = "https://www.manserifthink.com";

const ALL_PRODUCTS_FOR_SITEMAP_QUERY = defineQuery(`*[
  _type == "product"
  && defined(slug.current)
]{
  "slug": slug.current,
  _updatedAt,
  "images": images[].asset->url
}`);

const ALL_EXHIBITS_FOR_SITEMAP_QUERY = defineQuery(`*[
  _type == "exhibit"
  && defined(slug.current)
]{
  "slug": slug.current,
  _updatedAt,
  "image": heroImage.asset->url
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
    {
      url: `${siteUrl}/exhibits`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const [{ data: products }, { data: exhibits }] = await Promise.all([
    sanityFetch({ query: ALL_PRODUCTS_FOR_SITEMAP_QUERY }),
    sanityFetch({ query: ALL_EXHIBITS_FOR_SITEMAP_QUERY }),
  ]);

  type ProductRow = NonNullable<typeof products>[number];
  type ExhibitRow = NonNullable<typeof exhibits>[number];

  const productRoutes: MetadataRoute.Sitemap = (products ?? [])
    .filter((p: ProductRow): p is ProductRow & { slug: string } => p.slug !== null)
    .map((product: ProductRow & { slug: string }) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: new Date(product._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(product.images?.length
        ? { images: product.images.filter((img): img is string => img !== null) }
        : {}),
    }));

  const exhibitRoutes: MetadataRoute.Sitemap = (exhibits ?? [])
    .filter((e: ExhibitRow): e is ExhibitRow & { slug: string } => e.slug !== null)
    .map((exhibit: ExhibitRow & { slug: string }) => ({
      url: `${siteUrl}/exhibits/${exhibit.slug}`,
      lastModified: new Date(exhibit._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      ...(exhibit.image ? { images: [exhibit.image] } : {}),
    }));

  return [...staticRoutes, ...productRoutes, ...exhibitRoutes];
}