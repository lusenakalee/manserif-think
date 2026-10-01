import { defineQuery } from "next-sanity";

export const portfolioQuery = defineQuery(`
  *[_type == "portfolio"][0]{
    "header": {
      "imageUrl": headerImage.asset->url,
      "imageAlt": coalesce(headerImage.alt, "background"),
      "firstText": headerFirstText,
      "secondText": headerSecondText
    },
    "about": {
      "heading": coalesce(aboutHeading, "About"),
      "paragraphs": aboutParagraphs
    }
  }
`);