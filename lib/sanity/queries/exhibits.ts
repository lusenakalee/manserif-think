import { defineQuery } from "next-sanity";

// ── All Exhibits ───────────────────────────────────────────────────────────────
export const ALL_EXHIBITS_QUERY = defineQuery(`
  *[_type == "exhibit"] | order(order asc, startDateTime desc) {
    _id,
    _createdAt,
    title,
    slug,
    subtitle,
    exhibitDescription,
    artistDescription,
    heroImage {
      asset,
      hotspot,
      crop,
      alt
    },
    startDateTime,
    endDateTime,
    exhibitLocation {
      venueName,
      address,
      city,
      country,
      mapsUrl
    },
    isFeatured,
    order
  }
`);

// ── Featured Exhibits ──────────────────────────────────────────────────────────
export const FEATURED_EXHIBITS_QUERY = defineQuery(`
  *[_type == "exhibit" && isFeatured == true] | order(order asc, startDateTime desc) {
    _id,
    _createdAt,
    title,
    slug,
    subtitle,
    exhibitDescription,
    artistDescription,
    heroImage {
      asset,
      hotspot,
      crop,
      alt
    },
    startDateTime,
    endDateTime,
    exhibitLocation {
      venueName,
      address,
      city,
      country,
      mapsUrl
    },
    order
  }
`);

// ── Exhibit by Slug ────────────────────────────────────────────────────────────
export const EXHIBIT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "exhibit" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    subtitle,
    exhibitDescription,
    artistDescription,
    heroImage {
      asset,
      hotspot,
      crop,
      alt
    },
    images[] {
      asset,
      hotspot,
      crop,
      alt
    },
    startDateTime,
    endDateTime,
    exhibitLocation {
      venueName,
      address,
      city,
      country,
      mapsUrl
    },
    featuredProducts[]-> {
      _id,
      title,
      slug,
    },
    partners[] {
      name,
      role,
      logo {
        asset,
        hotspot,
        crop,
        alt
      },
      website
    },
    isFeatured,
    order
  }
`);