import { defineQuery } from "next-sanity";

export const landingHeroQuery = defineQuery(`
  *[_type == "landingHero"][0]{
    "image": heroImage{
      "src": asset->url,
      "alt": coalesce(alt, "Hero background"),
      "lqip": asset->metadata.lqip
    },
    "headline": {
      "prefix": coalesce(headlinePrefix, ""),
      "highlight": coalesce(headlineHighlight, ""),
      "suffix": coalesce(headlineSuffix, "")
    },
    "contact": {
      "label": coalesce(contactLabel, "Say Hello"),
      "email": coalesce(contactEmail, ""),
      "instagramUrl": coalesce(instagramUrl, "")
    }
  }
`);