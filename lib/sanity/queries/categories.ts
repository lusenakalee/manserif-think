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
 * Returns the shape CategoryGrid expects (CategoryInput[]).
 *
 * - Only categories with "Show on landing grid" on, a slug and an image.
 * - `href` opens the category page (/category/<slug>) unless a custom link is set.
 *   If your category route is different (e.g. /categories/<slug>), change the
 *   "/category/" prefix below.
 * - Categories without a grid order go last.
 */
export const LANDING_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
  && showOnLanding == true
  && defined(slug.current)
  && defined(image.asset)
] | order(coalesce(order, 9999) asc, title asc) {
  "id": _id,
  title,
  "href": coalesce(customLink, "/category/" + slug.current),
  "image": image.asset->url,
  "lqip": image.asset->metadata.lqip,
  "alt": coalesce(image.alt, title),
  "hotspot": image.hotspot{ x, y }
}`);