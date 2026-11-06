import { defineQuery } from "next-sanity";

/**
 * Shared subcategory projection fragment — reused across all queries
 * that need to expand a subcategory reference.
 */
const SUBCATEGORY_PROJECTION = `subcategory->{
  _id,
  title,
  "slug": slug.current,
  description
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Subcategory queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * All subcategories — ordered by parent category title then display order.
 */
export const ALL_SUBCATEGORIES_QUERY = defineQuery(`*[
  _type == "subcategory"
] | order(parentCategory->title asc, coalesce(order, 9999) asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "parentCategory": parentCategory->{
    _id,
    title,
    "slug": slug.current
  },
  order
}`);

/**
 * Subcategories belonging to a specific parent category slug.
 */
export const SUBCATEGORIES_BY_CATEGORY_QUERY = defineQuery(`*[
  _type == "subcategory"
  && parentCategory->slug.current == $categorySlug
] | order(coalesce(order, 9999) asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  order
}`);

// ─────────────────────────────────────────────────────────────────────────────
// Category queries
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  contentTypes,
  "image": image{
    asset->{
      _id,
      url
    },
    hotspot
  }
}`);

export const CATEGORY_BY_SLUG_QUERY = defineQuery(`*[
  _type == "category"
  && slug.current == $slug
][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  contentTypes,
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

// ─────────────────────────────────────────────────────────────────────────────
// Category Page Query
//
// Single round-trip: category document + subcategories + all content split by
// type. Each content type carries its full detail payload for the lightbox
// panel in addition to the card shape.
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORY_PAGE_QUERY = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    contentTypes,
    "image": image {
      "url":     asset->url,
      "lqip":    asset->metadata.lqip,
      "alt":     coalesce(alt, title),
      "hotspot": hotspot{ x, y }
    },

    // ── Subcategories belonging to this category ──────────────────────────────
    "subcategories": *[
      _type == "subcategory"
      && parentCategory._ref == ^._id
    ] | order(coalesce(order, 9999) asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description
    },

    // ── Art pieces ────────────────────────────────────────────────────────────
    "art": *[
      _type == "art"
      && references(^._id)
    ] | order(featured desc, name asc) {
      "_type": _type,
      _id,
      "title": name,
      "slug":  slug.current,
      "heroImage": {
        "url":     images[0].asset->url,
        "lqip":    images[0].asset->metadata.lqip,
        "alt":     coalesce(images[0].asset->altText, name),
        "hotspot": images[0].hotspot{ x, y }
      },
      "subcategorySlug": subcategory->slug.current,
      stock,
      featured,
      // Lightbox detail fields
      description,
      material,
      dimensions,
      price
    },

    // ── Exhibits ──────────────────────────────────────────────────────────────
    "exhibits": *[
      _type == "exhibit"
      && references(^._id)
    ] | order(order asc, startDateTime desc) {
      "_type": _type,
      _id,
      "title": title,
      "slug":  slug.current,
      "heroImage": {
        "url":     heroImage.asset->url,
        "lqip":    heroImage.asset->metadata.lqip,
        "alt":     coalesce(heroImage.alt, title),
        "hotspot": heroImage.hotspot{ x, y }
      },
      subtitle,
      "subcategorySlug": subcategory->slug.current,
      startDateTime,
      endDateTime,
      // Lightbox detail fields
      exhibitDescription,
      "venueName":    exhibitLocation.venueName,
      "venueCity":    exhibitLocation.city,
      "venueCountry": exhibitLocation.country,
      "venueMapsUrl": exhibitLocation.mapsUrl
    },

    // ── Projects ──────────────────────────────────────────────────────────────
    "projects": *[
      _type == "project"
      && references(^._id)
    ] | order(order asc) {
      "_type": _type,
      _id,
      "title": title,
      "slug":  slug.current,
      "heroImage": {
        "url":     heroImage.asset->url,
        "lqip":    heroImage.asset->metadata.lqip,
        "alt":     coalesce(heroImage.alt, title),
        "hotspot": heroImage.hotspot{ x, y }
      },
      subtitle,
      "subcategorySlug": subcategory->slug.current,
      // Lightbox detail fields
      description,
      location,
      note
    },

    // ── Apparel ───────────────────────────────────────────────────────────────
    "apparel": *[
      _type == "apparel"
      && references(^._id)
    ] | order(featured desc, name asc) {
      "_type": _type,
      _id,
      "title": name,
      "slug":  slug.current,
      "heroImage": {
        "url":     images[0].asset->url,
        "lqip":    images[0].asset->metadata.lqip,
        "alt":     coalesce(images[0].asset->altText, name),
        "hotspot": images[0].hotspot{ x, y }
      },
      "subcategorySlug": subcategory->slug.current,
      stock,
      featured,
      limitedEdition,
      // Lightbox detail fields
      description,
      price,
      apparelKind,
      gender,
      material,
      materialDetail,
      features,
      careInstructions,
      availableSizes,
      shoeSizes
    }
  }
`);