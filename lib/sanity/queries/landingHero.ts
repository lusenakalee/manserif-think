import { defineQuery } from "next-sanity";

export const landingHeroQuery = defineQuery(`
  *[_type == "landingHero"][0]{
    "images": coalesce(introImages[defined(asset)]{
      "src": asset->url,
      "alt": coalesce(alt, "Manserif think")
   }, []),
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