import { defineQuery } from "next-sanity";

/**
 * Get all categories
 * Used for navigation and filters
 */
export const ALL_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "image": image{
    asset->{
      _id,
      url
    },
    hotspot
  }
}`);

/**
 * Get category by slug
 */
export const CATEGORY_BY_SLUG_QUERY = defineQuery(`*[
  _type == "category"
  && slug.current == $slug
][0] {
  _id,
  title,
  "slug": slug.current,
  "image": image{
    asset->{
      _id,
      url
    },
    hotspot
  }
}`);

/**
 * Categories shown as tiles in the landing page grid.
 * Returns exactly the shape CategoryGrid expects (CategoryItem[]).
 * Only categories with "Show on landing grid" turned on, a link and an image.
 */
export const LANDING_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
  && showOnLanding == true
  && defined(href)
  && defined(image.asset)
] | order(order asc, title asc) {
  "id": _id,
  title,
  href,
  "image": image.asset->url,
  "lqip": image.asset->metadata.lqip,
  "alt": coalesce(image.alt, title)
}`);