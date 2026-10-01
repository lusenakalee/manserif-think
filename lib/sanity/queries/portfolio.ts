import { defineQuery } from "next-sanity";

export const portfolioQuery = defineQuery(`
  *[_type == "portfolio"][0]{
    "header": {
       "imageUrl": coalesce(headerImage.asset->url, ""),
       "imageAlt": coalesce(headerImage.alt, "background"),
      "firstText": coalesce(headerFirstText, ""),
      "secondText": coalesce(headerSecondText, "")
    },
    "about": {
      "heading": coalesce(aboutHeading, "About"),
   "paragraphs": coalesce(aboutParagraphs, [])
    }
  }
`);