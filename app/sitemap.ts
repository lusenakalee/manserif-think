import type { MetadataRoute } from "next";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const siteUrl = "https://www.manserifthink.com";

const ALL_ART_FOR_SITEMAP_QUERY = defineQuery(`*[
  _type == "art"
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
      url: `${siteUrl}/pieces`,
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

  const [{ data: artPieces }, { data: exhibits }] = await Promise.all([
    sanityFetch({ query: ALL_ART_FOR_SITEMAP_QUERY }),
    sanityFetch({ query: ALL_EXHIBITS_FOR_SITEMAP_QUERY }),
  ]);

  type ArtRow = NonNullable<typeof artPieces>[number];
  type ExhibitRow = NonNullable<typeof exhibits>[number];

  const artRoutes: MetadataRoute.Sitemap = (artPieces ?? [])
    .filter((p: ArtRow): p is ArtRow & { slug: string } => p.slug !== null)
    .map((piece: ArtRow & { slug: string }) => ({
      url: `${siteUrl}/pieces/${piece.slug}`,
      lastModified: new Date(piece._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(piece.images?.length
        ? { images: piece.images.filter((img): img is string => img !== null) }
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

  return [...staticRoutes, ...artRoutes, ...exhibitRoutes];
}